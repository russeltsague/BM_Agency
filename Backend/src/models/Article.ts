import { Schema, model, Document, Types } from 'mongoose';
import { IUser } from './User';

export interface IArticle extends Document {
  title: string;
  content: string;
  excerpt?: string;
  author: Types.ObjectId | IUser;
  category?: string;
  tags?: string[];
  image?: string;
  published: boolean;
  featured?: boolean;
  readTime?: string;
  createdAt: Date;
  updatedAt: Date;
}

const articleSchema = new Schema<IArticle>({
  title: {
    type: String,
    required: [true, 'Title is required'],
    trim: true,
    maxlength: [200, 'Title cannot be more than 200 characters']
  },
  content: {
    type: String,
    required: [true, 'Content is required'],
    trim: true
  },
  excerpt: {
    type: String,
    trim: true,
    maxlength: [500, 'Excerpt cannot be more than 500 characters']
  },
  author: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'Author is required']
  },
  category: {
    type: String,
    trim: true
  },
  tags: {
    type: [String],
    default: []
  },
  image: {
    type: String,
    trim: true
  },
  published: {
    type: Boolean,
    default: true
  },
  featured: {
    type: Boolean,
    default: false
  },
  readTime: {
    type: String,
    trim: true
  }
}, {
  timestamps: true
});

// Create text index for search functionality
articleSchema.index({ title: 'text', content: 'text' });

export const Article = model<IArticle>('Article', articleSchema);
