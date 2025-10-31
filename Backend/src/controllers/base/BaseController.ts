import { Request, Response } from 'express';
import { Model, Document, Types } from 'mongoose';
import { IBaseController } from '../baseController';

// Base document interface
export interface IDocument extends Document<Types.ObjectId> {
  _id: Types.ObjectId;
  [key: string]: any;
}

// Generic controller that works with any Mongoose model
export class BaseController<T extends Document> implements IBaseController {
  constructor(protected model: Model<T>) {}

  getAll = async (req: Request, res: Response): Promise<void> => {
    try {
      const docs = await this.model.find();
      res.status(200).json({
        status: 'success',
        results: docs.length,
        data: { data: docs }
      });
    } catch (error) {
      this.handleError(res, error, 'Error fetching documents');
    }
  };

  getOne = async (req: Request, res: Response): Promise<void> => {
    try {
      const doc = await this.model.findById(req.params.id);
      
      if (!doc) {
        res.status(404).json({
          status: 'fail',
          message: 'No document found with that ID'
        });
        return;
      }
      
      res.status(200).json({
        status: 'success',
        data: { data: doc }
      });
    } catch (error) {
      this.handleError(res, error, 'Error fetching document');
    }
  };

  create = async (req: Request, res: Response): Promise<void> => {
    try {
      const doc = await this.model.create(req.body);
      
      res.status(201).json({
        status: 'success',
        data: { data: doc }
      });
    } catch (error) {
      this.handleError(res, error, 'Error creating document');
    }
  };

  update = async (req: Request, res: Response): Promise<void> => {
    try {
      const doc = await this.model.findByIdAndUpdate(
        req.params.id,
        req.body,
        {
          new: true,
          runValidators: true
        }
      );

      if (!doc) {
        res.status(404).json({
          status: 'fail',
          message: 'No document found with that ID'
        });
        return;
      }

      res.status(200).json({
        status: 'success',
        data: { data: doc }
      });
    } catch (error) {
      this.handleError(res, error, 'Error updating document');
    }
  };

  remove = async (req: Request, res: Response): Promise<void> => {
    try {
      const doc = await this.model.findByIdAndDelete(req.params.id);

      if (!doc) {
        res.status(404).json({
          status: 'fail',
          message: 'No document found with that ID'
        });
        return;
      }

      res.status(204).json({
        status: 'success',
        data: null
      });
    } catch (error) {
      this.handleError(res, error, 'Error deleting document');
    }
  };

  protected handleError(res: Response, error: any, defaultMessage: string): void {
    
    // Handle validation errors
    if (error.name === 'ValidationError') {
      const errors = Object.values(error.errors).map((err: any) => err.message);
      res.status(400).json({
        status: 'fail',
        message: 'Validation error',
        errors
      });
      return;
    }

    // Handle duplicate field errors
    if (error.code === 11000) {
      const field = Object.keys(error.keyValue)[0];
      res.status(400).json({
        status: 'fail',
        message: `Duplicate field value: ${field}. Please use another value!`
      });
      return;
    }

    // Handle cast errors (invalid ID format)
    if (error.name === 'CastError') {
      res.status(400).json({
        status: 'fail',
        message: 'Invalid ID format'
      });
      return;
    }

    // Default error response
    res.status(500).json({
      status: 'error',
      message: process.env.NODE_ENV === 'development' 
        ? error.message 
        : defaultMessage
    });
  }
}
