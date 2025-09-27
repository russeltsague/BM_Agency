import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import { User, IUser } from '../models/User';
import { z } from 'zod';

// Zod schemas for request validation
const registerSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters').max(50, 'Name cannot exceed 50 characters'),
  email: z.string().email('Please provide a valid email'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  role: z.enum(['admin', 'editor']).optional()
});

const loginSchema = z.object({
  email: z.string().email('Please provide a valid email'),
  password: z.string().min(1, 'Password is required')
});

// Generate JWT token
const signToken = (id: string): string => {
  const secret = process.env.JWT_SECRET || 'your-secret-key';
  
  return jwt.sign(
    { id },
    secret,
    { expiresIn: '90d' }
  );
};

// Create and send token
const createSendToken = (user: IUser & { _id: any }, statusCode: number, res: Response) => {
  const token = signToken(user._id.toString());
  
  // Remove password from output
  user.password = undefined as any;
  
  res.status(statusCode).json({
    status: 'success',
    token,
    data: {
      user
    }
  });
};

// Update password schema
const updatePasswordSchema = z.object({
  currentPassword: z.string().min(1, 'Current password is required'),
  newPassword: z.string().min(8, 'New password must be at least 8 characters')
});

export const authController = {
  async register(req: Request, res: Response) {
    try {
      // 1) Validate request body
      const { name, email, password, role } = registerSchema.parse(req.body);

      // 2) Check if user already exists
      const existingUser = await User.findOne({ email });
      if (existingUser) {
        return res.status(400).json({
          status: 'error',
          message: 'Email already in use'
        });
      }

      // 3) Create new user
      const newUser = await User.create({
        name,
        email,
        password,
        role: role || 'editor'
      });

      // 4) Generate token and send response
      createSendToken(newUser, 201, res);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({
          status: 'error',
          message: 'Validation error',
          errors: error.issues.map(issue => ({
            message: issue.message,
            path: issue.path
          }))
        });
      }
      
      console.error('Registration error:', error);
      res.status(500).json({
        status: 'error',
        message: 'Internal server error'
      });
    }
  },

  async login(req: Request, res: Response) {
    try {
      // 1) Validate request body
      const { email, password } = loginSchema.parse(req.body);

      // 2) Check if user exists && password is correct
      const user = await User.findOne({ email }).select('+password');
      
      if (!user || !(await user.comparePassword(password))) {
        return res.status(401).json({
          status: 'error',
          message: 'Incorrect email or password'
        });
      }

      // 3) If everything ok, send token to client
      createSendToken(user, 200, res);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({
          status: 'error',
          message: 'Validation error',
          errors: error.issues.map(issue => ({
            message: issue.message,
            path: issue.path
          }))
        });
      }
      
      console.error('Login error:', error);
      res.status(500).json({
        status: 'error',
        message: 'Internal server error'
      });
    }
  },

  async getMe(req: Request, res: Response) {
    try {
      // The user is already attached to the request by the protect middleware
      const user = await User.findById(req.user?._id);
      
      if (!user) {
        return res.status(404).json({
          status: 'error',
          message: 'User not found'
        });
      }

      res.status(200).json({
        status: 'success',
        data: {
          user
        }
      });
    } catch (error) {
      console.error('Get me error:', error);
      res.status(500).json({
        status: 'error',
        message: 'Internal server error'
      });
    }
  },

  // Update user password
  async updatePassword(req: Request, res: Response) {
    try {
      // 1) Get user from collection
      if (!req.user?.id) {
        return res.status(401).json({
          status: 'error',
          message: 'You are not logged in! Please log in to get access.'
        });
      }
      const user = await User.findById(req.user.id).select('+password');
      if (!user) {
        return res.status(404).json({
          status: 'error',
          message: 'User not found'
        });
      }

      // 2) Check if POSTed current password is correct
      if (!user || !(await user.comparePassword(req.body.currentPassword))) {
        return res.status(401).json({
          status: 'error',
          message: 'Your current password is wrong.'
        });
      }

      // 3) If so, update password
      user.password = req.body.newPassword;
      await user.save();

      // 4) Log user in, send JWT
      createSendToken(user, 200, res);
    } catch (error) {
      res.status(500).json({
        status: 'error',
        message: 'An error occurred while updating password'
      });
    }
  },

  // Get all users (admin only)
  async getAllUsers(req: Request, res: Response) {
    try {
      const users = await User.find().select('-__v -password');
      res.status(200).json({
        status: 'success',
        results: users.length,
        data: {
          users
        }
      });
    } catch (error) {
      res.status(500).json({
        status: 'error',
        message: 'An error occurred while fetching users'
      });
    }
  }
};

export default authController;
