import express from 'express'
import cors from 'cors'
import 'dotenv/config';
import { clerkMiddleware, clerkClient, requireAuth, getAuth } from '@clerk/express'
import aiRouter from './routes/aiRoutes.js';
import connectCloudinary from './configs/cloudnary.js';
import userRouter from './routes/userRoutes.js';

const app = express();
await connectCloudinary();
// Parse JSON bodies first
app.use(express.json())
    // Enable CORS
app.use(cors({
    origin: ['http://localhost:5173', 'http://192.168.29.139:5173'], // Add your network IP
    credentials: true
}));
// Log all incoming requests (headers and body)
app.use((req, res, next) => {
    console.log('--- Incoming Request ---');
    console.log('Headers:', req.headers);
    console.log('Body:', req.body);
    next();
});
// Clerk middleware for authentication
app.use(clerkMiddleware())

app.get('/', (req, res) => res.send("Server is Live"))
    // Require authentication for all routes after this
app.use(requireAuth())
app.use('/api/ai', aiRouter)
app.use('/api/user', userRouter)

const PORT = process.env.PORT || 3000;

app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server is running at http://0.0.0.0:${PORT}`);
});