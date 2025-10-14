import mongoose, { Document, Schema } from 'mongoose';

export interface IQuote extends Document {
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  company?: string;
  projectType: 'website' | 'ecommerce' | 'mobile_app' | 'digital_marketing' | 'branding' | 'consulting' | 'other';
  budget: 'under_500k' | '500k_1m' | '1m_5m' | '5m_10m' | 'over_10m' | 'discuss';
  timeline: 'urgent' | '1_month' | '3_months' | '6_months' | 'flexible';
  description: string;
  status: 'new' | 'quoted' | 'accepted' | 'rejected' | 'completed';
  priority: 'low' | 'medium' | 'high';
  assignedTo?: mongoose.Types.ObjectId;
  quoteAmount?: number;
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

const quoteSchema = new Schema<IQuote>({
  firstName: {
    type: String,
    required: [true, 'Le prénom est obligatoire'],
    trim: true,
    maxlength: [50, 'Le prénom ne peut pas dépasser 50 caractères']
  },
  lastName: {
    type: String,
    required: [true, 'Le nom est obligatoire'],
    trim: true,
    maxlength: [50, 'Le nom ne peut pas dépasser 50 caractères']
  },
  email: {
    type: String,
    required: [true, 'L\'email est obligatoire'],
    trim: true,
    lowercase: true,
    match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Veuillez entrer un email valide']
  },
  phone: {
    type: String,
    trim: true,
    match: [/^\+237[0-9]{9}$/, 'Veuillez entrer un numéro de téléphone camerounais valide']
  },
  company: {
    type: String,
    trim: true,
    maxlength: [100, 'Le nom de l\'entreprise ne peut pas dépasser 100 caractères']
  },
  projectType: {
    type: String,
    required: [true, 'Le type de projet est obligatoire'],
    enum: {
      values: ['website', 'ecommerce', 'mobile_app', 'digital_marketing', 'branding', 'consulting', 'other'],
      message: 'Type de projet non valide'
    }
  },
  budget: {
    type: String,
    required: [true, 'Le budget approximatif est obligatoire'],
    enum: {
      values: ['under_500k', '500k_1m', '1m_5m', '5m_10m', 'over_10m', 'discuss'],
      message: 'Budget sélectionné non valide'
    }
  },
  timeline: {
    type: String,
    required: [true, 'Le délai souhaité est obligatoire'],
    enum: {
      values: ['urgent', '1_month', '3_months', '6_months', 'flexible'],
      message: 'Délai sélectionné non valide'
    }
  },
  description: {
    type: String,
    required: [true, 'La description du projet est obligatoire'],
    trim: true,
    maxlength: [2000, 'La description ne peut pas dépasser 2000 caractères']
  },
  status: {
    type: String,
    enum: ['new', 'quoted', 'accepted', 'rejected', 'completed'],
    default: 'new'
  },
  priority: {
    type: String,
    enum: ['low', 'medium', 'high'],
    default: 'medium'
  },
  assignedTo: {
    type: Schema.Types.ObjectId,
    ref: 'User'
  },
  quoteAmount: {
    type: Number,
    min: [0, 'Le montant du devis ne peut pas être négatif']
  },
  notes: {
    type: String,
    trim: true,
    maxlength: [1000, 'Les notes ne peuvent pas dépasser 1000 caractères']
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Index for better query performance
quoteSchema.index({ status: 1, createdAt: -1 });
quoteSchema.index({ email: 1 });
quoteSchema.index({ projectType: 1 });
quoteSchema.index({ assignedTo: 1 });

export default mongoose.model<IQuote>('Quote', quoteSchema);
