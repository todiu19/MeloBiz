export interface MusicLicense {
  code: string;
  taxCode: string | null;
  businessName: string;
  locationName: string;
  scope: string;
  status: "active" | "expired" | "revoked";
  validFrom: string;
  validUntil: string;
}
