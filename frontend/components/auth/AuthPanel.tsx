"use client";

import { FormEvent, useState } from "react";
import { Logo } from "@/components/layout/SiteChrome";

type AuthMode = "login" | "register" | "forgot";

const content = {
  login: {
    eyebrow: "CHÀO MỪNG TRỞ LẠI",
    title: "Đăng nhập vào MeloBiz",
    description: "Quản lý điểm phát, thành viên và giấy phép của doanh nghiệp.",
    submit: "Đăng nhập",
  },
  register: {
    eyebrow: "DÙNG THỬ 14 NGÀY",
    title: "Tạo tài khoản doanh nghiệp",
    description: "Thiết lập không gian đầu tiên trong vài phút. Không cần thẻ tín dụng.",
    submit: "Tạo tài khoản miễn phí",
  },
  forgot: {
    eyebrow: "KHÔI PHỤC TÀI KHOẢN",
    title: "Quên mật khẩu?",
    description: "Nhập email đã đăng ký, MeloBiz sẽ gửi hướng dẫn đặt lại mật khẩu.",
    submit: "Gửi hướng dẫn",
  },
} satisfies Record<AuthMode, {
  eyebrow: string;
  title: string;
  description: string;
  submit: string;
}>;

export function AuthPanel({ mode }: { mode: AuthMode }) {
  const [form, setForm] = useState({
    name: "",
    businessName: "",
    email: mode === "login" ? "demo@melobiz.vn" : "",
    password: mode === "login" ? "Demo@123" : "",
  });
  const [message, setMessage] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const pageContent = content[mode];

  function updateField(field: keyof typeof form, value: string) {
    setForm((current) => ({ ...current, [field]: value }));
  }

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus("loading");
    setMessage("Đang xử lý...");

    const apiUrl =
      process.env.NEXT_PUBLIC_API_URL ??
      (window.location.hostname === "localhost"
        ? "http://localhost:4000/api/v1"
        : "");

    if (!apiUrl) {
      setStatus("error");
      setMessage("Bản production chưa được kết nối backend.");
      return;
    }

    const endpoint =
      mode === "login"
        ? "login"
        : mode === "register"
          ? "register"
          : "forgot-password";

    const payload =
      mode === "login"
        ? { email: form.email, password: form.password }
        : mode === "register"
          ? form
          : { email: form.email };

    try {
      const response = await fetch(`${apiUrl}/auth/${endpoint}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const result = (await response.json()) as {
        message?: string;
        data?: { token?: string };
      };

      if (!response.ok) {
        setStatus("error");
        setMessage(result.message ?? "Không thể xử lý yêu cầu.");
        return;
      }

      if (result.data?.token) {
        window.localStorage.setItem("melobiz_token", result.data.token);
      }

      setStatus("success");
      setMessage(result.message ?? "Thao tác thành công.");

      if (mode !== "forgot") {
        window.setTimeout(() => {
          window.location.href = "/";
        }, 900);
      }
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

          <form className="auth-form" onSubmit={submit}>
            {mode === "register" && (
              <div className="auth-row">
                <label>
                  <span>Họ và tên</span>
                  <input
                    autoComplete="name"
                    onChange={(event) => updateField("name", event.target.value)}
                    placeholder="Nguyễn Minh Anh"
                    required
                    value={form.name}
                  />
                </label>
                <label>
                  <span>Tên doanh nghiệp</span>
                  <input
                    onChange={(event) => updateField("businessName", event.target.value)}
                    placeholder="Cà phê Ban Mai"
                    required
                    value={form.businessName}
                  />
                </label>
              </div>
            )}

            <label>
              <span>Email</span>
              <input
                autoComplete="email"
                onChange={(event) => updateField("email", event.target.value)}
                placeholder="ban@doanhnghiep.vn"
                required
                type="email"
                value={form.email}
              />
            </label>

            {mode !== "forgot" && (
              <label>
                <span>Mật khẩu</span>
                <input
                  autoComplete={mode === "login" ? "current-password" : "new-password"}
                  minLength={8}
                  onChange={(event) => updateField("password", event.target.value)}
                  placeholder="Tối thiểu 8 ký tự"
                  required
                  type="password"
                  value={form.password}
                />
              </label>
            )}

            {mode === "login" && (
              <div className="auth-options">
                <label><input type="checkbox" /> Ghi nhớ đăng nhập</label>
                <a href="/quen-mat-khau">Quên mật khẩu?</a>
              </div>
            )}

            {mode === "register" && (
              <label className="auth-terms">
                <input required type="checkbox" />
                <span>Tôi đồng ý với <a>Điều khoản sử dụng</a> và <a>Chính sách bảo mật</a>.</span>
              </label>
            )}

            <button className="button auth-submit" disabled={status === "loading"} type="submit">
              {status === "loading" ? "Đang xử lý..." : pageContent.submit}
              <span>→</span>
            </button>

            {message && <div className={`auth-message ${status}`}>{message}</div>}
          </form>

          {mode === "login" && (
            <>
              <div className="demo-account"><span>TÀI KHOẢN DEMO</span><b>demo@melobiz.vn</b><i>Demo@123</i></div>
              <p className="auth-switch">Chưa có tài khoản? <a href="/dang-ky">Dùng thử miễn phí</a></p>
            </>
          )}
          {mode === "register" && <p className="auth-switch">Đã có tài khoản? <a href="/dang-nhap">Đăng nhập</a></p>}
          {mode === "forgot" && <p className="auth-switch">Đã nhớ mật khẩu? <a href="/dang-nhap">Quay lại đăng nhập</a></p>}
        </div>
      </section>
    </main>
  );
}
