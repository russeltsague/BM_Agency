import { Request } from 'express';
import { Document, Types } from 'mongoose';
import { Language } from '../i18n';

export type UserRole = 'owner' | 'admin' | 'editor' | 'author';

export interface IUserPayload {
  id: string | Types.ObjectId;
  roles: UserRole[];
  name?: string;
  email?: string;
  hasPermission?: (permission: string) => boolean;
  [key: string]: any;
}

export interface IUser extends Document {
  _id: Types.ObjectId;
  name: string;
  email: string;
  password: string;
  roles: UserRole[];
  isActive: boolean;
  lastLogin?: Date;
  passwordChangedAt?: Date;
  passwordResetToken?: string;
  passwordResetExpires?: Date;
  comparePassword(candidatePassword: string): Promise<boolean>;
  changedPasswordAfter(JWTTimestamp: number): boolean;
  hasPermission(permission: string): boolean;
}

export interface CustomRequest extends Request {
  user?: IUserPayload;
  requestTime?: string;
  t?: (key: string, params?: Record<string, string | number>) => string;
  lang?: Language;
}

declare module 'express-serve-static-core' {
  interface Request {
    user?: IUserPayload;
    requestTime?: string;
    t?: (key: string, params?: Record<string, string | number>) => string;
    lang?: Language;
  }
}

declare module 'xss-clean' {
  const xss: () => any;
  export default xss;
}

declare module 'hpp' {
  const hpp: () => any;
  export default hpp;
}
