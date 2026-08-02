import "dotenv/config";

function parsePort(value: string | undefined): number {
  const parsed = Number(value ?? "4000");
  return Number.isInteger(parsed) && parsed > 0 ? parsed : 4000;
}

function parseBoolean(value: string | undefined, fallback = false): boolean {
  if (value === undefined) return fallback;
  return value.trim().toLowerCase() === "true";
}

function parsePositiveInteger(value: string | undefined, fallback: number) {
  const parsed = Number(value);
  return Number.isInteger(parsed) && parsed > 0 ? parsed : fallback;
}

export const config = {
  port: parsePort(process.env.PORT),
  corsOrigins: (process.env.CORS_ORIGINS ?? "http://localhost:3001")
    .split(",")
    .map((origin) => origin.trim())
    .filter(Boolean),
  databaseUrl: process.env.DATABASE_URL?.trim() || null,
  databaseSsl: parseBoolean(process.env.DATABASE_SSL),
  seedDemoData: parseBoolean(
    process.env.SEED_DEMO_DATA,
    process.env.NODE_ENV !== "production",
  ),
  jwtSecret: process.env.JWT_SECRET?.trim() || null,
  sessionDays: parsePositiveInteger(process.env.SESSION_DAYS, 30),
  sessionCookieName:
    process.env.SESSION_COOKIE_NAME?.trim() || "melobiz_session",
  sessionCookieSecure: parseBoolean(
    process.env.SESSION_COOKIE_SECURE,
    process.env.NODE_ENV === "production",
  ),
  frontendUrl: (process.env.FRONTEND_URL ?? "http://localhost:3001").replace(/\/$/, ""),
  googleClientId: process.env.GOOGLE_CLIENT_ID?.trim() || null,
  googleClientSecret: process.env.GOOGLE_CLIENT_SECRET?.trim() || null,
  googleRedirectUri:
    process.env.GOOGLE_REDIRECT_URI?.trim() ||
    "http://localhost:4000/api/v1/auth/google/callback",
  smtpUrl: process.env.SMTP_URL?.trim() || null,
  smtpFrom:
    process.env.SMTP_FROM?.trim() || "MeloBiz <no-reply@melobiz.vn>",
  otpTtlMinutes: parsePositiveInteger(process.env.OTP_TTL_MINUTES, 5),
  redisUrl: process.env.REDIS_URL?.trim() || "redis://127.0.0.1:6379",
};
