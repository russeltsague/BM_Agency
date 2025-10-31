import { Response } from 'express';
import { User, UserRole, RolePermissions } from '../models/User';
import { emailService } from '../utils/emailService';
import { CustomRequest, IUser, IUserPayload } from '../types/express';

// Get all users (admin/super admin only)
export const getAllUsers = async (req: CustomRequest, res: Response) => {
  try {
    if (!req.user?.roles?.includes('admin') && !req.user?.roles?.includes('owner')) {
      return res.status(403).json({ status: 'fail', message: 'You do not have permission to view users' });
    }

    const users = await User.find().select('-password').sort({ createdAt: -1 });
    res.status(200).json({ status: 'success', results: users.length, data: users });
  } catch (error) {
    res.status(500).json({ status: 'error', message: 'Failed to get users' });
  }
};

// Get user by ID (admin/super admin only)
export const getUserById = async (req: CustomRequest, res: Response) => {
  try {
    if (!req.user?.roles?.includes('admin') && !req.user?.roles?.includes('owner')) {
      return res.status(403).json({ status: 'fail', message: 'You do not have permission to view users' });
    }

    const user = await User.findById(req.params.id).select('-password');
    if (!user) {
      return res.status(404).json({ status: 'fail', message: 'User not found' });
    }

    res.status(200).json({ status: 'success', data: user });
  } catch (error) {
    res.status(500).json({ status: 'error', message: 'Failed to get user' });
  }
};

// Delete user (owner only)
export const deleteUser = async (req: CustomRequest, res: Response) => {
  try {
    if (!req.user?.roles?.includes('owner')) {
      return res.status(403).json({ status: 'fail', message: 'Only owners can delete users' });
    }

    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({ status: 'fail', message: 'User not found' });
    }

    // Prevent deleting owner
    if (user.roles.includes(UserRole.OWNER)) {
      return res.status(403).json({ status: 'fail', message: 'Cannot delete owner' });
    }

    // Prevent self-deletion
    if (user._id.toString() === req.user?.id) {
      return res.status(400).json({ status: 'fail', message: 'You cannot delete your own account' });
    }

    await User.findByIdAndDelete(req.params.id);

    res.status(204).json({ status: 'success', data: null });
  } catch (error) {
    res.status(500).json({ status: 'error', message: 'Failed to delete user' });
  }
};

// Create new user (admin/owner only)
export const createUser = async (req: CustomRequest, res: Response) => {
  try {
    if (!req.user?.roles?.includes('admin') && !req.user?.roles?.includes('owner')) {
      return res.status(403).json({ status: 'fail', message: 'You do not have permission to create users' });
    }

    const { name, email, role } = req.body as { name: string; email: string; role?: string };
    if (!name || !email) {
      return res.status(400).json({ status: 'fail', message: 'Name and email are required' });
    }

    // Check if email already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ status: 'fail', message: 'User with this email already exists' });
    }

    // Generate temporary password
    const tempPassword = Math.random().toString(36).slice(-12);

    // Create user
    const newUser = await User.create({
      name,
      email,
      password: tempPassword, // Will be hashed by pre-save hook
      roles: [role || UserRole.AUTHOR],
      invitedBy: req.user.id,
      invitedAt: new Date()
    });

    // Send welcome email with temp password
    await emailService.sendWelcomeNotification(newUser, tempPassword);

    res.status(201).json({
      status: 'success',
      data: {
        user: {
          id: newUser._id,
          name: newUser.name,
          email: newUser.email,
          roles: newUser.roles
        }
      }
    });
  } catch (error) {
    res.status(500).json({ status: 'error', message: 'Failed to create user' });
  }
};

// Update user role (admin/super admin only)
export const updateUserRole = async (req: CustomRequest, res: Response) => {
  try {
    if (!req.user?.roles?.includes('admin') && !req.user?.roles?.includes('owner')) {
      return res.status(403).json({ status: 'fail', message: 'You do not have permission to update user roles' });
    }

    const { role } = req.body;
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({ status: 'fail', message: 'User not found' });
    }

    // Prevent owner from being modified by non-owner
    if (user.roles.includes('owner') && !req.user?.roles?.includes('owner')) {
      return res.status(403).json({ status: 'fail', message: 'Only owners can modify other owners' });
    }

    // Prevent promoting to owner unless current user is owner
    if (role === 'owner' && !req.user?.roles?.includes('owner')) {
      return res.status(403).json({ status: 'fail', message: 'Only owners can assign owner role' });
    }
    if (user.roles.includes(UserRole.OWNER) && !req.user.roles.includes(UserRole.OWNER)) {
      return res.status(403).json({ status: 'fail', message: 'Only owners can modify other owner roles' });
    }

    // Prevent self-demotion
    if (user._id.toString() === req.user.id && role !== user.roles[0]) {
      return res.status(400).json({ status: 'fail', message: 'You cannot change your own role' });
    }

    const oldRole = user.roles[0];
    user.roles = [role];
    await user.save();

    // Send role assignment notification
    if (emailService) {
      // Create a minimal user object for the email service
      const currentUser = {
        name: req.user?.name || 'Admin',
        email: req.user?.email || 'admin@example.com',
        id: req.user?.id || 'unknown',
        roles: req.user?.roles || [],
        permissions: []
      } as IUserPayload;
      
      await emailService.sendRoleAssignmentNotification(
        user as unknown as IUser, 
        role, 
        currentUser
      );
    }

    res.status(200).json({ status: 'success', data: { user: { id: user._id.toString(), name: user.name, roles: user.roles } } });
  } catch (error) {
    res.status(500).json({ status: 'error', message: 'Failed to update user role' });
  }
};

// Deactivate user (admin/super admin only)
export const deactivateUser = async (req: CustomRequest, res: Response) => {
  try {
    if (!req.user?.roles?.includes('admin') && !req.user?.roles?.includes('owner')) {
      return res.status(403).json({ status: 'fail', message: 'You do not have permission to deactivate users' });
    }

    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({ status: 'fail', message: 'User not found' });
    }

    // Prevent deactivating owner
    if (user.roles.includes('owner') && !req.user?.roles?.includes('owner')) {
      return res.status(403).json({ status: 'fail', message: 'Only owners can deactivate other owners' });
    }

    // Prevent self-deactivation
    if (user._id.toString() === req.user.id) {
      return res.status(400).json({ status: 'fail', message: 'You cannot deactivate your own account' });
    }

    user.isActive = false;
    await user.save();

    res.status(200).json({ status: 'success', message: 'User deactivated successfully' });
  } catch (error) {
    res.status(500).json({ status: 'error', message: 'Failed to deactivate user' });
  }
};

// Reactivate user (admin/super admin only)
export const reactivateUser = async (req: CustomRequest, res: Response) => {
  try {
    if (!req.user?.roles?.includes('admin') && !req.user?.roles?.includes('owner')) {
      return res.status(403).json({ status: 'fail', message: 'You do not have permission to reactivate users' });
    }

    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({ status: 'fail', message: 'User not found' });
    }

    user.isActive = true;
    await user.save();

    res.status(200).json({ status: 'success', message: 'User reactivated successfully' });
  } catch (error) {
    res.status(500).json({ status: 'error', message: 'Failed to reactivate user' });
  }
};

// Update user profile (own profile or admin/owner)
export const updateUserProfile = async (req: CustomRequest, res: Response) => {
  try {
    const userId = req.params.id || req.user?.id;
    if (!userId) {
      return res.status(400).json({ status: 'fail', message: 'User ID is required' });
    }
    
    // Check if user is updating their own profile or is an admin/owner
    if (req.params.id && req.params.id !== req.user?.id && 
        !req.user?.roles?.includes('admin') && !req.user?.roles?.includes('owner')) {
      return res.status(403).json({ status: 'fail', message: 'You can only update your own profile' });
    }

    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ status: 'fail', message: 'User not found' });
    }

    // Check if user is updating their own profile or is admin/owner
    if (user._id.toString() !== req.user?.id && 
        !req.user?.roles?.includes('admin') && 
        !req.user?.roles?.includes('owner')) {
      return res.status(403).json({
        status: 'fail',
        message: 'You do not have permission to update this user'
      });
    }

    // Update fields
    if (req.body.name) user.name = req.body.name;
    if (req.body.email) user.email = req.body.email;

    await user.save();

    res.status(200).json({
      status: 'success',
      message: 'User profile updated successfully',
      data: { name: user.name, email: user.email, roles: user.roles }
    });
  } catch (error) {
    res.status(500).json({ status: 'error', message: 'Failed to update user profile' });
  }
};

// Get available roles and permissions (admin/owner only)
export const getRolesAndPermissions = async (req: CustomRequest, res: Response) => {
  try {
    if (!req.user?.roles?.includes('admin') && !req.user?.roles?.includes('owner')) {
      return res.status(403).json({ status: 'fail', message: 'You do not have permission to view roles and permissions' });
    }

    res.status(200).json({
      status: 'success',
      data: {
        roles: Object.values(UserRole),
        permissions: RolePermissions
      }
    });
  } catch (error) {
    res.status(500).json({ status: 'error', message: 'Failed to get roles and permissions' });
  }
};

// Assign role to user (owner only)
export const assignRole = async (req: CustomRequest, res: Response) => {
  try {
    const { id } = req.params;
    const { role } = req.body;

    // Validate role
    if (!Object.values(UserRole).includes(role as UserRole)) {
      return res.status(400).json({ status: 'fail', message: 'Invalid role' });
    }

    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({ status: 'fail', message: 'User not found' });
    }

    // Check if user already has the role
    if (user.roles.includes(role as UserRole)) {
      return res.status(400).json({ status: 'fail', message: 'User already has this role' });
    }

    user.roles.push(role as UserRole);
    await user.save({ validateBeforeSave: false });

    res.status(200).json({ status: 'success', data: user });
  } catch (error) {
    res.status(500).json({ status: 'error', message: 'Failed to assign role' });
  }
};

// Remove role from user (owner only)
export const removeRole = async (req: CustomRequest, res: Response) => {
  try {
    const { id, role } = req.params;

    // Validate role
    if (!Object.values(UserRole).includes(role as UserRole)) {
      return res.status(400).json({ status: 'fail', message: 'Invalid role' });
    }

    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({ status: 'fail', message: 'User not found' });
    }

    // Check if user has the role to remove
    if (!user.roles.includes(role as UserRole)) {
      return res.status(400).json({ status: 'fail', message: 'User does not have this role' });
    }

    // Don't allow removing the last role
    if (user.roles.length <= 1) {
      return res.status(400).json({ status: 'fail', message: 'Cannot remove the last role from a user' });
    }

    user.roles = user.roles.filter(r => r !== role);
    await user.save({ validateBeforeSave: false });

    res.status(200).json({ status: 'success', data: user });
  } catch (error) {
    res.status(500).json({ status: 'error', message: 'Failed to remove role' });
  }
};

// Get user statistics (admin/owner only)
export const getUserStats = async (req: CustomRequest, res: Response) => {
  try {
    if (!req.user?.roles?.includes('admin') && !req.user?.roles?.includes('owner')) {
      return res.status(403).json({ status: 'fail', message: 'You do not have permission to view user statistics' });
    }

    const stats = await User.aggregate([
      {
        $group: {
          _id: { $arrayElemAt: ['$roles', 0] }, // Primary role
          count: { $sum: 1 },
          active: {
            $sum: { $cond: ['$isActive', 1, 0] }
          }
        }
      }
    ]);

    res.status(200).json({ status: 'success', data: stats });
  } catch (error) {
    res.status(500).json({ status: 'error', message: 'Failed to get user statistics' });
  }
};
