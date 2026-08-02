"use client";

import { FormEvent, useEffect, useState } from "react";
import { Logo } from "@/components/layout/SiteChrome";

const apiUrl =
  process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:4000/api/v1";

export function GoogleOnboardingPanel() {
  const [source, setSource] = useState<"google" | "email">("google");
  const [profile, setProfile] = useState({ email: "", name: "" });
  const [form, setForm] = useState({ name: "", businessName: "" });
  const [message, setMessage] = useState("Đang đọc thông tin xác minh...");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const selected =
      new URLSearchParams(window.location.search).get("source") === "email"
        ? "email"
        : "google";
    setSource(selected);
    void fetch(`${apiUrl}/auth/${selected}/onboarding`, {
      credentials: "include",
    })
      .then(async (response) => {
        const result = await response.json() as {
          message?: string;
          data?: { email: string; name: string };
        };
        if (!response.ok || !result.data) {
          throw new Error(result.message ?? "Phiên xác minh đã hết hạn.");
        }
        setProfile(result.data);
        setForm((current) => ({ ...current, name: result.data!.name }));
        setMessage("");
      })
      .catch((error: Error) => setMessage(error.message))
      .finally(() => setLoading(false));
  }, []);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setMessage("Đang tạo tài khoản...");
    try {
      const response = await fetch(`${apiUrl}/auth/${source}/complete`, {
        method: "POST",
        credentials: "include",
        headers: { "content-type": "application/json" },
        body: JSON.stringify(form),
      });
      const result = await response.json() as { message?: string };
      if (!response.ok) throw new Error(result.message ?? "Không thể tạo tài khoản.");
      window.location.href = "/app";
    } catch (error) {
      setMessage((error as Error).message);
      setLoading(false);
    }
  }

  return (
    <main className="auth-page onboarding-page">
      <section className="auth-visual">
        <div className="auth-visual-top"><Logo /><a href="/">← Trang chủ</a></div>
        <div className="auth-visual-copy">
          <span>CHỈ CÒN MỘT BƯỚC</span>
          <blockquote>Hoàn tất hồ sơ để bắt đầu không gian âm nhạc của bạn.</blockquote>
        </div>
      </section>
      <section className="auth-form-side">
        <div className="auth-form-wrap">
          <span className="page-kicker">HOÀN TẤT ĐĂNG KÝ</span>
          <h1>Thông tin doanh nghiệp</h1>
          <p>Email đã được xác minh. MeloBiz không lưu hay yêu cầu mật khẩu.</p>
          <form className="auth-form" onSubmit={submit}>
            <label><span>Email</span><input disabled value={profile.email} /></label>
            <label><span>Họ và tên</span><input required value={form.name} onChange={(e) => setForm({...form, name:e.target.value})} /></label>
            <label><span>Tên doanh nghiệp</span><input required value={form.businessName} onChange={(e) => setForm({...form, businessName:e.target.value})} /></label>
            <button className="button auth-submit" disabled={loading} type="submit">Hoàn tất tài khoản <span>→</span></button>
            {message && <div className="auth-message">{message}</div>}
          </form>
        </div>
      </section>
    </main>
  );
}
