import { z } from 'zod';

// Common validation schemas
export const emailSchema = z.string().email('Please provide a valid email address');

export const passwordSchema = z
  .string()
  .min(8, 'Password must be at least 8 characters long')
  .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
  .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
  .regex(/[0-9]/, 'Password must contain at least one number')
  .regex(/[^A-Za-z0-9]/, 'Password must contain at least one special character');

// User validation
export const userValidation = {
  register: z.object({
    body: z.object({
      name: z.string().min(2, 'Name must be at least 2 characters'),
      email: emailSchema,
      password: passwordSchema,
      role: z.enum(['user', 'admin', 'editor']).default('user'),
    }),
  }),

  login: z.object({
    body: z.object({
      email: emailSchema,
      password: z.string().min(1, 'Password is required'),
    }),
  }),
};

// Article validation
export const articleValidation = {
  create: z.object({
    body: z.object({
      title: z.string().min(3, 'Title must be at least 3 characters'),
      content: z.string().min(50, 'Content must be at least 50 characters'),
      excerpt: z.string().max(200, 'Excerpt must be at most 200 characters'),
      category: z.string().min(2, 'Category is required'),
      tags: z.array(z.string()).optional(),
      featured: z.boolean().optional(),
      published: z.boolean().optional(),
    }),
  }),
};

// Service validation
export const serviceValidation = {
  create: z.object({
    body: z.object({
      title: z.string().min(3, 'Title must be at least 3 characters'),
      description: z.string().min(10, 'Description must be at least 10 characters'),
    }),
  }),
};

// Realisation validation
export const realisationValidation = {
  create: z.object({
    body: z.object({
      title: z.string().min(3, 'Title must be at least 3 characters'),
      description: z.string().min(10, 'Description must be at least 10 characters'),
      client: z.string().min(1, 'Client name is required'),
      image: z.string().url('Image URL must be a valid URL').optional(),
      video: z.string().url('Video URL must be a valid URL').optional(),
    }),
  }),
};

// Team validation
export const teamValidation = {
  create: z.object({
    body: z.object({
      name: z.string().min(2, 'Name must be at least 2 characters'),
      role: z.string().min(2, 'Role must be at least 2 characters'),
      description: z.string().min(10, 'Description must be at least 10 characters'),
      achievements: z.array(z.string()).optional(),
    }),
  }),
};

// Validation middleware
export const validate = (schema: z.ZodSchema) => {
  return (req: any, res: any, next: any) => {
    try {
      // Create a plain object to avoid Express 5 getter issues
      const validationData = {
        body: req.body || {},
        query: req.query ? { ...req.query } : {},
        params: req.params ? { ...req.params } : {},
      };

      schema.parse(validationData);
      next();
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({
          status: 'fail',
          errors: error.issues.map((issue) => ({
            path: issue.path.join('.'),
            message: issue.message,
          })),
        });
      }
      next(error);
    }
  };
};
