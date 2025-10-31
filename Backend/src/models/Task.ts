import { Schema, model, Document, Types } from 'mongoose';
import { IUser } from './User';

export const TaskStatus = {
  PENDING: 'pending',
  IN_REVIEW: 'in_review',
  APPROVED: 'approved',
  REJECTED: 'rejected',
  COMPLETED: 'completed'
} as const;

export type TaskStatus = typeof TaskStatus[keyof typeof TaskStatus];

export interface ITask extends Document {
  title: string;
  description: string;
  type: 'article' | 'media' | 'other';
  referenceId?: Types.ObjectId;
  status: TaskStatus;
  submittedBy: Types.ObjectId | IUser;
  assignedTo?: Types.ObjectId | IUser;
  submittedAt: Date;
  updatedAt: Date;
  completedAt?: Date;
  feedback?: string;
  history: Array<{
    status: TaskStatus;
    changedBy: Types.ObjectId;
    changedAt: Date;
    note?: string;
  }>;
}

const taskSchema = new Schema<ITask>({
  title: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    required: true
  },
  type: {
    type: String,
    enum: ['article', 'media', 'other'],
    required: true
  },
  referenceId: {
    type: Schema.Types.ObjectId
  },
  status: {
    type: String,
    enum: Object.values(TaskStatus),
    default: TaskStatus.PENDING
  },
  submittedBy: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  assignedTo: {
    type: Schema.Types.ObjectId,
    ref: 'User'
  },
  submittedAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  },
  completedAt: Date,
  feedback: String,
  history: [{
    status: { type: String, required: true },
    changedBy: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    changedAt: { type: Date, default: Date.now },
    note: String
  }]
}, {
  timestamps: true
});

// Update the updatedAt field before saving
taskSchema.pre('save', function(next) {
  this.updatedAt = new Date();
  next();
});

export default model<ITask>('Task', taskSchema);
