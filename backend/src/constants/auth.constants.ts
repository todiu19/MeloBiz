export const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export const SESSION_JWT_ISSUER = "melobiz-api";
export const SESSION_JWT_AUDIENCE = "melobiz-web";

export const GOOGLE_STATE_COOKIE = "melobiz_google_state";
export const GOOGLE_ONBOARDING_COOKIE = "melobiz_google_onboarding";
export const EMAIL_ONBOARDING_COOKIE = "melobiz_email_onboarding";

export const GOOGLE_STATE_MAX_AGE_MS = 10 * 60 * 1000;
export const ONBOARDING_MAX_AGE_MS = 15 * 60 * 1000;
