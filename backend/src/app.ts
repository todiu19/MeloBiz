import cors from "cors";
import express from "express";
import { config } from "./config.js";
import { licenseRouter } from "./routes/license.routes.js";
import { publicRouter } from "./routes/public.routes.js";

export const app = express();

app.disable("x-powered-by");
app.use(
  cors({
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

app.get("/health", (_request, response) => {
  response.json({
    success: true,
    service: "melobiz-backend",
    timestamp: new Date().toISOString(),
  });
});

app.use("/api/v1/licenses", licenseRouter);
app.use("/api/v1", publicRouter);

app.use((_request, response) => {
  response.status(404).json({
    success: false,
    message: "Không tìm thấy API endpoint.",
  });
});

app.use(
  (
    error: Error,
    _request: express.Request,
    response: express.Response,
    _next: express.NextFunction,
  ) => {
    console.error(error);
    response.status(500).json({
      success: false,
      message: "Máy chủ đang gặp lỗi. Vui lòng thử lại sau.",
    });
  },
);
