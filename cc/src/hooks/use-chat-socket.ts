'use client';

import { useEffect, useCallback, useState } from 'react';
import { useSocket } from '@/providers/socket-provider';

interface Message {
  id: string;
  content: string;
  type: 'TEXT' | 'IMAGE' | 'EMOJI';
  senderId: string;
  sender: {
    id: string;
    nickname: string;
    image?: string;
  };
  createdAt: string;
}

interface TypingUser {
  userId: string;
  nickname: string;
}

interface UseChatSocketOptions {
  roomId: string;
  onMessage?: (message: Message) => void;
  onTyping?: (users: TypingUser[]) => void;
  onRead?: (messageIds: string[]) => void;
}

export function useChatSocket({
  roomId,
  onMessage,
  onTyping,
  onRead,
}: UseChatSocketOptions) {
  const { socket, isConnected } = useSocket();
  const [typingUsers, setTypingUsers] = useState<TypingUser[]>([]);

  // 채팅방 입장/퇴장
  useEffect(() => {
    if (!socket || !isConnected) return;

    socket.emit('chat:join', { roomId });

    return () => {
      socket.emit('chat:leave', { roomId });
    };
  }, [socket, isConnected, roomId]);

  // 메시지 수신
  useEffect(() => {
    if (!socket) return;

    const handleMessage = (message: Message) => {
      onMessage?.(message);
    };

    socket.on('chat:message', handleMessage);

    return () => {
      socket.off('chat:message', handleMessage);
    };
  }, [socket, onMessage]);

  // 타이핑 상태 수신
  useEffect(() => {
    if (!socket) return;

    const handleTyping = ({
      userId,
      nickname,
      isTyping,
    }: {
      userId: string;
      nickname: string;
      isTyping: boolean;
    }) => {
      setTypingUsers((prev) => {
        if (isTyping) {
          // 이미 타이핑 중인 유저가 아니면 추가
          if (!prev.find((u) => u.userId === userId)) {
            return [...prev, { userId, nickname }];
          }
          return prev;
        } else {
          // 타이핑 종료 시 제거
          return prev.filter((u) => u.userId !== userId);
        }
      });
    };

    socket.on('chat:typing', handleTyping);

    return () => {
      socket.off('chat:typing', handleTyping);
    };
  }, [socket]);

  // typingUsers 변경 시 콜백 호출
  useEffect(() => {
    onTyping?.(typingUsers);
  }, [typingUsers, onTyping]);

  // 읽음 처리 수신
  useEffect(() => {
    if (!socket) return;

    const handleRead = ({ messageIds }: { messageIds: string[] }) => {
      onRead?.(messageIds);
    };

    socket.on('chat:read', handleRead);

    return () => {
      socket.off('chat:read', handleRead);
    };
  }, [socket, onRead]);

  // 메시지 전송
  const sendMessage = useCallback(
    (content: string, type: 'TEXT' | 'IMAGE' | 'EMOJI' = 'TEXT') => {
      if (!socket?.connected) return;

      socket.emit('chat:message', { roomId, content, type });
    },
    [socket, roomId]
  );

  // 타이핑 상태 전송
  const sendTyping = useCallback(
    (isTyping: boolean) => {
      if (!socket?.connected) return;

      socket.emit('chat:typing', { roomId, isTyping });
    },
    [socket, roomId]
  );

  // 메시지 읽음 처리 - API + Socket 이벤트
  const markAsRead = useCallback(
    async (messageIds: string[]) => {
      if (!socket?.connected) return;

      try {
        // API 호출로 DB에 읽음 상태 저장
        const response = await fetch(`/api/chat/rooms/${roomId}/read`, {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ messageIds }),
        });

        if (response.ok) {
          // Socket 이벤트도 발송하여 실시간 동기화
          socket.emit('chat:read', { roomId, messageIds });
        }
      } catch (error) {
        console.error('Failed to mark messages as read:', error);
        // 에러가 발생해도 Socket 이벤트는 발송
        socket.emit('chat:read', { roomId, messageIds });
      }
    },
    [socket, roomId]
  );

  // 채팅방 입장 시 자동 읽음 처리
  const markAllAsRead = useCallback(async () => {
    try {
      await fetch(`/api/chat/rooms/${roomId}/read`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({}),
      });
    } catch (error) {
      console.error('Failed to mark all messages as read:', error);
    }
  }, [roomId]);

  return {
    sendMessage,
    sendTyping,
    markAsRead,
    markAllAsRead,
    typingUsers,
    isConnected,
  };
}
