import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { API, Passport, templates, SectionHead } from '../components/shared';
export default function GuestBookPage() {
  const [items, setItems] = useState<Passport[]>([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    fetch(`${API}/passports`)
      .then((r) => r.json())
      .then((d) => setItems(Array.isArray(d) ? d : []))
      .catch(() => setItems([]))
      .finally(() => setLoading(false));
  }, []);
  return (
    <>
      <main className="section dark-section page-section">
        <SectionHead
          kicker="04 · COMMUNITY IMPACT"
          title="Sổ Khách Quý"
          intro="Mỗi hộ chiếu công khai là một lời nhắc: đến Sơn Trà, hãy làm một vị khách tử tế."
        />
        <div className="stats-banner">
          Đã có <strong>{items.length}</strong> lượt cam kết Khách có gu.
        </div>
        {loading ? (
          <p>Đang tải danh sách…</p>
        ) : (
          <div className="guest-grid">
            {items.map((item, i) => (
              <article className="guest-card" key={item._id || item.id || i}>
                <div
                  className="guest-art"
                  style={{ background: templates[item.template % templates.length] }}
                >
                  <span>HỘ CHIẾU KHÁCH CÓ GU</span>
                </div>
                <h3>{item.displayName}</h3>
                <p>Khách có gu · Sơn Trà</p>
              </article>
            ))}
            {items.length === 0 && (
              <div className="empty-state">
                Chưa có hộ chiếu nào được công khai.
                <br />
                Hãy là người đầu tiên!
              </div>
            )}
          </div>
        )}
        <div className="guest-bottom">
          <p>
            Hộ chiếu chỉ xuất hiện ở đây khi bạn đồng ý công khai. Bạn có thể tải hộ chiếu PNG mà
            không cần đăng nhập.
          </p>
          <Link to="/ho-chieu" className="button button-lime">
            Lấy Hộ chiếu của bạn <ArrowRight />
          </Link>
        </div>
      </main>
    </>
  );
}
