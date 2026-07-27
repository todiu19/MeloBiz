# MeloBiz Backend

REST API dùng Express 5 và TypeScript. Mặc định chạy tại
`http://localhost:4000`.

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

## Cấu trúc dữ liệu

Hiện dữ liệu mẫu nằm trong `src/data/industries.ts`, đủ 18 loại hình. Sáu loại
hình chính có nội dung sâu gồm headline, mô tả, mood, genre, playlist, lịch
phát, lợi ích, FAQ và SEO.

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
