import React from 'react';
import { Eye, Ban, Waypoints } from 'lucide-react';
export const API = import.meta.env.VITE_API_URL || 'http://localhost:4000/api';
export type User = { id: string; name: string; email: string };
export type Passport = {
  _id?: string;
  id?: string;
  displayName: string;
  template: number;
  createdAt?: string;
};
export const templates = ['#1c6048', '#984629', '#5c796a', '#24604b'];
export function Chip({ icon, text }: { icon: React.ReactNode; text: string }) {
  return (
    <div className="rule-chip">
      <span>{icon}</span>
      <b>{text}</b>
    </div>
  );
}
export function ForestArt() {
  return (
    <div className="forest-art" aria-label="Minh họa voọc chà vá chân nâu">
      <div className="sun" />
      <div className="leaf-shape" />
      <div className="hill hill-one" />
      <div className="hill hill-two" />
      <div className="branch" />
      <div className="monkey">
        <div className="head">
          <i />
          <i />
          <b />
        </div>
        <div className="body" />
        <div className="arm" />
        <div className="leg leg-a" />
        <div className="leg leg-b" />
      </div>
    </div>
  );
}
export function SectionHead({
  kicker,
  title,
  intro,
}: {
  kicker: string;
  title: React.ReactNode;
  intro: string;
}) {
  return (
    <div className="section-head">
      <div>
        <span className="kicker">{kicker}</span>
        <h2>{title}</h2>
      </div>
      <p>{intro}</p>
    </div>
  );
}
const rules = [
  {
    n: 'BƯỚC 1',
    title: 'Bình tĩnh quan sát',
    icon: <Eye />,
    items: [
      'Không đột ngột tiến lại gần.',
      'Không đuổi theo, bao vây hay thu hút sự chú ý của voọc.',
      'Hạn chế tiếng ồn và hành động gây xáo trộn.',
    ],
  },
  {
    n: 'BƯỚC 2',
    title: 'Cất đồ ăn',
    icon: <Ban />,
    items: [
      'Không cho voọc ăn dưới bất kỳ hình thức nào.',
      'Không dùng thức ăn để dụ voọc hay tạo dáng chụp ảnh.',
      'Giữ đồ ăn và rác được cất gọn.',
    ],
  },
  {
    n: 'BƯỚC 3',
    title: 'Giữ khoảng cách an toàn',
    icon: <Waypoints />,
    items: [
      'Không chủ động tiến lại gần voọc.',
      'Nếu voọc đến gần, bình tĩnh giữ khoảng cách, không chặn đường của chúng.',
      'Tuân thủ biển báo và hướng dẫn của người quản lý.',
    ],
  },
];
export function RuleCards() {
  return (
    <div className="rule-grid">
      {rules.map((r) => (
        <article className="rule-card" key={r.n}>
          <div className="rule-title">
            <span className="icon-box">{r.icon}</span>
            <div>
              <small>{r.n}</small>
              <h3>{r.title}</h3>
            </div>
          </div>
          <ul>
            {r.items.map((i) => (
              <li key={i}>{i}</li>
            ))}
          </ul>
        </article>
      ))}
    </div>
  );
}
export function Footer() {
  return (
    <footer className="footer">
      <div>
        <b>© GreenViet · Chiến dịch “Khách có gu”</b>
        <p>Nội dung website là bản MVP minh họa, cần được đơn vị xác minh trước khi phát hành.</p>
      </div>
      <span>Nhà Voọc, bạn là khách.</span>
    </footer>
  );
}
