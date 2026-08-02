import cors from "cors";
import cookieParser from "cookie-parser";
import express from "express";
import { config } from "./config/index.js";
import { query } from "./config/database.js";
import { redis } from "./config/redis.js";
import { authRouter } from "./routes/auth.routes.js";
import { industryRouter } from "./routes/industry.routes.js";
import { licenseRouter } from "./routes/license.routes.js";
import { publicRouter } from "./routes/public.routes.js";
import {
  errorHandler,
  notFoundHandler,
} from "./middleware/error.middleware.js";

export const app = express();

app.disable("x-powered-by");
app.use(
  cors({
    credentials: true,
    origin(origin, callback) {
      if (!origin || config.corsOrigins.includes(origin)) {
        callback(null, true);
        return;
      }
      callback(new Error("Origin không được phép."));
    },
  }),
);
app.use(express.json({ limit: "200kb" }));
app.use(cookieParser());

app.get("/health", async (_request, response) => {
  const [database, redisStatus] = await Promise.allSettled([
    query<{ timestamp: Date }>("SELECT now() AS timestamp"),
    redis.ping(),
  ]);
  const healthy =
    database.status === "fulfilled" && redisStatus.status === "fulfilled";
  response.status(healthy ? 200 : 503).json({
    success: healthy,
    service: "melobiz-backend",
    database: database.status === "fulfilled" ? "connected" : "disconnected",
    redis: redisStatus.status === "fulfilled" ? "connected" : "disconnected",
    timestamp:
      database.status === "fulfilled"
        ? database.value.rows[0]?.timestamp.toISOString()
        : new Date().toISOString(),
  });
});

app.use("/api/v1/licenses", licenseRouter);
app.use("/api/v1/auth", authRouter);
app.use("/api/v1/industries", industryRouter);
app.use("/api/v1", publicRouter);

app.use(notFoundHandler);
app.use(errorHandler);
