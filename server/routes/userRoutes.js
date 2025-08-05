import express from 'express';
import { getUserCreations, getPublishedCreations, toggleLikeCreation } from '../controllers/userController.js';
import { auth } from '../middleware/auth.js';

const userRouter = express.Router();

// Apply auth middleware to all routes
userRouter.use(auth);

// Get user's own creations
userRouter.get('/get-user-creations', getUserCreations);

// Get all published creations (for community page)
userRouter.get('/get-published-creations', getPublishedCreations);

// Toggle like on a creation
userRouter.post('/toggle-like-creation', toggleLikeCreation);

export default userRouter;