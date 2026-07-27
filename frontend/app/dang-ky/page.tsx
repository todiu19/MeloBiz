import type { Metadata } from "next";
import { AuthPanel } from "@/components/auth/AuthPanel";

export const metadata: Metadata = {
  title: "Đăng ký dùng thử | MeloBiz",
  description: "Tạo tài khoản MeloBiz và dùng thử miễn phí 14 ngày.",
};

export default function RegisterPage() {
  return <AuthPanel mode="register" />;
}
