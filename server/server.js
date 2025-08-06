import express from 'express';
import cors from 'cors';
import 'dotenv/config';
import { clerkMiddleware, requireAuth } from '@clerk/express';
import aiRouter from './routes/aiRoutes.js';
import userRouter from './routes/userRoutes.js';
import connectCloudinary from './configs/cloudnary.js';

const app = express();

// 1. Connect to Cloudinary
await connectCloudinary();

// 2. Strict CORS Configuration (Single Origin)
const corsOptions = {
  origin: 'https://devmindai.vercel.app',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: [
    'Content-Type',
    'Authorization',
    'X-Requested-With',
    'Accept'
  ],
  credentials: true,
  optionsSuccessStatus: 200
};

app.use(cors(corsOptions));
app.options('*', cors(corsOptions)); // Explicit preflight handling

// 3. Middleware Pipeline
app.use(express.json({ limit: '10mb' })); // Increased payload limit
app.use(express.urlencoded({ extended: true }));

// 4. Enhanced Request Logging
app.use((req, res, next) => {
  console.log('\n=== Incoming Request ===');
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.path}`);
  console.log('Origin:', req.headers.origin);
  console.log('Auth:', req.headers.authorization ? 'Present' : 'Missing');
  next();
});

// 5. Clerk Authentication
app.use(clerkMiddleware());

// 6. Health Check Route (Public)
app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    allowedOrigin: corsOptions.origin
  });
});

// 7. Protected Routes
app.use('/api/ai', requireAuth(), aiRouter);
app.use('/api/user', requireAuth(), userRouter);

// 8. Error Handling
app.use((err, req, res, next) => {
  console.error('\n!!! Error Handler !!!');
  console.error(err.stack);

  if (err.name === 'CORSError') {
    return res.status(403).json({
      error: 'Forbidden',
      message: 'Origin not allowed',
      allowedOrigin: corsOptions.origin
    });
  }

  res.status(500).json({
    error: 'Internal Server Error',
    message: process.env.NODE_ENV === 'development' ? err.message : 'Something went wrong'
  });
});

// 9. Server Startup
const PORT = process.env.PORT || 3000;
const server = app.listen(PORT, '0.0.0.0', () => {
  console.log('\n=== Server Information ===');
  console.log(`Server   : http://localhost:${PORT}`);
  console.log(`Frontend : ${corsOptions.origin}`);
  console.log(`Environment : ${process.env.NODE_ENV || 'development'}`);
  console.log(`Started at : ${new Date().toISOString()}`);
});

// 10. Graceful Shutdown
process.on('SIGTERM', () => {
  console.log('\nSIGTERM received. Shutting down gracefully...');
  server.close(() => {
    console.log('Server terminated');
    process.exit(0);
  });
});
