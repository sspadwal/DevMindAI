import sql from "../configs/db.js"

export const getUserCreations = async(req, res) => {
    try {
        const { userId } = req.auth();

        console.log('Fetching creations for user:', userId);

        const creations = await sql `SELECT * FROM creations WHERE user_id = ${userId} ORDER BY created_at DESC`;

        console.log('Found creations:', creations.length);

        res.json({
            success: true,
            creations: creations, // Changed from 'message' to 'creations'
            count: creations.length
        });
    } catch (error) {
        console.error('getUserCreations error:', error);
        res.status(500).json({
            success: false,
            message: error.message,
            error: process.env.NODE_ENV === 'development' ? error.stack : undefined
        });
    }
}

export const getPublishedCreations = async(req, res) => {
    try {
        console.log('Fetching published creations...');

        // Simple query without JOIN since users table might not exist or have issues
        const creations = await sql `
            SELECT 
                id,
                user_id,
                prompt,
                content,
                type,
                publish,
                likes,
                created_at,
                updated_at
            FROM creations 
            WHERE publish = true 
            ORDER BY created_at DESC
        `;

        console.log('Raw creations from DB:', creations.length);

        // Process the results to ensure proper data types
        const processedCreations = creations.map(creation => {
            // Ensure likes is always an array
            let likesArray = [];
            if (creation.likes) {
                if (Array.isArray(creation.likes)) {
                    likesArray = creation.likes;
                } else if (typeof creation.likes === 'string') {
                    // Handle string representation of array
                    try {
                        likesArray = JSON.parse(creation.likes);
                    } catch (e) {
                        // If it's a PostgreSQL array string like "{user1,user2}"
                        if (creation.likes.startsWith('{') && creation.likes.endsWith('}')) {
                            const cleanStr = creation.likes.slice(1, -1);
                            likesArray = cleanStr ? cleanStr.split(',') : [];
                        } else {
                            likesArray = [];
                        }
                    }
                }
            }

            return {
                id: creation.id,
                user_id: creation.user_id,
                prompt: creation.prompt || '',
                content: creation.content || '',
                type: creation.type || 'image',
                publish: creation.publish,
                likes: likesArray,
                created_at: creation.created_at,
                updated_at: creation.updated_at,
                creator_username: 'Anonymous User', // Default since we're not joining users table
                creator_image: ''
            };
        });

        console.log('Processed creations:', processedCreations.length);
        console.log('Sample creation:', processedCreations[0]);

        res.status(200).json({
            success: true,
            creations: processedCreations,
            count: processedCreations.length
        });

    } catch (error) {
        console.error('Error in getPublishedCreations:', error);
        console.error('Error stack:', error.stack);

        res.status(500).json({
            success: false,
            message: 'Failed to fetch published creations',
            error: error.message,
            stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
        });
    }
};

export const toggleLikeCreation = async(req, res) => {
    try {
        const { userId } = req.auth();
        const { id } = req.body;

        console.log('Toggle like request - User ID:', userId, 'Creation ID:', id);

        if (!id) {
            return res.status(400).json({ success: false, message: "Creation ID is required" });
        }

        // Get the creation
        const creations = await sql `SELECT * FROM creations WHERE id = ${id}`;

        if (!creations || creations.length === 0) {
            return res.status(404).json({ success: false, message: "Creation not found" });
        }

        const creation = creations[0];
        console.log('Found creation:', creation.id, 'Current likes:', creation.likes);

        // Process current likes
        let currentLikes = [];
        if (creation.likes) {
            if (Array.isArray(creation.likes)) {
                currentLikes = creation.likes;
            } else if (typeof creation.likes === 'string') {
                try {
                    currentLikes = JSON.parse(creation.likes);
                } catch (e) {
                    // Handle PostgreSQL array format
                    if (creation.likes.startsWith('{') && creation.likes.endsWith('}')) {
                        const cleanStr = creation.likes.slice(1, -1);
                        currentLikes = cleanStr ? cleanStr.split(',') : [];
                    }
                }
            }
        }

        // Convert userId to string for consistent comparison
        const userIdStr = userId.toString();

        let updatedLikes;
        let message;
        let hasLiked;

        // Check if user has already liked this creation
        if (currentLikes.includes(userIdStr)) {
            // Remove like
            updatedLikes = currentLikes.filter((user) => user !== userIdStr);
            message = 'Creation Unliked';
            hasLiked = false;
        } else {
            // Add like
            updatedLikes = [...currentLikes, userIdStr];
            message = 'Creation Liked';
            hasLiked = true;
        }

        console.log('Updated likes:', updatedLikes);

        // Update the database - using PostgreSQL array format
        await sql `UPDATE creations SET likes = ${updatedLikes}, updated_at = NOW() WHERE id = ${id}`;

        res.json({
            success: true,
            message,
            likes: updatedLikes,
            hasLiked: hasLiked,
            likesCount: updatedLikes.length
        });

    } catch (error) {
        console.error('Toggle like error:', error);
        console.error('Error stack:', error.stack);

        res.status(500).json({
            success: false,
            message: 'Failed to toggle like',
            error: error.message
        });
    }
}