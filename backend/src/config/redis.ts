import { createClient } from "redis";
import { config } from "./index.js";

export const redis = createClient({ url: config.redisUrl });

redis.on("error", (error) => {
  console.error("Redis client error:", error);
});

export async function connectRedis(): Promise<void> {
  if (!redis.isOpen) await redis.connect();
}

export async function checkRedisConnection(): Promise<void> {
  await connectRedis();
  await redis.ping();
}

export async function closeRedis(): Promise<void> {
  if (redis.isOpen) await redis.close();
}
