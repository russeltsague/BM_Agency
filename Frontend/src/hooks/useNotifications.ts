import { useEffect, useState } from 'react';
import { io, Socket } from 'socket.io-client';
import { useAuth } from '@/contexts/AuthContext';

interface NotificationData {
  type: string;
  message: string;
  data?: Record<string, any>;
}

interface Notification {
  id: string;
  message: string;
  createdAt: string;
  type: string;
}

export const useNotifications = (onNotification?: (notification: NotificationData) => void) => {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const { user } = useAuth();

  useEffect(() => {
    if (!user?.id) return;

    // Initialize socket connection
    const newSocket = io(process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:5000', {
      withCredentials: true,
      transports: ['websocket', 'polling']
    });

    // Connection handlers
    newSocket.on('connect', () => {
      console.log('Socket connected:', newSocket.id);
      setIsConnected(true);

      // Register user with socket
      newSocket.emit('registerUser', user.id);
    });

    newSocket.on('disconnect', () => {
      console.log('Socket disconnected');
      setIsConnected(false);
    });

    newSocket.on('connect_error', (error) => {
      console.error('Socket connection error:', error);
      setIsConnected(false);
    });

    // Notification handler
    newSocket.on('notification', (notification: NotificationData) => {
      console.log('Received notification:', notification);

      // Add to notifications list
      const newNotification: Notification = {
        id: Date.now().toString(),
        message: notification.message,
        createdAt: new Date().toISOString(),
        type: notification.type
      };

      setNotifications(prev => [newNotification, ...prev].slice(0, 50)); // Keep last 50
      setUnreadCount(prev => prev + 1);

      // Call the callback if provided
      if (onNotification) {
        onNotification(notification);
      }
    });

    setSocket(newSocket);

    // Cleanup on unmount
    return () => {
      newSocket.close();
    };
  }, [user?.id, onNotification]);

  return {
    socket,
    isConnected,
    notifications,
    unreadCount
  };
};
