import { Router } from 'express';
import * as realisationController from '../controllers/realisationController';
import { protect } from '../middleware/auth';
import { isAdmin } from '../middleware/roleCheck';
import { validate } from '../utils/validate';
import { realisationValidation } from '../utils/validate';

const router = Router();

// Public routes
router.get('/', realisationController.getAllRealisations);
router.get('/:id', realisationController.getRealisationById);

// Protected routes (admin only)
router.use(protect, isAdmin);

router.post(
  '/',
  validate(realisationValidation.create),
  realisationController.createRealisation
);

router.patch(
  '/:id',
  validate(realisationValidation.create),
  realisationController.updateRealisation
);

router.delete('/:id', realisationController.deleteRealisation);

export default router;
