import { createHash, randomBytes } from "node:crypto";
import { OAuth2Client } from "google-auth-library";
import jwt, { type JwtPayload } from "jsonwebtoken";
import { config } from "../config/index.js";
import type { GoogleProfile } from "../types/google-profile.js";

type StatePayload = JwtPayload & { state: string; verifier: string };
type OnboardingPayload = JwtPayload & GoogleProfile;

function requireGoogleConfig() {
  if (
    !config.googleClientId ||
    !config.googleClientSecret ||
    !config.jwtSecret
  ) {
    throw new Error("Google OAuth chưa được cấu hình.");
  }
  return {
    clientId: config.googleClientId,
    clientSecret: config.googleClientSecret,
    jwtSecret: config.jwtSecret,
  };
}

export function createGoogleAuthorization() {
  const oauth = requireGoogleConfig();
  const state = randomBytes(24).toString("base64url");
  const verifier = randomBytes(48).toString("base64url");
  const challenge = createHash("sha256")
    .update(verifier)
    .digest("base64url");
  const stateToken = jwt.sign({ state, verifier }, oauth.jwtSecret, {
    issuer: "melobiz-api",
    audience: "google-oauth-state",
    expiresIn: 10 * 60,
    algorithm: "HS256",
  });
  const url = new URL("https://accounts.google.com/o/oauth2/v2/auth");
  url.search = new URLSearchParams({
    client_id: oauth.clientId,
    redirect_uri: config.googleRedirectUri,
    response_type: "code",
    scope: "openid email profile",
    state,
    code_challenge: challenge,
    code_challenge_method: "S256",
    prompt: "select_account",
  }).toString();

  return { url: url.toString(), stateToken };
}

function verifyInternalToken<T extends JwtPayload>(
  token: string,
  audience: string,
): T | undefined {
  const oauth = requireGoogleConfig();
  try {
    const payload = jwt.verify(token, oauth.jwtSecret, {
      issuer: "melobiz-api",
      audience,
      algorithms: ["HS256"],
    });
    return typeof payload === "string" ? undefined : (payload as T);
  } catch {
    return undefined;
  }
}

export async function exchangeGoogleCode(input: {
  code: string;
  state: string;
  stateToken: string;
}): Promise<GoogleProfile> {
  const oauth = requireGoogleConfig();
  const statePayload = verifyInternalToken<StatePayload>(
    input.stateToken,
    "google-oauth-state",
  );
  if (!statePayload || statePayload.state !== input.state) {
    throw new Error("Google OAuth state không hợp lệ.");
  }

  const tokenResponse = await fetch("https://oauth2.googleapis.com/token", {
    method: "POST",
    headers: { "content-type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      code: input.code,
      client_id: oauth.clientId,
      client_secret: oauth.clientSecret,
      redirect_uri: config.googleRedirectUri,
      grant_type: "authorization_code",
      code_verifier: statePayload.verifier,
    }),
  });
  const tokens = (await tokenResponse.json()) as {
    id_token?: string;
    error_description?: string;
  };
  if (!tokenResponse.ok || !tokens.id_token) {
    throw new Error(tokens.error_description ?? "Không thể đổi Google code.");
  }

  const client = new OAuth2Client(oauth.clientId);
  const ticket = await client.verifyIdToken({
    idToken: tokens.id_token,
    audience: oauth.clientId,
  });
  const payload = ticket.getPayload();
  if (
    !payload?.sub ||
    !payload.email ||
    payload.email_verified !== true
  ) {
    throw new Error("Google không xác minh được email.");
  }

  return {
    subject: payload.sub,
    email: payload.email.toLowerCase(),
    name: payload.name ?? payload.email.split("@")[0] ?? "Người dùng",
    picture: payload.picture,
  };
}

export function createOnboardingToken(identity: GoogleProfile): string {
  const oauth = requireGoogleConfig();
  return jwt.sign(identity, oauth.jwtSecret, {
    issuer: "melobiz-api",
    audience: "google-onboarding",
    expiresIn: 15 * 60,
    algorithm: "HS256",
  });
}

export function readOnboardingToken(
  token: string,
): GoogleProfile | undefined {
  const payload = verifyInternalToken<OnboardingPayload>(
    token,
    "google-onboarding",
  );
  if (!payload?.subject || !payload.email || !payload.name) return undefined;
  return {
    subject: payload.subject,
    email: payload.email,
    name: payload.name,
    picture: payload.picture,
  };
}
