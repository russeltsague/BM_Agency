import { Request, Response } from 'express';
import mongoose from 'mongoose';
import logger from '../utils/logger';

// Health check endpoint
export const healthCheck = async (req: Request, res: Response) => {
  try {
    // Check database connection
    const dbStatus = mongoose.connection.readyState === 1 ? 'connected' : 'disconnected';

    // Check server status
    const serverStatus = {
      status: 'ok',
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      memory: process.memoryUsage(),
      version: process.env.npm_package_version || '1.0.0',
      environment: process.env.NODE_ENV || 'development',
      database: {
        status: dbStatus,
        name: mongoose.connection.name,
        host: mongoose.connection.host,
      }
    };

    // Return 200 if everything is healthy
    if (dbStatus === 'connected') {
      logger.info('Health check passed');
      return res.status(200).json({
        status: 'healthy',
        data: serverStatus
      });
    }

    // Return 503 if database is not connected
    logger.warn('Health check failed - database disconnected');
    return res.status(503).json({
      status: 'unhealthy',
      data: serverStatus,
      message: 'Database connection issue'
    });

  } catch (error) {
    logger.error('Health check error:', error);
    return res.status(503).json({
      status: 'unhealthy',
      timestamp: new Date().toISOString(),
      error: 'Health check failed'
    });
  }
};

// Readiness check for Kubernetes/OpenShift
export const readinessCheck = async (req: Request, res: Response) => {
  try {
    // Check if database is ready
    if (mongoose.connection.readyState !== 1) {
      return res.status(503).json({
        status: 'not ready',
        message: 'Database not ready'
      });
    }

    res.status(200).json({
      status: 'ready',
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    logger.error('Readiness check error:', error);
    res.status(503).json({
      status: 'not ready',
      error: 'Readiness check failed'
    });
  }
};

// Liveness check for Kubernetes/OpenShift
export const livenessCheck = (req: Request, res: Response) => {
  // Simple liveness check - if the server is responding, it's alive
  res.status(200).json({
    status: 'alive',
    timestamp: new Date().toISOString(),
    uptime: process.uptime()
  });
};
