"use client";

import { FormEvent, useState } from "react";
import { Logo } from "@/components/layout/SiteChrome";

export function LicenseLookupPanel() {
  const [query, setQuery] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const value = query.trim();

    if (!value) {
      setMessage("Vui lòng nhập mã giấy phép hoặc mã số thuế.");
      return;
    }

    const apiUrl =
      process.env.NEXT_PUBLIC_API_URL ??
      (window.location.hostname === "localhost"
        ? "http://localhost:4000/api/v1"
        : "");

    if (!apiUrl) {
      setMessage("Bản production chưa kết nối máy chủ tra cứu.");
      return;
    }

    setLoading(true);
    setMessage("Đang kiểm tra giấy phép...");

    try {
      const response = await fetch(`${apiUrl}/licenses/lookup`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query: value }),
      });
      const result = (await response.json()) as { message?: string };
      setMessage(result.message ?? "Không thể đọc kết quả tra cứu.");
    } catch {
      setMessage("Không thể kết nối máy chủ. Hãy thử lại sau.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="license-lookup-layout">
      <div className="license-lookup-form">
        <span className="page-kicker">TRA CỨU TRỰC TUYẾN</span>
        <h2>Kiểm tra trong vài giây</h2>
        <p>Nhập mã trên giấy chứng nhận hoặc mã số thuế của doanh nghiệp.</p>
        <form onSubmit={submit}>
          <label htmlFor="license-code">Mã giấy phép / Mã số thuế</label>
          <div>
            <input
              id="license-code"
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Ví dụ: MELO-2026-001"
              value={query}
            />
            <button className="button" disabled={loading} type="submit">
              {loading ? "Đang tra..." : "Tra cứu"}
            </button>
          </div>
        </form>
        {message && <div className="license-page-result">{message}</div>}
        <small>Dữ liệu được đối chiếu trực tiếp với hệ thống MeloBiz.</small>
      </div>

      <div className="license-page-certificate">
        <div className="license-certificate-head"><Logo /><span>GIẤY CHỨNG NHẬN</span></div>
        <div className="license-certificate-seal">✓</div>
        <span className="certificate-type">QUYỀN SỬ DỤNG ÂM NHẠC</span>
        <h3>Điểm kinh doanh<br />đã được xác thực</h3>
        <dl>
          <div><dt>Phạm vi</dt><dd>Phát công khai tại điểm đăng ký</dd></div>
          <div><dt>Trạng thái</dt><dd className="valid">● Đang hiệu lực</dd></div>
          <div><dt>Mã mẫu</dt><dd>MELO-2026-001</dd></div>
        </dl>
      </div>
    </div>
  );
}
