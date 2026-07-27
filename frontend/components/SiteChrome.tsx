export function Logo() {
  return (
    <a className="logo" href="/" aria-label="MeloBiz">
      <span className="logo-mark"><i /><i /><i /></span>
      <span>Melo<span>Biz</span></span>
    </a>
  );
}

export function SiteHeader() {
  return (
    <header>
      <div className="container nav">
        <Logo />
        <nav>
          <a href="/loai-hinh">Loại hình</a>
          <a href="/#cach-hoat-dong">Cách hoạt động</a>
          <a href="/bang-gia">Bảng giá</a>
          <a href="/#giay-phep">Giấy phép</a>
        </nav>
        <div className="nav-actions">
          <a className="login" href="/dang-nhap">Đăng nhập</a>
          <a className="button button-small" href="/dang-ky">Dùng thử miễn phí <span>↗</span></a>
        </div>
      </div>
    </header>
  );
}

export function SiteFooter() {
  return (
    <footer id="lien-he">
      <div className="container footer-grid">
        <div>
          <Logo />
          <p>Nhạc bản quyền cho không gian kinh doanh Việt Nam.</p>
          <div className="socials"><a>f</a><a>◎</a><a>in</a></div>
        </div>
        <div>
          <h4>Sản phẩm</h4>
          <a href="/loai-hinh">Loại hình</a>
          <a href="/bang-gia">Bảng giá</a>
          <a href="/#giay-phep">Tra cứu giấy phép</a>
        </div>
        <div>
          <h4>Công ty</h4>
          <a href="/">Về chúng tôi</a>
          <a href="/#cach-hoat-dong">Cách hoạt động</a>
          <a href="mailto:hello@melobiz.vn">Liên hệ</a>
        </div>
        <div>
          <h4>Nhận bản tin</h4>
          <p>Mẹo chọn nhạc và cập nhật pháp lý mỗi tháng.</p>
          <form><input placeholder="Email của bạn" /><button aria-label="Đăng ký">→</button></form>
        </div>
      </div>
      <div className="container footer-bottom">
        <span>© 2026 MeloBiz. Bản thiết kế demo.</span>
        <div><a>Điều khoản</a><a>Bảo mật</a></div>
      </div>
    </footer>
  );
}
