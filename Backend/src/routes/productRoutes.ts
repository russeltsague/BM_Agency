import { Router } from 'express';
import * as productController from '../controllers/productController';
import { protect } from '../middleware/auth';
import { isAdmin } from '../middleware/roleCheck';
import { validate } from '../utils/validate';
import { z } from 'zod';

// Define product validation schema
const productValidation = {
  create: z.object({
    body: z.object({
      name: z.string().min(2, 'Name must be at least 2 characters'),
      description: z.string().min(10, 'Description must be at least 10 characters'),
      price: z.number().positive('Price must be a positive number'),
      image: z.string().url('Please provide a valid URL for the image'),
      category: z.string().min(2, 'Category is required'),
      stock: z.number().int().nonnegative('Stock must be a non-negative integer'),
      featured: z.boolean().optional(),
    }),
  }),
};

const router = Router();

// Public routes
router.get('/', productController.getAllProducts);
router.get('/:id', productController.getProductById);

// Protected routes (admin only)
router.use(protect, isAdmin);

router.post(
  '/',
  validate(productValidation.create),
  productController.createProduct
);

router.patch(
  '/:id',
  validate(productValidation.create),
  productController.updateProduct
);

router.delete('/:id', productController.deleteProduct);

export default router;
