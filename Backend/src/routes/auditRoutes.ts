import { Router } from 'express';
import * as auditController from '../controllers/auditController';
import { protect } from '../middleware/auth';
import { restrictTo } from '../middleware/auth';

const router = Router();

// All audit routes require authentication
router.use(protect);

// Get audit logs (owner only)
router.get('/', restrictTo('owner'), auditController.getAuditLogs);

// Get audit logs for specific resource
router.get('/resource/:resourceType/:resourceId', restrictTo('owner'), auditController.getResourceAuditLogs);

// Get audit statistics (owner only)
router.get('/stats/overview', restrictTo('owner'), auditController.getAuditStats);

// Get current user's audit logs (all authenticated users)
router.get('/my-logs', auditController.getMyAuditLogs);

export default router;
