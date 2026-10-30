# Flood Server – Web cho Hệ thống cảnh báo ngập đường thông minh

Backend API (Express) + CSDL (MongoDB) + giao diện web (HTML/JS, Leaflet). Phần trạm đo (ESP32) do thành viên khác làm; hai phần nối với nhau bằng **một API duy nhất**: `POST /api/ban-ghi`.

## 1. Chạy trên máy

1. Cài Node.js 18 trở lên.
2. Tạo cluster miễn phí trên **MongoDB Atlas** (M0): tạo user CSDL, mục *Network Access* thêm IP (khi thử nghiệm có thể cho `0.0.0.0/0`), lấy chuỗi kết nối.
3. Trong thư mục dự án:

```bash
npm install
cp .env.example .env      # rồi dán MONGODB_URI vào .env
npm start
```

Mở http://localhost:3000.

4. Chưa có phần cứng thì chạy giả lập ở cửa sổ khác:

```bash
npm run sim               # TR02 (nước dâng nhanh) + TR03 (ngắt kết nối)
```

5. Kiểm thử logic: `npm test`.

## 2. Hợp đồng API với bạn làm trạm đo

`POST /api/ban-ghi` (HTTPS, mỗi 5 giây)

```
Header:  Content-Type: application/json
         X-API-Key: <khoa_api của trạm>
Body:    {"ma_tram":"TR01","muc_nuoc":12.3,"thoi_diem_do":"2026-10-30T15:46:00+07:00"}
```

| Mã phản hồi | Nội dung | Ý nghĩa |
|---|---|---|
| 200 | `{"ket_qua":"Đã nhận"}` | Đã lưu |
| 401 | `Từ chối – sai khóa` | Sai `ma_tram` hoặc khóa (C-01) |
| 400 | `Từ chối – dữ liệu không hợp lệ` | Thiếu trường, `muc_nuoc` < 0 hoặc > `chieu_cao_lap` (C-02) |

- `muc_nuoc` là **số** (cm), đã lọc nhiễu và quy đổi trên trạm (PS-1.2).
- `thoi_diem_do` nếu lệch quá 60 giây so với giờ máy chủ hoặc không đọc được thì máy chủ dùng giờ nhận (C-07), nên ESP32 chưa đồng bộ giờ vẫn gửi được.
- Khi không nhận được phản hồi 200, trạm tự kết nối lại và gửi bản ghi kế tiếp (FR-04).

Thử bằng curl:

```bash
curl -X POST http://localhost:3000/api/ban-ghi \
  -H "Content-Type: application/json" -H "X-API-Key: tr01demokey_change_me_0123456789" \
  -d '{"ma_tram":"TR01","muc_nuoc":12.3,"thoi_diem_do":"2026-10-30T15:46:00+07:00"}'
```

## 3. Các endpoint đọc (web dùng)

| Endpoint | Mô tả |
|---|---|
| `GET /api/tram?loai_xe=XM\|OT_THAP\|OT_CAO` | Danh sách trạm, mức cảnh báo theo loại xe, cờ dâng nhanh (trạm có cờ lên đầu). Không truyền `loai_xe` thì `muc_canh_bao = null` |
| `GET /api/cau-hinh` | Chu kỳ làm mới, danh sách loại xe |
| `GET /api/health` | Kiểm tra máy chủ và CSDL |

Web chỉ có thao tác đọc; chỉ trạm có khóa hợp lệ mới ghi được (C-10, NFR-07).

## 4. Cấu hình (`config.json`, FR-14)

Khai báo trạm, bảng ngưỡng T theo loại xe (D3) và tham số cảnh báo (D4). **Sửa tệp là đủ, không cần sửa mã**; server tự nạp lại sau vài giây. Nếu cấu hình sai (ngưỡng tắt ≥ ngưỡng bật, T không tăng dần, trùng mã trạm…) thì giữ cấu hình cũ và ghi lỗi ra log (C-11).

- **Đổi khóa API**: sửa `khoa_api` hoặc đặt biến môi trường `KHOA_API_TR01=...` (ưu tiên hơn tệp). Khóa trong tệp mẫu chỉ để demo, hãy đổi trước khi đưa lên mạng và không đưa khóa thật lên GitHub công khai.
- `nguong_bat_den`/`nguong_tat_den` ở đây chỉ để tham chiếu; đèn thật chạy trong firmware ESP32 (đổi ngưỡng đèn phải nạp lại firmware).
- Thông tin vị trí (`vi_do`, `kinh_do`, `chieu_cao_lap`) trong tệp mẫu là giá trị tạm, hãy sửa theo trạm thật.

## 5. Triển khai (Render, Railway…)

1. Đưa mã lên GitHub (đã có `.gitignore` loại `.env`, `node_modules`).
2. Tạo Web Service Node: Build `npm install`, Start `npm start`.
3. Đặt biến môi trường `MONGODB_URI` (và `KHOA_API_*` nếu dùng).
4. Trên Atlas, cho phép IP của dịch vụ (hoặc `0.0.0.0/0` khi demo).
5. Đưa URL `https://<tên>.onrender.com/api/ban-ghi` cho bạn làm trạm đo.

Lưu ý: gói miễn phí của Render ngủ sau một thời gian không có truy cập, nên mở trước buổi demo vài phút. Khi demo/chạy 2 giờ (NFR-04), nhớ giữ cho máy chủ không ngủ (trạm gửi mỗi 5 giây nên thường đã đủ).

## 6. Đối chiếu với tài liệu

| Thành phần | Nơi cài đặt | Căn cứ |
|---|---|---|
| 3.1 Kiểm tra bản ghi | `src/ingest.js` | FR-05, NFR-07, BRULE-06, C-01, C-02 |
| 3.2 Lưu bản ghi, giờ chuẩn | `src/ingest.js` | FR-05, C-07 |
| 3.3 Theo dõi kết nối | `src/connection.js` | FR-10, BRULE-04, C-05 |
| 3.4 Dâng nhanh | `src/rapidRise.js` | FR-16, BRULE-07, C-06 |
| 4.1, 4.5 Danh sách, cờ lên đầu | `src/api.js` | FR-06, FR-17 |
| 4.3 Mức cảnh báo | `src/alertLevel.js` | FR-08, BRULE-02 |
| 4.4 Hiển thị mức + khuyến cáo | `public/app.js` | FR-09, BRULE-03 |
| 5.x Cấu hình | `src/config.js`, `config.json` | FR-14, C-11 |
| D1, D2 | `src/db.js` (MongoDB) | |
| Test TC-08, TC-16 | `test/` | Bảng 8.18, 8.19 |

Ghi chú thiết kế nhỏ: nếu bản ghi cũ dùng để so sánh dâng nhanh cách bản ghi mới quá 2 lần cửa sổ (120 giây, ví dụ sau khi trạm mất kết nối lâu rồi gửi lại), server bỏ qua lần đánh giá đó vì dữ liệu cũ không còn so sánh được. Đây là bổ sung so với PS-3.4, hãy báo lại nhóm để cập nhật tài liệu nếu giữ.
