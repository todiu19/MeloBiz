import type { MusicLicenseResponseDto } from "../domain/dto/license.dto.js";
import { findLicense as findLicenseRecord } from "../data/license.repository.js";

export function findLicense(
  lookupValue: string,
): Promise<MusicLicenseResponseDto | undefined> {
  return findLicenseRecord(lookupValue);
}
