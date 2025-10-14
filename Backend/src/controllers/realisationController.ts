import { Request, Response } from 'express';
import { Realisation } from '../models/Realisation';

// Get all realisations
export const getAllRealisations = async (req: Request, res: Response) => {
  try {
    const realisations = await Realisation.find();
    res.status(200).json({ status: 'success', results: realisations.length, data: realisations });
  } catch (error) {
    res.status(500).json({ status: 'error', message: 'Failed to get realisations' });
  }
};

// Get realisation by ID
export const getRealisationById = async (req: Request, res: Response) => {
  try {
    const realisation = await Realisation.findById(req.params.id);
    if (!realisation) {
      return res.status(404).json({ status: 'fail', message: 'Realisation not found' });
    }
    res.status(200).json({ status: 'success', data: realisation });
  } catch (error) {
    res.status(500).json({ status: 'error', message: 'Failed to get realisation' });
  }
};

// Create a new realisation
export const createRealisation = async (req: Request, res: Response) => {
  try {
    const newRealisation = await Realisation.create(req.body);
    res.status(201).json({ status: 'success', data: newRealisation });
  } catch (error) {
    res.status(500).json({ status: 'error', message: 'Failed to create realisation' });
  }
};

// Update a realisation
export const updateRealisation = async (req: Request, res: Response) => {
  try {
    const updatedRealisation = await Realisation.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!updatedRealisation) {
      return res.status(404).json({ status: 'fail', message: 'Realisation not found' });
    }
    res.status(200).json({ status: 'success', data: updatedRealisation });
  } catch (error) {
    res.status(500).json({ status: 'error', message: 'Failed to update realisation' });
  }
};

// Delete a realisation
export const deleteRealisation = async (req: Request, res: Response) => {
  try {
    const deletedRealisation = await Realisation.findByIdAndDelete(req.params.id);
    if (!deletedRealisation) {
      return res.status(404).json({ status: 'fail', message: 'Realisation not found' });
    }
    res.status(204).json({ status: 'success', data: null });
  } catch (error) {
    res.status(500).json({ status: 'error', message: 'Failed to delete realisation' });
  }
};
