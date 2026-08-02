import { EMAIL_PATTERN } from "../constants/auth.constants.js";
import type {
  CompleteOnboardingDto,
  RequestEmailOtpDto,
  VerifyEmailOtpDto,
} from "../domain/dto/auth.dto.js";

function objectBody(value: unknown): Record<string, unknown> {
  return typeof value === "object" && value !== null
    ? (value as Record<string, unknown>)
    : {};
}

export function validateOnboarding(
  body: unknown,
): CompleteOnboardingDto | undefined {
  const value = objectBody(body);
  if (
    typeof value.name !== "string" ||
    !value.name.trim() ||
    typeof value.businessName !== "string" ||
    !value.businessName.trim()
  ) {
    return undefined;
  }
  return { name: value.name, businessName: value.businessName };
}

export function validateRequestEmailOtp(
  body: unknown,
): RequestEmailOtpDto | undefined {
  const value = objectBody(body);
  return typeof value.email === "string" && EMAIL_PATTERN.test(value.email)
    ? { email: value.email }
    : undefined;
}

export function validateVerifyEmailOtp(
  body: unknown,
): VerifyEmailOtpDto | undefined {
  const value = objectBody(body);
  return typeof value.email === "string" &&
    EMAIL_PATTERN.test(value.email) &&
    typeof value.code === "string" &&
    /^\d{6}$/.test(value.code)
    ? { email: value.email, code: value.code }
    : undefined;
}
