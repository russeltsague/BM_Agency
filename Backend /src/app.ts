import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import mongoose from 'mongoose';
import path from 'path';
import dotenv from 'dotenv';
import rateLimit from 'express-rate-limit';
import mongoSanitize from 'express-mongo-sanitize';
const xss = require('xss-clean');
const hpp = require('hpp');
import swaggerUi from 'swagger-ui-express';
import YAML from 'yamljs';
import { globalErrorHandler } from './middleware/errorHandler';
import specs from './config/swagger';

// Load environment variables
dotenv.config({ path: path.join(__dirname, '../.env') });

// Import routes
import authRoutes from './routes/authRoutes';
import serviceRoutes from './routes/serviceRoutes';
import realisationRoutes from './routes/realisationRoutes';
import articleRoutes from './routes/articleRoutes';
import testimonialRoutes from './routes/testimonialRoutes';
import productRoutes from './routes/productRoutes';

// Database connection
const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI!);
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error: any) {
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
};

// Create Express application
export const app = express();

// Middleware
// CORS configuration for frontend
const allowedOrigins = process.env.FRONTEND_URL?.split(',') || ['http://localhost:3000'];

const corsOptions = {
  origin: (origin: string | undefined, callback: (err: Error | null, allow?: boolean) => void) => {
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true);

    if (allowedOrigins.includes(origin)) {
      return callback(null, true);
    } else {
      return callback(new Error('Not allowed by CORS'), false);
    }
  },
  credentials: true,
  optionsSuccessStatus: 200
};
app.use(cors(corsOptions));
app.use(helmet());
app.use(express.json({ limit: '10kb' }));
app.use(express.urlencoded({ extended: true, limit: '10kb' }));

// Logging in development
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// Security headers
// Helmet v8 sets sensible defaults; the specific sub-middleware functions like
// xssFilter/noSniff/hidePoweredBy were removed. The base helmet middleware
// already provides these protections.

// Rate limiting
const limiter = rateLimit({
  max: 100,
  windowMs: 15 * 60 * 1000, // 15 minutes
  message: 'Too many requests from this IP, please try again in 15 minutes!',
});
app.use('/api', limiter);

// Data sanitization against NoSQL query injection
// Temporarily disabled due to Express 5 compatibility issues
// app.use(mongoSanitize());

// Data sanitization against XSS
// app.use(xss());

// Prevent parameter pollution
// Temporarily disabled due to Express 5 compatibility issues
// app.use(hpp({
//   whitelist: [
//     'duration', 'ratingsQuantity', 'ratingsAverage', 'maxGroupSize', 'difficulty', 'price'
//   ]
// }));

// Test middleware
app.use((req: Request, res: Response, next: NextFunction) => {
  req.requestTime = new Date().toISOString();
  next();
});

// API Documentation
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs, {
  explorer: true,
  customCss: '.swagger-ui .topbar { display: none }',
}));

// API Routes
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/services', serviceRoutes);
app.use('/api/v1/realisations', realisationRoutes);
app.use('/api/v1/articles', articleRoutes);
app.use('/api/v1/testimonials', testimonialRoutes);
app.use('/api/v1/products', productRoutes);

// Serve static files in production
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '../client/build')));
  
  app.get('*', (req, res) => {
    res.sendFile(path.resolve(__dirname, '../client/build/index.html'));
  });
}

// Handle unhandled routes
app.use((req: Request, res: Response, next: NextFunction) => {
  res.status(404).json({
    status: 'fail',
    message: `Can't find ${req.originalUrl} on this server!`
  });
});

// Global error handling middleware
app.use(globalErrorHandler);

const PORT = process.env.PORT || 3000;

// Start the server (only if not in test environment)
if (process.env.NODE_ENV !== 'test') {
  const startServer = async () => {
    try {
      await connectDB();
      
      const server = app.listen(PORT, () => {
        console.log(`Server is running on port ${PORT}`);
        
        // Log API documentation URL
        console.log(`API Documentation: http://localhost:${PORT}/api-docs`);
      });
      
      // Handle unhandled promise rejections
      process.on('unhandledRejection', (err: Error) => {
        console.error('UNHANDLED REJECTION! Shutting down...');
        console.error(err.name, err.message);
        server.close(() => {
          process.exit(1);
        });
      });
      
      // Handle uncaught exceptions
      process.on('uncaughtException', (err: Error) => {
        console.error('UNCAUGHT EXCEPTION! Shutting down...');
        console.error(err.name, err.message);
        process.exit(1);
      });
      
      // Handle SIGTERM for graceful shutdown
      process.on('SIGTERM', () => {
        console.log('SIGTERM RECEIVED. Shutting down gracefully');
        server.close(() => {
          console.log('Process terminated!');
        });
      });
    } catch (error) {
      console.error('Failed to start server:', error);
      process.exit(1);
    }
  };
  
  startServer().catch((error) => {
    console.error('Failed to start server:', error);
    process.exit(1);
  });
}

// Export the app for testing
export default app;
