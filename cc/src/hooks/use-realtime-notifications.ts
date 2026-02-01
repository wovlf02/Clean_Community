'use client';

import { useEffect, useCallback } from 'react';
import { useSocket } from '@/providers/socket-provider';

interface Notification {
  id: string;
  type: 'LIKE' | 'COMMENT' | 'FRIEND_REQUEST' | 'CHAT';
  title: string;
  content: string;
  link?: string;
  isRead: boolean;
  createdAt: string;
}

interface UseRealtimeNotificationsOptions {
  onNotification?: (notification: Notification) => void;
}

export function useRealtimeNotifications(
  options?: UseRealtimeNotificationsOptions
) {
  const { socket, isConnected } = useSocket();

  // 알림 수신
  useEffect(() => {
    if (!socket) return;

    const handleNotification = (notification: Notification) => {
      options?.onNotification?.(notification);
    };

    socket.on('notification:new', handleNotification);

    return () => {
      socket.off('notification:new', handleNotification);
    };
  }, [socket, options]);

  // 알림 읽음 처리
  const markAsRead = useCallback(
    (notificationId: string) => {
      if (!socket?.connected) return;

      socket.emit('notification:read', { notificationId });
    },
    [socket]
  );

  // 모든 알림 읽음 처리
  const markAllAsRead = useCallback(() => {
    if (!socket?.connected) return;

    socket.emit('notification:read-all');
  }, [socket]);

  return {
    markAsRead,
    markAllAsRead,
    isConnected,
  };
}
