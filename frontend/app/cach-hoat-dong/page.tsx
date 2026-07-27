import type { Metadata } from "next";
import { SiteFooter, SiteHeader } from "@/components/layout/SiteChrome";

export const metadata: Metadata = {
  title: "Cách MeloBiz hoạt động",
  description:
    "Tạo tài khoản, chọn playlist và lên lịch phát nhạc bản quyền cho điểm kinh doanh.",
};

const steps = [
  {
    number: "01",
    title: "Tạo không gian",
    description:
      "Đăng ký doanh nghiệp, thêm địa điểm và chọn loại hình phù hợp.",
    note: "Khoảng 1 phút",
  },
  {
    number: "02",
    title: "Chọn chất nhạc",
    description:
      "MeloBiz gợi ý playlist theo hành vi khách, mood và khung giờ.",
    note: "Không cần tự xếp bài",
  },
  {
    number: "03",
    title: "Lên lịch phát",
    description:
      "Chọn lịch một lần để nhạc tự chuyển theo nhịp vận hành mỗi ngày.",
    note: "Tự động 24/7",
  },
  {
    number: "04",
    title: "Quản lý tập trung",
    description:
      "Theo dõi điểm phát, thành viên, lịch sử và giấy phép tại một nơi.",
    note: "Dễ mở rộng chi nhánh",
  },
];

export default function HowItWorksPage() {
  return (
    <main className="process-page">
      <SiteHeader />

      <section className="content-page-hero">
        <div className="container content-page-hero-grid">
          <div>
            <span className="page-kicker">CÁCH MELOBIZ HOẠT ĐỘNG</span>
            <h1>Từ mở cửa đến đóng cửa,<br /><em>nhạc luôn đúng nhịp.</em></h1>
          </div>
          <div>
            <p>Thiết lập một lần, MeloBiz chăm phần còn lại. Nhân viên không cần chọn từng bài và chủ doanh nghiệp vẫn kiểm soát được mọi điểm phát.</p>
            <a className="button" href="/dang-ky">Tạo không gian đầu tiên <span>→</span></a>
          </div>
        </div>
      </section>

      <section className="process-steps-page">
        <div className="container">
          <div className="directory-head">
            <div><span className="page-kicker">BỐN BƯỚC GỌN GÀNG</span><h2>Không cần biết nhiều về âm nhạc</h2></div>
            <p>Mọi bước được thiết kế để đội ngũ tại quán có thể bắt đầu mà không cần đào tạo phức tạp.</p>
          </div>
          <div className="process-step-list">
            {steps.map((step) => (
              <article key={step.number}>
                <span>{step.number}</span>
                <div><small>{step.note}</small><h3>{step.title}</h3><p>{step.description}</p></div>
                <i>↗</i>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="process-day">
        <div className="container process-day-grid">
          <div>
            <span className="page-kicker">MỘT NGÀY CÓ NHẠC</span>
            <h2>Mỗi thời điểm,<br />một mức năng lượng</h2>
            <p>Playlist thay đổi êm theo lịch, không tạo khoảng lặng và không có quảng cáo chen ngang.</p>
          </div>
          <div className="process-day-console">
            <div className="day-console-head"><span>QUÁN CÀ PHÊ · QUẬN 1</span><b>● ONLINE</b></div>
            <div className="day-row active"><time>07:00</time><i>♪</i><div><small>MỞ CỬA</small><strong>Morning Drip</strong></div><span>Đang phát</span></div>
            <div className="day-row"><time>11:30</time><i>♪</i><div><small>GIỜ TRƯA</small><strong>Slow Afternoon</strong></div><span>Tự chuyển</span></div>
            <div className="day-row"><time>18:00</time><i>♪</i><div><small>BUỔI TỐI</small><strong>After Six</strong></div><span>Tự chuyển</span></div>
          </div>
        </div>
      </section>

      <section className="process-control">
        <div className="container">
          <div className="directory-head">
            <div><span className="page-kicker">KIỂM SOÁT MÀ KHÔNG NẶNG VIỆC</span><h2>Một bảng điều khiển cho mọi chi nhánh</h2></div>
          </div>
          <div className="control-grid">
            <article><b>12</b><h3>Điểm phát</h3><p>Xem trạng thái online và playlist đang chạy tại từng địa điểm.</p></article>
            <article><b>28</b><h3>Thành viên</h3><p>Phân quyền chủ doanh nghiệp, quản lý vùng và nhân viên tại quán.</p></article>
            <article><b>100%</b><h3>Lịch sử rõ ràng</h3><p>Lưu lịch phát và giấy chứng nhận để kiểm tra khi cần.</p></article>
          </div>
        </div>
      </section>

      <section className="compact-cta">
        <div className="container compact-cta-inner">
          <div><span className="page-kicker">SẴN SÀNG TRONG VÀI PHÚT</span><h2>Để không gian tự chạy đúng nhịp.</h2></div>
          <a className="button button-light" href="/dang-ky">Dùng thử miễn phí <span>→</span></a>
        </div>
      </section>

      <SiteFooter />
    </main>
  );
}
