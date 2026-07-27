import { HomeFaq } from "@/components/home/HomeFaq";
import { HomeLicenseLookup } from "@/components/home/HomeLicenseLookup";
import { SiteFooter, SiteHeader } from "@/components/layout/SiteChrome";

const businessTypes = [
  { icon: "01", slug: "quan-ca-phe", name: "Quán cà phê", note: "Lo-fi · Acoustic · Jazz", mood: "Chậm & ấm" },
  { icon: "02", slug: "nha-hang", name: "Nhà hàng", note: "Lounge · Classical · Chill", mood: "Tinh tế" },
  { icon: "03", slug: "spa-wellness", name: "Spa & Wellness", note: "Ambient · Nature · Piano", mood: "Thư giãn" },
  { icon: "04", slug: "phong-gym", name: "Phòng gym", note: "EDM · Pop · Workout", mood: "Năng lượng" },
  { icon: "05", slug: "khach-san", name: "Khách sạn", note: "Elegant · Piano · Lounge", mood: "Thanh lịch" },
  { icon: "06", slug: "cua-hang-ban-le", name: "Cửa hàng", note: "Indie · Pop · Seasonal", mood: "Tươi mới" },
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
    <main id="top">
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
          <div className="section-intro centered">
            <span>CHO MỌI KHÔNG GIAN</span>
            <h2>Mỗi không gian, một chất nhạc riêng</h2>
            <p>Playlist được tuyển chọn theo loại hình, thời điểm và cảm xúc bạn muốn tạo ra.</p>
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

      <section className="legal-band">
        <div className="container legal-grid">
          <div>
            <span className="mini-label">AN TÂM PHÁP LÝ</span>
            <h2>Âm nhạc hay.<br />Giấy tờ <em>đầy đủ.</em></h2>
          </div>
          <div className="legal-points">
            <article><i>✓</i><div><h3>Quyền sử dụng rõ ràng</h3><p>Phạm vi cấp phép minh bạch cho từng điểm kinh doanh.</p></div></article>
            <article><i>✓</i><div><h3>Chứng từ doanh nghiệp</h3><p>Hợp đồng, giấy chứng nhận và hóa đơn VAT đầy đủ.</p></div></article>
            <article><i>✓</i><div><h3>Tra cứu công khai</h3><p>Xác thực trạng thái giấy phép bằng mã số riêng.</p></div></article>
          </div>
        </div>
      </section>

      <section className="steps" id="cach-hoat-dong">
        <div className="container">
          <div className="section-intro">
            <span>ĐƠN GIẢN TỪ LẦN ĐẦU</span>
            <h2>Ba bước để không gian có nhạc</h2>
          </div>
          <div className="step-grid">
            <article><b>01</b><i>→</i><h3>Tạo tài khoản</h3><p>Đăng ký doanh nghiệp trong một phút. Không cần thẻ tín dụng.</p></article>
            <article><b>02</b><i>→</i><h3>Chọn đúng playlist</h3><p>Lọc theo không gian, tâm trạng hoặc thời điểm trong ngày.</p></article>
            <article><b>03</b><h3>Bật nhạc & tận hưởng</h3><p>Quản lý mọi điểm phát từ một nơi, kèm lịch sử phát minh bạch.</p></article>
          </div>
        </div>
      </section>

      <section className="brand-quote">
        <div className="container quote-grid">
          <div className="quote-art" aria-hidden="true">
            <span className="record"><i /><b>MB</b></span>
            <div className="sound-lines">{Array.from({length: 24}).map((_, i) => <i key={i} />)}</div>
          </div>
          <blockquote>
            <span>ÂM NHẠC TẠO NÊN KHÔNG KHÍ</span>
            <p>“Khách hàng có thể quên món họ gọi, nhưng sẽ nhớ cảm giác mà không gian của bạn để lại.”</p>
            <footer>MeloBiz Editorial · 2026</footer>
          </blockquote>
        </div>
      </section>

      <section className="pricing" id="bang-gia">
        <div className="container pricing-grid">
          <div className="section-intro">
            <span>GIÁ GỌN GÀNG, KHÔNG PHÍ ẨN</span>
            <h2>Một gói.<br />Đủ mọi tính năng.</h2>
            <p>Thêm điểm phát khi doanh nghiệp lớn lên. Hủy bất cứ lúc nào.</p>
          </div>
          <div className="price-card">
            <div className="popular">PHỔ BIẾN NHẤT</div>
            <div className="price-title"><div><h3>MeloBiz Pro</h3><p>Cho mọi loại hình kinh doanh</p></div><span>PRO</span></div>
            <div className="price"><b>199.000₫</b><span>/ điểm phát / tháng</span></div>
            <small>Giá chưa bao gồm VAT</small>
            <ul>
              <li>✓ Kho nhạc bản quyền không giới hạn</li>
              <li>✓ Playlist tuyển chọn theo không gian</li>
              <li>✓ Quản lý nhiều điểm phát & thành viên</li>
              <li>✓ Giấy chứng nhận và hóa đơn VAT</li>
              <li>✓ Lịch sử phát và hỗ trợ ưu tiên</li>
            </ul>
            <a className="button full" href="/dang-ky">Bắt đầu dùng thử <span>→</span></a>
            <p className="card-note">14 ngày miễn phí · Không cần thẻ tín dụng</p>
          </div>
        </div>
      </section>

      <section className="license" id="giay-phep">
        <HomeLicenseLookup />
      </section>

      <section className="faq">
        <div className="container faq-grid">
          <div className="section-intro"><span>GIẢI ĐÁP NHANH</span><h2>Bạn có câu hỏi?</h2><p>Chưa tìm thấy câu trả lời? <a href="#lien-he">Trò chuyện với chuyên viên →</a></p></div>
          <HomeFaq />
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
