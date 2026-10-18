import { useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Eye, Ban, Waypoints, Leaf, Download, Upload } from 'lucide-react';
import { toPng } from 'html-to-image';
import { API, User, templates, ForestArt, SectionHead } from '../components/shared';
export default function PassportPage({
  user,
  token,
  onNeedLogin,
}: {
  user: User | null;
  token: string;
  onNeedLogin: () => void;
}) {
  const [template, setTemplate] = useState(0);
  const [name, setName] = useState(user?.name || 'Minh Anh');
  const [checks, setChecks] = useState([true, true, true]);
  const [image, setImage] = useState('');
  const [msg, setMsg] = useState('');
  const cardRef = useRef<HTMLDivElement>(null);
  const allChecked = checks.every(Boolean);
  async function downloadCard() {
    if (!allChecked || !name.trim()) {
      setMsg('Hãy tích đủ 3 cam kết và nhập tên hiển thị.');
      return;
    }
    if (!cardRef.current) return;
    try {
      const data = await toPng(cardRef.current, { pixelRatio: 2, cacheBust: true });
      const a = document.createElement('a');
      a.href = data;
      a.download = `ho-chieu-khach-co-gu-${name.trim().replace(/\s+/g, '-')}.png`;
      a.click();
      setMsg('Đã tải hộ chiếu PNG về thiết bị!');
    } catch {
      setMsg('Không tạo được ảnh. Hãy thử lại.');
    }
  }
  async function saveCard() {
    if (!token) {
      onNeedLogin();
      setMsg('Đăng nhập để lưu hộ chiếu vào Sổ khách quý.');
      return;
    }
    if (!allChecked || !name.trim()) {
      setMsg('Hãy tích đủ cam kết và nhập tên.');
      return;
    }
    try {
      const imageData = cardRef.current ? await toPng(cardRef.current, { pixelRatio: 1 }) : '';
      const r = await fetch(`${API}/passports`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ displayName: name, template, imageData, isPublic: true }),
      });
      const d = await r.json();
      if (!r.ok) throw new Error(d.message);
      setMsg('Đã lưu hộ chiếu lên Sổ khách quý!');
    } catch (e) {
      setMsg(e instanceof Error ? e.message : 'Lỗi lưu hộ chiếu.');
    }
  }
  async function uploadFile(file?: File) {
    if (!file) return;
    if (file.size > 2 * 1024 * 1024) {
      setMsg('Ảnh tối đa 2 MB.');
      return;
    }
    if (!file.type.startsWith('image/')) {
      setMsg('Vui lòng chọn một tệp ảnh.');
      return;
    }
    const reader = new FileReader();
    reader.onload = () => {
      setImage(String(reader.result));
      setMsg('Đã tải ảnh lên bản xem trước.');
    };
    reader.readAsDataURL(file);
  }
  return (
    <>
      <main className="section light-section page-section">
        <SectionHead
          kicker="03 · TAKE THE PLEDGE"
          title="Hộ chiếu Khách có gu"
          intro="Chọn ảnh voọc, tích cam kết, đặt tên. Tải PNG ngay trên trình duyệt; đăng nhập nếu muốn lưu vào Sổ khách quý."
        />
        <div className="passport-layout">
          <div className="passport-controls">
            <h3>
              <span className="step">1</span> Chọn ảnh voọc
            </h3>
            <div className="template-row">
              {templates.map((c, i) => (
                <button
                  key={c}
                  className={`template-swatch ${template === i ? 'selected' : ''}`}
                  style={{ background: c }}
                  onClick={() => {
                    setTemplate(i);
                    setImage('');
                  }}
                  aria-label={`Chọn mẫu ${i + 1}`}
                >{`Ảnh ${i + 1}${template === i ? ' ✓' : ''}`}</button>
              ))}
            </div>
            <p className="helper">Mẫu minh họa tự tạo; có thể tải ảnh của bạn lên để xem trước.</p>
            <label className="upload-button">
              <Upload size={18} /> Tải ảnh từ thiết bị
              <input
                type="file"
                accept="image/png,image/jpeg,image/webp"
                onChange={(e) => uploadFile(e.target.files?.[0])}
              />
            </label>
            <h3>
              <span className="step">2</span> Xác nhận cam kết
            </h3>
            <div className="pledges">
              {[
                'Tôi sẽ bình tĩnh quan sát, không vội tiến lại gần voọc.',
                'Tôi sẽ cất đồ ăn và không cho voọc ăn.',
                'Tôi sẽ giữ khoảng cách an toàn và tôn trọng không gian sống của voọc.',
              ].map((s, i) => (
                <label className="pledge" key={s}>
                  <input
                    type="checkbox"
                    checked={checks[i]}
                    onChange={(e) =>
                      setChecks((old) => old.map((v, j) => (i === j ? e.target.checked : v)))
                    }
                  />
                  <span>{s}</span>
                </label>
              ))}
            </div>
            <h3>
              <span className="step">3</span> Tên hiển thị hoặc biệt danh
            </h3>
            <input
              className="text-input"
              value={name}
              onChange={(e) => setName(e.target.value)}
              maxLength={40}
              placeholder="Ví dụ: Minh Anh"
            />
            <p className="helper">
              Tên này sẽ xuất hiện trên hộ chiếu. Đừng nhập thông tin riêng tư.
            </p>
            {msg && <p className="form-message">{msg}</p>}
            <div className="action-row">
              <button className="button button-dark" onClick={downloadCard}>
                <Download size={18} /> Tải Hộ chiếu PNG
              </button>
              <button className="button button-outline" onClick={saveCard}>
                Lưu Sổ khách quý
              </button>
            </div>
          </div>
          <div className="passport-preview-wrap">
            <div className="passport-card" ref={cardRef}>
              <div className="passport-top">
                <div>
                  <small>GREENVIET · SƠN TRÀ</small>
                  <h3>HỘ CHIẾU KHÁCH CÓ GU</h3>
                </div>
                <span className="passport-stamp">
                  <Leaf />
                </span>
              </div>
              <div className="passport-main">
                <div className="passport-photo" style={{ background: templates[template] }}>
                  {image ? <img src={image} alt="Ảnh tải lên" /> : <ForestArt />}
                </div>
                <div className="passport-info">
                  <small>TÊN KHÁCH</small>
                  <h2>{name || 'Tên của bạn'}</h2>
                  <p>Khách có gu, giữ ý với Voọc</p>
                  <div className="mini-icons">
                    <span>
                      <Eye />
                    </span>
                    <span>
                      <Ban />
                    </span>
                    <span>
                      <Waypoints />
                    </span>
                  </div>
                </div>
              </div>
              <div className="passport-bottom">
                <p>
                  <b>Nhà Voọc, bạn là khách</b>
                  <br />
                  Tôi cam kết du lịch có trách nhiệm.
                </p>
                <div className="qr-placeholder">
                  GV
                  <br />✓
                </div>
              </div>
            </div>
            <p className="helper center">Bản xem trước · chỉ tải ảnh bạn có quyền sử dụng.</p>
          </div>
        </div>
      </main>
    </>
  );
}
