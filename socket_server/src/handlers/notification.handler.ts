import { Server } from 'socket.io';
import { logger } from '../services/logger.js';
import {
  AuthenticatedSocket,
  Notification,
  ServerToClientEvents,
  ClientToServerEvents,
} from '../types/index.js';

// User socket mapping for direct notifications
const userSockets = new Map<string, string>();

export const registerNotificationHandlers = (
  _io: Server<ClientToServerEvents, ServerToClientEvents>,
  socket: AuthenticatedSocket
): void => {
  const user = socket.user!;

  // Register user socket for notifications
  userSockets.set(user.id, socket.id);
  logger.debug('User registered for notifications', { userId: user.id });

  socket.on('disconnect', () => {
    userSockets.delete(user.id);
    logger.debug('User unregistered from notifications', { userId: user.id });
  });
};

// Utility function to send notification to a specific user
export const sendNotificationToUser = (
  io: Server<ClientToServerEvents, ServerToClientEvents>,
  userId: string,
  notification: Notification
): boolean => {
  const socketId = userSockets.get(userId);

  if (socketId) {
    io.to(socketId).emit('notification', notification);
    logger.debug('Notification sent', { userId, notificationId: notification.id });
    return true;
  }

  logger.debug('User not connected, notification not sent', { userId });
  return false;
};

// Get connected socket ID for a user
export const getUserSocketId = (userId: string): string | undefined => {
  return userSockets.get(userId);
};
