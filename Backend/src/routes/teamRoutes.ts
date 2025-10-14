import { Router } from 'express';
import * as teamController from '../controllers/teamController';
import { protect } from '../middleware/auth';
import { isAdmin } from '../middleware/roleCheck';
import { validate } from '../utils/validate';
import { teamValidation } from '../utils/validate';

const router = Router();

// Public routes
router.get('/', teamController.getAllTeamMembers);
router.get('/:id', teamController.getTeamMemberById);

// Protected routes (admin only)
router.use(protect, isAdmin);

router.post(
  '/',
  validate(teamValidation.create),
  teamController.createTeamMember
);

router.patch(
  '/:id',
  validate(teamValidation.create),
  teamController.updateTeamMember
);

router.delete('/:id', teamController.deleteTeamMember);

export default router;
