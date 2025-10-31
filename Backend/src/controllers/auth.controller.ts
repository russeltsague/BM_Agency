import { Request, Response } from 'express';
import jwt, { SignOptions } from 'jsonwebtoken';
import { z } from 'zod';
import { User } from '../models/User';
import { promisify } from 'util';

const verifyAsync = promisify(jwt.verify) as (token: string, secret: string) => Promise<any>;

interface JwtPayload {
  id: string;
}

declare module 'jsonwebtoken' {
  export interface JwtPayload {
    id: string;
  }
}

interface UserDocument extends Document {
  _id: any;
  email: string;
  password: string;
  comparePassword(candidatePassword: string): Promise<boolean>;
  toObject(): any;
}

const loginSchema = z.object({
  email: z.string().email('Invalid email format'),
  password: z.string().min(6, 'Password must be at least 6 characters long')
});

export const authController = {
  async login(req: Request, res: Response) {
    try {
      const { email, password } = loginSchema.parse(req.body);
      
      // Find user by email with proper type
      const user = await User.findOne({ email }).select('+password').lean();
      
      if (!user || !('comparePassword' in user) || !(await user.comparePassword(password))) {
        return res.status(401).json({ status: 'error', message: 'Invalid credentials' });
      }
      
      // Ensure user._id is a string
      const userId = user._id?.toString();
      if (!userId) {
        throw new Error('User ID is missing');
      }
      
      // Generate access token (short-lived)
      const accessToken = jwt.sign(
        { id: userId },
        process.env.JWT_SECRET || 'your-secret-key',
        { expiresIn: '15m' }
      ) as string;
      
      // Generate refresh token (long-lived)
      const refreshToken = jwt.sign(
        { id: userId },
        process.env.REFRESH_TOKEN_SECRET || 'your-refresh-secret',
        { expiresIn: '7d' }
      ) as string;
      
      // Set refresh token in HTTP-only cookie
      res.cookie('refreshToken', refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
        path: '/api/v1/auth/refresh-token'
      });
      
      // Remove password from response
      const userWithoutPassword = user.toObject();
      if ('password' in userWithoutPassword) {
        delete (userWithoutPassword as any).password;
      }
      
      res.json({
        status: 'success',
        data: {
          user: userWithoutPassword,
          token: accessToken
        }
      });
      
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({
          status: 'error',
          message: 'Validation error',
          errors: error.issues
        });
      }
      
      res.status(500).json({ status: 'error', message: 'Internal server error' });
    }
  },
  
  async register(req: Request, res: Response) {
    try {
      const { email, password } = loginSchema.parse(req.body);
      
      // Check if user already exists
      const existingUser = await User.findOne({ email });
      if (existingUser) {
        return res.status(400).json({ status: 'error', message: 'Email already in use' });
      }
      
      // Create new user
      const user = await User.create({ email, password });
      
      // Generate JWT token
      const jwtOptions: SignOptions = { expiresIn: '7d' }; // Default to 7 days
      if (process.env.JWT_EXPIRES_IN) {
        const expiresIn = parseInt(process.env.JWT_EXPIRES_IN, 10);
        if (!isNaN(expiresIn)) {
          jwtOptions.expiresIn = expiresIn;
        }
      }
      
      const token = jwt.sign(
        { id: user._id },
        process.env.JWT_SECRET || 'your-secret-key',
        jwtOptions
      );
      
      // Remove password from response
      const userWithoutPassword = user.toObject();
      if ('password' in userWithoutPassword) {
        delete (userWithoutPassword as any).password;
      }
      
      res.status(201).json({
        status: 'success',
        data: {
          user: userWithoutPassword,
          token
        }
      });
      
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({
          status: 'error',
          message: 'Validation error',
          errors: error.issues
        });
      }
      
      res.status(500).json({ status: 'error', message: 'Internal server error' });
    }
  },
  
  async refreshToken(req: Request, res: Response) {
    try {
      // Get the refresh token from cookies
      const refreshToken = req.cookies?.refreshToken;
      
      if (!refreshToken) {
        return res.status(401).json({ 
          status: 'error', 
          message: 'No refresh token provided' 
        });
      }

      // Verify the refresh token
      const decoded = await verifyAsync(
        refreshToken, 
        process.env.REFRESH_TOKEN_SECRET || 'your-refresh-secret'
      );

      // Find the user
      const user = await User.findById(decoded.id);
      
      if (!user) {
        return res.status(404).json({ 
          status: 'error', 
          message: 'User not found' 
        });
      }

      // Generate a new access token
      const accessToken = jwt.sign(
        { id: user._id },
        process.env.JWT_SECRET || 'your-secret-key',
        { expiresIn: process.env.JWT_EXPIRES_IN || '15m' }
      );

      // Set the new access token in the response
      res.json({
        status: 'success',
        data: {
          token: accessToken
        }
      });
      
    } catch (error) {
      res.status(401).json({ 
        status: 'error', 
        message: 'Invalid or expired refresh token' 
      });
    }
  }
};
