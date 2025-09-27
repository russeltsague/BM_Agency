import { Schema, model, Document } from 'mongoose';

export interface ITestimonial extends Document {
  clientName: string;
  content: string;
  company: string;
  image: string;
}

const testimonialSchema = new Schema<ITestimonial>({
  clientName: { 
    type: String, 
    required: [true, 'Client name is required'],
    trim: true,
    maxlength: [100, 'Client name cannot be more than 100 characters']
  },
  content: { 
    type: String, 
    required: [true, 'Testimonial content is required'],
    trim: true,
    maxlength: [1000, 'Testimonial cannot be more than 1000 characters']
  },
  company: { 
    type: String, 
    trim: true,
    maxlength: [100, 'Company name cannot be more than 100 characters']
  },
  image: { 
    type: String, 
    required: [true, 'Client image URL is required'],
    trim: true
  }
}, {
  timestamps: true
});

export const Testimonial = model<ITestimonial>('Testimonial', testimonialSchema);
