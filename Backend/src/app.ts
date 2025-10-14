import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import mongoose from 'mongoose';
import path from 'path';
import dotenv from 'dotenv';
import rateLimit from 'express-rate-limit';
import mongoSanitize from 'express-mongo-sanitize';
import compression from 'compression';
const xss = require('xss-clean');
const hpp = require('hpp');
const csurf = require('csurf');
import swaggerUi from 'swagger-ui-express';
import YAML from 'yamljs';
import { globalErrorHandler } from './middleware/errorHandler';
import specs from './config/swagger';
import logger from './utils/logger';
import { initSentry, sentryErrorHandler } from './utils/sentry';

// Load environment variables
dotenv.config({ path: path.join(__dirname, '../.env') });

// Initialize Sentry for error tracking
initSentry();

// Import routes
import authRoutes from './routes/authRoutes';
import serviceRoutes from './routes/serviceRoutes';
import realisationRoutes from './routes/realisationRoutes';
import articleRoutes from './routes/articleRoutes';
import testimonialRoutes from './routes/testimonialRoutes';
import productRoutes from './routes/productRoutes';
import teamRoutes from './routes/teamRoutes';
import healthRoutes from './routes/healthRoutes';
import contactRoutes from './routes/contactRoutes';
import quoteRoutes from './routes/quoteRoutes';
import newsletterRoutes from './routes/newsletterRoutes';

// Database connection
const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI!, {
      // Production optimizations
      autoIndex: false, // Disable auto-indexing in production
      maxPoolSize: 10, // Maintain up to 10 socket connections
      serverSelectionTimeoutMS: 5000, // Keep trying to send operations for 5 seconds
      socketTimeoutMS: 45000, // Close sockets after 45 seconds of inactivity
      family: 4 // Use IPv4, skip trying IPv6
    });
    logger.info(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error: any) {
    logger.error(`MongoDB Connection Error: ${error.message}`);
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
    // TEMPORARILY DISABLE CORS FOR DEBUGGING
    console.log('CORS request from origin:', origin);
    console.log('TEMPORARILY ALLOWING ALL ORIGINS FOR DEBUGGING');

    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin) {
      console.log('Allowing request with no origin');
      return callback(null, true);
    }

    // TEMPORARILY ALLOW ALL ORIGINS FOR DEBUGGING
    console.log('TEMPORARILY allowing origin:', origin);
    return callback(null, true);

    // ORIGINAL LOGIC (commented out for debugging):
    // if (allowedOrigins.includes(origin)) {
    //   return callback(null, true);
    // } else {
    //   return callback(new Error('Not allowed by CORS'), false);
    // }
  },
  credentials: true,
  optionsSuccessStatus: 200
};
app.use(cors(corsOptions));
app.use(helmet());
app.use(compression()); // Compress responses
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// Logging in development
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
} else if (process.env.NODE_ENV === 'production') {
  app.use(morgan('combined'));
}

// Security headers
// Helmet v8 sets sensible defaults; the specific sub-middleware functions like
// xssFilter/noSniff/hidePoweredBy were removed. The base helmet middleware
// already provides these protections.

// CSRF Protection - only for state-changing operations
const csrfProtection = csurf({
  cookie: {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'none' // Allow cross-origin requests
  }
});

// Apply CSRF protection to all routes except GET, HEAD, OPTIONS and API routes
app.use((req, res, next) => {
  // Skip CSRF for API routes and safe methods
  if (req.path.startsWith('/api/v1/') || ['GET', 'HEAD', 'OPTIONS'].includes(req.method)) {
    return next();
  }
  return csrfProtection(req, res, next);
});

// Rate limiting
const limiter = rateLimit({
  max: 100,
  windowMs: 15 * 60 * 1000, // 15 minutes
  message: 'Too many requests from this IP, please try again in 15 minutes!',
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers
});
app.use('/api', limiter);

// Data sanitization against NoSQL query injection
// Temporarily disabled due to Express 5 compatibility issues
// app.use(mongoSanitize());

// Data sanitization against XSS - Temporarily disabled due to compatibility issues
// app.use(xss());

// Prevent parameter pollution
app.use(hpp({
  whitelist: [
    'sort', 'page', 'limit', 'fields'
  ]
}));

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

// CSRF token endpoint for frontend
app.get('/api/v1/csrf-token', (req: Request, res: Response) => {
  res.json({ csrfToken: req.csrfToken() });
});

// API Routes
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/services', serviceRoutes);
app.use('/api/v1/realisations', realisationRoutes);
app.use('/api/v1/articles', articleRoutes);
app.use('/api/v1/testimonials', testimonialRoutes);
app.use('/api/v1/team', teamRoutes);
app.use('/api/v1/products', productRoutes);
app.use('/api/v1/contacts', contactRoutes);
app.use('/api/v1/quotes', quoteRoutes);
app.use('/api/v1/newsletter', newsletterRoutes);
app.use('/api/v1', healthRoutes); // Health check routes

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

// Sentry error handler (must be after all routes and before global error handler)
app.use(sentryErrorHandler);

const PORT = process.env.PORT || 5000;

// Start the server (only if not in test environment)
if (process.env.NODE_ENV !== 'test') {
  const startServer = async () => {
    try {
      await connectDB();
      
      const server = app.listen(PORT, () => {
        logger.info(`Server is running on port ${PORT}`);
        logger.info(`Environment: ${process.env.NODE_ENV || 'development'}`);

        // Log API documentation URL
        if (process.env.NODE_ENV !== 'test') {
        }
      });
      
      // Handle unhandled promise rejections
      process.on('unhandledRejection', (err: Error) => {
        logger.error('UN HANDLED REJECTION! Shutting down...');
        logger.error(`${err.name}: ${err.message}`);
        logger.error(err.stack);
        server.close(() => {
          process.exit(1);
        });
      });

      // Handle uncaught exceptions
      process.on('uncaughtException', (err: Error) => {
        logger.error('UNCAUGHT EXCEPTION! Shutting down...');
        logger.error(`${err.name}: ${err.message}`);
        process.exit(1);
      });
      
      // Handle SIGTERM for graceful shutdown
      process.on('SIGTERM', () => {
        logger.info('SIGTERM RECEIVED. Shutting down gracefully');
        server.close(async () => {
          logger.info('HTTP server closed');
          // Close database connection
          await mongoose.connection.close();
          logger.info('MongoDB connection closed');
          logger.info('Process terminated!');
        });
      });

      // Handle SIGINT (Ctrl+C) for graceful shutdown
      process.on('SIGINT', () => {
        logger.info('SIGINT RECEIVED. Shutting down gracefully');
        server.close(async () => {
          logger.info('HTTP server closed');
          // Close database connection
          await mongoose.connection.close();
          logger.info('MongoDB connection closed');
          logger.info('Process terminated!');
        });
      });
    } catch (error) {
      logger.error('Failed to start server:', error);
      process.exit(1);
    }
  };
  
  startServer().catch((error) => {
    logger.error('Failed to start server:', error);
    process.exit(1);
  });
}

// Export the app for testing
export default app;
