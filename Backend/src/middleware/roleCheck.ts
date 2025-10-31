import { Response, NextFunction } from 'express';
import { AppError } from './errorHandler';
import { CustomRequest } from '../types/express';

export const restrictTo = (...roles: string[]) => {
  return (req: CustomRequest, res: Response, next: NextFunction) => {
    // Check if user is authenticated and has roles
    if (!req.user || !req.user.roles) {
      return next(
        new AppError('You are not logged in! Please log in to get access.', 401)
      );
    }

    // Check if user's roles include any of the allowed roles
    if (!roles.some(role => req.user!.roles.includes(role))) {
      return next(
        new AppError('You do not have permission to perform this action', 403)
      );
    }

    next();
  };
};

// Middleware to check if user is admin
export const isAdmin = restrictTo('admin');

// Middleware to check if user is admin or editor
export const isAdminOrEditor = restrictTo('admin', 'editor');

// Middleware to check if user is the owner of the resource
export const isOwnerOrAdmin = (modelName: string) => {
  return async (req: CustomRequest, res: Response, next: NextFunction) => {
    try {
      const Model = require(`../models/${modelName}`);
      const doc = await Model.findById(req.params.id);

      if (!doc) {
        return next(new AppError('No document found with that ID', 404));
      }

      // Check if user is authenticated and has roles
      if (!req.user || !req.user.roles) {
        return next(
          new AppError('You are not logged in! Please log in to get access.', 401)
        );
      }

      // If user is admin, allow access
      if (req.user.roles.includes('admin')) {
        return next();
      }

      // If user is the owner of the document, allow access
      if (doc.user && doc.user.toString() === req.user?.id) {
        return next();
      }

      next(
        new AppError('You do not have permission to perform this action', 403)
      );
    } catch (error) {
      next(error);
    }
  };
};
