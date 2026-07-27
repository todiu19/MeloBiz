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

## Tài khoản demo

```text
Email: demo@melobiz.vn
Mật khẩu: Demo@123
```

Các trang tài khoản:

- `/dang-nhap`
- `/dang-ky`
- `/quen-mat-khau`

API auth:

- `POST /api/v1/auth/login`
- `POST /api/v1/auth/register`
- `POST /api/v1/auth/forgot-password`

## API loại hình kinh doanh

Backend có dữ liệu 18 loại hình, trong đó 6 loại hình chính đã có nội dung sâu,
playlist, lịch phát, FAQ và metadata SEO.

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
