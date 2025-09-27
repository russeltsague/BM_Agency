import { Request, Response } from 'express';
import { Testimonial } from '../models/Testimonial';

// Get all testimonials
export const getAllTestimonials = async (req: Request, res: Response) => {
  try {
    const testimonials = await Testimonial.find();
    res.status(200).json({ status: 'success', results: testimonials.length, data: testimonials });
  } catch (error) {
    res.status(500).json({ status: 'error', message: 'Failed to get testimonials' });
  }
};

// Get testimonial by ID
export const getTestimonialById = async (req: Request, res: Response) => {
  try {
    const testimonial = await Testimonial.findById(req.params.id);
    if (!testimonial) {
      return res.status(404).json({ status: 'fail', message: 'Testimonial not found' });
    }
    res.status(200).json({ status: 'success', data: testimonial });
  } catch (error) {
    res.status(500).json({ status: 'error', message: 'Failed to get testimonial' });
  }
};

// Create a new testimonial
export const createTestimonial = async (req: Request, res: Response) => {
  try {
    const newTestimonial = await Testimonial.create(req.body);
    res.status(201).json({ status: 'success', data: newTestimonial });
  } catch (error) {
    res.status(500).json({ status: 'error', message: 'Failed to create testimonial' });
  }
};

// Update a testimonial
export const updateTestimonial = async (req: Request, res: Response) => {
  try {
    const updatedTestimonial = await Testimonial.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!updatedTestimonial) {
      return res.status(404).json({ status: 'fail', message: 'Testimonial not found' });
    }
    res.status(200).json({ status: 'success', data: updatedTestimonial });
  } catch (error) {
    res.status(500).json({ status: 'error', message: 'Failed to update testimonial' });
  }
};

// Delete a testimonial
export const deleteTestimonial = async (req: Request, res: Response) => {
  try {
    const deletedTestimonial = await Testimonial.findByIdAndDelete(req.params.id);
    if (!deletedTestimonial) {
      return res.status(404).json({ status: 'fail', message: 'Testimonial not found' });
    }
    res.status(204).json({ status: 'success', data: null });
  } catch (error) {
    res.status(500).json({ status: 'error', message: 'Failed to delete testimonial' });
  }
};
