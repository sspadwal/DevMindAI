import OpenAI from "openai";
import sql from '../configs/db.js'
import { clerkClient } from '@clerk/express'
import FormData from 'form-data';
import { cloudinary } from '../configs/cloudnary.js';
import axios from "axios";
import fs from 'fs'
import pdf from 'pdf-parse/lib/pdf-parse.js'


const AI = new OpenAI({
    apiKey: process.env.GEMINI_API_KEY,
    baseURL: "https://generativelanguage.googleapis.com/v1beta/openai/"
});


export const genereateArticle = async(req, res) => {
    try {
        const { userId } = req.auth();
        console.log(userId)
        const { prompt, length } = req.body;
        const plan = req.plan;
        const free_usage = req.free_usage;
        // const free_usage = req.free_usage ? ? 0; 

        if (plan !== 'premium' && free_usage >= 10) {
            return res.json({ success: "false", message: "Limit Reached Upgrade to continue." })
        }

        // Convert word count to approximate token count
        // Rule of thumb: 1 word ≈ 1.3 tokens for English
        // Add extra buffer for formatting and ensure complete output
        const estimatedTokens = Math.ceil(length * 1.5) + 500;

        // Enhanced prompt to ensure full-length article
        const enhancedPrompt = `Write a comprehensive, well-structured article about "${prompt}". 
        
        Requirements:
        - Target length: approximately ${length} words
        - Include an engaging introduction
        - Use clear headings and subheadings
        - Provide detailed explanations and examples
        - Include a strong conclusion
        - Write in a professional, informative tone
        - Ensure the article is complete and not cut off
        
        Article topic: ${prompt}`;

        const response = await AI.chat.completions.create({
            model: "gemini-2.0-flash",
            messages: [{
                role: "user",
                content: enhancedPrompt,
            }],
            temperature: 0.7,
            max_tokens: estimatedTokens, // Use calculated token count instead of word count
        });

        const content = response.choices[0].message.content

        // Check if content seems complete (basic validation)
        if (!content || content.length < 100) {
            throw new Error("Generated content appears incomplete");
        }

        await sql `INSERT INTO creations (user_id, prompt, content, type) 
        VALUES (${userId}, ${prompt}, ${content}, 'article')`;

        if (plan !== 'premium') {
            await clerkClient.users.updateUserMetadata(userId, {
                privateMetadata: {
                    free_usage: free_usage + 1
                }
            })
        }

        res.json({ success: true, content })

    } catch (error) {
        console.log(error)
        res.status(400).json({ success: false, message: error.message, stack: error.stack });
    }
}


export const genereateBlogTitle = async(req, res) => {
    try {
        const { userId } = req.auth();
        console.log(userId)
        const { prompt, length } = req.body;
        const plan = req.plan;
        const free_usage = req.free_usage;
        // const free_usage = req.free_usage ? ? 0; // Use 0 if undefined

        if (plan !== 'premium' && free_usage >= 10) {
            return res.json({ success: "false", message: "Limit Reached Upgrade to continue." })
        }

        const response = await AI.chat.completions.create({
            model: "gemini-2.0-flash",
            messages: [{
                role: "user",
                content: prompt,
            }, ],
            temperature: 0.7,
            max_tokens: 100,
        });

        const content = response.choices[0].message.content
        await sql ` INSERT INTO creations (user_id, prompt,content,type) 
        VALUES (${userId},${prompt},${content},'blog-title')`;

        if (plan !== 'premium') {
            await clerkClient.users.updateUserMetadata(userId, {
                // privateMetadata: {
                //     free_usage: free_usage + 1
                // }

                privateMetadata: {
                    free_usage: free_usage + 1
                }
            })
        }
        res.json({ success: true, content })

    } catch (error) {
        console.log(error)
            // res.json({ success: false, message: error.message })
        res.status(400).json({ success: false, message: error.message, stack: error.stack });
    }
}


export const genereateImage = async(req, res) => {
    try {
        const { userId } = req.auth();
        const { prompt, publish } = req.body;
        const plan = req.plan;

        if (plan != 'premium') {
            return res.json({ success: false, message: "This feature is only available for premium subscriptions." })
        }

        const formData = new FormData()
        formData.append('prompt', prompt)

        const { data } = await axios.post('https://clipdrop-api.co/text-to-image/v1', formData, {
            headers: {
                'x-api-key': process.env.CLIPDROP_API_KEY,
                ...formData.getHeaders(),
            },
            responseType: "arraybuffer",
        })

        const imageBuffer = Buffer.from(data);

        try {
            const uploadResult = await new Promise((resolve, reject) => {
                const uploadStream = cloudinary.uploader.upload_stream({
                        folder: 'ai-generated-images',
                        resource_type: 'image',
                    },
                    (error, result) => {
                        if (error) {
                            reject(error);
                        } else {
                            resolve(result);
                        }
                    }
                );

                uploadStream.end(imageBuffer);
            });

            await sql ` INSERT INTO creations (user_id, prompt,content,type,publish) 
            VALUES (${userId},${prompt},${uploadResult.secure_url},'image',${publish ?? false})`;

            res.json({ success: true, content: uploadResult.secure_url });

        } catch (cloudinaryError) {
            res.status(400).json({
                success: false,
                message: 'Failed to upload image to Cloudinary: ' + cloudinaryError.message,
                stack: cloudinaryError.stack
            });
        }

    } catch (error) {
        if (error.response) {
            res.status(400).json({
                success: false,
                message: error.response.data ? error.response.data.message : error.message,
                stack: error.stack
            });
        } else {
            res.status(400).json({
                success: false,
                message: error.message,
                stack: error.stack
            });
        }
    }
}


export const removeImageBackground = async(req, res) => {
    try {
        const { userId } = req.auth();
        const image = req.file;
        const plan = req.plan || 'free'; // Default to free if not set

        console.log('Remove background request:', { userId, hasImage: !!image, plan });

        // Check if image file exists
        if (!image) {
            return res.status(400).json({
                success: false,
                message: "No image file uploaded"
            });
        }

        // Check if user has premium plan
        if (plan !== 'premium') {
            return res.json({
                success: false, // ✅ Fixed: boolean instead of string
                message: "This feature is only available for premium subscriptions."
            });
        }

        try {
            // First upload the original image to Cloudinary
            const uploadResult = await new Promise((resolve, reject) => {
                const uploadStream = cloudinary.uploader.upload_stream({
                        folder: 'background-removal-images',
                        resource_type: 'image',
                        // ✅ Correct way to apply background removal transformation
                        transformation: [
                            { effect: 'background_removal' }
                        ]
                    },
                    (error, result) => {
                        if (error) {
                            console.error('Cloudinary upload error:', error);
                            reject(error);
                        } else {
                            console.log('Cloudinary upload success:', result.secure_url);
                            resolve(result);
                        }
                    }
                );

                // ✅ Correct way to pass the image buffer
                uploadStream.end(image.buffer);
            });

            // Save to database
            await sql `
                INSERT INTO creations (user_id, prompt, content, type) 
                VALUES (${userId}, 'Remove background from image', ${uploadResult.secure_url}, 'background-removal')
            `;

            res.json({
                success: true,
                content: uploadResult.secure_url
            });

        } catch (cloudinaryError) {
            console.error('Cloudinary processing error:', cloudinaryError);
            res.status(400).json({
                success: false,
                message: 'Failed to process image: ' + cloudinaryError.message,
                stack: process.env.NODE_ENV === 'development' ? cloudinaryError.stack : undefined
            });
        }

    } catch (error) {
        console.error('Background removal error:', error);
        res.status(400).json({
            success: false,
            message: error.message || 'Failed to remove background',
            stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
        });
    }
}


export const removeImageObject = async(req, res) => {
        try {
            const { userId } = req.auth();
            const { object } = req.body;
            const image = req.file;
            const plan = req.plan;

            // Check if premium plan is required
            if (plan !== 'premium') {
                return res.json({
                    success: false,
                    message: "This feature is only available for premium subscriptions."
                });
            }

            // Validate inputs
            if (!image) {
                return res.status(400).json({
                    success: false,
                    message: "No image file uploaded"
                });
            }

            if (!object) {
                return res.status(400).json({
                    success: false,
                    message: "Object to remove is required"
                });
            }

            try {
                // Upload image to Cloudinary and apply transformation
                const uploadResult = await new Promise((resolve, reject) => {
                    const uploadStream = cloudinary.uploader.upload_stream({
                        folder: 'ai-generated-images',
                        resource_type: 'image',
                    }, (error, result) => {
                        if (error) {
                            reject(error);
                        } else {
                            resolve(result);
                        }
                    });

                    // Write the buffer to the upload stream
                    uploadStream.end(image.buffer);
                });

                // Generate the transformed image URL with object removal
                const imageUrl = cloudinary.url(uploadResult.public_id, {
                    transformation: [{
                        effect: `gen_remove:${object}`
                    }],
                    resource_type: 'image'
                });

                // Save to database
                await sql `
                INSERT INTO creations (user_id, prompt, content, type) 
                VALUES (${userId}, ${`Removed ${object} from image`}, ${imageUrl}, 'image')
            `;

            res.json({
                success: true,
                content: imageUrl
            });

        } catch (cloudinaryError) {
            console.error('Cloudinary error:', cloudinaryError);
            res.status(400).json({
                success: false,
                message: 'Failed to process image: ' + cloudinaryError.message
            });
        }

    } catch (error) {
        console.error('Server error:', error);
        res.status(500).json({
            success: false,
            message: 'Internal server error: ' + error.message
        });
    }
};


export const resumeReview = async (req, res) => {
    try {
        const { userId } = req.auth();
        const resume = req.file;
        const plan = req.plan;

        console.log('=== RESUME REVIEW DEBUG ===');
        console.log('User ID:', userId);
        console.log('Plan:', plan);
        console.log('Request file:', resume);
        console.log('Request body:', req.body);
        console.log('Request headers:', req.headers);

        // Check premium plan
        if (plan !== 'premium') {
            console.log('User is not premium, rejecting request');
            return res.json({
                success: false,
                message: "This feature is only available for premium subscriptions."
            });
        }

        // Validate file upload
        if (!resume) {
            console.log('No resume file found in request');
            return res.status(400).json({
                success: false,
                message: "No resume file uploaded"
            });
        }

        console.log('File details:');
        console.log('- Original name:', resume.originalname);
        console.log('- Mimetype:', resume.mimetype);
        console.log('- Size:', resume.size, 'bytes');
        console.log('- Path:', resume.path);
        console.log('- Field name:', resume.fieldname);

        // Check file size (5MB limit)
        if (resume.size > 5 * 1024 * 1024) {
            console.log('File size exceeds limit:', resume.size, 'bytes');
            return res.status(400).json({
                success: false,
                message: "Resume file size exceeds allowed limit (5MB)."
            });
        }

        // Check file type
        if (resume.mimetype !== 'application/pdf') {
            console.log('Invalid file type:', resume.mimetype);
            return res.status(400).json({
                success: false,
                message: "Only PDF files are supported."
            });
        }

        try {
            console.log('Starting PDF processing...');

            // Use the buffer directly since multer stores files in memory
            const dataBuffer = resume.buffer;
            console.log('File buffer size:', dataBuffer.length, 'bytes');

            console.log('Parsing PDF with pdf-parse...');
            const pdfData = await pdf(dataBuffer);
            console.log('PDF parsing completed');
            console.log('PDF text length:', pdfData.text ? pdfData.text.length : 0);
            console.log('PDF text preview (first 200 chars):', pdfData.text ? pdfData.text.substring(0, 200) : 'No text');

            if (!pdfData.text || pdfData.text.trim().length === 0) {
                console.log('No text extracted from PDF');
                return res.status(400).json({
                    success: false,
                    message: "Could not extract text from PDF. Please ensure the PDF contains readable text."
                });
            }

            console.log('Generating AI review...');
            const prompt = `Review the following resume and provide constructive feedback on its strengths, weaknesses, and areas for improvement. Please structure your response with clear sections for:

1. Overall Impression
2. Strengths
3. Areas for Improvement
4. Specific Recommendations
5. Formatting and Presentation
6. Overall Rating (out of 10)

Resume Content:

${pdfData.text}`;

            const response = await AI.chat.completions.create({
                model: "gemini-2.0-flash",
                messages: [{
                    role: "user",
                    content: prompt,
                }],
                temperature: 0.7,
                max_tokens: 1500,
            });

            const content = response.choices[0].message.content;
            console.log('AI review generated, content length:', content.length);

            // Save to database
            console.log('Saving to database...');
            await sql`
                INSERT INTO creations (user_id, prompt, content, type) 
                VALUES (${userId}, 'Review The Uploaded Resume', ${content}, 'resume-review')
            `;
            console.log('Saved to database successfully');

            console.log('=== RESUME REVIEW SUCCESS ===');
            res.json({
                success: true,
                content: content
            });

        } catch (pdfError) {
            console.error('=== PDF PROCESSING ERROR ===');
            console.error('PDF processing error:', pdfError);
            console.error('Error name:', pdfError.name);
            console.error('Error message:', pdfError.message);
            console.error('Error stack:', pdfError.stack);

            return res.status(400).json({
                success: false,
                message: "Failed to process PDF file. Please ensure it's a valid PDF with readable text. Error: " + pdfError.message
            });
        }

    } catch (error) {
        console.error('=== SERVER ERROR ===');
        console.error('Server error:', error);
        console.error('Error name:', error.name);
        console.error('Error message:', error.message);
        console.error('Error stack:', error.stack);

        // Clean up temporary file if it exists
        if (req.file && req.file.path && fs.existsSync(req.file.path)) {
            console.log('Cleaning up temporary file after server error...');
            fs.unlinkSync(req.file.path);
        }

        if (error.response) {
            res.status(400).json({
                success: false,
                message: error.response.data ? error.response.data.message : error.message
            });
        } else {
            res.status(500).json({
                success: false,
                message: "Internal server error: " + error.message
            });
        }
    }
};