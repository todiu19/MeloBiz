import type { Metadata } from "next";
import type { CSSProperties } from "react";
import { SiteFooter, SiteHeader } from "@/components/layout/SiteChrome";
import { listIndustries } from "@/services/industries";

export const metadata: Metadata = {
  title: "Nhạc cho mọi loại hình kinh doanh | MeloBiz",
  description: "Playlist bản quyền được thiết kế riêng cho quán cà phê, nhà hàng, spa, gym, khách sạn và cửa hàng bán lẻ.",
};

export default async function IndustryIndexPage() {
  const catalog = await listIndustries();
  const featuredIndustries = catalog
    .filter((industry) => industry.featured !== false)
    .slice(0, 6);
  const moreIndustries = catalog.filter(
    (industry) =>
      !featuredIndustries.some((featured) => featured.slug === industry.slug),
  );

  return (
    <main className="industry-page">
      <SiteHeader />

      <section className="industry-index-hero">
        <div className="container industry-index-grid">
          <div>
            <span className="page-kicker">KHÔNG GIAN NÀO CŨNG CÓ NHẠC HỢP GU</span>
            <h1>Chọn đúng nhạc cho<br /><em>từng loại hình.</em></h1>
            <p>Không dùng một playlist cho tất cả. MeloBiz xây dựng nhịp âm thanh riêng theo hành vi khách hàng, khung giờ và cá tính của từng không gian.</p>
            <a className="button" href="#danh-muc">Khám phá loại hình <span>↓</span></a>
          </div>
          <figure className="industry-hero-image">
            <img src="/images/business-spaces-hero.png" alt="Không gian cà phê, nhà hàng, spa và phòng gym" />
            <figcaption><strong>{catalog.length}</strong><span>loại hình có thể<br />khám phá ngay</span></figcaption>
          </figure>
        </div>
      </section>

      <section className="industry-directory" id="danh-muc">
        <div className="container">
          <div className="directory-head">
            <div><span className="page-kicker">DANH MỤC NỔI BẬT</span><h2>Không gian của bạn là gì?</h2></div>
            <p>Chọn một loại hình để xem playlist, lịch phát và cách MeloBiz thiết kế trải nghiệm âm thanh riêng.</p>
          </div>

          <div className="industry-card-grid">
            {featuredIndustries.map((industry) => (
              <a
                className="industry-card"
                href={`/loai-hinh/${industry.slug}`}
                key={industry.slug}
                style={{ "--card-accent": industry.accent } as CSSProperties}
              >
                <div className="industry-card-top"><span>{industry.number}</span><i>↗</i></div>
                <div>
                  <small>{industry.mood}</small>
                  <h3>{industry.name}</h3>
                  <p>{industry.short}</p>
                </div>
                <ul>{industry.genres.map((genre) => <li key={genre}>{genre}</li>)}</ul>
              </a>
            ))}
          </div>

          <div className="more-industries">
            <div><span className="page-kicker">VÀ CÒN NHIỀU HƠN</span><h2>Giải pháp cho mọi điểm chạm</h2></div>
            <div className="industry-chip-grid">
              {moreIndustries.map((industry) => (
                <a href={`/loai-hinh/${industry.slug}`} key={industry.slug}>
                  <b>{industry.number}</b>
                  <span>{industry.name}</span>
                  <i>↗</i>
                </a>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="compact-cta">
        <div className="container compact-cta-inner">
          <div><span className="page-kicker">CHƯA THẤY LOẠI HÌNH CỦA BẠN?</span><h2>Để MeloBiz lên gu nhạc riêng.</h2></div>
          <a className="button button-light" href="mailto:hello@melobiz.vn">Nhận tư vấn <span>→</span></a>
        </div>
      </section>

      <SiteFooter />
    </main>
  );
}
