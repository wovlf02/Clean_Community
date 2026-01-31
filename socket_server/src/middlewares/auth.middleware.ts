import { Socket } from 'socket.io';
import jwt from 'jsonwebtoken';
import { config } from '../config.js';
import { logger } from '../services/logger.js';
import { AuthenticatedSocket, UserPayload } from '../types/index.js';

export const authMiddleware = (
  socket: Socket,
  next: (err?: Error) => void
): void => {
  try {
    const token = socket.handshake.auth.token || socket.handshake.headers.authorization?.replace('Bearer ', '');

    if (!token) {
      logger.warn('Connection attempt without token', { socketId: socket.id });
      return next(new Error('Authentication required'));
    }

    const decoded = jwt.verify(token, config.jwt.secret) as UserPayload;

    (socket as AuthenticatedSocket).user = decoded;

    logger.debug('User authenticated', {
      socketId: socket.id,
      userId: decoded.id,
      nickname: decoded.nickname
    });

    next();
  } catch (error) {
    logger.error('Authentication failed', {
      socketId: socket.id,
      error: error instanceof Error ? error.message : 'Unknown error'
    });
    next(new Error('Invalid token'));
  }
};
