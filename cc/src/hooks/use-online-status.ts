'use client';

import { useEffect, useState, useCallback } from 'react';
import { useSocket } from '@/providers/socket-provider';

interface OnlineUser {
  id: string;
  isOnline: boolean;
  lastSeenAt?: string;
}

export function useOnlineStatus() {
  const { socket, isConnected } = useSocket();
  const [onlineUsers, setOnlineUsers] = useState<Map<string, boolean>>(
    new Map()
  );

  // 온라인 상태 수신
  useEffect(() => {
    if (!socket) return;

    const handleOnlineStatus = ({
      userId,
      isOnline,
    }: {
      userId: string;
      isOnline: boolean;
    }) => {
      setOnlineUsers((prev) => {
        const newMap = new Map(prev);
        newMap.set(userId, isOnline);
        return newMap;
      });
    };

    // 초기 온라인 사용자 목록 수신
    const handleOnlineList = ({ users }: { users: OnlineUser[] }) => {
      const newMap = new Map<string, boolean>();
      users.forEach((user) => {
        newMap.set(user.id, user.isOnline);
      });
      setOnlineUsers(newMap);
    };

    socket.on('user:online', handleOnlineStatus);
    socket.on('user:offline', handleOnlineStatus);
    socket.on('users:online-list', handleOnlineList);

    // 온라인 사용자 목록 요청
    if (isConnected) {
      socket.emit('users:get-online');
    }

    return () => {
      socket.off('user:online', handleOnlineStatus);
      socket.off('user:offline', handleOnlineStatus);
      socket.off('users:online-list', handleOnlineList);
    };
  }, [socket, isConnected]);

  // 특정 사용자의 온라인 상태 확인
  const isUserOnline = useCallback(
    (userId: string): boolean => {
      return onlineUsers.get(userId) ?? false;
    },
    [onlineUsers]
  );

  return {
    onlineUsers,
    isUserOnline,
    isConnected,
  };
}
