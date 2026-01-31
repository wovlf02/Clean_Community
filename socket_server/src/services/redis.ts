import { config } from '../config.js';
import { logger } from './logger.js';
import { Redis } from 'ioredis';

let redisClient: Redis | null = null;
let redisPubClient: Redis | null = null;
let redisSubClient: Redis | null = null;

export const initializeRedis = async (): Promise<{
  pubClient: Redis;
  subClient: Redis;
} | null> => {
  if (!config.redis.enabled) {
    logger.info('Redis is disabled. Running in single-instance mode.');
    return null;
  }

  try {
    redisClient = new Redis(config.redis.url);
    redisPubClient = new Redis(config.redis.url);
    redisSubClient = new Redis(config.redis.url);

    await Promise.all([
      new Promise<void>((resolve, reject) => {
        redisClient!.on('connect', () => resolve());
        redisClient!.on('error', (err: Error) => reject(err));
      }),
      new Promise<void>((resolve, reject) => {
        redisPubClient!.on('connect', () => resolve());
        redisPubClient!.on('error', (err: Error) => reject(err));
      }),
      new Promise<void>((resolve, reject) => {
        redisSubClient!.on('connect', () => resolve());
        redisSubClient!.on('error', (err: Error) => reject(err));
      }),
    ]);

    logger.info('Redis connected successfully');

    return {
      pubClient: redisPubClient!,
      subClient: redisSubClient!,
    };
  } catch (error) {
    logger.error('Failed to connect to Redis', { error });
    return null;
  }
};

export const getRedisClient = (): Redis | null => redisClient;

export const closeRedis = async (): Promise<void> => {
  if (redisClient) {
    await redisClient.quit();
  }
  if (redisPubClient) {
    await redisPubClient.quit();
  }
  if (redisSubClient) {
    await redisSubClient.quit();
  }
  logger.info('Redis connections closed');
};
