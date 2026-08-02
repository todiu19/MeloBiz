import type { Request, Response } from "express";
import {
  EMAIL_ONBOARDING_COOKIE,
  GOOGLE_ONBOARDING_COOKIE,
  GOOGLE_STATE_COOKIE,
  GOOGLE_STATE_MAX_AGE_MS,
  ONBOARDING_MAX_AGE_MS,
} from "../constants/auth.constants.js";
import {
  createSession,
  createGoogleUser,
  createUser,
  DuplicateEmailError,
  findUserByEmail,
  findOrLinkGoogleUser,
  recordLogin,
  revokeSessionToken,
  toPublicUser,
} from "../services/auth.service.js";
import { config } from "../config/index.js";
import {
  clearSessionCookie,
  clearTemporaryCookie,
  setSessionCookie,
  setTemporaryCookie,
} from "../utils/session-cookie.utils.js";
import {
  createGoogleAuthorization,
  createOnboardingToken,
  exchangeGoogleCode,
  readOnboardingToken,
} from "../services/google-oauth.service.js";
import {
  createEmailOnboardingToken,
  discardEmailOtp,
  issueEmailOtp,
  OtpRateLimitError,
  readEmailOnboardingToken,
  sendEmailOtp,
  verifyEmailOtp,
} from "../services/email-otp.service.js";
import {
  validateOnboarding,
  validateRequestEmailOtp,
  validateVerifyEmailOtp,
} from "../validators/auth.validator.js";

export function startGoogleAuth(_request: Request, response: Response) {
  try {
    const authorization = createGoogleAuthorization();
    setTemporaryCookie(
      response,
      GOOGLE_STATE_COOKIE,
      authorization.stateToken,
      GOOGLE_STATE_MAX_AGE_MS,
    );
    response.redirect(authorization.url);
  } catch {
    response.redirect(
      `${config.frontendUrl}/dang-nhap?oauth_error=not_configured`,
    );
  }
}

export async function handleGoogleCallback(
  request: Request,
  response: Response,
) {
  const code = typeof request.query.code === "string" ? request.query.code : "";
  const state =
    typeof request.query.state === "string" ? request.query.state : "";
  const stateToken = request.cookies?.[GOOGLE_STATE_COOKIE];

  if (!code || !state || typeof stateToken !== "string") {
    response.redirect(`${config.frontendUrl}/dang-nhap?oauth_error=invalid`);
    return;
  }

  try {
    const identity = await exchangeGoogleCode({ code, state, stateToken });
    clearTemporaryCookie(response, GOOGLE_STATE_COOKIE);
    const user = await findOrLinkGoogleUser(identity);

    if (user) {
      const token = await createSession(user.id);
      await recordLogin(user.id);
      setSessionCookie(response, token);
      response.redirect(`${config.frontendUrl}/app`);
      return;
    }

    setTemporaryCookie(
      response,
      GOOGLE_ONBOARDING_COOKIE,
      createOnboardingToken(identity),
      ONBOARDING_MAX_AGE_MS,
    );
    response.redirect(`${config.frontendUrl}/hoan-tat-dang-ky?source=google`);
  } catch (error) {
    console.error("Google OAuth callback error:", error);
    clearTemporaryCookie(response, GOOGLE_STATE_COOKIE);
    response.redirect(`${config.frontendUrl}/dang-nhap?oauth_error=failed`);
  }
}

export function getGoogleOnboarding(
  request: Request,
  response: Response,
) {
  const token = request.cookies?.[GOOGLE_ONBOARDING_COOKIE];
  const identity =
    typeof token === "string" ? readOnboardingToken(token) : undefined;
  if (!identity) {
    response.status(401).json({
      success: false,
      message: "Phiên đăng ký Google đã hết hạn.",
    });
    return;
  }
  response.json({
    success: true,
    data: {
      email: identity.email,
      name: identity.name,
      picture: identity.picture,
    },
  });
}

export async function completeGoogleOnboarding(
  request: Request,
  response: Response,
) {
  const token = request.cookies?.[GOOGLE_ONBOARDING_COOKIE];
  const identity =
    typeof token === "string" ? readOnboardingToken(token) : undefined;
  if (!identity) {
    response.status(401).json({
      success: false,
      message: "Phiên đăng ký Google đã hết hạn.",
    });
    return;
  }

  const onboarding = validateOnboarding(request.body);
  if (!onboarding) {
    response.status(400).json({
      success: false,
      message: "Vui lòng nhập đầy đủ thông tin.",
    });
    return;
  }
  try {
    const user = await createGoogleUser({
      identity,
      ...onboarding,
    });
    const sessionToken = await createSession(user.id);
    clearTemporaryCookie(response, GOOGLE_ONBOARDING_COOKIE);
    setSessionCookie(response, sessionToken);
    response.status(201).json({
      success: true,
      message: "Hoàn tất tài khoản thành công.",
      data: { user: toPublicUser(user) },
    });
  } catch (error) {
    if (error instanceof DuplicateEmailError) {
      response.status(409).json({ success: false, message: error.message });
      return;
    }
    throw error;
  }
}

export async function requestEmailOtp(
  request: Request,
  response: Response,
) {
  const input = validateRequestEmailOtp(request.body);
  if (!input) {
    response.status(400).json({
      success: false,
      message: "Vui lòng nhập email hợp lệ.",
    });
    return;
  }
  try {
    const otp = await issueEmailOtp(input.email, request.ip);
    try {
      await sendEmailOtp(input.email, otp.code);
    } catch (error) {
      await discardEmailOtp(input.email, otp.code);
      throw error;
    }
    response.json({
      success: true,
      message: "Mã OTP đã được gửi. Mã có hiệu lực trong vài phút.",
    });
  } catch (error) {
    if (error instanceof OtpRateLimitError) {
      response.status(429).json({ success: false, message: error.message });
      return;
    }
    console.error("Email OTP delivery error:", error);
    response.status(503).json({
      success: false,
      message: "Chưa thể gửi email OTP. Vui lòng kiểm tra cấu hình SMTP.",
    });
  }
}

export async function verifyEmailOtpCode(
  request: Request,
  response: Response,
) {
  const input = validateVerifyEmailOtp(request.body);
  if (!input) {
    response.status(400).json({
      success: false,
      message: "Email hoặc mã OTP không hợp lệ.",
    });
    return;
  }

  if (!(await verifyEmailOtp(input.email, input.code))) {
    response.status(401).json({
      success: false,
      message: "Mã OTP không đúng, đã hết hạn hoặc đã được sử dụng.",
    });
    return;
  }

  const user = await findUserByEmail(input.email);
  if (!user) {
    setTemporaryCookie(
      response,
      EMAIL_ONBOARDING_COOKIE,
      createEmailOnboardingToken(input.email),
      ONBOARDING_MAX_AGE_MS,
    );
    response.json({
      success: true,
      message: "Email đã được xác minh.",
      data: { requiresOnboarding: true },
    });
    return;
  }
  const [token] = await Promise.all([
    createSession(user.id),
    recordLogin(user.id),
  ]);
  setSessionCookie(response, token);

  response.json({
    success: true,
    message: "Đăng nhập thành công.",
    data: { user: toPublicUser(user) },
  });
}

export function getEmailOnboarding(
  request: Request,
  response: Response,
) {
  const token = request.cookies?.[EMAIL_ONBOARDING_COOKIE];
  const identity =
    typeof token === "string" ? readEmailOnboardingToken(token) : undefined;
  if (!identity) {
    response.status(401).json({
      success: false,
      message: "Phiên xác minh email đã hết hạn.",
    });
    return;
  }
  response.json({ success: true, data: { email: identity.email, name: "" } });
}

export async function completeEmailOnboarding(
  request: Request,
  response: Response,
) {
  const token = request.cookies?.[EMAIL_ONBOARDING_COOKIE];
  const identity =
    typeof token === "string" ? readEmailOnboardingToken(token) : undefined;
  if (!identity) {
    response.status(401).json({
      success: false,
      message: "Phiên xác minh email đã hết hạn.",
    });
    return;
  }
  const onboarding = validateOnboarding(request.body);
  if (!onboarding) {
    response.status(400).json({
      success: false,
      message: "Vui lòng nhập đầy đủ thông tin.",
    });
    return;
  }
  try {
    const user = await createUser({
      ...onboarding,
      email: identity.email,
    });
    const sessionToken = await createSession(user.id);
    clearTemporaryCookie(response, EMAIL_ONBOARDING_COOKIE);
    setSessionCookie(response, sessionToken);
    response.status(201).json({
      success: true,
      message: "Hoàn tất tài khoản thành công.",
      data: { user: toPublicUser(user) },
    });
  } catch (error) {
    if (error instanceof DuplicateEmailError) {
      response.status(409).json({ success: false, message: error.message });
      return;
    }
    throw error;
  }
}

export function getCurrentUser(request: Request, response: Response) {
  response.json({
    success: true,
    data: { user: toPublicUser(request.authUser!) },
  });
}

export async function logout(request: Request, response: Response) {
  const token = request.cookies?.[config.sessionCookieName];
  if (typeof token === "string") {
    await revokeSessionToken(token);
  }

  clearSessionCookie(response);
  response.json({
    success: true,
    message: "Đăng xuất thành công.",
  });
}
