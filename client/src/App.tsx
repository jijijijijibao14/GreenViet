import { useEffect, useState } from 'react';
import { Link, NavLink, Route, Routes, useLocation } from 'react-router-dom';
import { Leaf, Menu, X, LogIn, LogOut } from 'lucide-react';
import HomePage from './pages/HomePage';
import RulesPage from './pages/RulesPage';
import PassportPage from './pages/PassportPage';
import GuestBookPage from './pages/GuestBookPage';
import MeetupPage from './pages/MeetupPage';
import ContactPage from './pages/ContactPage';
import AuthPage from './pages/AuthPage';
import { API, Footer, User } from './components/shared';

function isUser(value: unknown): value is User {
  if (!value || typeof value !== 'object') return false;
  const user = value as Record<string, unknown>;
  return (
    typeof user.id === 'string' && typeof user.name === 'string' && typeof user.email === 'string'
  );
}

function readStoredUser(): User | null {
  try {
    if (!localStorage.getItem('gv_token')) return null;
    const stored = localStorage.getItem('gv_user');
    if (!stored) return null;
    const user: unknown = JSON.parse(stored);
    return isUser(user) ? user : null;
  } catch {
    return null;
  }
}

export default function App() {
  const [user, setUser] = useState<User | null>(readStoredUser);
  const [token, setToken] = useState(() => localStorage.getItem('gv_token') || '');
  const [notice, setNotice] = useState('');
  const [mobileMenu, setMobileMenu] = useState(false);
  const location = useLocation();

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    setMobileMenu(false);
  }, [location.pathname]);

  useEffect(() => {
    if (!token) return;

    let isActive = true;
    async function restoreSession() {
      try {
        const response = await fetch(`${API}/auth/me`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data: unknown = await response.json();
        if (!isActive) return;

        if (response.status === 401) {
          setToken('');
          setUser(null);
          localStorage.removeItem('gv_token');
          localStorage.removeItem('gv_user');
          setNotice('Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.');
          return;
        }

        if (!response.ok) {
          const message =
            data &&
            typeof data === 'object' &&
            'message' in data &&
            typeof data.message === 'string'
              ? data.message
              : 'Không thể xác minh phiên đăng nhập.';
          throw new Error(message);
        }
        if (!data || typeof data !== 'object' || !('user' in data) || !isUser(data.user)) {
          throw new Error('Máy chủ trả về dữ liệu phiên đăng nhập không hợp lệ.');
        }

        setUser(data.user);
        localStorage.setItem('gv_user', JSON.stringify(data.user));
      } catch (error) {
        if (isActive) {
          setNotice(error instanceof Error ? error.message : 'Không thể kết nối máy chủ.');
        }
      }
    }

    void restoreSession();
    return () => {
      isActive = false;
    };
  }, [token]);

  function login(data: { token: string; user: User }) {
    setToken(data.token);
    setUser(data.user);
    localStorage.setItem('gv_token', data.token);
    localStorage.setItem('gv_user', JSON.stringify(data.user));
    setNotice('Đăng nhập thành công!');
  }

  function logout() {
    setToken('');
    setUser(null);
    localStorage.removeItem('gv_token');
    localStorage.removeItem('gv_user');
    setNotice('Bạn đã đăng xuất.');
  }

  return (
    <div className="app-shell">
      <header className="header">
        <Link className="brand" to="/">
          <span className="brand-mark">
            <Leaf size={25} />
          </span>
          <b>GreenViet</b>
        </Link>
        <span className="brand-divider" />
        <NavLink className="campaign-link" to="/">
          Khách có gu
        </NavLink>
        <button
          className="menu-toggle"
          onClick={() => setMobileMenu(!mobileMenu)}
          aria-label={mobileMenu ? 'Đóng menu' : 'Mở menu'}
          aria-expanded={mobileMenu}
        >
          {mobileMenu ? <X /> : <Menu />}
        </button>
        <nav className={mobileMenu ? 'nav nav-open' : 'nav'}>
          {[
            ['Nội quy nhà Voọc', '/noi-quy'],
            ['Hộ chiếu', '/ho-chieu'],
            ['Sổ khách quý', '/so-khach-quy'],
            ['Hẹn ở Sơn Trà', '/hen-gap'],
            ['Liên hệ', '/lien-he'],
          ].map(([label, path]) => (
            <NavLink key={path} to={path}>
              {label}
            </NavLink>
          ))}
          {user ? (
            <button className="nav-auth" onClick={logout}>
              <LogOut size={16} /> Đăng xuất
            </button>
          ) : (
            <>
              <Link className="nav-auth" to="/dang-nhap">
                <LogIn size={16} /> Đăng nhập
              </Link>
              <Link className="nav-register" to="/dang-ky">
                Đăng ký
              </Link>
            </>
          )}
        </nav>
      </header>
      {notice && (
        <button className="toast" onClick={() => setNotice('')} role="status">
          {notice}
          <X size={15} />
        </button>
      )}
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/noi-quy" element={<RulesPage />} />
        <Route
          path="/ho-chieu"
          element={
            <PassportPage
              user={user}
              token={token}
              onNeedLogin={() => setNotice('Bạn hãy đăng nhập để lưu hộ chiếu lên Sổ khách quý.')}
            />
          }
        />
        <Route path="/so-khach-quy" element={<GuestBookPage />} />
        <Route path="/hen-gap" element={<MeetupPage />} />
        <Route path="/lien-he" element={<ContactPage />} />
        <Route path="/dang-nhap" element={<AuthPage mode="login" onLogin={login} />} />
        <Route path="/dang-ky" element={<AuthPage mode="register" onLogin={login} />} />
        <Route path="*" element={<HomePage />} />
      </Routes>
      <Footer />
    </div>
  );
}
