import { redis } from "@/lib/redis";

type PresenceMap = Map<string, number>;

const ACTIVE_WINDOW_MS = 30_000;
const REDIS_KEY = "presence:active-users";
const presence: PresenceMap = new Map();

function now() {
  return Date.now();
}

function pruneExpired(current = now()) {
  for (const [id, lastSeen] of presence.entries()) {
    if (current - lastSeen > ACTIVE_WINDOW_MS) {
      presence.delete(id);
    }
  }
}

export async function heartbeat(sessionId: string) {
  const current = now();

  if (redis) {
    await redis.zadd(REDIS_KEY, current, sessionId);
    await redis.zremrangebyscore(REDIS_KEY, 0, current - ACTIVE_WINDOW_MS);
    return;
  }

  pruneExpired(current);
  presence.set(sessionId, current);
}

export async function getActiveCount() {
  const current = now();

  if (redis) {
    await redis.zremrangebyscore(REDIS_KEY, 0, current - ACTIVE_WINDOW_MS);
    return await redis.zcard(REDIS_KEY);
  }

  pruneExpired(current);
  return presence.size;
}