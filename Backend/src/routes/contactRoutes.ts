import express from 'express';
import { body, validationResult } from 'express-validator';
import Contact from '../models/Contact';
import { catchAsync } from '../utils/catchAsync';
import { AppError } from '../utils/appError';
import { APIFeatures } from '../utils/apiFeatures';

const router = express.Router();

// Validation rules
const contactValidation = [
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
  body('service')
    .optional()
    .isIn(['digital', 'marketing', 'design', 'strategy', 'objects', 'training', 'other'])
    .withMessage('Service sélectionné non valide'),
  body('message')
    .trim()
    .isLength({ min: 1, max: 2000 })
    .withMessage('Le message doit contenir entre 1 et 2000 caractères')
];

// Create contact
router.post('/', contactValidation, catchAsync(async (req: express.Request, res: express.Response, next: express.NextFunction) => {
  // Check for validation errors
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return next(new AppError('Données de validation invalides', 400, errors.array()));
  }

  const contact = await Contact.create({
    ...req.body,
    source: 'website'
  });

  res.status(201).json({
    status: 'success',
    data: {
      contact
    },
    message: 'Votre message a été envoyé avec succès. Nous vous répondrons sous 24h.'
  });
}));

// Get all contacts (admin only)
router.get('/', catchAsync(async (req: express.Request, res: express.Response, next: express.NextFunction) => {
  // In a real app, you'd check for admin authentication here
  const features = new APIFeatures(Contact.find(), req.query)
    .filter()
    .sort()
    .limitFields()
    .paginate();

  const contacts = await features.query.populate('assignedTo', 'name email');

  res.status(200).json({
    status: 'success',
    results: contacts.length,
    data: {
      contacts
    }
  });
}));

// Get contact by ID (admin only)
router.get('/:id', catchAsync(async (req: express.Request, res: express.Response, next: express.NextFunction) => {
  const contact = await Contact.findById(req.params.id).populate('assignedTo', 'name email');

  if (!contact) {
    return next(new AppError('Contact non trouvé', 404));
  }

  res.status(200).json({
    status: 'success',
    data: {
      contact
    }
  });
}));

// Update contact status (admin only)
router.patch('/:id/status', catchAsync(async (req: express.Request, res: express.Response, next: express.NextFunction) => {
  const { status, assignedTo, notes } = req.body;

  const contact = await Contact.findByIdAndUpdate(
    req.params.id,
    {
      status,
      ...(assignedTo && { assignedTo }),
      ...(notes && { notes })
    },
    {
      new: true,
      runValidators: true
    }
  ).populate('assignedTo', 'name email');

  if (!contact) {
    return next(new AppError('Contact non trouvé', 404));
  }

  res.status(200).json({
    status: 'success',
    data: {
      contact
    }
  });
}));

// Delete contact (admin only)
router.delete('/:id', catchAsync(async (req: express.Request, res: express.Response, next: express.NextFunction) => {
  const contact = await Contact.findByIdAndDelete(req.params.id);

  if (!contact) {
    return next(new AppError('Contact non trouvé', 404));
  }

  res.status(204).json({
    status: 'success',
    data: null
  });
}));

export default router;
