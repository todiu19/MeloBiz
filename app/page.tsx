"use client";

import { FormEvent, useState } from "react";

const businessTypes = [
  { icon: "☕", name: "Quán cà phê", note: "Lo-fi · Acoustic · Jazz" },
  { icon: "🍽", name: "Nhà hàng", note: "Lounge · Classical · Chill" },
  { icon: "◌", name: "Spa & Wellness", note: "Ambient · Nature · Piano" },
  { icon: "⚡", name: "Phòng gym", note: "EDM · Pop · Workout" },
  { icon: "▣", name: "Khách sạn", note: "Elegant · Piano · Lounge" },
  { icon: "✦", name: "Cửa hàng", note: "Indie · Pop · Seasonal" },
];

const faqs = [
  {
    q: "Mở nhạc ở quán có cần giấy phép không?",
    a: "Có. Phát nhạc phục vụ khách là hình thức sử dụng công khai. Gói MeloBiz bao gồm phạm vi cấp phép phù hợp cho điểm kinh doanh đã đăng ký.",
  },
  {
    q: "Một gói sử dụng được cho bao nhiêu địa điểm?",
    a: "Mỗi gói áp dụng cho một điểm phát. Bạn có thể quản lý nhiều điểm phát và nhiều nhân viên trong cùng một tài khoản doanh nghiệp.",
  },
  {
    q: "Có xuất hóa đơn VAT và chứng từ không?",
    a: "Có. Hồ sơ doanh nghiệp, hợp đồng, giấy chứng nhận và hóa đơn được quản lý tập trung trên cổng doanh nghiệp.",
  },
  {
    q: "Dùng thử có cần thẻ tín dụng không?",
    a: "Không. Bạn có 14 ngày trải nghiệm toàn bộ kho nhạc và tính năng quản lý mà không cần nhập thẻ.",
  },
];

function Logo() {
  return (
    <a className="logo" href="#top" aria-label="MeloBiz">
      <span className="logo-mark"><i /><i /><i /></span>
      <span>Melo<span>Biz</span></span>
    </a>
  );
}

function PlayerMockup() {
  return (
    <div className="player-wrap" aria-label="Mô phỏng trình phát MeloBiz">
      <div className="orb orb-one" />
      <div className="orb orb-two" />
      <div className="player-card">
        <div className="window-bar">
          <Logo />
          <span className="online"><b /> Đang phát tại Quận 1</span>
        </div>
        <div className="player-grid">
          <aside>
            <span>TỔNG QUAN</span>
            <a className="active">♫ &nbsp; Khám phá</a>
            <a>♡ &nbsp; Đã lưu</a>
            <span>KHÔNG GIAN</span>
            <a>☕ &nbsp; Quán cà phê</a>
            <a>◌ &nbsp; Spa</a>
            <a>⚡ &nbsp; Gym</a>
          </aside>
          <main>
            <div className="playlist-head">
              <small>PLAYLIST DÀNH CHO BẠN</small>
              <h3>Buổi sáng dịu êm</h3>
              <p>Acoustic & lo-fi cho một ngày mới nhẹ nhàng.</p>
            </div>
            <div className="track"><span className="art art-a">M</span><div><b>Morning on the balcony</b><small>Mayfield · 03:24</small></div><i>•••</i></div>
            <div className="track"><span className="art art-b">S</span><div><b>Softly, we begin</b><small>Sonder · 02:51</small></div><i>•••</i></div>
            <div className="track playing"><span className="art art-c">A</span><div><b>April breeze</b><small>Aster · 03:08</small></div><i className="bars">▂▅▃▆</i></div>
          </main>
        </div>
        <div className="now-playing">
          <span className="art art-c">A</span>
          <div><b>April breeze</b><small>Aster</small></div>
          <button aria-label="Bài trước">‹</button>
          <button className="play" aria-label="Tạm dừng">Ⅱ</button>
          <button aria-label="Bài sau">›</button>
          <div className="progress"><i /></div>
          <span>2:14 / 3:08</span>
        </div>
      </div>
      <div className="floating-note"><b>1.200+</b><span>bản nhạc có bản quyền</span></div>
    </div>
  );
}

export default function Home() {
  const [openFaq, setOpenFaq] = useState(0);
  const [lookup, setLookup] = useState("");
  const [lookupResult, setLookupResult] = useState("");

  function handleLookup(e: FormEvent) {
    e.preventDefault();
    setLookupResult(
      lookup.trim()
        ? "Đây là bản demo. Mã giấy phép chưa được kết nối với cơ sở dữ liệu."
        : "Vui lòng nhập mã giấy phép hoặc mã số thuế."
    );
  }

  return (
    <main id="top">
      <header>
        <div className="container nav">
          <Logo />
          <nav>
            <a href="#giai-phap">Giải pháp</a>
            <a href="#cach-hoat-dong">Cách hoạt động</a>
            <a href="#bang-gia">Bảng giá</a>
            <a href="#giay-phep">Giấy phép</a>
          </nav>
          <div className="nav-actions">
            <a className="login" href="#lien-he">Đăng nhập</a>
            <a className="button button-small" href="#dung-thu">Dùng thử miễn phí <span>↗</span></a>
          </div>
        </div>
      </header>

      <section className="hero">
        <div className="container hero-grid">
          <div className="hero-copy">
            <div className="eyebrow"><span>♪</span> NHẠC BẢN QUYỀN CHO DOANH NGHIỆP</div>
            <h1>Không gian đúng gu.<br /><em>Âm nhạc đúng luật.</em></h1>
            <p>Kho nhạc được tuyển chọn và cấp phép cho quán cà phê, nhà hàng, spa và cửa hàng. Bật nhạc trong vài phút, an tâm vận hành mỗi ngày.</p>
            <div className="hero-actions">
              <a className="button" href="#dung-thu">Dùng thử 14 ngày <span>→</span></a>
              <a className="text-link" href="#giai-phap"><i>▶</i> Nghe thử playlist</a>
            </div>
            <div className="trust-row">
              <div className="avatars"><span>H</span><span>M</span><span>T</span><span>+</span></div>
              <p><b>Được tin dùng bởi 200+ không gian</b><br />từ quán nhỏ đến chuỗi cửa hàng</p>
            </div>
          </div>
          <PlayerMockup />
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
                <i>{type.icon}</i>
                <h3>{type.name}</h3>
                <p>{type.note}</p>
                <a href="#dung-thu">Khám phá <span>→</span></a>
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
            <a className="button full" href="#dung-thu">Bắt đầu dùng thử <span>→</span></a>
            <p className="card-note">14 ngày miễn phí · Không cần thẻ tín dụng</p>
          </div>
        </div>
      </section>

      <section className="license" id="giay-phep">
        <div className="container license-grid">
          <div>
            <span className="mini-label">MINH BẠCH & DỄ KIỂM TRA</span>
            <h2>Tra cứu giấy phép</h2>
            <p>Nhập mã giấy phép hoặc mã số thuế để kiểm tra trạng thái sử dụng nhạc của doanh nghiệp.</p>
            <form onSubmit={handleLookup}>
              <input value={lookup} onChange={(e) => setLookup(e.target.value)} placeholder="Ví dụ: MELO-2026-001" aria-label="Mã giấy phép" />
              <button className="button" type="submit">Tra cứu</button>
            </form>
            {lookupResult && <div className="lookup-result">{lookupResult}</div>}
          </div>
          <div className="certificate">
            <div className="cert-head"><Logo /><span>GIẤY CHỨNG NHẬN</span></div>
            <div className="seal">✓</div>
            <h3>Giấy phép sử dụng âm nhạc</h3>
            <p>Cấp cho: <b>Doanh nghiệp của bạn</b></p>
            <dl><div><dt>Phạm vi</dt><dd>Phát công khai tại điểm kinh doanh</dd></div><div><dt>Trạng thái</dt><dd className="valid">● Đang hiệu lực</dd></div><div><dt>Mã giấy phép</dt><dd>MELO-2026-001</dd></div></dl>
          </div>
        </div>
      </section>

      <section className="faq">
        <div className="container faq-grid">
          <div className="section-intro"><span>GIẢI ĐÁP NHANH</span><h2>Bạn có câu hỏi?</h2><p>Chưa tìm thấy câu trả lời? <a href="#lien-he">Trò chuyện với chuyên viên →</a></p></div>
          <div className="accordion">
            {faqs.map((faq, index) => (
              <article key={faq.q} className={openFaq === index ? "open" : ""}>
                <button onClick={() => setOpenFaq(openFaq === index ? -1 : index)}><span>{faq.q}</span><i>{openFaq === index ? "−" : "+"}</i></button>
                {openFaq === index && <p>{faq.a}</p>}
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="cta" id="dung-thu">
        <div className="container cta-box">
          <div><span>BẮT ĐẦU NGAY HÔM NAY</span><h2>Cho không gian của bạn<br />một chất nhạc riêng.</h2></div>
          <div><a className="button button-light" href="mailto:hello@melobiz.vn">Dùng thử 14 ngày <span>→</span></a><p>Không cần thẻ · Hủy bất cứ lúc nào</p></div>
          <div className="wave">{Array.from({length: 36}).map((_, i) => <i key={i} style={{height: `${12 + ((i * 17) % 42)}px`}} />)}</div>
        </div>
      </section>

      <footer id="lien-he">
        <div className="container footer-grid">
          <div><Logo /><p>Nhạc bản quyền cho không gian kinh doanh Việt Nam.</p><div className="socials"><a>f</a><a>◎</a><a>in</a></div></div>
          <div><h4>Sản phẩm</h4><a href="#giai-phap">Giải pháp</a><a href="#bang-gia">Bảng giá</a><a href="#giay-phep">Tra cứu giấy phép</a></div>
          <div><h4>Công ty</h4><a href="#top">Về chúng tôi</a><a href="#cach-hoat-dong">Cách hoạt động</a><a href="mailto:hello@melobiz.vn">Liên hệ</a></div>
          <div><h4>Nhận bản tin</h4><p>Mẹo chọn nhạc và cập nhật pháp lý mỗi tháng.</p><form><input placeholder="Email của bạn" /><button aria-label="Đăng ký">→</button></form></div>
        </div>
        <div className="container footer-bottom"><span>© 2026 MeloBiz. Bản thiết kế demo.</span><div><a>Điều khoản</a><a>Bảo mật</a></div></div>
      </footer>
    </main>
  );
}
