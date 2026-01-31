import { Server } from 'socket.io';
import { logger } from '../services/logger.js';
import {
  AuthenticatedSocket,
  PresenceUpdate,
  ServerToClientEvents,
  ClientToServerEvents,
} from '../types/index.js';

// In-memory presence store (for single instance)
// In production, this should be stored in Redis
const onlineUsers = new Map<string, { socketId: string; status: 'online' | 'away' }>();

export const registerPresenceHandlers = (
  _io: Server<ClientToServerEvents, ServerToClientEvents>,
  socket: AuthenticatedSocket
): void => {
  const user = socket.user!;

  // Set user as online when connected
  onlineUsers.set(user.id, { socketId: socket.id, status: 'online' });

  // Broadcast presence update
  const presenceUpdate: PresenceUpdate = {
    userId: user.id,
    status: 'online',
  };
  socket.broadcast.emit('presence_update', presenceUpdate);

  logger.info('User came online', { userId: user.id, nickname: user.nickname });

  // Update presence status
  socket.on('update_presence', (status: 'online' | 'away') => {
    onlineUsers.set(user.id, { socketId: socket.id, status });

    const update: PresenceUpdate = {
      userId: user.id,
      status,
    };
    socket.broadcast.emit('presence_update', update);

    logger.debug('Presence updated', { userId: user.id, status });
  });

  // Handle disconnect
  socket.on('disconnect', () => {
    onlineUsers.delete(user.id);

    const offlineUpdate: PresenceUpdate = {
      userId: user.id,
      status: 'offline',
      lastSeen: new Date().toISOString(),
    };
    socket.broadcast.emit('presence_update', offlineUpdate);

    logger.info('User went offline', { userId: user.id, nickname: user.nickname });
  });
};

export const getOnlineUsers = (): Map<string, { socketId: string; status: 'online' | 'away' }> => {
  return onlineUsers;
};
