"use client";

import { FormEvent, useEffect, useState } from "react";
import { Logo } from "@/components/layout/SiteChrome";

type AuthMode = "login" | "register" | "forgot";

const content = {
  login: {
    eyebrow: "CHÀO MỪNG TRỞ LẠI",
    title: "Đăng nhập vào MeloBiz",
    description: "Dùng Google hoặc mã OTP được gửi tới email của bạn.",
  },
  register: {
    eyebrow: "DÙNG THỬ 14 NGÀY",
    title: "Tạo tài khoản doanh nghiệp",
    description: "Xác minh email bằng OTP, sau đó hoàn tất thông tin doanh nghiệp.",
  },
  forgot: {
    eyebrow: "ĐĂNG NHẬP KHÔNG MẬT KHẨU",
    title: "Không cần đặt lại mật khẩu",
    description: "MeloBiz không lưu mật khẩu. Hãy nhập email để nhận mã OTP.",
  },
} satisfies Record<AuthMode, {
  eyebrow: string;
  title: string;
  description: string;
}>;

export function AuthPanel({ mode }: { mode: AuthMode }) {
  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [message, setMessage] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const pageContent = content[mode];
  const apiUrl =
    process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:4000/api/v1";
  const googleUrl = `${apiUrl}/auth/google`;

  useEffect(() => {
    const oauthError = new URLSearchParams(window.location.search).get(
      "oauth_error",
    );
    if (!oauthError) return;
    setStatus("error");
    setMessage(
      oauthError === "not_configured"
        ? "Đăng nhập Google chưa được cấu hình trên máy chủ."
        : "Không thể xác thực với Google. Vui lòng thử lại.",
    );
  }, []);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus("loading");
    setMessage(otpSent ? "Đang xác minh mã..." : "Đang gửi mã OTP...");

    try {
      const endpoint = otpSent ? "verify-otp" : "request-otp";
      const response = await fetch(`${apiUrl}/auth/email/${endpoint}`, {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(otpSent ? { email, code } : { email }),
      });
      const result = (await response.json()) as {
        message?: string;
        data?: { requiresOnboarding?: boolean };
      };
      if (!response.ok) {
        setStatus("error");
        setMessage(result.message ?? "Không thể xử lý yêu cầu.");
        return;
      }

      setStatus("success");
      setMessage(result.message ?? "Thao tác thành công.");
      if (!otpSent) {
        setOtpSent(true);
        return;
      }
      window.location.href = result.data?.requiresOnboarding
        ? "/hoan-tat-dang-ky?source=email"
        : "/app";
    } catch {
      setStatus("error");
      setMessage("Không thể kết nối backend. Hãy kiểm tra cổng 4000.");
    }
  }

  return (
    <main className="auth-page">
      <section className="auth-visual">
        <div className="auth-visual-top">
          <Logo />
          <a href="/">← Về trang chủ</a>
        </div>
        <div className="auth-visual-copy">
          <span>MELOBIZ FOR BUSINESS</span>
          <blockquote>“Một không gian đáng nhớ luôn có âm thanh của riêng mình.”</blockquote>
          <div className="auth-proof">
            <div><strong>1.200+</strong><small>bản nhạc cấp phép</small></div>
            <div><strong>200+</strong><small>không gian tin dùng</small></div>
          </div>
        </div>
        <div className="auth-record" aria-hidden="true"><i /><span>MB</span></div>
      </section>

      <section className="auth-form-side">
        <div className="auth-mobile-logo"><Logo /><a href="/">×</a></div>
        <div className="auth-form-wrap">
          <span className="page-kicker">{pageContent.eyebrow}</span>
          <h1>{pageContent.title}</h1>
          <p>{pageContent.description}</p>

          <a className="google-auth-button" href={googleUrl}>
            <b>G</b>
            Tiếp tục với Google
          </a>
          <div className="auth-divider"><span>hoặc dùng email</span></div>

          <form className="auth-form" onSubmit={submit}>
            <label>
              <span>Email</span>
              <input
                autoComplete="email"
                disabled={otpSent}
                onChange={(event) => setEmail(event.target.value)}
                placeholder="ban@doanhnghiep.vn"
                required
                type="email"
                value={email}
              />
            </label>

            {otpSent && (
              <label>
                <span>Mã OTP 6 chữ số</span>
                <input
                  autoComplete="one-time-code"
                  inputMode="numeric"
                  maxLength={6}
                  minLength={6}
                  onChange={(event) => setCode(event.target.value.replace(/\D/g, ""))}
                  pattern="\d{6}"
                  placeholder="000000"
                  required
                  value={code}
                />
              </label>
            )}

            <button className="button auth-submit" disabled={status === "loading"} type="submit">
              {status === "loading"
                ? "Đang xử lý..."
                : otpSent
                  ? "Xác minh và đăng nhập"
                  : "Gửi mã OTP"}
              <span>→</span>
            </button>

            {otpSent && status !== "loading" && (
              <button
                className="google-auth-button"
                onClick={() => {
                  setOtpSent(false);
                  setCode("");
                  setMessage("");
                  setStatus("idle");
                }}
                type="button"
              >
                Đổi email
              </button>
            )}
            {message && <div className={`auth-message ${status}`}>{message}</div>}
          </form>

          {mode === "login" && <p className="auth-switch">Chưa có tài khoản? <a href="/dang-ky">Dùng thử miễn phí</a></p>}
          {mode !== "login" && <p className="auth-switch">Đã có tài khoản? <a href="/dang-nhap">Đăng nhập</a></p>}
        </div>
      </section>
    </main>
  );
}
