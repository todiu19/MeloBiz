/**
 * Hồ sơ kỹ thuật nhận từ Google OpenID Connect.
 * Đây không phải domain model của MeloBiz.
 */
export interface GoogleProfile {
  subject: string;
  email: string;
  name: string;
  picture?: string;
}
