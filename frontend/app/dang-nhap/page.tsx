import type { Metadata } from "next";
import { AuthPanel } from "../../components/AuthPanel";

export const metadata: Metadata = {
  title: "Đăng nhập | MeloBiz",
  description: "Đăng nhập cổng quản lý nhạc bản quyền MeloBiz.",
};

export default function LoginPage() {
  return <AuthPanel mode="login" />;
}
