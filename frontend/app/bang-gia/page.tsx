import type { Metadata } from "next";
import { SiteFooter, SiteHeader } from "@/components/layout/SiteChrome";

export const metadata: Metadata = {
  title: "Bảng giá nhạc bản quyền | MeloBiz",
  description:
    "Bảng giá MeloBiz cho quán cà phê, nhà hàng, spa và chuỗi kinh doanh. Dùng thử miễn phí 14 ngày.",
};

const includedFeatures = [
  "Kho nhạc bản quyền không giới hạn",
  "Playlist theo loại hình và khung giờ",
  "Lên lịch phát nhạc tự động",
  "Giấy chứng nhận cho điểm kinh doanh",
  "Hóa đơn VAT và lịch sử phát",
  "Thêm thành viên cùng quản lý",
];

const pricingFaqs = [
  {
    question: "199.000₫ áp dụng cho bao nhiêu địa điểm?",
    answer:
      "Mức giá áp dụng cho một điểm phát trong một tháng. Mỗi địa điểm có giấy chứng nhận và lịch phát riêng.",
  },
  {
    question: "Có cần nhập thẻ khi dùng thử không?",
    answer:
      "Không. Bạn có 14 ngày trải nghiệm toàn bộ tính năng trước khi lựa chọn thanh toán.",
  },
  {
    question: "Chuỗi nhiều chi nhánh có mức giá riêng không?",
    answer:
      "Có. MeloBiz có chính sách theo số lượng điểm phát và hỗ trợ thiết lập tập trung cho chuỗi.",
  },
  {
    question: "Có thể dừng gói bất cứ lúc nào không?",
    answer:
      "Có. Gói theo tháng không có phí ẩn; quyền phát nhạc được duy trì đến cuối chu kỳ đã thanh toán.",
  },
];

export default function PricingPage() {
  return (
    <main className="pricing-page">
      <SiteHeader />

      <section className="pricing-page-hero">
        <div className="container pricing-page-heading">
          <div>
            <span className="page-kicker">BẢNG GIÁ MELOBIZ</span>
            <h1>Giá gọn gàng.<br /><em>Mở nhạc thật nhẹ đầu.</em></h1>
          </div>
          <div>
            <p>Một gói đầy đủ cho mỗi điểm kinh doanh. Không phí ẩn, không cần thẻ khi dùng thử và có chứng từ rõ ràng.</p>
            <div className="pricing-reassurance">
              <span>✓ 14 ngày miễn phí</span>
              <span>✓ Hủy bất cứ lúc nào</span>
              <span>✓ Xuất hóa đơn VAT</span>
            </div>
          </div>
        </div>
      </section>

      <section className="pricing-page-plans">
        <div className="container plan-layout">
          <article className="main-plan">
            <div className="plan-badge">PHÙ HỢP NHẤT CHO QUÁN ĐỘC LẬP</div>
            <div className="plan-heading">
              <div><span>MeloBiz</span><h2>Pro</h2></div>
              <small>01 điểm phát</small>
            </div>
            <p className="plan-description">Đủ kho nhạc, lịch phát và giấy phép để không gian vận hành mỗi ngày.</p>
            <div className="plan-price"><strong>199.000₫</strong><span>/ tháng<br />/ điểm phát</span></div>
            <p className="plan-vat">Giá chưa bao gồm VAT</p>
            <ul>{includedFeatures.map((feature) => <li key={feature}><i>✓</i>{feature}</li>)}</ul>
            <a className="button full" href="/dang-ky">Dùng thử 14 ngày <span>→</span></a>
            <small className="plan-footnote">Không cần thẻ tín dụng · Thiết lập trong vài phút</small>
          </article>

          <aside className="chain-plan">
            <div>
              <span className="page-kicker">CHO CHUỖI & THƯƠNG HIỆU</span>
              <h2>Nhiều điểm phát,<br />một nơi quản lý.</h2>
              <p>Mức giá linh hoạt theo số lượng chi nhánh, kèm hỗ trợ lên mood nhạc và triển khai tập trung.</p>
            </div>
            <div className="chain-features">
              <div><b>01</b><span>Quản lý tập trung toàn chuỗi</span></div>
              <div><b>02</b><span>Phân quyền cho từng chi nhánh</span></div>
              <div><b>03</b><span>Playlist theo nhận diện thương hiệu</span></div>
              <div><b>04</b><span>Đối soát và hóa đơn tổng hợp</span></div>
            </div>
            <a href="mailto:hello@melobiz.vn">Nhận báo giá cho chuỗi <span>↗</span></a>
          </aside>
        </div>
      </section>

      <section className="pricing-included">
        <div className="container">
          <div className="directory-head">
            <div><span className="page-kicker">MỌI THỨ ĐÃ BAO GỒM</span><h2>Không có tính năng bị giấu sau gói cao hơn</h2></div>
            <p>Mọi điểm phát đều dùng cùng một bộ tính năng. Chi phí chỉ tăng khi doanh nghiệp thêm địa điểm mới.</p>
          </div>
          <div className="included-grid">
            <article><span>♪</span><h3>Nhạc tuyển chọn</h3><p>Playlist được biên tập theo không gian, năng lượng và thời điểm trong ngày.</p></article>
            <article><span>◷</span><h3>Lịch phát tự động</h3><p>Thiết lập một lần, MeloBiz tự đổi playlist theo đúng nhịp vận hành.</p></article>
            <article><span>✓</span><h3>An tâm pháp lý</h3><p>Giấy chứng nhận, lịch sử phát và chứng từ được lưu tập trung.</p></article>
          </div>
        </div>
      </section>

      <section className="pricing-faq">
        <div className="container pricing-faq-layout">
          <div>
            <span className="page-kicker">CÂU HỎI VỀ CHI PHÍ</span>
            <h2>Rõ ràng trước khi bắt đầu</h2>
            <p>Cần tư vấn theo số lượng chi nhánh? <a href="mailto:hello@melobiz.vn">Liên hệ MeloBiz →</a></p>
          </div>
          <div>
            {pricingFaqs.map((faq, index) => (
              <details key={faq.question} open={index === 0}>
                <summary>{faq.question}<i>+</i></summary>
                <p>{faq.answer}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      <section className="compact-cta">
        <div className="container compact-cta-inner">
          <div><span className="page-kicker">BẬT NHẠC TRONG VÀI PHÚT</span><h2>Dùng thử trước, quyết định sau.</h2></div>
          <a className="button button-light" href="/dang-ky">Bắt đầu miễn phí <span>→</span></a>
        </div>
      </section>

      <SiteFooter />
    </main>
  );
}
