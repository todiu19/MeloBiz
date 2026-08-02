import type { MusicLicense } from "../model/license.js";

export interface LookupLicenseDto {
  query: string;
}

export type MusicLicenseResponseDto = MusicLicense;
