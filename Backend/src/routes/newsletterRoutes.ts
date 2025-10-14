import express from 'express';
import { body, validationResult } from 'express-validator';
import Newsletter from '../models/Newsletter';
import { catchAsync } from '../utils/catchAsync';
import { AppError } from '../utils/appError';
import crypto from 'crypto';

const router = express.Router();

// Validation rules
const newsletterValidation = [
  body('email')
    .isEmail()
    .normalizeEmail()
    .withMessage('Veuillez entrer un email valide')
];

// Subscribe to newsletter
router.post('/', newsletterValidation, catchAsync(async (req: express.Request, res: express.Response, next: express.NextFunction) => {
  // Check for validation errors
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return next(new AppError('Données de validation invalides', 400, errors.array()));
  }

  const { email } = req.body;

  // Check if email already exists
  const existingSubscriber = await Newsletter.findOne({ email });

  if (existingSubscriber) {
    if (existingSubscriber.isActive) {
      return next(new AppError('Cette adresse email est déjà inscrite à notre newsletter', 409));
    } else {
      // Reactivate subscription
      existingSubscriber.isActive = true;
      existingSubscriber.subscriptionDate = new Date();
      existingSubscriber.unsubscribeToken = crypto.randomBytes(32).toString('hex');
      await existingSubscriber.save();

      return res.status(200).json({
        status: 'success',
        message: 'Votre inscription à la newsletter a été réactivée avec succès !'
      });
    }
  }

  // Create new subscription
  const unsubscribeToken = crypto.randomBytes(32).toString('hex');
  const subscriber = await Newsletter.create({
    email,
    unsubscribeToken,
    preferences: {
      news: true,
      promotions: true,
      events: false
    }
  });

  res.status(201).json({
    status: 'success',
    data: {
      subscriber
    },
    message: 'Merci pour votre inscription à notre newsletter ! Vous recevrez bientôt nos dernières actualités.'
  });
}));

// Unsubscribe from newsletter
router.post('/unsubscribe', catchAsync(async (req: express.Request, res: express.Response, next: express.NextFunction) => {
  const { email, token } = req.body;

  if (!email && !token) {
    return next(new AppError('Email ou token de désinscription requis', 400));
  }

  let subscriber;

  if (token) {
    subscriber = await Newsletter.findOne({ unsubscribeToken: token });
  } else {
    subscriber = await Newsletter.findOne({ email });
  }

  if (!subscriber) {
    return next(new AppError('Abonné non trouvé', 404));
  }

  subscriber.isActive = false;
  await subscriber.save();

  res.status(200).json({
    status: 'success',
    message: 'Vous avez été désinscrit de notre newsletter avec succès.'
  });
}));

// Get all newsletter subscribers (admin only)
router.get('/', catchAsync(async (req: express.Request, res: express.Response, next: express.NextFunction) => {
  // In a real app, you'd check for admin authentication here
  const subscribers = await Newsletter.find({ isActive: true })
    .sort({ subscriptionDate: -1 });

  res.status(200).json({
    status: 'success',
    results: subscribers.length,
    data: {
      subscribers
    }
  });
}));

// Update subscriber preferences (admin only)
router.patch('/:id/preferences', catchAsync(async (req: express.Request, res: express.Response, next: express.NextFunction) => {
  const { preferences } = req.body;

  const subscriber = await Newsletter.findByIdAndUpdate(
    req.params.id,
    { preferences },
    {
      new: true,
      runValidators: true
    }
  );

  if (!subscriber) {
    return next(new AppError('Abonné non trouvé', 404));
  }

  res.status(200).json({
    status: 'success',
    data: {
      subscriber
    }
  });
}));

export default router;
