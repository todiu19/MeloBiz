import { Router } from "express";
import {
  createSession,
  createUser,
  findUserByEmail,
  toPublicUser,
  verifyPassword,
} from "../data/users.js";

export const authRouter = Router();

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

authRouter.post("/register", (request, response) => {
  const { name, email, businessName, password } = request.body ?? {};

  if (![name, email, businessName, password].every((value) => typeof value === "string" && value.trim())) {
    response.status(400).json({
      success: false,
      message: "Vui lòng nhập đầy đủ thông tin.",
    });
    return;
  }

  if (!emailPattern.test(email)) {
    response.status(400).json({ success: false, message: "Email không hợp lệ." });
    return;
  }

  if (password.length < 8) {
    response.status(400).json({
      success: false,
      message: "Mật khẩu cần có ít nhất 8 ký tự.",
    });
    return;
  }

  if (findUserByEmail(email)) {
    response.status(409).json({
      success: false,
      message: "Email này đã được sử dụng.",
    });
    return;
  }

  const user = createUser({ name, email, businessName, password });
  const token = createSession(user.id);

  response.status(201).json({
    success: true,
    message: "Tạo tài khoản thành công.",
    data: { user: toPublicUser(user), token },
  });
});

authRouter.post("/login", (request, response) => {
  const { email, password } = request.body ?? {};

  if (typeof email !== "string" || typeof password !== "string") {
    response.status(400).json({
      success: false,
      message: "Vui lòng nhập email và mật khẩu.",
    });
    return;
  }

  const user = findUserByEmail(email);
  if (!user || !verifyPassword(password, user.passwordHash)) {
    response.status(401).json({
      success: false,
      message: "Email hoặc mật khẩu không đúng.",
    });
    return;
  }

  response.json({
    success: true,
    message: "Đăng nhập thành công.",
    data: { user: toPublicUser(user), token: createSession(user.id) },
  });
});

authRouter.post("/forgot-password", (request, response) => {
  const { email } = request.body ?? {};

  if (typeof email !== "string" || !emailPattern.test(email)) {
    response.status(400).json({
      success: false,
      message: "Vui lòng nhập email hợp lệ.",
    });
    return;
  }

  response.json({
    success: true,
    message: "Nếu email tồn tại, hướng dẫn đặt lại mật khẩu sẽ được gửi.",
  });
});
