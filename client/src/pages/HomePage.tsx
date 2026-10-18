import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Eye, Ban, Waypoints, Upload, ImagePlus, X } from 'lucide-react';
import { Chip, ForestArt, SectionHead, RuleCards } from '../components/shared';
export default function HomePage() {
  return (
    <>
      <section className="hero dark-section">
        <div className="hero-copy">
          <span className="pill green-pill">Chiến dịch tại bán đảo Sơn Trà</span>
          <h1>
            NHÀ VOOỌC —<br />
            <em>BẠN LÀ KHÁCH</em>
          </h1>
          <p className="hero-sub">
            Khách có gu, giữ ý với Voọc. Bình tĩnh quan sát –<br className="desktop" /> Cất đồ ăn –
            Giữ khoảng cách an toàn.
          </p>
          <div className="hero-actions">
            <Link className="button button-lime" to="/ho-chieu">
              Lấy Hộ chiếu Khách có gu <ArrowRight />
            </Link>
            <span className="small-muted">
              Khoảng 1 phút
              <br />
              Không cần đăng nhập để tạo thử
            </span>
          </div>
          <div className="rule-chips">
            <Chip icon={<Eye />} text="Bình tĩnh quan sát" />
            <Chip icon={<Ban />} text="Không cho ăn" />
            <Chip icon={<Waypoints />} text="Giữ khoảng cách an toàn" />
          </div>
        </div>
        <HomeHeroUpload />
      </section>
      <section className="section cream-section">
        <SectionHead
          kicker="02 · NỘI QUY NHÀ VOOỌC"
          title={
            <>
              Đến nhà người khác,
              <br />
              mình vẫn phải biết ý.
            </>
          }
          intro="Sơn Trà là nhà của voọc chà vá chân nâu. Mình đến chơi thì làm khách cho có gu: ngắm từ xa, không làm phiền cuộc sống thường ngày của chúng."
        />
        <div className="truth-grid">
          <article className="myth">
            <span className="pill rust-pill">LẦM TƯỞNG</span>
            <h3>“Cho voọc bánh kẹo, bim bim là thân thiện.”</h3>
          </article>
          <article className="truth">
            <span className="pill green-pill">SỰ THẬT</span>
            <p>
              Thức ăn của con người không phù hợp với chế độ ăn tự nhiên của voọc. Việc cho ăn có
              thể làm thay đổi tập tính kiếm ăn, khiến chúng phụ thuộc vào con người và tăng nguy cơ
              tiếp xúc với đường giao thông.
            </p>
          </article>
        </div>
        <RuleCards />
      </section>
      <section className="section light-section">
        <SectionHead
          kicker="03 · TAKE THE PLEDGE"
          title="Hộ chiếu Khách có gu"
          intro="Chọn ảnh, tích cam kết, đặt tên. Hộ chiếu tạo ngay trên trình duyệt, tải về dạng PNG."
        />
        <Link className="button button-dark" to="/ho-chieu">
          Tạo hộ chiếu của bạn <ArrowRight />
        </Link>
      </section>
      <section className="section dark-section">
        <SectionHead
          kicker="04 · COMMUNITY IMPACT"
          title="Sổ Khách Quý"
          intro="Những vị khách chọn du lịch có trách nhiệm với ngôi nhà Sơn Trà."
        />
        <Link className="button button-lime" to="/so-khach-quy">
          Xem sổ khách quý <ArrowRight />
        </Link>
      </section>
      <section className="section cream-section">
        <SectionHead
          kicker="05 · TAKE ACTION"
          title="Hẹn gặp ở Sơn Trà"
          intro="Cùng lan tỏa tình yêu thiên nhiên và những hành động nhỏ có ích."
        />
        <Link className="button button-dark" to="/hen-gap">
          Xem hoạt động & tải toolkit <ArrowRight />
        </Link>
      </section>
    </>
  );
}

function HomeHeroUpload() {
  const [preview, setPreview] = useState<{
    url: string;
    name: string;
    type: 'image' | 'video';
  } | null>(null);
  const [message, setMessage] = useState('');

  useEffect(() => {
    if (!preview) return;
    return () => URL.revokeObjectURL(preview.url);
  }, [preview]);

  function handleUpload(file?: File) {
    if (!file) return;
    const isImage = ['image/png', 'image/jpeg', 'image/webp'].includes(file.type);
    const isVideo = ['video/mp4', 'video/webm'].includes(file.type);
    if (!isImage && !isVideo) {
      setMessage('Vui lòng chọn ảnh PNG, JPG, WEBP hoặc video MP4, WEBM.');
      return;
    }
    const maxSize = isImage ? 8 * 1024 * 1024 : 50 * 1024 * 1024;
    if (file.size > maxSize) {
      setMessage(`Dung lượng ${isImage ? 'ảnh' : 'video'} tối đa ${isImage ? '8' : '50'} MB.`);
      return;
    }
    setPreview({
      url: URL.createObjectURL(file),
      name: file.name,
      type: isImage ? 'image' : 'video',
    });
    setMessage('');
  }

  return (
    <div className="hero-art">
      <div className="hero-image-upload">
        {preview ? (
          preview.type === 'image' ? (
            <img className="hero-uploaded-image" src={preview.url} alt={preview.name} />
          ) : (
            <video
              className="hero-uploaded-image"
              src={preview.url}
              controls
              playsInline
              preload="metadata"
            >
              Trình duyệt không thể phát video này.
            </video>
          )
        ) : (
          <ForestArt />
        )}
        {preview && (
          <button
            type="button"
            className="hero-clear-image"
            onClick={() => {
              setPreview(null);
              setMessage('');
            }}
            aria-label="Xóa ảnh hoặc video đã tải lên"
          >
            <X size={17} />
          </button>
        )}
      </div>
      <label className="button button-lime hero-upload-button">
        {preview ? <ImagePlus size={20} /> : <Upload size={20} />}
        {preview ? 'Chọn ảnh/video khác' : 'Tải ảnh hoặc video lên'}
        <input
          type="file"
          accept="image/png,image/jpeg,image/webp,video/mp4,video/webm"
          onChange={(event) => {
            handleUpload(event.target.files?.[0]);
            event.target.value = '';
          }}
        />
      </label>
      {message && (
        <p className="hero-upload-message" role="alert">
          {message}
        </p>
      )}
    </div>
  );
}
