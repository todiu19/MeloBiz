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
