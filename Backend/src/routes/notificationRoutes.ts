import { Router } from 'express';
import * as notificationController from '../controllers/notificationController';
import { protect } from '../middleware/auth';

const router = Router();

// All notification routes require authentication
router.use(protect);

// Get all notifications for current user
router.get('/', notificationController.getNotifications);

// Get notification by ID
router.get('/:id', notificationController.getNotificationById);

// Mark notification as read
router.put('/:id/read', notificationController.markAsRead);

// Mark all notifications as read
router.put('/read-all', notificationController.markAllAsRead);

// Delete notification
router.delete('/:id', notificationController.deleteNotification);

// Get notification statistics
router.get('/stats/overview', notificationController.getNotificationStats);

export default router;
