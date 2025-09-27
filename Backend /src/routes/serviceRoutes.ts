import { Router } from 'express';
import * as serviceController from '../controllers/serviceController';
import { protect } from '../middleware/auth';
import { isAdmin } from '../middleware/roleCheck';
import { validate } from '../utils/validate';
import { serviceValidation } from '../utils/validate';

const router = Router();

// Public routes
router.get('/', serviceController.getAllServices);
router.get('/:id', serviceController.getServiceById);

// Protected routes (admin only)
router.use(protect, isAdmin);

router.post(
  '/',
  validate(serviceValidation.create),
  serviceController.createService
);

router.patch(
  '/:id',
  validate(serviceValidation.create),
  serviceController.updateService
);

router.delete('/:id', serviceController.deleteService);

export default router;
