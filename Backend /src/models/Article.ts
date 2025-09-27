import { Schema, model, Document, Types } from 'mongoose';
import { IUser } from './User';

export interface IArticle extends Document {
  title: string;
  content: string;
  author: Types.ObjectId | IUser;
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
  author: { 
    type: Schema.Types.ObjectId, 
    ref: 'User',
    required: [true, 'Author is required']
  }
}, {
  timestamps: true
});

// Create text index for search functionality
articleSchema.index({ title: 'text', content: 'text' });

export const Article = model<IArticle>('Article', articleSchema);
