import type { CookieOptions, Response } from "express";
import { config } from "../config/index.js";

function baseCookieOptions(): CookieOptions {
  return {
    httpOnly: true,
    secure: config.sessionCookieSecure,
    sameSite: "lax",
    path: "/",
  };
}

export function setSessionCookie(response: Response, token: string): void {
  response.cookie(config.sessionCookieName, token, {
    ...baseCookieOptions(),
    maxAge: config.sessionDays * 24 * 60 * 60 * 1000,
  });
}

export function clearSessionCookie(response: Response): void {
  response.clearCookie(config.sessionCookieName, baseCookieOptions());
}

export function setTemporaryCookie(
  response: Response,
  name: string,
  value: string,
  maxAge: number,
): void {
  response.cookie(name, value, { ...baseCookieOptions(), maxAge });
}

export function clearTemporaryCookie(response: Response, name: string): void {
  response.clearCookie(name, baseCookieOptions());
}
