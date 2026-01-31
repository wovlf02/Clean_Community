import { Server } from 'socket.io';
import { randomUUID } from 'crypto';
import { logger } from '../services/logger.js';
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

  // Read message
  socket.on('read_message', (payload: ReadMessagePayload) => {
    const { roomId, messageId } = payload;

    socket.to(roomId).emit('message_read', {
      userId: user.id,
      messageId,
    });

    logger.debug('Message read', {
      userId: user.id,
      roomId,
      messageId
    });
  });
};
