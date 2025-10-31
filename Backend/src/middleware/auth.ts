import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { IUser, User } from '../models/User';
import { IUserPayload } from '../types/express';

export const protect = async (req: Request, res: Response, next: NextFunction) => {
  try {
    // 1) Get token from header
    let token: string | undefined;
    // Authorization: Bearer <token>
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer ')) {
      token = req.headers.authorization.split(' ')[1];
    }
    // x-access-token header
    if (!token && typeof req.headers['x-access-token'] === 'string') {
      token = req.headers['x-access-token'] as string;
    }
    // Cookie (requires cookie-parser; safe if absent)
    if (!token && (req as any).cookies?.token) {
      token = (req as any).cookies.token;
    }
    // Query param ?token=...
    if (!token && typeof req.query.token === 'string') {
      token = req.query.token as string;
    }
    // Body { token: "..." }
    if (!token && typeof (req.body as any)?.token === 'string') {
      token = (req.body as any).token;
    }

    if (!token) {
      return res.status(401).json({
        status: 'error',
        message: req.t?.('auth.not_logged_in') || 'You are not logged in! Please log in to get access.'
      });
    }

    // 2) Verify token
    interface JwtPayload {
      id: string;
      iat: number;
    }
    
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as JwtPayload;

    // 3) Check if user still exists
    const currentUser = await User.findById(decoded.id);
    if (!currentUser) {
      return res.status(401).json({
        status: 'error',
        message: req.t?.('auth.user_no_longer_exists') || 'The user belonging to this token no longer exists.'
      });
    }

    // 4) Check if user changed password after the token was issued
    if (currentUser.changedPasswordAfter(decoded.iat)) {
      return res.status(401).json({
        status: 'error',
        message: req.t?.('auth.password_changed_recently') || 'User recently changed password! Please log in again.'
      });
    }

    // GRANT ACCESS TO PROTECTED ROUTE
    req.user = {
      id: currentUser.id || currentUser._id?.toString() || '',
      roles: currentUser.roles,
      name: currentUser.name,
      email: currentUser.email
    };
    next();
  } catch (err) {
    return res.status(401).json({
      status: 'error',
      message: req.t?.('auth.token_expired') || 'Invalid token or session expired. Please log in again.'
    });
  }
};

// Role-based authorization
export const restrictTo = (...roles: string[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.user || !req.user.roles || !roles.some(role => req.user!.roles.includes(role))) {
      return res.status(403).json({
        status: 'error',
        message: req.t?.('auth.no_permission') || 'You do not have permission to perform this action'
      });
    }
    next();
  };
};

// Only for rendered pages, no errors!
export const isLoggedIn = async (req: Request, res: Response, next: NextFunction) => {
  if (req.cookies?.token) {
    try {
      // 1) Verify token
      interface JwtPayload {
        id: string;
        iat: number;
      }
      const decoded = jwt.verify(req.cookies.token, process.env.JWT_SECRET!) as JwtPayload;

      // 2) Check if user still exists
      const currentUser = await User.findById(decoded.id);
      if (!currentUser) {
        return next();
      }

      // 3) Check if user changed password after the token was issued
      if (currentUser.changedPasswordAfter(decoded.iat)) {
        return next();
      }

      // THERE IS A LOGGED IN USER
      res.locals.user = currentUser;
      return next();
    } catch (err) {
      return next();
    }
  }
  next();
};
