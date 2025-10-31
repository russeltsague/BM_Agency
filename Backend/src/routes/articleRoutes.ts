import { Router } from 'express';
import * as articleController from '../controllers/articleController';
import { protect } from '../middleware/auth';
import { restrictTo } from '../middleware/auth';
import { validate } from '../utils/validate';
import { articleValidation } from '../utils/validate';

const router = Router();

// Public routes
router.get('/', articleController.getAllArticles);
router.get('/author/:author', articleController.getArticlesByAuthor);
router.get('/:id', articleController.getArticleById);

// Protected routes for content writers and above
router.use(protect);

router.post(
  '/',
  validate(articleValidation.create),
  restrictTo('author', 'editor', 'admin', 'owner'),
  articleController.createArticle
);

// Routes for article authors (submit for approval)
router.patch('/:id/submit', restrictTo('editor', 'author'), articleController.submitForApproval);

// Admin/Owner routes for approval workflow
router.use(restrictTo('admin', 'owner'));

router.get('/admin/pending', articleController.getPendingArticles);
router.patch('/:id/approve', articleController.approveArticle);
router.patch('/:id/reject', articleController.rejectArticle);
router.patch('/:id/publish', articleController.publishArticle);

// Editor and above routes
router.patch(
  '/:id',
  validate(articleValidation.create),
  restrictTo('editor', 'admin', 'owner'),
  articleController.updateArticle
);

router.delete('/:id', restrictTo('admin', 'owner'), articleController.deleteArticle);

export default router;
