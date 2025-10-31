import { AuditLog } from '../models/AuditLog';

/**
 * Log an action to the audit log
 * @param resourceType - The type of resource (e.g., 'Article', 'User')
 * @param resourceId - The ID of the resource (optional)
 * @param action - The action performed (e.g., 'submit', 'approve', 'publish')
 * @param userId - The ID of the user who performed the action
 * @param meta - Additional metadata about the action (optional)
 */
export const logAction = async (
  resourceType: string,
  resourceId: string | undefined,
  action: string,
  userId: string,
  meta: Record<string, any> = {}
) => {
  try {
    await AuditLog.create({
      resourceType,
      resourceId,
      action,
      by: userId,
      meta
    });
  } catch (error) {
    // Don't throw error to avoid disrupting the main flow
  }
};
