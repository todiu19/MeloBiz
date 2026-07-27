import "dotenv/config";

function parsePort(value: string | undefined): number {
  const parsed = Number(value ?? "4000");
  return Number.isInteger(parsed) && parsed > 0 ? parsed : 4000;
}

export const config = {
  port: parsePort(process.env.PORT),
  corsOrigins: (process.env.CORS_ORIGINS ?? "http://localhost:3001")
    .split(",")
    .map((origin) => origin.trim())
    .filter(Boolean),
};
