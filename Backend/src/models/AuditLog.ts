import { Schema, model, Document, Types } from 'mongoose';

export interface IAuditLog extends Document {
  resourceType: string;
  resourceId?: Types.ObjectId;
  action: string;
  by: Types.ObjectId;
  meta?: Record<string, any>;
  createdAt: Date;
  updatedAt: Date;
}

const auditLogSchema = new Schema<IAuditLog>({
  resourceType: {
    type: String,
    required: [true, 'Resource type is required']
  },
  resourceId: {
    type: Schema.Types.ObjectId,
    refPath: 'resourceType'
  },
  action: {
    type: String,
    required: [true, 'Action is required']
  },
  by: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'User who performed action is required']
  },
  meta: {
    type: Schema.Types.Mixed,
    default: {}
  }
}, {
  timestamps: true
});

// Indexes for efficient querying
auditLogSchema.index({ resourceType: 1, resourceId: 1 });
auditLogSchema.index({ by: 1 });
auditLogSchema.index({ action: 1 });
auditLogSchema.index({ createdAt: -1 });

export const AuditLog = model<IAuditLog>('AuditLog', auditLogSchema);
