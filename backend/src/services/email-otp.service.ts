import jwt, { type JwtPayload } from "jsonwebtoken";
import nodemailer from "nodemailer";
import { config } from "../config/index.js";
import {
  consumeOtpChallenge,
  discardOtpChallenge,
  incrementOtpRequests,
  saveOtpChallenge,
} from "../data/otp.repository.js";
import {
  generateNumericOtp,
  hmacSha256,
} from "../utils/crypto.utils.js";
import { normalizeEmail } from "../utils/string.utils.js";

type EmailOnboardingPayload = JwtPayload & { email: string };

export class OtpRateLimitError extends Error {}

function requireJwtSecret() {
  if (!config.jwtSecret) {
    throw new Error("JWT_SECRET chưa được cấu hình.");
  }
  return config.jwtSecret;
}

function hashValue(value: string) {
  return hmacSha256(requireJwtSecret(), value);
}

function challengeKey(email: string) {
  return `melobiz:otp:challenge:${hashValue(normalizeEmail(email))}`;
}

function rateLimitKey(email: string) {
  return `melobiz:otp:rate:${hashValue(normalizeEmail(email))}`;
}

function hashCode(email: string, code: string) {
  return hashValue(`${normalizeEmail(email)}:${code}`);
}

export async function issueEmailOtp(emailInput: string, _requestIp?: string) {
  const email = normalizeEmail(emailInput);
  const rateKey = rateLimitKey(email);
  const requestCount = await incrementOtpRequests(rateKey, 600);
  if (requestCount > 3) {
    throw new OtpRateLimitError(
      "Bạn đã yêu cầu quá nhiều mã. Vui lòng thử lại sau 10 phút.",
    );
  }

  const code = generateNumericOtp();
  await saveOtpChallenge(
    challengeKey(email),
    hashCode(email, code),
    config.otpTtlMinutes * 60,
  );
  return {
    code,
    expiresAt: new Date(Date.now() + config.otpTtlMinutes * 60_000),
  };
}

export async function sendEmailOtp(email: string, code: string) {
  if (!config.smtpUrl) {
    throw new Error(
      "SMTP_URL chưa được cấu hình. Hãy cập nhật backend/.env để gửi OTP.",
    );
  }
  const transporter = nodemailer.createTransport(config.smtpUrl);
  await transporter.sendMail({
    from: config.smtpFrom,
    to: normalizeEmail(email),
    subject: `${code} là mã đăng nhập MeloBiz`,
    text: `Mã đăng nhập MeloBiz của bạn là ${code}. Mã có hiệu lực trong ${config.otpTtlMinutes} phút. Không chia sẻ mã này với bất kỳ ai.`,
    html: `<p>Mã đăng nhập MeloBiz của bạn:</p><p style="font-size:28px;font-weight:700;letter-spacing:6px">${code}</p><p>Mã có hiệu lực trong ${config.otpTtlMinutes} phút. Không chia sẻ mã này với bất kỳ ai.</p>`,
  });
}

export async function discardEmailOtp(email: string, code: string) {
  await discardOtpChallenge(
    challengeKey(email),
    hashCode(email, code),
    rateLimitKey(email),
  );
}

export async function verifyEmailOtp(emailInput: string, code: string) {
  const email = normalizeEmail(emailInput);
  return consumeOtpChallenge(
    challengeKey(email),
    hashCode(email, code),
    5,
  );
}

export function createEmailOnboardingToken(email: string) {
  return jwt.sign({ email: normalizeEmail(email) }, requireJwtSecret(), {
    issuer: "melobiz-api",
    audience: "email-onboarding",
    expiresIn: 15 * 60,
    algorithm: "HS256",
  });
}

export function readEmailOnboardingToken(
  token: string,
): { email: string } | undefined {
  try {
    const payload = jwt.verify(token, requireJwtSecret(), {
      issuer: "melobiz-api",
      audience: "email-onboarding",
      algorithms: ["HS256"],
    });
    if (
      typeof payload === "string" ||
      typeof (payload as EmailOnboardingPayload).email !== "string"
    ) {
      return undefined;
    }
    return { email: (payload as EmailOnboardingPayload).email };
  } catch {
    return undefined;
  }
}
