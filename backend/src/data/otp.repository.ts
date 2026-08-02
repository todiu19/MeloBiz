import { connectRedis, redis } from "../config/redis.js";

export async function incrementOtpRequests(
  rateKey: string,
  windowSeconds: number,
): Promise<number> {
  await connectRedis();
  const count = await redis.eval(
    `
      local count = redis.call('INCR', KEYS[1])
      if count == 1 then redis.call('EXPIRE', KEYS[1], ARGV[1]) end
      return count
    `,
    { keys: [rateKey], arguments: [String(windowSeconds)] },
  );
  return Number(count);
}

export async function saveOtpChallenge(
  challengeKey: string,
  codeHash: string,
  ttlSeconds: number,
): Promise<void> {
  await connectRedis();
  await redis.set(
    challengeKey,
    JSON.stringify({ codeHash, attempts: 0 }),
    { EX: ttlSeconds },
  );
}

export async function discardOtpChallenge(
  challengeKey: string,
  expectedCodeHash: string,
  rateKey: string,
): Promise<void> {
  await connectRedis();
  const stored = await redis.get(challengeKey);
  if (stored) {
    const challenge = JSON.parse(stored) as { codeHash?: string };
    if (challenge.codeHash === expectedCodeHash) {
      await redis.del(challengeKey);
    }
  }
  await redis.eval(
    `
      local count = tonumber(redis.call('GET', KEYS[1]) or '0')
      if count <= 1 then
        return redis.call('DEL', KEYS[1])
      end
      return redis.call('DECR', KEYS[1])
    `,
    { keys: [rateKey], arguments: [] },
  );
}

export async function consumeOtpChallenge(
  challengeKey: string,
  expectedCodeHash: string,
  maxAttempts: number,
): Promise<boolean> {
  await connectRedis();
  const result = await redis.eval(
    `
      local raw = redis.call('GET', KEYS[1])
      if not raw then return 0 end
      local challenge = cjson.decode(raw)
      local maxAttempts = tonumber(ARGV[2])
      if challenge.attempts >= maxAttempts then
        redis.call('DEL', KEYS[1])
        return 0
      end
      if challenge.codeHash ~= ARGV[1] then
        challenge.attempts = challenge.attempts + 1
        if challenge.attempts >= maxAttempts then
          redis.call('DEL', KEYS[1])
        else
          redis.call('SET', KEYS[1], cjson.encode(challenge), 'KEEPTTL')
        end
        return 0
      end
      redis.call('DEL', KEYS[1])
      return 1
    `,
    {
      keys: [challengeKey],
      arguments: [expectedCodeHash, String(maxAttempts)],
    },
  );
  return Number(result) === 1;
}
