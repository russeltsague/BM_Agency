import { Request, Response } from 'express';
import { Service } from '../models/Service';

// Get all services
export const getAllServices = async (req: Request, res: Response) => {
  try {
    const services = await Service.find();
    res.status(200).json({ status: 'success', results: services.length, data: services });
  } catch (error) {
    res.status(500).json({ status: 'error', message: 'Failed to get services' });
  }
};

// Get service by ID
export const getServiceById = async (req: Request, res: Response) => {
  try {
    const service = await Service.findById(req.params.id);
    if (!service) {
      return res.status(404).json({ status: 'fail', message: 'Service not found' });
    }
    res.status(200).json({ status: 'success', data: service });
  } catch (error) {
    res.status(500).json({ status: 'error', message: 'Failed to get service' });
  }
};

// Create a new service
export const createService = async (req: Request, res: Response) => {
  try {
    const newService = await Service.create(req.body);
    res.status(201).json({ status: 'success', data: newService });
  } catch (error) {
    res.status(500).json({ status: 'error', message: 'Failed to create service' });
  }
};

// Update a service
export const updateService = async (req: Request, res: Response) => {
  try {
    const updatedService = await Service.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!updatedService) {
      return res.status(404).json({ status: 'fail', message: 'Service not found' });
    }
    res.status(200).json({ status: 'success', data: updatedService });
  } catch (error) {
    res.status(500).json({ status: 'error', message: 'Failed to update service' });
  }
};

// Delete a service
export const deleteService = async (req: Request, res: Response) => {
  try {
    const deletedService = await Service.findByIdAndDelete(req.params.id);
    if (!deletedService) {
      return res.status(404).json({ status: 'fail', message: 'Service not found' });
    }
    res.status(204).json({ status: 'success', data: null });
  } catch (error) {
    res.status(500).json({ status: 'error', message: 'Failed to delete service' });
  }
};
