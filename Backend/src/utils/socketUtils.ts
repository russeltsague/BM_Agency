import { Server as SocketServer } from 'socket.io';

interface NotificationData {
  type: string;
  message: string;
  data?: Record<string, any>;
}

/**
 * Send real-time notification to a specific user via Socket.io
 * @param io - Socket.io server instance
 * @param onlineUsers - Map of user IDs to socket IDs
 * @param userId - ID of the user to notify
 * @param notification - Notification data to send
 */
export const sendLiveNotification = (
  io: SocketServer,
  onlineUsers: Map<string, string>,
  userId: string,
  notification: NotificationData
): void => {
  try {
    const socketId = onlineUsers.get(userId.toString());
    if (socketId) {
      io.to(socketId).emit('notification', notification);
    }
  } catch (error) {
  }
};

/**
 * Send real-time notification to multiple users
 * @param io - Socket.io server instance
 * @param onlineUsers - Map of user IDs to socket IDs
 * @param userIds - Array of user IDs to notify
 * @param notification - Notification data to send
 */
export const sendLiveNotificationToMultiple = (
  io: SocketServer,
  onlineUsers: Map<string, string>,
  userIds: string[],
  notification: NotificationData
): void => {
  try {
    userIds.forEach(userId => {
      sendLiveNotification(io, onlineUsers, userId, notification);
    });
  } catch (error) {
  }
};

/**
 * Broadcast notification to all connected users
 * @param io - Socket.io server instance
 * @param notification - Notification data to broadcast
 */
export const broadcastNotification = (
  io: SocketServer,
  notification: NotificationData
): void => {
  try {
    io.emit('notification', notification);
  } catch (error) {
  }
};
