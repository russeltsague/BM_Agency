import { Router } from 'express';
import * as taskController from '../controllers/taskController';
import { protect, restrictTo } from '../middleware/auth';

const router = Router();

// All routes below are protected
router.use(protect);

// Editor routes
router.post('/', taskController.createTask);
router.get('/my-tasks', taskController.getMyTasks);

// Admin routes
router.use(restrictTo('admin', 'super-admin'));
router.post('/admin-create', taskController.createAdminTask);
router.get('/', taskController.getAllTasks);
router.patch('/:id/status', taskController.updateTaskStatus);

export default router;
