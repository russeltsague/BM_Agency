import { Router } from 'express';
import * as testimonialController from '../controllers/testimonialController';
import { protect } from '../middleware/auth';
import { isAdmin } from '../middleware/roleCheck';
import { validate } from '../utils/validate';
import { z } from 'zod';

// Define testimonial validation schema
const testimonialValidation = {
  create: z.object({
    body: z.object({
      name: z.string().min(2, 'Name must be at least 2 characters'),
      content: z.string().min(10, 'Content must be at least 10 characters'),
      role: z.string().optional(),
      company: z.string().optional(),
      image: z.string().url('Please provide a valid URL for the image').optional(),
      rating: z.number().min(1).max(5).optional(),
    }),
  }),
};

const router = Router();

// Public routes
router.get('/', testimonialController.getAllTestimonials);
router.get('/:id', testimonialController.getTestimonialById);

// Protected routes (admin only)
router.use(protect, isAdmin);

router.post(
  '/',
  validate(testimonialValidation.create),
  testimonialController.createTestimonial
);

router.patch(
  '/:id',
  validate(testimonialValidation.create),
  testimonialController.updateTestimonial
);

router.delete('/:id', testimonialController.deleteTestimonial);

export default router;
