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

// Enhanced CORS configuration
const allowedOrigins = [
  'https://dev-mind-ai.vercel.app', // Your actual frontend domain
  'https://devmindai.vercel.app',   // Previous domain
  'http://localhost:5173'           // For local development
];

app.use(cors({
  origin: function (origin, callback) {
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true);
    
    if (allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'Origin', 'X-Requested-With'],
  credentials: true,
  preflightContinue: false,
  optionsSuccessStatus: 204
}));

// Handle preflight requests
app.options('*', cors());

// Log all incoming requests (headers and body)
app.use((req, res, next) => {
    console.log('--- Incoming Request ---');
    console.log('Method:', req.method);
    console.log('Path:', req.path);
    console.log('Origin:', req.headers.origin);
    console.log('Headers:', req.headers);
    if (Object.keys(req.body).length > 0) {
      console.log('Body:', req.body);
    }
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
    console.log('Allowed Origins:', allowedOrigins);
});
