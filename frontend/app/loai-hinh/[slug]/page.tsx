import type { CSSProperties } from "react";
import { notFound } from "next/navigation";
import { SiteFooter, SiteHeader } from "../../../components/SiteChrome";
import { getIndustry, industries } from "../../../data/industries";

export function generateStaticParams() {
  return industries.map(({ slug }) => ({ slug }));
}

export default async function IndustryDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const industry = getIndustry(slug);
  if (!industry) notFound();

  const related = industries.filter((item) => item.slug !== industry.slug).slice(0, 3);
  const pageStyle = { "--industry-accent": industry.accent } as CSSProperties;

  return (
    <main className="industry-detail-page" style={pageStyle}>
      <SiteHeader />

      <section className="detail-hero">
        <div className="container">
          <div className="breadcrumb"><a href="/">Trang chủ</a><span>/</span><a href="/loai-hinh">Loại hình</a><span>/</span><b>{industry.name}</b></div>
          <div className="detail-hero-grid">
            <div className="detail-copy">
              <span className="page-kicker">MELOBIZ CHO {industry.name.toUpperCase()}</span>
              <h1>{industry.title}</h1>
              <p>{industry.description}</p>
              <div className="detail-actions"><a className="button" href="/#dung-thu">Dùng thử 14 ngày <span>→</span></a><a href="#playlist">Xem playlist ↓</a></div>
              <ul className="genre-pills">{industry.genres.map((genre) => <li key={genre}>{genre}</li>)}</ul>
            </div>
            <div className="sound-console">
              <div className="console-head"><span>LIVE MOOD</span><b>{industry.mood}</b><i>● ONLINE</i></div>
              <div className="console-cover"><span>{industry.number}</span><div><small>ĐANG PHÁT</small><h3>{industry.playlists[0].name}</h3><p>{industry.playlists[0].mood} · MeloBiz Selects</p></div></div>
              <div className="console-wave">{Array.from({ length: 38 }).map((_, index) => <i key={index} style={{ height: `${14 + ((index * 19) % 52)}px` }} />)}</div>
              <div className="console-player"><button>‹</button><button className="console-play">Ⅱ</button><button>›</button><span><i /></span><small>02:18</small></div>
            </div>
          </div>
        </div>
      </section>

      <section className="detail-proof">
        <div className="container">
          <div><strong>60+</strong><span>playlist được biên tập</span></div>
          <div><strong>24/7</strong><span>phát nhạc liền mạch</span></div>
          <div><strong>100%</strong><span>quyền sử dụng rõ ràng</span></div>
        </div>
      </section>

      <section className="playlist-section" id="playlist">
        <div className="container">
          <div className="directory-head">
            <div><span className="page-kicker">PLAYLIST GỢI Ý</span><h2>Đúng nhịp, đúng thời điểm</h2></div>
            <p>Ba lớp năng lượng chính được thiết kế để nhân viên chỉ cần chọn và phát.</p>
          </div>
          <div className="playlist-cards">
            {industry.playlists.map((playlist, index) => (
              <article key={playlist.name}>
                <div className={`playlist-art art-${index + 1}`}><span>{String(index + 1).padStart(2, "0")}</span><i>▶</i></div>
                <small>{playlist.mood}</small>
                <h3>{playlist.name}</h3>
                <p>{playlist.tracks} bài · Cập nhật hàng tháng</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="sound-schedule">
        <div className="container schedule-grid">
          <div>
            <span className="page-kicker">MỘT NGÀY CÓ NHẠC</span>
            <h2>Lịch phát tự động theo nhịp vận hành</h2>
            <p>Mỗi khung giờ mang một mức năng lượng khác nhau. Lên lịch một lần, MeloBiz tự chuyển playlist đúng lúc.</p>
          </div>
          <div className="timeline">
            {industry.schedule.map((item, index) => (
              <article key={item.time}><time>{item.time}</time><i>{index + 1}</i><div><small>{item.label}</small><h3>{item.sound}</h3></div></article>
            ))}
          </div>
        </div>
      </section>

      <section className="industry-benefits">
        <div className="container benefits-grid">
          <div><span className="page-kicker">ĐƯỢC THIẾT KẾ CHO {industry.name.toUpperCase()}</span><h2>Không chỉ là một danh sách nhạc</h2></div>
          <div>{industry.benefits.map((benefit, index) => <article key={benefit}><span>0{index + 1}</span><h3>{benefit}</h3><p>Được thiết lập sẵn để đội ngũ vận hành dễ dùng và trải nghiệm khách hàng luôn nhất quán.</p></article>)}</div>
        </div>
      </section>

      <section className="detail-faq">
        <div className="container">
          <div className="detail-faq-head">
            <span className="page-kicker">CÂU HỎI THƯỜNG GẶP</span>
            <h2>Điều bạn cần biết trước khi bật nhạc</h2>
          </div>
          <div>
            <details open><summary>Gói nhạc có bao gồm quyền phát tại {industry.name.toLowerCase()} không?<i>+</i></summary><p>Có. Giấy phép được cấp cho điểm kinh doanh đã đăng ký và có thể tra cứu công khai theo mã.</p></details>
            <details><summary>Có thể thay đổi playlist theo khung giờ không?<i>+</i></summary><p>Có. Bạn có thể chọn thủ công hoặc lên lịch tự động cho từng thời điểm trong ngày.</p></details>
            <details><summary>Một tài khoản quản lý được nhiều chi nhánh không?<i>+</i></summary><p>Có. Chủ doanh nghiệp quản lý tập trung các điểm phát, thành viên và lịch sử phát.</p></details>
          </div>
        </div>
      </section>

      <section className="related-industries">
        <div className="container">
          <div className="directory-head"><div><span className="page-kicker">KHÁM PHÁ THÊM</span><h2>Giải pháp cho loại hình khác</h2></div></div>
          <div className="related-grid">{related.map((item) => <a href={`/loai-hinh/${item.slug}`} key={item.slug}><span>{item.number}</span><h3>{item.name}</h3><p>{item.short}</p><i>↗</i></a>)}</div>
        </div>
      </section>

      <section className="compact-cta">
        <div className="container compact-cta-inner">
          <div><span className="page-kicker">BẮT ĐẦU TRONG VÀI PHÚT</span><h2>Cho {industry.name.toLowerCase()} một chất nhạc riêng.</h2></div>
          <a className="button button-light" href="/#dung-thu">Dùng thử miễn phí <span>→</span></a>
        </div>
      </section>

      <SiteFooter />
    </main>
  );
}
