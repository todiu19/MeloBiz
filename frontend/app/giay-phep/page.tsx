import type { Metadata } from "next";
import { LicenseLookupPanel } from "../../components/LicenseLookupPanel";
import { SiteFooter, SiteHeader } from "../../components/SiteChrome";

export const metadata: Metadata = {
  title: "Giấy phép và tra cứu | MeloBiz",
  description:
    "Tra cứu trạng thái giấy phép sử dụng âm nhạc tại điểm kinh doanh MeloBiz.",
};

export default function LicensePage() {
  return (
    <main className="license-page">
      <SiteHeader />

      <section className="content-page-hero license-page-hero">
        <div className="container content-page-hero-grid">
          <div>
            <span className="page-kicker">MINH BẠCH PHÁP LÝ</span>
            <h1>Âm nhạc hay.<br /><em>Giấy tờ rõ ràng.</em></h1>
          </div>
          <div>
            <p>Mỗi điểm kinh doanh được cấp mã riêng để chủ doanh nghiệp, nhân viên hoặc đơn vị kiểm tra có thể xác thực nhanh chóng.</p>
            <div className="pricing-reassurance">
              <span>✓ Chứng nhận theo địa điểm</span>
              <span>✓ Có lịch sử phát</span>
              <span>✓ Xuất hóa đơn VAT</span>
            </div>
          </div>
        </div>
      </section>

      <section className="license-lookup-section">
        <div className="container">
          <LicenseLookupPanel />
        </div>
      </section>

      <section className="license-scope">
        <div className="container">
          <div className="directory-head">
            <div><span className="page-kicker">PHẠM VI RÕ TỪ ĐẦU</span><h2>Mỗi điểm phát có một hồ sơ riêng</h2></div>
            <p>Thông tin sử dụng được lưu theo địa điểm để doanh nghiệp dễ quản lý khi mở rộng.</p>
          </div>
          <div className="included-grid">
            <article><span>01</span><h3>Thông tin doanh nghiệp</h3><p>Tên pháp lý, mã số thuế và người đại diện được gắn với tài khoản chủ.</p></article>
            <article><span>02</span><h3>Địa chỉ điểm phát</h3><p>Giấy chứng nhận xác định rõ nơi được phép sử dụng kho nhạc MeloBiz.</p></article>
            <article><span>03</span><h3>Thời hạn hiệu lực</h3><p>Trạng thái gói và thời gian hiệu lực được cập nhật để có thể tra cứu.</p></article>
          </div>
        </div>
      </section>

      <section className="compact-cta">
        <div className="container compact-cta-inner">
          <div><span className="page-kicker">CẦN HỒ SƠ CHO DOANH NGHIỆP?</span><h2>Bắt đầu với một điểm phát.</h2></div>
          <a className="button button-light" href="/dang-ky">Dùng thử 14 ngày <span>→</span></a>
        </div>
      </section>

      <SiteFooter />
    </main>
  );
}
