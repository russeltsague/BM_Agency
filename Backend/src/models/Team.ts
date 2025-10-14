import { Schema, model, Document } from 'mongoose';

export interface ITeam extends Document {
  name: string;
  role: string;
  description: string;
  image?: string;
  achievements: string[];
}

const teamSchema = new Schema<ITeam>({
  name: {
    type: String,
    required: [true, 'Name is required'],
    trim: true,
    maxlength: [100, 'Name cannot be more than 100 characters']
  },
  role: {
    type: String,
    required: [true, 'Role is required'],
    trim: true,
    maxlength: [100, 'Role cannot be more than 100 characters']
  },
  description: {
    type: String,
    required: [true, 'Description is required'],
    trim: true
  },
  image: {
    type: String,
    required: false,
    trim: true
  },
  achievements: {
    type: [String],
    default: []
  }
}, {
  timestamps: true
});

export const Team = model<ITeam>('Team', teamSchema);
