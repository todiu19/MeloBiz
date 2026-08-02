# MeloBiz Backend

REST API dùng Express 5 và TypeScript. Mặc định chạy tại
`http://localhost:4000`.

## PostgreSQL

Backend đọc toàn bộ dữ liệu từ PostgreSQL. Tạo database và áp dụng schema:

```bash
createdb melobiz
psql -d melobiz -f backend/database/schema.sql
```

Sao chép `backend/.env.example` thành `backend/.env`, sau đó thay
`YOUR_PASSWORD` bằng mật khẩu PostgreSQL. Nếu mật khẩu chứa ký tự đặc biệt,
phải URL-encode giá trị đó.

```text
DATABASE_URL=postgresql://postgres:YOUR_PASSWORD@localhost:5432/melobiz
DATABASE_SSL=false
SEED_DEMO_DATA=true
JWT_SECRET=replace-with-at-least-32-random-characters
SESSION_DAYS=30
SESSION_COOKIE_NAME=melobiz_session
SESSION_COOKIE_SECURE=false
FRONTEND_URL=http://localhost:3001
GOOGLE_CLIENT_ID=your-client-id.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=your-google-client-secret
GOOGLE_REDIRECT_URI=http://localhost:4000/api/v1/auth/google/callback
SMTP_URL=smtps://username:password@smtp.example.com:465
SMTP_FROM=MeloBiz <no-reply@melobiz.vn>
OTP_TTL_MINUTES=5
REDIS_URL=redis://127.0.0.1:6379
```

Khi `SEED_DEMO_DATA=true`, backend tự tạo tài khoản, doanh nghiệp, điểm phát,
subscription và giấy phép demo nếu chúng chưa tồn tại.

Tạo JWT secret an toàn bằng:

```bash
openssl rand -hex 32
```

JWT được gửi bằng cookie `HttpOnly`, `SameSite=Lax`; frontend không đọc hoặc
lưu token trong `localStorage`. Khi deploy qua HTTPS, đặt
`SESSION_COOKIE_SECURE=true`.

## Đăng nhập Google

Tạo OAuth Client loại **Web application** trong Google Cloud Console và thêm
redirect URI:

```text
http://localhost:4000/api/v1/auth/google/callback
```

Với database đã tạo trước tính năng Google, chạy migration:

```bash
psql -U postgres -d melobiz -f backend/database/migrations/001_google_oauth.sql
```

Luồng người dùng mới: Google callback → `/hoan-tat-dang-ky` → nhập thông tin
doanh nghiệp → tạo user, business và Google identity trong cùng transaction.
Email Google đã tồn tại trong MeloBiz sẽ được liên kết và đăng nhập trực tiếp.

## Đăng nhập bằng OTP email

Cấu hình `SMTP_URL`, `SMTP_FROM` và `REDIS_URL`. Mã OTP gồm 6 chữ số, chỉ dùng
một lần, mặc định hết hạn sau 5 phút và bị khóa sau 5 lần nhập sai. OTP chỉ tồn
tại tạm thời trong Redis dưới dạng HMAC; PostgreSQL không lưu OTP hay mật khẩu.

Với database đã tồn tại, áp dụng migration passwordless:

```bash
psql -U postgres -d melobiz -f backend/database/migrations/002_passwordless_email_otp.sql
psql -U postgres -d melobiz -f backend/database/migrations/003_move_otp_to_redis.sql
psql -U postgres -d melobiz -f backend/database/migrations/004_one_business_per_user.sql
psql -U postgres -d melobiz -f backend/database/migrations/005_move_membership_to_users.sql
```

Các endpoint:

- `POST /api/v1/auth/email/request-otp`
- `POST /api/v1/auth/email/verify-otp`
- `GET /api/v1/auth/email/onboarding`
- `POST /api/v1/auth/email/complete`

## Chạy riêng backend

Từ thư mục gốc:

```powershell
npm.cmd run dev:backend
```

Kiểm tra:

```text
GET http://localhost:4000/health
```

## API loại hình kinh doanh

Prefix chung: `/api/v1/industries`

| Method | Endpoint | Mô tả |
| --- | --- | --- |
| GET | `/` | Danh sách loại hình, hỗ trợ lọc và phân trang |
| GET | `/groups` | Nhóm loại hình và số lượng từng nhóm |
| GET | `/:slug` | Toàn bộ nội dung trang chi tiết |
| GET | `/:slug/playlists` | Playlist được thiết kế cho loại hình |
| GET | `/:slug/schedule` | Lịch nhạc gợi ý theo khung giờ |
| GET | `/:slug/related` | Loại hình liên quan |

### Bộ lọc danh sách

| Query | Kiểu | Giá trị |
| --- | --- | --- |
| `q` | string | Tìm trong tên, mô tả, thể loại và từ khóa SEO |
| `group` | enum | `hospitality`, `wellness`, `retail`, `fitness`, `healthcare`, `workplace`, `entertainment`, `transport` |
| `featured` | boolean | `true` hoặc `false` |
| `hasDetail` | boolean | Chỉ lấy mục đã có nội dung chi tiết |
| `limit` | integer | Từ 1 đến 100, mặc định 20 |
| `offset` | integer | Từ 0, mặc định 0 |

Ví dụ:

```text
GET /api/v1/industries?group=hospitality&featured=true
GET /api/v1/industries?q=spa&limit=6
GET /api/v1/industries/quan-ca-phe
GET /api/v1/industries/quan-ca-phe/playlists
GET /api/v1/industries/quan-ca-phe/schedule
GET /api/v1/industries/quan-ca-phe/related?limit=3
```

Response danh sách:

```json
{
  "success": true,
  "data": [],
  "meta": {
    "total": 18,
    "limit": 20,
    "offset": 0,
    "hasMore": false
  }
}
```

Các endpoint đọc dữ liệu có `Cache-Control` để CDN hoặc reverse proxy có thể
cache an toàn. Tham số không hợp lệ trả về HTTP 400; slug không tồn tại trả về
HTTP 404.

## Kiến trúc backend

Mã nguồn trong `backend/src` được tổ chức theo kiến trúc phân tầng:

```text
routes → controllers → services → data → config/database
              ↓             ↓        ↓
         validators      domain   SQL/Redis
              ↓
             dto
```

- `config/`: dotenv, PostgreSQL, Redis, JWT, SMTP và Google OAuth.
- `routes/`: chỉ khai báo endpoint và gắn middleware/controller.
- `controllers/`: nhận request, gọi validator/service và tạo HTTP response.
- `services/`: business logic và tích hợp Google, SMTP.
- `data/`: repository/DAO truy cập PostgreSQL, Redis và seed development.
- `domain/`: entity/model nghiệp vụ như `User`, `Industry`, `MusicLicense`.
- `domain/dto/`: kiểu dữ liệu request/response truyền qua API hoặc giữa các tầng.
- `middleware/`: JWT auth, 404 và xử lý lỗi tập trung.
- `validators/`: kiểm tra và chuẩn hóa dữ liệu đầu vào trước khi gọi service.
- `utils/`: hàm dùng chung như tạo OTP, HMAC, chuẩn hóa email và cookie.
- `types/`: kiểu kỹ thuật hỗ trợ, ví dụ `GoogleProfile` và mở rộng
  `Express.Request`, `ValidationResult`.
- `constants/`: các giá trị cố định như cookie name, JWT audience và nhóm ngành.
- `app.ts`: cấu hình Express và đăng ký router.
- `server.ts`: kết nối hạ tầng, khởi động và dừng server.

Route và controller không truy cập PostgreSQL/Redis trực tiếp. Request/response
DTO nằm trong `domain/dto`, domain model nằm trong `domain`, còn kiểu hàng SQL nội bộ
như `UserRow` chỉ nằm trong repository tương ứng tại `data`. Kiểu kỹ thuật từ
thư viện hoặc nhà cung cấp bên ngoài nằm trong `types`. JWT được xử lý tại
`auth.service.ts`; dữ liệu session và OTP được truy cập qua repository riêng.

Quan hệ tài khoản–doanh nghiệp là một–nhiều: một doanh nghiệp có nhiều user,
nhưng mỗi user chỉ thuộc một doanh nghiệp. `app_users.business_id` là khóa
ngoại trực tiếp tới `businesses`; role và trạng thái thành viên cũng nằm trên
`app_users`, không sử dụng bảng nối.

## Cấu trúc dữ liệu

Dữ liệu nằm trong PostgreSQL, schema và seed ban đầu được quản lý tại
`backend/database/schema.sql`. Sáu loại hình chính có thể chứa nội dung sâu gồm
headline, mô tả, mood, genre, playlist, lịch phát, lợi ích, FAQ và SEO.

Khi chuyển sang database, có thể tách thành các bảng:

- `industries`
- `industry_genres`
- `industry_playlists`
- `industry_schedule`
- `industry_benefits`
- `industry_faqs`
- `industry_seo`

`slug` nên đặt unique index; `group`, `featured`, `active` và `sort_order` nên có
index phục vụ trang danh sách.
