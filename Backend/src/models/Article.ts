import { Schema, model, Document, Types } from 'mongoose';
import { IUser } from './User';

export const ArticleStatus = {
  DRAFT: 'draft',
  SUBMITTED_FOR_REVIEW: 'submitted_for_review',
  APPROVED: 'approved',
  PUBLISHED: 'published'
} as const;

export type ArticleStatus = typeof ArticleStatus[keyof typeof ArticleStatus];

export interface IArticle extends Document {
  title: string;
  slug: string;
  content: string;
  excerpt?: string;
  author: Types.ObjectId | IUser;
  category?: string;
  tags?: string[];
  image?: string;
  status: ArticleStatus;
  published: boolean;
  featured?: boolean;
  readTime?: string;
  submittedAt?: Date;
  approvedAt?: Date;
  publishedAt?: Date;
  history?: Array<{
    action: string;
    by: Types.ObjectId;
    at: Date;
    note?: string;
  }>;
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
  slug: {
    type: String,
    trim: true,
    lowercase: true
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
  status: {
    type: String,
    enum: Object.values(ArticleStatus),
    default: ArticleStatus.DRAFT
  },
  published: {
    type: Boolean,
    default: false
  },
  featured: {
    type: Boolean,
    default: false
  },
  readTime: {
    type: String,
    trim: true
  },
  submittedAt: Date,
  approvedAt: Date,
  publishedAt: Date,
  history: [{
    action: { type: String, required: true },
    by: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    at: { type: Date, default: Date.now },
    note: String
  }]
}, {
  timestamps: true
});

// Generate slug from title before saving
articleSchema.pre('save', function(next) {
  if (this.isModified('title') && !this.slug) {
    this.slug = this.title
      .toLowerCase()
      .replace(/[^a-zA-Z0-9 ]/g, '') // Remove special characters
      .replace(/\s+/g, '-') // Replace spaces with hyphens
      .replace(/-+/g, '-') // Replace multiple hyphens with single hyphen
      .replace(/^-|-$/g, ''); // Remove leading/trailing hyphens
  }
  next();
});

export const Article = model<IArticle>('Article', articleSchema);
