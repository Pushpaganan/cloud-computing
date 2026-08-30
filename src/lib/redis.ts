import Redis from "ioredis";

declare global {
  // eslint-disable-next-line no-var
  var __redisClient: Redis | undefined;
}

const redisUrl = process.env.REDIS_URL;

export const redis = redisUrl
  ? (global.__redisClient ??
      new Redis(redisUrl, {
        maxRetriesPerRequest: 2,
        enableReadyCheck: true,
        tls: redisUrl.startsWith("rediss://") ? {} : undefined,
      }))
  : null;

if (redis && !global.__redisClient) {
  global.__redisClient = redis;
}