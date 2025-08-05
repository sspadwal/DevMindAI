import express from 'express'
import { genereateArticle, genereateBlogTitle, genereateImage, removeImageBackground, removeImageObject, resumeReview } from '../controllers/aiController.js';
import { auth } from '../middleware/auth.js';
import { upload } from '../configs/multer.js';


const aiRouter = express.Router();

aiRouter.post('/generate-article', auth, genereateArticle)
aiRouter.post('/generate-blog-title', auth, genereateBlogTitle)
aiRouter.post('/generate-image', auth, genereateImage)
aiRouter.post('/remove-image-background', upload.single('image'), auth, removeImageBackground)
aiRouter.post('/remove-image-object', upload.single('image'), auth, removeImageObject)
aiRouter.post('/resume-review', upload.single('resume'), auth, resumeReview)

export default aiRouter;