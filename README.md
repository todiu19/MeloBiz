# MeloBiz Platform

Project được tách thành hai ứng dụng độc lập và quản lý bằng npm workspaces.

## Cấu trúc

```text
MeloBiz-Website/
├─ frontend/          Giao diện Next.js/vinext, cổng 3001
├─ backend/           REST API Express + TypeScript, cổng 4000
├─ scripts/           Script kiểm thử và đóng gói deployment
├─ .openai/           Cấu hình hosting website
└─ package.json       Lệnh quản lý chung
```

## Chạy toàn bộ hệ thống

```powershell
npm.cmd install
npm.cmd run dev
```

- Frontend: http://localhost:3001
- Backend health check: http://localhost:4000/health

MeloBiz không lưu mật khẩu. Người dùng đăng nhập bằng Google OAuth hoặc mã OTP
gửi qua email; OTP chỉ được giữ tạm trong Redis và tự hết hạn.

Các trang tài khoản:

- `/dang-nhap`
- `/dang-ky`
- `/quen-mat-khau`

Các trang nội dung chính đều dùng route riêng:

- `/gioi-thieu`
- `/loai-hinh`
- `/loai-hinh/:slug`
- `/cach-hoat-dong`
- `/bang-gia`
- `/giay-phep`

API auth:

- `POST /api/v1/auth/email/request-otp`
- `POST /api/v1/auth/email/verify-otp`
- `GET /api/v1/auth/email/onboarding`
- `POST /api/v1/auth/email/complete`
- `GET /api/v1/auth/me`
- `POST /api/v1/auth/logout`
- `GET /api/v1/auth/google`
- `GET /api/v1/auth/google/callback`
- `GET /api/v1/auth/google/onboarding`
- `POST /api/v1/auth/google/complete`

## API loại hình kinh doanh

Backend có dữ liệu 18 loại hình, trong đó 6 loại hình chính đã có nội dung sâu,
playlist, lịch phát, FAQ và metadata SEO.

Frontend ưu tiên đọc danh mục và trang chi tiết từ API này. Nếu backend tạm
không phản hồi, frontend dùng bộ dữ liệu fallback 18 loại hình để các đường dẫn
vẫn hoạt động. Cấu hình kết nối trong `frontend/.env.local`:

```text
API_URL=http://localhost:4000/api/v1
NEXT_PUBLIC_API_URL=http://localhost:4000/api/v1
```

- `GET /api/v1/industries`
- `GET /api/v1/industries/groups`
- `GET /api/v1/industries/:slug`
- `GET /api/v1/industries/:slug/playlists`
- `GET /api/v1/industries/:slug/schedule`
- `GET /api/v1/industries/:slug/related`

Xem bộ lọc, response mẫu và cấu trúc dữ liệu tại
[`backend/README.md`](backend/README.md).

## Chạy riêng

```powershell
npm.cmd run dev:frontend
npm.cmd run dev:backend
```

## Build

```powershell
npm.cmd run build
```

Build frontend nằm tại `frontend/dist`, backend tại `backend/dist`. Thư mục
`dist` ở root là gói triển khai website được tạo tự động.
