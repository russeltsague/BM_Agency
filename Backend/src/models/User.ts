// Enhanced role system similar to Facebook's admin roles
import { Schema, model, Document, Types } from 'mongoose';
import { IUser, IUserPayload, UserRole } from '../types/models/User';
import bcrypt from 'bcrypt';

export const UserRole = {
  OWNER: 'owner',
  ADMIN: 'admin',
  EDITOR: 'editor',
  AUTHOR: 'author'
} as const;

// Permissions for each role
export const RolePermissions = {
  [UserRole.OWNER]: [
    'manage_users',
    'manage_roles',
    'manage_all_content',
    'publish_content',
    'approve_content',
    'delete_content',
    'view_analytics',
    'manage_settings'
  ],
  [UserRole.ADMIN]: [
    'manage_users',
    'manage_roles',
    'manage_all_content',
    'publish_content',
    'approve_content',
    'delete_content',
    'view_analytics'
  ],
  [UserRole.EDITOR]: [
    'manage_own_content',
    'publish_own_content',
    'edit_others_content',
    'view_analytics'
  ],
  [UserRole.AUTHOR]: [
    'manage_own_content',
    'submit_for_approval'
  ]
} as const;

// User schema definition
const userSchema = new Schema<IUser>({
  _id: {
    type: Schema.Types.ObjectId,
    default: () => new Types.ObjectId(),
  } as const,
  name: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true,
    match: [/^\S+@\S+\.\S+$/, 'Please use a valid email address']
  },
  password: {
    type: String,
    required: true,
    select: false,
    minlength: [8, 'Password must be at least 8 characters long']
  },
  roles: [{
    type: String,
    enum: ['owner', 'admin', 'editor', 'author'],
    default: ['author'],
    required: true,
  }],
  permissions: {
    type: [String],
    default: []
  },
  adminPermissions: {
    services: { type: Boolean, default: false },
    portfolio: { type: Boolean, default: false },
    blog: { type: Boolean, default: false },
    team: { type: Boolean, default: false },
    testimonials: { type: Boolean, default: false },
    users: { type: Boolean, default: false },
    settings: { type: Boolean, default: false },
    analytics: { type: Boolean, default: false }
  },
  isActive: {
    type: Boolean,
    default: true
  },
  invitedBy: {
    type: Schema.Types.ObjectId,
    ref: 'User'
  },
  invitedAt: Date,
  passwordChangedAt: Date
}, {
  timestamps: true,
  toJSON: {
    transform: (doc, ret) => {
      ret.id = ret._id;
      delete ret._id;
      delete ret.__v;
      delete ret.password;
      return ret;
    }
  }
});

// Method to check if user has admin permission for a specific feature
userSchema.methods.hasAdminPermission = function(this: IUser, feature: string): boolean {
  return this.adminPermissions !== undefined && (this.adminPermissions as any)[feature] === true;
};

// Method to check if user has any admin permissions
userSchema.methods.hasAnyAdminPermissions = function(this: IUser): boolean {
  const adminPerms = this.adminPermissions as any;
  return adminPerms && Object.values(adminPerms).some((permission: any) => permission === true);
};

// Method to add permission (for role management)
userSchema.methods.addPermission = function(permission: string) {
  if (!this.permissions) {
    this.permissions = [];
  }
  if (!this.permissions.includes(permission)) {
    this.permissions.push(permission);
  }
};

// Method to remove permission
userSchema.methods.removePermission = function(permission: string) {
  if (this.permissions) {
    this.permissions = this.permissions.filter((p: string) => p !== permission);
  }
};

// Update permissions when roles change
userSchema.pre('save', function(next) {
  if (this.isModified('roles')) {
    const roles = this.roles as UserRole[];
    this.permissions = roles.flatMap((role: UserRole) => RolePermissions[role] || []);
  } else if (!this.permissions || this.permissions.length === 0) {
    // Initialize permissions if empty
    const roles = this.roles as UserRole[];
    this.permissions = roles.flatMap((role: UserRole) => RolePermissions[role] || []);
  }
  next();
});

// Hash password before saving
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();

  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error: any) {
    next(error);
  }
});

// Method to compare password
userSchema.methods.comparePassword = async function(candidatePassword: string): Promise<boolean> {
  return bcrypt.compare(candidatePassword, this.password);
};

// Check if password was changed after token was issued
userSchema.methods.changedPasswordAfter = function(JWTTimestamp: number) {
  if (this.passwordChangedAt) {
    const changedTimestamp = Math.floor(this.passwordChangedAt.getTime() / 1000);
    return JWTTimestamp < changedTimestamp;
  }
  // False means NOT changed
  return false;
};

export const User = model<IUser>('User', userSchema);
