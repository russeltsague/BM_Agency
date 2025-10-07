import { Schema, model, Document } from 'mongoose';

export interface IRealisation extends Document {
  title: string;
  description: string;
  image: string;
  client: string;
  date: Date;
  category?: string;
  tags?: string[];
  link?: string;
  featured?: boolean;
}

const realisationSchema = new Schema<IRealisation>({
  title: {
    type: String,
    required: [true, 'Title is required'],
    trim: true,
    maxlength: [200, 'Title cannot be more than 200 characters']
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
  client: {
    type: String,
    required: [true, 'Client name is required'],
    trim: true
  },
  date: {
    type: Date,
    required: [true, 'Date is required'],
    default: Date.now
  },
  category: {
    type: String,
    trim: true
  },
  tags: {
    type: [String],
    default: []
  },
  link: {
    type: String,
    trim: true
  },
  featured: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true
});

export const Realisation = model<IRealisation>('Realisation', realisationSchema);
