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

// Helpers to create tokens
const signAccessToken = (id: string): string => {
  const secret = process.env.JWT_SECRET || 'your-secret-key';
  const expiresIn = process.env.JWT_EXPIRES_IN || '15m';
  return jwt.sign({ id }, secret, { expiresIn });
};

const signRefreshToken = (id: string): string => {
  const secret = process.env.REFRESH_TOKEN_SECRET || 'your-refresh-secret';
  const expiresIn = process.env.REFRESH_TOKEN_EXPIRES_IN || '7d';
  return jwt.sign({ id }, secret, { expiresIn });
};

// Create tokens, set HttpOnly cookies, and send response
const createSendToken = (user: IUser & { _id: any }, statusCode: number, res: Response) => {
  const accessToken = signAccessToken(user._id.toString());
  const refreshToken = signRefreshToken(user._id.toString());

  const isProd = process.env.NODE_ENV === 'production';

  // Set cookies
  res.cookie('token', accessToken, {
    httpOnly: true,
    secure: isProd,
    sameSite: isProd ? 'none' : 'lax',
    maxAge: 15 * 60 * 1000 // 15 minutes
  });

  res.cookie('refreshToken', refreshToken, {
    httpOnly: true,
    secure: isProd,
    sameSite: isProd ? 'none' : 'lax',
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    path: '/api/v1/auth/refresh-token'
  });
  
  // Remove password from output
  user.password = undefined as any;
  
  res.status(statusCode).json({
    status: 'success',
    token: accessToken,
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

// Update profile schema
const updateProfileSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters').max(50, 'Name cannot exceed 50 characters').optional(),
  email: z.string().email('Please provide a valid email').optional()
});

// Create admin schema
const createAdminSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters').max(50, 'Name cannot exceed 50 characters'),
  email: z.string().email('Please provide a valid email'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  role: z.enum(['admin', 'editor']).optional()
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
          message: req.t?.('auth.email_already_exists') || 'Email already in use'
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
          message: req.t?.('validation.validation_error') || 'Validation error',
          errors: error.issues.map(issue => ({
            message: issue.message,
            path: issue.path
          }))
        });
      }
      
      res.status(500).json({
        status: 'error',
        message: req.t?.('errors.internal_server_error') || 'Internal server error'
      });
    }
  },

  // Refresh access token using refresh token cookie
  async refreshToken(req: Request, res: Response) {
    try {
      const refreshToken = req.cookies?.refreshToken;
      if (!refreshToken) {
        return res.status(401).json({ 
          status: 'error', 
          message: req.t?.('auth.no_refresh_token') || 'No refresh token provided' 
        });
      }

      const decoded = jwt.verify(
        refreshToken,
        process.env.REFRESH_TOKEN_SECRET || 'your-refresh-secret'
      ) as { id: string };

      const user = await User.findById(decoded.id);
      if (!user) {
        return res.status(404).json({ 
          status: 'error', 
          message: req.t?.('auth.user_not_found') || 'User not found' 
        });
      }

      const newAccessToken = signAccessToken(user._id.toString());

      const isProd = process.env.NODE_ENV === 'production';
      res.cookie('token', newAccessToken, {
        httpOnly: true,
        secure: isProd,
        sameSite: isProd ? 'none' : 'lax',
        maxAge: 15 * 60 * 1000
      });

      return res.json({ status: 'success', data: { token: newAccessToken } });
    } catch (error) {
      return res.status(401).json({ 
        status: 'error', 
        message: req.t?.('auth.invalid_refresh_token') || 'Invalid or expired refresh token' 
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
          message: req.t?.('auth.invalid_credentials') || 'Incorrect email or password'
        });
      }

      // 3) If everything ok, set cookies and send token to client
      createSendToken(user, 200, res);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({
          status: 'error',
          message: req.t?.('validation.validation_error') || 'Validation error',
          errors: error.issues.map(issue => ({
            message: issue.message,
            path: issue.path
          }))
        });
      }
      
      res.status(500).json({
        status: 'error',
        message: req.t?.('errors.internal_server_error') || 'Internal server error'
      });
    }
  },

  async getMe(req: Request, res: Response) {
    try {
      // The user is already attached to the request by the protect middleware
      const user = await User.findById(req.user?.id);
      
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
  },

  // Update user profile (admin only)
  async updateProfile(req: Request, res: Response) {
    try {
      // 1) Get user from collection
      if (!req.user?.id) {
        return res.status(401).json({
          status: 'error',
          message: 'You are not logged in! Please log in to get access.'
        });
      }

      const user = await User.findById(req.user.id);
      if (!user) {
        return res.status(404).json({
          status: 'error',
          message: 'User not found'
        });
      }

      // 2) Validate request body
      const { name, email } = updateProfileSchema.parse(req.body);

      // 3) Check if email is already taken by another user
      if (email && email !== user.email) {
        const existingUser = await User.findOne({ email });
        if (existingUser) {
          return res.status(400).json({
            status: 'error',
            message: 'Email already in use'
          });
        }
        user.email = email;
      }

      // 4) Update name if provided
      if (name) {
        user.name = name;
      }

      // 5) Save the updated user
      await user.save();

      res.status(200).json({
        status: 'success',
        data: {
          user
        }
      });
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

      res.status(500).json({
        status: 'error',
        message: 'An error occurred while updating profile'
      });
    }
  },

  // Create new admin user (admin only)
  async createAdmin(req: Request, res: Response) {
    try {
      // 1) Validate request body
      const { name, email, password, role } = createAdminSchema.parse(req.body);

      // 2) Check if user already exists
      const existingUser = await User.findOne({ email });
      if (existingUser) {
        return res.status(400).json({
          status: 'error',
          message: 'Email already in use'
        });
      }

      // 3) Create new admin user
      const newUser = await User.create({
        name,
        email,
        password,
        role: role || 'admin'
      });

      // 4) Remove password from response
      newUser.password = undefined as any;

      res.status(201).json({
        status: 'success',
        data: {
          user: newUser
        },
        message: 'Admin user created successfully'
      });
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

      res.status(500).json({
        status: 'error',
        message: 'Internal server error'
      });
    }
  },

  // Delete user (admin only)
  async deleteUser(req: Request, res: Response) {
    try {
      // 1) Get user ID from params
      const { id } = req.params;

      // 2) Prevent admin from deleting themselves
      if (req.user?.id === id) {
        return res.status(400).json({
          status: 'error',
          message: 'You cannot delete your own account'
        });
      }

      // 3) Delete user
      const deletedUser = await User.findByIdAndDelete(id);
      if (!deletedUser) {
        return res.status(404).json({
          status: 'error',
          message: 'User not found'
        });
      }

      res.status(200).json({
        status: 'success',
        data: null,
        message: 'User deleted successfully'
      });
    } catch (error) {
      res.status(500).json({
        status: 'error',
        message: 'An error occurred while deleting user'
      });
    }
  }
};

export default authController;
