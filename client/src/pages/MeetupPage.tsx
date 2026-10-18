import { Link } from 'react-router-dom';
import { Download, ArrowRight } from 'lucide-react';
import { SectionHead } from '../components/shared';
function MeetupCards() {
  return (
    <div className="meetup-grid">
      <article className="meetup-card">
        <span className="pill beige-pill">Chưa mở đăng ký</span>
        <h3>Eco-Tour “Tôi yêu Sơn Trà”</h3>
        <p>
          Form đăng ký chỉ mở khi GreenViet xác nhận thời gian, địa điểm và số lượng tham gia. Chưa
          có lịch chính thức nên trang này không hiển thị thông tin sự kiện giả.
        </p>
        <button className="button button-muted" disabled>
          Đăng ký tham gia
        </button>
      </article>
      <Toolkit />
    </div>
  );
}
export default function MeetupPage() {
  return (
    <>
      <main className="section cream-section page-section">
        <SectionHead
          kicker="05 · TAKE ACTION"
          title="Hẹn gặp ở Sơn Trà"
          intro="Theo dõi các hoạt động và tải bộ tài liệu truyền thông để lan tỏa thông điệp bảo tồn."
        />
        <MeetupCards />
      </main>
    </>
  );
}
function Toolkit() {
  const assets = [
    ['Hình nền điện thoại', 'wallpaper'],
    ['Infographic quan sát', 'infographic'],
    ['Sticker nhắn tin', 'sticker'],
    ['Ảnh cho Story & bài đăng', 'story'],
  ];
  function download(label: string, kind: string) {
    const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="1080" height="1920" viewBox="0 0 1080 1920"><rect width="1080" height="1920" fill="#0d3b2e"/><circle cx="850" cy="280" r="150" fill="#65df42"/><path d="M0 1350 Q350 1200 600 1370 T1080 1290 V1920 H0Z" fill="#155440"/><text x="80" y="170" font-family="Arial,sans-serif" font-size="36" font-weight="bold" fill="#65df42">GREENVIET · SƠN TRÀ</text><text x="80" y="360" font-family="Arial,sans-serif" font-size="68" font-weight="bold" fill="#fbf7ed">NHÀ VOOỌC —</text><text x="80" y="450" font-family="Arial,sans-serif" font-size="68" font-weight="bold" fill="#65df42">BẠN LÀ KHÁCH</text><text x="80" y="560" font-family="Arial,sans-serif" font-size="34" fill="#fbf7ed">Bình tĩnh quan sát · Cất đồ ăn</text><text x="80" y="620" font-family="Arial,sans-serif" font-size="34" fill="#fbf7ed">Giữ khoảng cách an toàn</text><text x="80" y="1770" font-family="Arial,sans-serif" font-size="30" fill="#fbf7ed">${label}</text></svg>`;
    const a = document.createElement('a');
    a.href = URL.createObjectURL(new Blob([svg], { type: 'image/svg+xml' }));
    a.download = `greenviet-${kind}.svg`;
    a.click();
    URL.revokeObjectURL(a.href);
  }
  return (
    <article className="toolkit">
      <h3>Toolkit tải về</h3>
      <div className="toolkit-grid">
        {assets.map(([label, kind]) => (
          <button key={kind} onClick={() => download(label, kind)}>
            {label}
            <Download size={18} />
          </button>
        ))}
      </div>
      <p className="helper">Tải xuống dạng SVG, mở được bằng trình duyệt và phần mềm thiết kế.</p>
    </article>
  );
}
