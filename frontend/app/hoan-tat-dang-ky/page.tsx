import type { Metadata } from "next";
import { GoogleOnboardingPanel } from "@/components/auth/GoogleOnboardingPanel";

export const metadata: Metadata = {
  title: "Hoàn tất đăng ký | MeloBiz",
  description: "Bổ sung thông tin doanh nghiệp sau khi xác minh email.",
};

export default function CompleteGoogleRegistrationPage() {
  return <GoogleOnboardingPanel />;
}
