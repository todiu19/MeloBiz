import {
  randomBytes,
  randomUUID,
  scryptSync,
  timingSafeEqual,
} from "node:crypto";

export interface User {
  id: string;
  name: string;
  email: string;
  businessName: string;
  passwordHash: string;
  createdAt: string;
}

const users = new Map<string, User>();
const sessions = new Map<string, string>();

function normalizeEmail(email: string) {
  return email.trim().toLowerCase();
}

export function hashPassword(password: string) {
  const salt = randomBytes(16).toString("hex");
  const hash = scryptSync(password, salt, 64).toString("hex");
  return `${salt}:${hash}`;
}

export function verifyPassword(password: string, storedHash: string) {
  const [salt, hash] = storedHash.split(":");
  if (!salt || !hash) return false;

  const candidate = scryptSync(password, salt, 64);
  const expected = Buffer.from(hash, "hex");
  return candidate.length === expected.length && timingSafeEqual(candidate, expected);
}

export function findUserByEmail(email: string) {
  return users.get(normalizeEmail(email));
}

export function createUser(input: {
  name: string;
  email: string;
  businessName: string;
  password: string;
}) {
  const email = normalizeEmail(input.email);
  const user: User = {
    id: randomUUID(),
    name: input.name.trim(),
    email,
    businessName: input.businessName.trim(),
    passwordHash: hashPassword(input.password),
    createdAt: new Date().toISOString(),
  };
  users.set(email, user);
  return user;
}

export function createSession(userId: string) {
  const token = randomBytes(32).toString("hex");
  sessions.set(token, userId);
  return token;
}

export function toPublicUser(user: User) {
  return {
    id: user.id,
    name: user.name,
    email: user.email,
    businessName: user.businessName,
    createdAt: user.createdAt,
  };
}

createUser({
  name: "MeloBiz Demo",
  email: "demo@melobiz.vn",
  businessName: "Cà phê Ban Mai",
  password: "Demo@123",
});
