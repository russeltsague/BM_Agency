import { Schema, model, Document } from 'mongoose';

export interface IService extends Document {
  title: string;
  description: string;
  image: string;
  features: string[];
  pricing?: string;
  duration?: string;
  caseStudy?: string;
  icon?: string;
}

const serviceSchema = new Schema<IService>({
  title: {
    type: String,
    required: [true, 'Title is required'],
    trim: true,
    maxlength: [100, 'Title cannot be more than 100 characters']
  },
  description: {
    type: String,
    required: [true, 'Description is required'],
    trim: true
  },
  image: {
    type: String,
    required: [true, 'Image URL is required'],
    trim: true
  },
  features: {
    type: [String],
    default: []
  },
  pricing: {
    type: String,
    trim: true
  },
  duration: {
    type: String,
    trim: true
  },
  caseStudy: {
    type: String,
    trim: true
  },
  icon: {
    type: String,
    trim: true
  }
}, {
  timestamps: true
});

export const Service = model<IService>('Service', serviceSchema);
