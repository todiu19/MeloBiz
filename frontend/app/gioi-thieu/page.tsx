import type { Metadata } from "next";
import { SiteFooter, SiteHeader } from "../../components/SiteChrome";

export const metadata: Metadata = {
  title: "Giới thiệu MeloBiz",
  description:
    "MeloBiz giúp không gian kinh doanh Việt Nam có âm nhạc phù hợp và quyền sử dụng rõ ràng.",
};

export default function AboutPage() {
  return (
    <main className="about-page">
      <SiteHeader />

      <section className="about-hero">
        <div className="container about-hero-grid">
          <div>
            <span className="page-kicker">VỀ MELOBIZ</span>
            <h1>Chúng tôi tin rằng<br /><em>không gian cũng có tiếng nói.</em></h1>
            <p>MeloBiz được xây dựng để những quán nhỏ và chuỗi kinh doanh có thể tạo bản sắc âm thanh riêng mà không phải lo về việc chọn nhạc hay giấy tờ.</p>
          </div>
          <figure>
            <img src="/images/cafe-hero-warm.png" alt="Không gian quán cà phê ấm áp sử dụng MeloBiz" />
            <figcaption><span>MELOBIZ · VIỆT NAM</span><b>Âm nhạc cho những nơi dễ mến</b></figcaption>
          </figure>
        </div>
      </section>

      <section className="about-numbers">
        <div className="container">
          <div><strong>1.200+</strong><span>bản nhạc được tuyển chọn</span></div>
          <div><strong>60+</strong><span>playlist theo không gian</span></div>
          <div><strong>200+</strong><span>điểm kinh doanh đồng hành</span></div>
          <div><strong>18</strong><span>loại hình được thiết kế riêng</span></div>
        </div>
      </section>

      <section className="about-story">
        <div className="container about-story-grid">
          <div><span className="page-kicker">VÌ SAO CHÚNG TÔI BẮT ĐẦU</span><h2>Nhạc tại quán không nên là việc làm cho có</h2></div>
          <div>
            <p>Một playlist đúng có thể khiến buổi sáng dịu hơn, cuộc trò chuyện tự nhiên hơn và thương hiệu trở nên đáng nhớ hơn.</p>
            <p>Chúng tôi kết hợp tuyển chọn âm nhạc, công cụ vận hành và hồ sơ sử dụng trong một nền tảng duy nhất để chủ doanh nghiệp có thể tập trung vào khách hàng của mình.</p>
          </div>
        </div>
      </section>

      <section className="about-values">
        <div className="container">
          <div className="directory-head"><div><span className="page-kicker">CÁCH MELOBIZ LÀM VIỆC</span><h2>Ba điều luôn được giữ lại</h2></div></div>
          <div className="included-grid">
            <article><span>♪</span><h3>Đúng cảm xúc</h3><p>Âm nhạc được chọn theo bối cảnh thật, không dùng một playlist cho tất cả.</p></article>
            <article><span>○</span><h3>Dễ vận hành</h3><p>Nhân viên chỉ cần mở lên; lịch phát và chuyển mood đã được chuẩn bị.</p></article>
            <article><span>✓</span><h3>Rõ ràng</h3><p>Chi phí, điểm phát, chứng nhận và lịch sử luôn có thể kiểm tra.</p></article>
          </div>
        </div>
      </section>

      <section className="compact-cta">
        <div className="container compact-cta-inner">
          <div><span className="page-kicker">CÙNG TẠO MỘT KHÔNG GIAN ĐÁNG NHỚ</span><h2>Bắt đầu bằng bài nhạc đầu tiên.</h2></div>
          <a className="button button-light" href="/dang-ky">Dùng thử MeloBiz <span>→</span></a>
        </div>
      </section>

      <SiteFooter />
    </main>
  );
}
