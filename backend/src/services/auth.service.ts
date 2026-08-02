import { randomUUID } from "node:crypto";
import jwt from "jsonwebtoken";
import { config } from "../config/index.js";
import {
  SESSION_JWT_AUDIENCE,
  SESSION_JWT_ISSUER,
} from "../constants/auth.constants.js";
import type {
  CreateGoogleUserInput,
  CreateUserInput,
  PublicUserDto,
} from "../domain/dto/auth.dto.js";
import type { User } from "../domain/model/user.js";
import type { GoogleProfile } from "../types/google-profile.js";
import * as sessionRepository from "../data/session.repository.js";
import * as userRepository from "../data/user.repository.js";
import { sha256 } from "../utils/crypto.utils.js";

export const DuplicateEmailError = userRepository.DuplicateEmailError;

function hashToken(token: string) {
  return sha256(token);
}

export function findUserByEmail(email: string): Promise<User | undefined> {
  return userRepository.findUserByEmail(email);
}

export function findOrLinkGoogleUser(
  identity: GoogleProfile,
): Promise<User | undefined> {
  return userRepository.findOrLinkGoogleUser(identity);
}

export function createGoogleUser(input: CreateGoogleUserInput): Promise<User> {
  return userRepository.createGoogleUser(input);
}

export function createUser(input: CreateUserInput): Promise<User> {
  return userRepository.createUser(input);
}

export async function createSession(userId: string): Promise<string> {
  if (!config.jwtSecret) {
    throw new Error(
      "JWT_SECRET chưa được cấu hình. Hãy cập nhật backend/.env.",
    );
  }
  const expiresInSeconds = config.sessionDays * 24 * 60 * 60;
  const token = jwt.sign({}, config.jwtSecret, {
    subject: userId,
    jwtid: randomUUID(),
    issuer: SESSION_JWT_ISSUER,
    audience: SESSION_JWT_AUDIENCE,
    expiresIn: expiresInSeconds,
    algorithm: "HS256",
  });
  await sessionRepository.createSessionRecord(
    userId,
    hashToken(token),
    expiresInSeconds,
  );
  return token;
}

export async function verifySessionToken(
  token: string,
): Promise<User | undefined> {
  if (!config.jwtSecret) return undefined;

  try {
    const payload = jwt.verify(token, config.jwtSecret, {
      issuer: SESSION_JWT_ISSUER,
      audience: SESSION_JWT_AUDIENCE,
      algorithms: ["HS256"],
    });
    if (typeof payload === "string" || typeof payload.sub !== "string") {
      return undefined;
    }
    const userId = await sessionRepository.findActiveSessionUserId(
      hashToken(token),
      payload.sub,
    );
    return userId ? userRepository.findUserById(userId) : undefined;
  } catch {
    return undefined;
  }
}

export function revokeSessionToken(token: string): Promise<void> {
  return sessionRepository.revokeSessionByTokenHash(hashToken(token));
}

export function recordLogin(userId: string): Promise<void> {
  return userRepository.recordLogin(userId);
}

export function toPublicUser(user: User): PublicUserDto {
  return {
    id: user.id,
    name: user.name,
    email: user.email,
    businessName: user.businessName,
    createdAt: user.createdAt,
  };
}
