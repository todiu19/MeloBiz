import { app } from "./app.js";
import { config } from "./config/index.js";
import {
  checkDatabaseConnection,
  closeDatabase,
} from "./config/database.js";
import { seedDevelopmentData } from "./config/seed.js";
import {
  checkRedisConnection,
  closeRedis,
} from "./config/redis.js";

async function start() {
  if (!config.jwtSecret || config.jwtSecret.length < 32) {
    throw new Error("JWT_SECRET phải được cấu hình với ít nhất 32 ký tự.");
  }

  await checkDatabaseConnection();
  await checkRedisConnection();
  await seedDevelopmentData();

  const server = app.listen(config.port, () => {
    console.log(`MeloBiz API đang chạy tại http://localhost:${config.port}`);
    console.log("PostgreSQL đã kết nối.");
    console.log("Redis đã kết nối.");
  });

  async function shutdown(signal: string) {
    console.log(`Nhận ${signal}, đang dừng MeloBiz API...`);
    server.close(async () => {
      await Promise.all([closeDatabase(), closeRedis()]);
      process.exit(0);
    });
  }

  process.on("SIGINT", () => void shutdown("SIGINT"));
  process.on("SIGTERM", () => void shutdown("SIGTERM"));
}

start().catch((error: unknown) => {
  console.error("Không thể khởi động MeloBiz API:", error);
  process.exit(1);
});
