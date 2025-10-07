import { Model, Document, Types } from 'mongoose';
import { BaseController } from '../base/BaseController';
import { RequestHandler } from 'express';

type ControllerActions = 'getAll' | 'getOne' | 'create' | 'update' | 'delete';

// Generic controller factory that works with any Mongoose model
export class ControllerFactory<T extends Document> {
  private controller: BaseController<T>;
  private excludedMethods: ControllerActions[] = [];

  constructor(model: Model<T>) {
    this.controller = new BaseController<T>(model);
  }

  excludeMethods(...methods: ControllerActions[]): this {
    this.excludedMethods = methods;
    return this;
  }

  getHandlers(): Record<string, RequestHandler> {
    const handlers: Record<string, RequestHandler> = {};
    
    if (!this.excludedMethods.includes('getAll')) {
      handlers.getAll = this.controller.getAll.bind(this.controller);
    }
    
    if (!this.excludedMethods.includes('getOne')) {
      handlers.getOne = this.controller.getOne.bind(this.controller);
    }
    
    if (!this.excludedMethods.includes('create')) {
      handlers.create = this.controller.create.bind(this.controller);
    }
    
    if (!this.excludedMethods.includes('update')) {
      handlers.update = this.controller.update.bind(this.controller);
    }
    
    if (!this.excludedMethods.includes('delete')) {
      handlers.remove = this.controller.remove.bind(this.controller);
    }
    
    return handlers;
  }
}

export function createController<T extends Document>(
  model: Model<T>,
  excludedMethods: ControllerActions[] = []
): Record<string, RequestHandler> {
  return new ControllerFactory<T>(model)
    .excludeMethods(...excludedMethods)
    .getHandlers();
}
