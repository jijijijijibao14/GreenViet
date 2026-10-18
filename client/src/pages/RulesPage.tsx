import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { SectionHead, RuleCards } from '../components/shared';
export default function RulesPage() {
  return (
    <>
      <main className="section cream-section page-section">
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
        <div className="center-cta">
          <Link to="/ho-chieu" className="button button-dark">
            Tôi cam kết làm khách có gu <ArrowRight />
          </Link>
        </div>
      </main>
    </>
  );
}
