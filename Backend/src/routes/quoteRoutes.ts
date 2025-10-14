import express from 'express';
import { body, validationResult } from 'express-validator';
import Quote from '../models/Quote';
import { catchAsync } from '../utils/catchAsync';
import { AppError } from '../utils/appError';
import { APIFeatures } from '../utils/apiFeatures';

const router = express.Router();

// Validation rules
const quoteValidation = [
  body('firstName')
    .trim()
    .isLength({ min: 1, max: 50 })
    .withMessage('Le prénom doit contenir entre 1 et 50 caractères'),
  body('lastName')
    .trim()
    .isLength({ min: 1, max: 50 })
    .withMessage('Le nom doit contenir entre 1 et 50 caractères'),
  body('email')
    .isEmail()
    .normalizeEmail()
    .withMessage('Veuillez entrer un email valide'),
  body('phone')
    .optional()
    .matches(/^\+237[0-9]{9}$/)
    .withMessage('Veuillez entrer un numéro de téléphone camerounais valide'),
  body('company')
    .optional()
    .trim()
    .isLength({ max: 100 })
    .withMessage('Le nom de l\'entreprise ne peut pas dépasser 100 caractères'),
  body('projectType')
    .isIn(['website', 'ecommerce', 'mobile_app', 'digital_marketing', 'branding', 'consulting', 'other'])
    .withMessage('Type de projet non valide'),
  body('budget')
    .isIn(['under_500k', '500k_1m', '1m_5m', '5m_10m', 'over_10m', 'discuss'])
    .withMessage('Budget sélectionné non valide'),
  body('timeline')
    .isIn(['urgent', '1_month', '3_months', '6_months', 'flexible'])
    .withMessage('Délai sélectionné non valide'),
  body('description')
    .trim()
    .isLength({ min: 1, max: 2000 })
    .withMessage('La description doit contenir entre 1 et 2000 caractères')
];

// Create quote request
router.post('/', quoteValidation, catchAsync(async (req: express.Request, res: express.Response, next: express.NextFunction) => {
  // Check for validation errors
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return next(new AppError('Données de validation invalides', 400, errors.array()));
  }

  const quote = await Quote.create(req.body);

  res.status(201).json({
    status: 'success',
    data: {
      quote
    },
    message: 'Votre demande de devis a été envoyée avec succès. Nous vous contacterons sous 24h avec une proposition personnalisée.'
  });
}));

// Get all quotes (admin only)
router.get('/', catchAsync(async (req: express.Request, res: express.Response, next: express.NextFunction) => {
  // In a real app, you'd check for admin authentication here
  const features = new APIFeatures(Quote.find(), req.query)
    .filter()
    .sort()
    .limitFields()
    .paginate();

  const quotes = await features.query.populate('assignedTo', 'name email');

  res.status(200).json({
    status: 'success',
    results: quotes.length,
    data: {
      quotes
    }
  });
}));

// Get quote by ID (admin only)
router.get('/:id', catchAsync(async (req: express.Request, res: express.Response, next: express.NextFunction) => {
  const quote = await Quote.findById(req.params.id).populate('assignedTo', 'name email');

  if (!quote) {
    return next(new AppError('Demande de devis non trouvée', 404));
  }

  res.status(200).json({
    status: 'success',
    data: {
      quote
    }
  });
}));

// Update quote (admin only)
router.patch('/:id', catchAsync(async (req: express.Request, res: express.Response, next: express.NextFunction) => {
  const allowedFields = ['status', 'assignedTo', 'quoteAmount', 'notes'];
  const updates: any = {};

  Object.keys(req.body).forEach(key => {
    if (allowedFields.includes(key)) {
      updates[key] = req.body[key];
    }
  });

  const quote = await Quote.findByIdAndUpdate(
    req.params.id,
    updates,
    {
      new: true,
      runValidators: true
    }
  ).populate('assignedTo', 'name email');

  if (!quote) {
    return next(new AppError('Demande de devis non trouvée', 404));
  }

  res.status(200).json({
    status: 'success',
    data: {
      quote
    }
  });
}));

// Delete quote (admin only)
router.delete('/:id', catchAsync(async (req: express.Request, res: express.Response, next: express.NextFunction) => {
  const quote = await Quote.findByIdAndDelete(req.params.id);

  if (!quote) {
    return next(new AppError('Demande de devis non trouvée', 404));
  }

  res.status(204).json({
    status: 'success',
    data: null
  });
}));

export default router;
