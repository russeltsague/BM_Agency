import { Router } from 'express';
import * as userController from '../controllers/userController';
import { protect } from '../middleware/auth';
import { restrictTo } from '../middleware/auth';

const router = Router();

// All user management routes require authentication
router.use(protect);

// Admin and owner routes
router.use(restrictTo('admin', 'owner'));

router.get('/', userController.getAllUsers);
router.get('/stats', userController.getUserStats);
router.get('/roles/permissions', userController.getRolesAndPermissions);
router.get('/:id', userController.getUserById);

router.post('/', userController.createUser);

// Role management (owner only)
router.post('/:id/roles', restrictTo('owner'), userController.assignRole);
router.delete('/:id/roles/:role', restrictTo('owner'), userController.removeRole);

router.patch('/:id/role', userController.updateUserRole);
router.patch('/:id/deactivate', userController.deactivateUser);
router.patch('/:id/reactivate', userController.reactivateUser);

// Profile updates (own profile or admin/owner)
router.patch('/:id/profile', userController.updateUserProfile);

router.delete('/:id', restrictTo('owner'), userController.deleteUser);

export default router;
