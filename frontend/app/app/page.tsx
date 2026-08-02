import type { Metadata } from "next";
import { MusicApp } from "@/components/app/MusicApp";

export const metadata: Metadata = {
  title: "MeloBiz Player",
  description: "Không gian phát và quản lý nhạc bản quyền MeloBiz.",
};

export default function PlayerPage() {
  return <MusicApp />;
}
