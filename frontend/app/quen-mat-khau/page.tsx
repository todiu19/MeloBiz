import type { Metadata } from "next";
import { AuthPanel } from "@/components/auth/AuthPanel";

export const metadata: Metadata = {
  title: "Đăng nhập không mật khẩu | MeloBiz",
  description: "Nhận mã OTP qua email để đăng nhập MeloBiz.",
};

export default function ForgotPasswordPage() {
  return <AuthPanel mode="forgot" />;
}
