import { Document, Types } from 'mongoose';

export type UserRole = 'owner' | 'admin' | 'editor' | 'author';

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
  hasAdminPermission(): boolean;
  hasAnyAdminPermissions(): boolean;
  permissions: string[];
}

export interface IUserPayload {
  id: string | Types.ObjectId;
  name?: string;
  email?: string;
  roles: UserRole[];
  permissions?: string[];
  hasPermission?: (permission: string) => boolean;
  hasAdminPermission?: () => boolean;
  hasAnyAdminPermissions?: () => boolean;
}
