import { Router } from 'express';
import * as articleController from '../controllers/articleController';
import { protect } from '../middleware/auth';
import { isAdminOrEditor } from '../middleware/roleCheck';
import { validate } from '../utils/validate';
import { articleValidation } from '../utils/validate';

const router = Router();

// Public routes
router.get('/', articleController.getAllArticles);
router.get('/:id', articleController.getArticleById);

// Protected routes (admin and editor)
router.use(protect, isAdminOrEditor);

router.post(
  '/',
  validate(articleValidation.create),
  articleController.createArticle
);

router.patch(
  '/:id',
  validate(articleValidation.create),
  articleController.updateArticle
);

router.delete('/:id', articleController.deleteArticle);

export default router;
