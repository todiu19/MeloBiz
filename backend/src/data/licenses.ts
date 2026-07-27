export interface MusicLicense {
  code: string;
  taxCode: string;
  businessName: string;
  scope: string;
  status: "active" | "expired" | "revoked";
  validUntil: string;
}

export const licenses: MusicLicense[] = [
  {
    code: "MELO-2026-001",
    taxCode: "0101234567",
    businessName: "Công ty TNHH Cà phê Ban Mai",
    scope: "Phát công khai tại một điểm kinh doanh",
    status: "active",
    validUntil: "2027-07-27",
  },
];
