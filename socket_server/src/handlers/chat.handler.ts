import { Server } from 'socket.io';
import { randomUUID } from 'crypto';
import { logger } from '../services/logger.js';
import { config } from '../config.js';
import {
  AuthenticatedSocket,
  ChatMessage,
  JoinRoomPayload,
  LeaveRoomPayload,
  SendMessagePayload,
  TypingPayload,
  ReadMessagePayload,
  ServerToClientEvents,
  ClientToServerEvents,
} from '../types/index.js';

// API 호출 헬퍼 함수
async function callNextJsApi(
  endpoint: string,
  method: string,
  token: string,
  body?: object
): Promise<{ success: boolean; data?: any; error?: string }> {
  try {
    const response = await fetch(`${config.nextJsApiUrl}${endpoint}`, {
      method,
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: body ? JSON.stringify(body) : undefined,
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({})) as { error?: string };
      return { success: false, error: errorData.error || 'API call failed' };
    }

    const data = await response.json();
    return { success: true, data };
  } catch (error) {
    logger.error('API call failed', { endpoint, error });
    return { success: false, error: 'Failed to call API' };
  }
}

export const registerChatHandlers = (
  io: Server<ClientToServerEvents, ServerToClientEvents>,
  socket: AuthenticatedSocket
): void => {
  const user = socket.user!;

  // Join a chat room
  socket.on('join_room', (payload: JoinRoomPayload) => {
    const { roomId } = payload;

    socket.join(roomId);
    logger.info('User joined room', { userId: user.id, roomId });

    // Notify other users in the room
    socket.to(roomId).emit('user_joined', {
      userId: user.id,
      nickname: user.nickname,
    });
  });

  // Leave a chat room
  socket.on('leave_room', (payload: LeaveRoomPayload) => {
    const { roomId } = payload;

    socket.leave(roomId);
    logger.info('User left room', { userId: user.id, roomId });

    // Notify other users in the room
    socket.to(roomId).emit('user_left', {
      userId: user.id,
      nickname: user.nickname,
    });
  });

  // Send a message
  socket.on('send_message', (payload: SendMessagePayload) => {
    const { roomId, content, type = 'text' } = payload;

    const messageId = randomUUID();
    const message: ChatMessage = {
      id: messageId,
      roomId,
      senderId: user.id,
      senderNickname: user.nickname,
      content,
      type,
      createdAt: new Date().toISOString(),
    };

    logger.debug('Message sent', {
      messageId,
      roomId,
      senderId: user.id
    });

    // Broadcast message to all users in the room (including sender)
    io.to(roomId).emit('message', message);

    // Confirm message was sent to the sender
    socket.emit('message_sent', {
      success: true,
      messageId,
    });
  });

  // Typing indicator
  socket.on('typing', (payload: TypingPayload) => {
    const { roomId, isTyping } = payload;

    socket.to(roomId).emit('typing', {
      userId: user.id,
      nickname: user.nickname,
      isTyping,
    });
  });

  // Read message - with database persistence
  socket.on('read_message', async (payload: ReadMessagePayload) => {
    const { roomId, messageId } = payload;

    try {
      // Get the token from the socket handshake (stored during authentication)
      const token = socket.handshake.auth?.token;

      if (token) {
        // Call Next.js API to persist read status
        const result = await callNextJsApi(
          `/api/chat/rooms/${roomId}/read`,
          'PATCH',
          token,
          { messageIds: [messageId] }
        );

        if (result.success && result.data) {
          // Broadcast updated unread count to all users in the room
          io.to(roomId).emit('message_read', {
            userId: user.id,
            messageId,
            unreadCount: result.data.unreadCount,
          });

          logger.info('Message read and persisted', {
            userId: user.id,
            roomId,
            messageId,
            unreadCount: result.data.unreadCount,
          });
        } else {
          // Still broadcast even if persistence failed
          socket.to(roomId).emit('message_read', {
            userId: user.id,
            messageId,
          });

          logger.warn('Message read broadcast without persistence', {
            userId: user.id,
            roomId,
            messageId,
            error: result.error,
          });
        }
      } else {
        // No token, just broadcast
        socket.to(roomId).emit('message_read', {
          userId: user.id,
          messageId,
        });

        logger.debug('Message read (no token for persistence)', {
          userId: user.id,
          roomId,
          messageId,
        });
      }
    } catch (error) {
      logger.error('Read message handler error', {
        userId: user.id,
        roomId,
        messageId,
        error,
      });

      // Still try to broadcast
      socket.to(roomId).emit('message_read', {
        userId: user.id,
        messageId,
      });
    }
  });
};
