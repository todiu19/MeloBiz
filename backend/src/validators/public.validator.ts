import type { ContactRequestInput } from "../domain/dto/public.dto.js";

export function validateContactRequest(
  body: unknown,
): ContactRequestInput | undefined {
  if (typeof body !== "object" || body === null) return undefined;
  const value = body as Record<string, unknown>;
  if (
    typeof value.name !== "string" ||
    !value.name.trim() ||
    typeof value.email !== "string" ||
    !value.email.trim() ||
    typeof value.message !== "string" ||
    !value.message.trim()
  ) {
    return undefined;
  }
  return {
    name: value.name,
    email: value.email,
    message: value.message,
  };
}
