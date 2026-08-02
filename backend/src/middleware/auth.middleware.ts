import type { NextFunction, Request, Response } from "express";
import { config } from "../config/index.js";
import { verifySessionToken } from "../services/auth.service.js";

export async function requireAuth(
  request: Request,
  response: Response,
  next: NextFunction,
) {
  const token = request.cookies?.[config.sessionCookieName];

  if (typeof token !== "string") {
    response.status(401).json({
      success: false,
      message: "Bạn chưa đăng nhập.",
    });
    return;
  }

  const user = await verifySessionToken(token);
  if (!user) {
    response.status(401).json({
      success: false,
      message: "Phiên đăng nhập không hợp lệ hoặc đã hết hạn.",
    });
    return;
  }

  request.authUser = user;
  next();
}
