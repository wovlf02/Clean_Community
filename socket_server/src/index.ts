import express, { Request, Response } from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';
import cors from 'cors';
import helmet from 'helmet';
import { createAdapter } from '@socket.io/redis-adapter';

import { config } from './config.js';
import { logger, initializeRedis, closeRedis } from './services/index.js';
import { authMiddleware } from './middlewares/index.js';
import {
  registerChatHandlers,
  registerPresenceHandlers,
  registerNotificationHandlers,
} from './handlers/index.js';
import {
  AuthenticatedSocket,
  ServerToClientEvents,
  ClientToServerEvents,
  InterServerEvents,
  SocketData,
} from './types/index.js';

// Create Express app
const app = express();

// Middleware
app.use(helmet());
app.use(cors({
  origin: config.cors.origin,
  credentials: true,
}));
app.use(express.json());

// Health check endpoint
app.get('/health', (_req: Request, res: Response) => {
  res.status(200).json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    environment: config.nodeEnv,
  });
});

// Ready check endpoint
app.get('/ready', (_req: Request, res: Response) => {
  res.status(200).json({
    status: 'ready',
    timestamp: new Date().toISOString(),
  });
});

// Create HTTP server
const httpServer = createServer(app);

// Create Socket.IO server
const io = new Server<
  ClientToServerEvents,
  ServerToClientEvents,
  InterServerEvents,
  SocketData
>(httpServer, {
  cors: {
    origin: config.cors.origin,
    credentials: true,
  },
  pingTimeout: 60000,
  pingInterval: 25000,
});

// Initialize server
const initializeServer = async (): Promise<void> => {
  // Initialize Redis adapter if enabled
  if (config.redis.enabled) {
    const redisClients = await initializeRedis();
    if (redisClients) {
      io.adapter(createAdapter(redisClients.pubClient, redisClients.subClient));
      logger.info('Redis adapter initialized');
    }
  }

  // Apply authentication middleware
  io.use(authMiddleware);

  // Socket connection handler
  io.on('connection', (socket: AuthenticatedSocket) => {
    const user = socket.user!;

    logger.info('Client connected', {
      socketId: socket.id,
      userId: user.id,
      nickname: user.nickname,
    });

    // Register all handlers
    registerChatHandlers(io, socket);
    registerPresenceHandlers(io, socket);
    registerNotificationHandlers(io, socket);

    // Handle errors
    socket.on('error', (error) => {
      logger.error('Socket error', {
        socketId: socket.id,
        userId: user.id,
        error: error.message,
      });
      socket.emit('error', {
        code: 'SOCKET_ERROR',
        message: 'An error occurred',
      });
    });

    // Handle disconnect
    socket.on('disconnect', (reason) => {
      logger.info('Client disconnected', {
        socketId: socket.id,
        userId: user.id,
        reason,
      });
    });
  });

  // Start server
  httpServer.listen(config.port, () => {
    logger.info(`Socket server is running on port ${config.port}`);
    logger.info(`Environment: ${config.nodeEnv}`);
    logger.info(`CORS origin: ${config.cors.origin}`);
    logger.info(`Redis enabled: ${config.redis.enabled}`);
  });
};

// Graceful shutdown
const gracefulShutdown = async (): Promise<void> => {
  logger.info('Shutting down gracefully...');

  // Close Socket.IO connections
  io.close(() => {
    logger.info('Socket.IO connections closed');
  });

  // Close Redis connections
  await closeRedis();

  // Close HTTP server
  httpServer.close(() => {
    logger.info('HTTP server closed');
    process.exit(0);
  });

  // Force close after 10 seconds
  setTimeout(() => {
    logger.error('Forced shutdown after timeout');
    process.exit(1);
  }, 10000);
};

// Handle process signals
process.on('SIGTERM', gracefulShutdown);
process.on('SIGINT', gracefulShutdown);

// Handle uncaught exceptions
process.on('uncaughtException', (error) => {
  logger.error('Uncaught exception', { error: error.message, stack: error.stack });
  process.exit(1);
});

process.on('unhandledRejection', (reason) => {
  logger.error('Unhandled rejection', { reason });
  process.exit(1);
});

// Start the server
initializeServer().catch((error) => {
  logger.error('Failed to initialize server', { error: error.message });
  process.exit(1);
});

export { app, io, httpServer };
