# GreenViet – Khách có gu (MVP)

Website React + TypeScript (FE) / Express + MongoDB (BE), dựa trên 6 ảnh tham khảo.

## Chức năng
- Trang chủ theo phong cách xanh rừng – kem – xanh lá.
- Header điều hướng đến Nội quy nhà Voọc, Hộ chiếu, Sổ khách quý, Hẹn ở Sơn Trà, Liên hệ.
- Đăng ký / đăng nhập bằng email và mật khẩu (JWT, bcrypt); phiên đăng nhập được xác minh lại khi mở ứng dụng.
- Tạo hộ chiếu: chọn mẫu minh họa, nhập biệt danh, xác nhận đủ 3 cam kết, xem trước và tải PNG.
- Gửi hộ chiếu lên backend để lưu MongoDB; danh sách Sổ khách quý lấy từ dữ liệu đã công khai.
- Tải các toolkit mẫu dạng SVG xuống máy.
- Form báo cáo sự cố / liên hệ được lưu MongoDB.
- Upload ảnh từ máy để xem trước khi làm hộ chiếu (lưu ảnh dưới dạng data URL trong document; phù hợp MVP, giới hạn 2 MB).

## Yêu cầu
- Node.js 18+
- MongoDB local hoặc MongoDB Atlas

## Chạy backend
```bash
cd server
cp .env.example .env
npm install
npm run dev
```
Sửa `MONGO_URI`, `JWT_SECRET`, `CLIENT_URL` trong `server/.env`. Tạo `JWT_SECRET` ngẫu nhiên riêng cho ứng dụng, ví dụ chạy `node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"`; server sẽ không khởi động nếu vẫn dùng giá trị mẫu.

## Chạy frontend
Mở terminal khác:
```bash
cd client
cp .env.example .env
npm install
npm run dev
```
Mặc định FE: http://localhost:5173, BE: http://localhost:4000.

## Ghi chú
Đây là MVP cho mục đích học tập. Số liệu chiến dịch, hotline, nguồn chính thức và lịch Eco-Tour đang là nội dung minh họa; hãy thay bằng thông tin đã được GreenViet xác minh trước khi công khai. Không đưa thông tin nhạy cảm vào hộ chiếu công khai.
