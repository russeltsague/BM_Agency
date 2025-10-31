import { Notification } from '../models/Notification';

// Get all notifications for the authenticated user
export const getNotifications = async (req: any, res: any) => {
  try {
    const { page = 1, limit = 20, unreadOnly = false } = req.query;

    // Build filter
    const filter: any = { user: req.user.id };

    if (unreadOnly === 'true') {
      filter.read = false;
    }

    // Pagination
    const skip = (Number(page) - 1) * Number(limit);

    const notifications = await Notification.find(filter)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(Number(limit));

    const total = await Notification.countDocuments(filter);
    const unreadCount = await Notification.countDocuments({ user: req.user.id, read: false });

    res.status(200).json({
      status: 'success',
      results: notifications.length,
      pagination: {
        current: Number(page),
        pages: Math.ceil(total / Number(limit)),
        total
      },
      unreadCount,
      data: notifications
    });
  } catch (err) {
    res.status(500).json({
      status: 'error',
      message: 'Error fetching notifications'
    });
  }
};

// Get notification by ID
export const getNotificationById = async (req: any, res: any) => {
  try {
    const notification = await Notification.findOne({
      _id: req.params.id,
      user: req.user.id
    });

    if (!notification) {
      return res.status(404).json({
        status: 'error',
        message: 'Notification not found'
      });
    }

    res.status(200).json({
      status: 'success',
      data: notification
    });
  } catch (err) {
    res.status(500).json({
      status: 'error',
      message: 'Error fetching notification'
    });
  }
};

// Mark notification as read
export const markAsRead = async (req: any, res: any) => {
  try {
    const notification = await Notification.findOneAndUpdate(
      { _id: req.params.id, user: req.user.id },
      { read: true },
      { new: true }
    );

    if (!notification) {
      return res.status(404).json({
        status: 'error',
        message: 'Notification not found'
      });
    }

    res.status(200).json({
      status: 'success',
      message: 'Notification marked as read',
      data: notification
    });
  } catch (err) {
    res.status(500).json({
      status: 'error',
      message: 'Error marking notification as read'
    });
  }
};

// Mark all notifications as read
export const markAllAsRead = async (req: any, res: any) => {
  try {
    const result = await Notification.updateMany(
      { user: req.user.id, read: false },
      { read: true }
    );

    res.status(200).json({
      status: 'success',
      message: `${result.modifiedCount} notifications marked as read`
    });
  } catch (err) {
    res.status(500).json({
      status: 'error',
      message: 'Error marking notifications as read'
    });
  }
};

// Delete notification
export const deleteNotification = async (req: any, res: any) => {
  try {
    const notification = await Notification.findOneAndDelete({
      _id: req.params.id,
      user: req.user.id
    });

    if (!notification) {
      return res.status(404).json({
        status: 'error',
        message: 'Notification not found'
      });
    }

    res.status(204).json({
      status: 'success',
      data: null
    });
  } catch (err) {
    res.status(500).json({
      status: 'error',
      message: 'Error deleting notification'
    });
  }
};

// Get notification statistics
export const getNotificationStats = async (req: any, res: any) => {
  try {
    const total = await Notification.countDocuments({ user: req.user.id });
    const unread = await Notification.countDocuments({ user: req.user.id, read: false });
    const read = total - unread;

    // Get counts by type
    const typeStats = await Notification.aggregate([
      { $match: { user: req.user.id } },
      {
        $group: {
          _id: '$type',
          count: { $sum: 1 },
          unread: {
            $sum: { $cond: ['$read', 0, 1] }
          }
        }
      }
    ]);

    res.status(200).json({
      status: 'success',
      data: {
        total,
        read,
        unread,
        byType: typeStats
      }
    });
  } catch (err) {
    res.status(500).json({
      status: 'error',
      message: 'Error fetching notification statistics'
    });
  }
};
