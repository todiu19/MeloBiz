import type { Metadata } from "next";
import { MusicApp } from "@/components/app/MusicApp";

export const metadata: Metadata = {
  title: "Tài khoản | MeloBiz",
  description: "Xem thông tin tài khoản và doanh nghiệp MeloBiz.",
};

export default function AccountPage() {
  return <MusicApp page="account" />;
}
