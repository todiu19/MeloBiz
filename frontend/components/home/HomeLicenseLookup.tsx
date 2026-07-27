"use client";

import { FormEvent, useState } from "react";
import { Logo } from "@/components/layout/SiteChrome";

export function HomeLicenseLookup() {
  const [query, setQuery] = useState("");
  const [message, setMessage] = useState("");

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const normalizedQuery = query.trim();

    if (!normalizedQuery) {
      setMessage("Vui lòng nhập mã giấy phép hoặc mã số thuế.");
      return;
    }

    const apiUrl =
      process.env.NEXT_PUBLIC_API_URL ??
      (window.location.hostname === "localhost"
        ? "http://localhost:4000/api/v1"
        : "");

    if (!apiUrl) {
      setMessage("Bản website demo chưa kết nối API production.");
      return;
    }

    setMessage("Đang kiểm tra giấy phép...");

    try {
      const response = await fetch(`${apiUrl}/licenses/lookup`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query: normalizedQuery }),
      });
      const result = (await response.json()) as { message?: string };
      setMessage(result.message ?? "Không thể đọc kết quả tra cứu.");
    } catch {
      setMessage("Không thể kết nối máy chủ. Hãy kiểm tra backend đang chạy.");
    }
  }

  return (
    <div className="container license-grid">
      <div>
        <span className="mini-label">MINH BẠCH & DỄ KIỂM TRA</span>
        <h2>Tra cứu giấy phép</h2>
        <p>
          Nhập mã giấy phép hoặc mã số thuế để kiểm tra trạng thái sử dụng
          nhạc của doanh nghiệp.
        </p>
        <form onSubmit={handleSubmit}>
          <input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Ví dụ: MELO-2026-001"
            aria-label="Mã giấy phép"
          />
          <button className="button" type="submit">
            Tra cứu
          </button>
        </form>
        {message && <div className="lookup-result">{message}</div>}
      </div>
      <div className="certificate">
        <div className="cert-head">
          <Logo />
          <span>GIẤY CHỨNG NHẬN</span>
        </div>
        <div className="seal">✓</div>
        <h3>Giấy phép sử dụng âm nhạc</h3>
        <p>
          Cấp cho: <b>Doanh nghiệp của bạn</b>
        </p>
        <dl>
          <div>
            <dt>Phạm vi</dt>
            <dd>Phát công khai tại điểm kinh doanh</dd>
          </div>
          <div>
            <dt>Trạng thái</dt>
            <dd className="valid">● Đang hiệu lực</dd>
          </div>
          <div>
            <dt>Mã giấy phép</dt>
            <dd>MELO-2026-001</dd>
          </div>
        </dl>
      </div>
    </div>
  );
}
