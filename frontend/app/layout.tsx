import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "MeloBiz — Không gian đúng gu, âm nhạc đúng luật",
  description:
    "Nền tảng nhạc bản quyền cho quán cà phê, nhà hàng, spa và chuỗi cửa hàng tại Việt Nam.",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="vi">
      <body>{children}</body>
    </html>
  );
}
