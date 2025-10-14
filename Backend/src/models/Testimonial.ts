import { Schema, model, Document } from 'mongoose';

export interface ITestimonial extends Document {
  name: string;
  content: string;
  company?: string;
  role?: string;
  image?: string;
  rating?: number;
  createdAt: Date;
  updatedAt: Date;
}

const testimonialSchema = new Schema<ITestimonial>({
  name: {
    type: String,
    required: [true, 'Le nom du client est obligatoire'],
    trim: true,
    maxlength: [100, 'Le nom ne peut pas dépasser 100 caractères']
  },
  content: {
    type: String,
    required: [true, 'Le contenu du témoignage est obligatoire'],
    trim: true,
    maxlength: [2000, 'Le témoignage ne peut pas dépasser 2000 caractères']
  },
  company: {
    type: String,
    trim: true,
    maxlength: [100, 'Le nom de l\'entreprise ne peut pas dépasser 100 caractères']
  },
  role: {
    type: String,
    trim: true,
    maxlength: [100, 'Le poste ne peut pas dépasser 100 caractères']
  },
  image: {
    type: String,
    trim: true
  },
  rating: {
    type: Number,
    min: [1, 'La note doit être au minimum 1'],
    max: [5, 'La note ne peut pas dépasser 5']
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Index for better query performance
testimonialSchema.index({ createdAt: -1 });

export default model<ITestimonial>('Testimonial', testimonialSchema);
