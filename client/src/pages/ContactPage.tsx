import { useState } from 'react';
import { ArrowRight } from 'lucide-react';
import { SectionHead, API } from '../components/shared';
export default function ContactPage() {
  const [form, setForm] = useState({ name: '', email: '', type: 'Liên hệ', message: '' });
  const [msg, setMsg] = useState('');
  const change = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>,
  ) => setForm({ ...form, [e.target.name]: e.target.value });
  async function submit(e: React.FormEvent) {
    e.preventDefault();
    try {
      const r = await fetch(`${API}/reports`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      const d = await r.json();
      if (!r.ok) throw new Error(d.message);
      setMsg(d.message);
      setForm({ name: '', email: '', type: 'Liên hệ', message: '' });
    } catch (e) {
      setMsg(e instanceof Error ? e.message : 'Không gửi được. Hãy kiểm tra backend.');
    }
  }
  return (
    <>
      <main className="section light-section page-section">
        <SectionHead
          kicker="06 · TRUST & CONTACT"
          title="Bảo chứng & liên hệ"
          intro="Tìm hiểu chiến dịch, gửi phản hồi hoặc báo cáo tình huống cần hỗ trợ tại Sơn Trà."
        />
        <div className="contact-grid">
          <article className="info-card">
            <h3>Về GreenViet</h3>
            <p>
              Trung tâm Bảo tồn Đa dạng Sinh học Nước Việt Nam. Nội dung giới thiệu và đường dẫn
              chính thức cần được đơn vị xác minh trước khi phát hành.
            </p>
            <a href="https://greenviet.org/" target="_blank" rel="noreferrer">
              Website GreenViet ↗
            </a>
          </article>
          <article className="info-card">
            <h3>Báo cáo sự cố</h3>
            <p>
              Thấy người cho voọc ăn, gây xáo trộn hoặc voọc gặp nguy hiểm? Báo cho đơn vị quản lý,
              đừng tiến lại gần để quay chụp hay tự xử lý.
            </p>
            <p className="contact-note">Hotline / kênh báo cáo: cập nhật sau khi được xác minh.</p>
          </article>
          <article className="info-card">
            <h3>Nguồn & chính sách</h3>
            <ul>
              <li>Tài liệu khoa học về voọc chà vá chân nâu</li>
              <li>Quy định chính thức tại Sơn Trà</li>
              <li>Chính sách quyền riêng tư</li>
              <li>Yêu cầu chỉnh sửa hoặc xóa dữ liệu</li>
            </ul>
          </article>
        </div>
        <form className="contact-form" onSubmit={submit}>
          <h3>Gửi lời nhắn</h3>
          <div className="form-row">
            <input
              className="text-input"
              name="name"
              value={form.name}
              onChange={change}
              placeholder="Họ tên (không bắt buộc)"
            />
            <input
              className="text-input"
              type="email"
              name="email"
              value={form.email}
              onChange={change}
              placeholder="Email (không bắt buộc)"
            />
          </div>
          <select className="text-input" name="type" value={form.type} onChange={change}>
            <option>Liên hệ</option>
            <option>Báo cáo sự cố</option>
            <option>Góp ý nội dung</option>
          </select>
          <textarea
            className="text-input"
            required
            name="message"
            value={form.message}
            onChange={change}
            placeholder="Nội dung bạn muốn gửi…"
            rows={5}
          />
          <button className="button button-dark">
            Gửi thông tin <ArrowRight />
          </button>
          {msg && <p className="form-message">{msg}</p>}
        </form>
      </main>
    </>
  );
}
