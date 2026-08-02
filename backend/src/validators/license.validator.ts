import type { LookupLicenseDto } from "../domain/dto/license.dto.js";

export function validateLicenseLookup(
  body: unknown,
): LookupLicenseDto | undefined {
  if (typeof body !== "object" || body === null) return undefined;
  const query = (body as Record<string, unknown>).query;
  return typeof query === "string" && query.trim()
    ? { query: query.trim().toUpperCase() }
    : undefined;
}
