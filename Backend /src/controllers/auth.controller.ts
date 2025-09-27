import { Request, Response } from 'express';
import jwt, { SignOptions } from 'jsonwebtoken';
import { z } from 'zod';
import { User } from '../models/User';

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
      
      // Find user by email
      const user = await User.findOne({ email }).select('+password');
      
      if (!user || !(await user.comparePassword(password))) {
        return res.status(401).json({ status: 'error', message: 'Invalid credentials' });
      }
      
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
      
      res.json({
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
      
      console.error('Login error:', error);
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
      
      console.error('Registration error:', error);
      res.status(500).json({ status: 'error', message: 'Internal server error' });
    }
  }
};
