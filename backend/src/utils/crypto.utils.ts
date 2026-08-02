import { createHash, createHmac, randomInt } from "node:crypto";

export function sha256(value: string): string {
  return createHash("sha256").update(value).digest("hex");
}

export function hmacSha256(secret: string, value: string): string {
  return createHmac("sha256", secret).update(value).digest("hex");
}

export function generateNumericOtp(length = 6): string {
  const ceiling = 10 ** length;
  return randomInt(0, ceiling).toString().padStart(length, "0");
}
