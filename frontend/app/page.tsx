import { SiteFooter, SiteHeader } from "../components/SiteChrome";

const businessTypes = [
  { icon: "01", slug: "quan-ca-phe", name: "Quán cà phê", note: "Lo-fi · Acoustic · Jazz", mood: "Chậm & ấm" },
  { icon: "02", slug: "nha-hang", name: "Nhà hàng", note: "Lounge · Classical · Chill", mood: "Tinh tế" },
  { icon: "03", slug: "spa-wellness", name: "Spa & Wellness", note: "Ambient · Nature · Piano", mood: "Thư giãn" },
];

const mainPaths = [
  {
    number: "01",
    title: "Cách hoạt động",
    description: "Bốn bước từ tạo không gian đến lịch phát tự động.",
    href: "/cach-hoat-dong",
    meta: "Khoảng 3 phút để bắt đầu",
  },
  {
    number: "02",
    title: "Bảng giá",
    description: "Một gói đầy đủ, thêm điểm phát khi doanh nghiệp lớn lên.",
    href: "/bang-gia",
    meta: "Từ 199.000₫ / tháng",
  },
  {
    number: "03",
    title: "Giấy phép",
    description: "Tra cứu chứng nhận và hiểu rõ phạm vi sử dụng tại quán.",
    href: "/giay-phep",
    meta: "Minh bạch theo địa điểm",
  },
];

function CafeHeroVisual() {
  return (
    <figure className="cafe-visual">
      <img
        src="/images/cafe-hero-warm.png"
        alt="Không gian quán cà phê ấm cúng với ánh nắng sớm và một tách cà phê"
      />
      <div className="cafe-visual-label">
        <span><i /> Đang phát tại Quận 1</span>
        <b>07:32 · Morning mood</b>
      </div>
      <div className="warm-player">
        <span className="warm-player-art">MB</span>
        <div className="warm-player-copy">
          <small>MELOBIZ SELECTS</small>
          <strong>Morning on the balcony</strong>
          <span>Acoustic · Lo-fi · Dịu nhẹ</span>
        </div>
        <button type="button" aria-label="Tạm dừng">Ⅱ</button>
        <div className="warm-player-wave" aria-hidden="true">
          {Array.from({ length: 18 }).map((_, index) => (
            <i key={index} style={{ height: `${8 + ((index * 7) % 19)}px` }} />
          ))}
        </div>
      </div>
      <figcaption>
        <span>Không quảng cáo</span>
        <span>Chuyển bài êm</span>
        <span>Nhạc đúng bản quyền</span>
      </figcaption>
    </figure>
  );
}

export default function Home() {
  return (
    <main className="home-main" id="top">
      <SiteHeader />

      <section className="hero">
        <div className="container hero-grid">
          <div className="hero-copy">
            <div className="eyebrow"><span>♪</span> ÂM NHẠC CHO NHỮNG KHÔNG GIAN DỄ MẾN</div>
            <h1>Một chút nhạc hay.<br /><em>Một ngày thật dịu.</em></h1>
            <p>MeloBiz chọn sẵn những playlist ấm áp cho quán cà phê, nhà hàng và không gian dịch vụ. Bạn chỉ cần mở lên, chúng tôi chăm từng nhịp còn lại.</p>
            <div className="hero-actions">
              <a className="button" href="/dang-ky">Dùng thử 14 ngày <span>→</span></a>
              <a className="text-link" href="/loai-hinh/quan-ca-phe"><i>▶</i> Nghe mood quán cà phê</a>
            </div>
            <div className="trust-row">
              <div className="avatars"><span>H</span><span>M</span><span>T</span><span>+</span></div>
              <p><b>Đang đồng hành cùng 200+ không gian</b><br />từ góc cà phê nhỏ đến chuỗi cửa hàng</p>
            </div>
          </div>
          <CafeHeroVisual />
        </div>
      </section>

      <section className="proof-strip" aria-label="Số liệu nổi bật">
        <div className="container proof-grid">
          <div><strong>1.200+</strong><span>Bản nhạc cấp phép</span></div>
          <div><strong>60+</strong><span>Playlist tuyển chọn</span></div>
          <div><strong>200+</strong><span>Không gian tin dùng</span></div>
          <div><strong>100%</strong><span>Chứng từ minh bạch</span></div>
        </div>
      </section>

      <section className="types" id="giai-phap">
        <div className="container">
          <div className="home-types-head">
            <div className="section-intro">
              <span>BA KHÔNG GIAN TIÊU BIỂU</span>
              <h2>Mỗi không gian, một chất nhạc riêng</h2>
              <p>Chọn nhanh một không gian hoặc xem toàn bộ 18 loại hình.</p>
            </div>
            <a href="/loai-hinh">Xem tất cả loại hình <span>→</span></a>
          </div>
          <div className="type-grid">
            {businessTypes.map((type) => (
              <article key={type.name}>
                <div className="type-top"><i>{type.icon}</i><span>{type.mood}</span></div>
                <h3>{type.name}</h3>
                <p>{type.note}</p>
                <a href={`/loai-hinh/${type.slug}`}>Khám phá <span>→</span></a>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="home-paths">
        <div className="container">
          <div className="home-paths-head">
            <div><span className="page-kicker">TÌM ĐÚNG THỨ BẠN CẦN</span><h2>Ba phần, xem riêng cho dễ</h2></div>
            <p>Thông tin được chia thành từng trang ngắn. Bạn không cần đọc hết một trang dài.</p>
          </div>
          <div className="home-path-grid">
            {mainPaths.map((item) => (
              <a href={item.href} key={item.href}>
                <div><span>{item.number}</span><i>↗</i></div>
                <small>{item.meta}</small>
                <h3>{item.title}</h3>
                <p>{item.description}</p>
              </a>
            ))}
          </div>
        </div>
      </section>

      <section className="cta" id="dung-thu">
        <div className="container cta-box">
          <div><span>BẮT ĐẦU NGAY HÔM NAY</span><h2>Cho không gian của bạn<br />một chất nhạc riêng.</h2></div>
          <div><a className="button button-light" href="/dang-ky">Dùng thử 14 ngày <span>→</span></a><p>Không cần thẻ · Hủy bất cứ lúc nào</p></div>
          <div className="wave">{Array.from({length: 36}).map((_, i) => <i key={i} style={{height: `${12 + ((i * 17) % 42)}px`}} />)}</div>
        </div>
      </section>

      <SiteFooter />
    </main>
  );
}
