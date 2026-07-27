import type { Metadata } from "next";
import { AuthPanel } from "../../components/AuthPanel";

export const metadata: Metadata = {
  title: "Quên mật khẩu | MeloBiz",
  description: "Khôi phục mật khẩu tài khoản MeloBiz.",
};

export default function ForgotPasswordPage() {
  return <AuthPanel mode="forgot" />;
}
