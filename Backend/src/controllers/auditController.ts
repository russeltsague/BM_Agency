import { AuditLog } from '../models/AuditLog';

// Get all audit logs (owner only)
export const getAuditLogs = async (req: any, res: any) => {
  try {
    const { page = 1, limit = 50, resourceType, action, user, startDate, endDate } = req.query;

    // Build filter
    const filter: any = {};

    if (resourceType) filter.resourceType = resourceType;
    if (action) filter.action = action;
    if (user) filter.by = user;

    // Date range filter
    if (startDate || endDate) {
      filter.createdAt = {};
      if (startDate) filter.createdAt.$gte = new Date(startDate);
      if (endDate) filter.createdAt.$lte = new Date(endDate);
    }

    // Pagination
    const skip = (Number(page) - 1) * Number(limit);

    const logs = await AuditLog.find(filter)
      .populate('by', 'name email')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(Number(limit));

    const total = await AuditLog.countDocuments(filter);

    res.status(200).json({
      status: 'success',
      results: logs.length,
      pagination: {
        current: Number(page),
        pages: Math.ceil(total / Number(limit)),
        total
      },
      data: logs
    });
  } catch (err) {
    res.status(500).json({
      status: 'error',
      message: 'Error fetching audit logs'
    });
  }
};

// Get audit logs for a specific resource
export const getResourceAuditLogs = async (req: any, res: any) => {
  try {
    const { resourceType, resourceId } = req.params;

    const logs = await AuditLog.find({
      resourceType,
      resourceId
    })
      .populate('by', 'name email')
      .sort({ createdAt: -1 });

    res.status(200).json({
      status: 'success',
      results: logs.length,
      data: logs
    });
  } catch (err) {
    res.status(500).json({
      status: 'error',
      message: 'Error fetching resource audit logs'
    });
  }
};

// Get audit log statistics
export const getAuditStats = async (req: any, res: any) => {
  try {
    const { days = 30 } = req.query;

    // Get total count
    const total = await AuditLog.countDocuments();

    // Get recent count (last N days)
    const recentDate = new Date();
    recentDate.setDate(recentDate.getDate() - Number(days));

    const recent = await AuditLog.countDocuments({
      createdAt: { $gte: recentDate }
    });

    // Get action distribution
    const actionStats = await AuditLog.aggregate([
      {
        $group: {
          _id: '$action',
          count: { $sum: 1 }
        }
      },
      { $sort: { count: -1 } }
    ]);

    // Get resource type distribution
    const resourceStats = await AuditLog.aggregate([
      {
        $group: {
          _id: '$resourceType',
          count: { $sum: 1 }
        }
      },
      { $sort: { count: -1 } }
    ]);

    // Get daily activity (last 30 days)
    const dailyStats = await AuditLog.aggregate([
      {
        $match: {
          createdAt: { $gte: recentDate }
        }
      },
      {
        $group: {
          _id: {
            $dateToString: {
              format: '%Y-%m-%d',
              date: '$createdAt'
            }
          },
          count: { $sum: 1 }
        }
      },
      { $sort: { _id: 1 } }
    ]);

    res.status(200).json({
      status: 'success',
      data: {
        total,
        recent,
        period: `${days} days`,
        byAction: actionStats,
        byResource: resourceStats,
        dailyActivity: dailyStats
      }
    });
  } catch (err) {
    res.status(500).json({
      status: 'error',
      message: 'Error fetching audit statistics'
    });
  }
};

// Get audit logs for current user
export const getMyAuditLogs = async (req: any, res: any) => {
  try {
    const { page = 1, limit = 20 } = req.query;

    // Pagination
    const skip = (Number(page) - 1) * Number(limit);

    const logs = await AuditLog.find({ by: req.user.id })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(Number(limit));

    const total = await AuditLog.countDocuments({ by: req.user.id });

    res.status(200).json({
      status: 'success',
      results: logs.length,
      pagination: {
        current: Number(page),
        pages: Math.ceil(total / Number(limit)),
        total
      },
      data: logs
    });
  } catch (err) {
    res.status(500).json({
      status: 'error',
      message: 'Error fetching your audit logs'
    });
  }
};
