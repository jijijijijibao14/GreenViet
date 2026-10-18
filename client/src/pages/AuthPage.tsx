import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowRight, Leaf } from 'lucide-react';
import { API, User } from '../components/shared';

type AuthResponse = { token: string; user: User };

function isAuthResponse(value: unknown): value is AuthResponse {
  if (!value || typeof value !== 'object') return false;
  const result = value as Record<string, unknown>;
  if (typeof result.token !== 'string' || !result.user || typeof result.user !== 'object')
    return false;
  const user = result.user as Record<string, unknown>;
  return (
    typeof user.id === 'string' && typeof user.name === 'string' && typeof user.email === 'string'
  );
}

export default function AuthPage({
  mode,
  onLogin,
}: {
  mode: 'login' | 'register';
  onLogin: (data: AuthResponse) => void;
}) {
  const nav = useNavigate();
  const [form, setForm] = useState({ name: '', email: '', password: '', confirm: '' });
  const [message, setMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const isRegister = mode === 'register';

  function change(event: React.ChangeEvent<HTMLInputElement>) {
    setForm((current) => ({ ...current, [event.target.name]: event.target.value }));
    setMessage('');
  }

  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setMessage('');

    if (isRegister && form.password !== form.confirm) {
      setMessage('Mật khẩu xác nhận chưa khớp.');
      return;
    }

    setIsSubmitting(true);
    try {
      const payload = isRegister
        ? { name: form.name, email: form.email, password: form.password }
        : { email: form.email, password: form.password };
      const response = await fetch(`${API}/auth/${mode}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      const data: unknown = await response.json();

      if (!response.ok) {
        const errorMessage =
          data && typeof data === 'object' && 'message' in data && typeof data.message === 'string'
            ? data.message
            : 'Không thể xác thực tài khoản.';
        throw new Error(errorMessage);
      }

      if (!isAuthResponse(data)) {
        throw new Error('Máy chủ trả về dữ liệu tài khoản không hợp lệ.');
      }

      onLogin(data);
      nav('/');
    } catch (error) {
      setMessage(error instanceof Error ? error.message : 'Không thể kết nối máy chủ.');
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <main className="auth-page">
      <div className="auth-card">
        <span className="brand-mark">
          <Leaf />
        </span>
        <span className="kicker">GREENVIET · SƠN TRÀ</span>
        <h1>{isRegister ? 'Trở thành Khách có gu' : 'Chào mừng trở lại'}</h1>
        <p>
          {isRegister
            ? 'Tạo tài khoản để lưu và quản lý hộ chiếu.'
            : 'Đăng nhập để lưu hộ chiếu của bạn.'}
        </p>
        <form onSubmit={submit}>
          {isRegister && (
            <input
              className="text-input"
              name="name"
              value={form.name}
              onChange={change}
              required
              maxLength={50}
              autoComplete="name"
              placeholder="Họ tên"
              aria-label="Họ tên"
            />
          )}
          <input
            className="text-input"
            type="email"
            name="email"
            value={form.email}
            onChange={change}
            required
            autoComplete="email"
            placeholder="Email"
            aria-label="Email"
          />
          <input
            className="text-input"
            type="password"
            name="password"
            value={form.password}
            onChange={change}
            required
            minLength={8}
            autoComplete={isRegister ? 'new-password' : 'current-password'}
            placeholder="Mật khẩu (ít nhất 8 ký tự)"
            aria-label="Mật khẩu"
          />
          {isRegister && (
            <input
              className="text-input"
              type="password"
              name="confirm"
              value={form.confirm}
              onChange={change}
              required
              minLength={8}
              autoComplete="new-password"
              placeholder="Nhập lại mật khẩu"
              aria-label="Nhập lại mật khẩu"
            />
          )}
          <button className="button button-dark full-width" type="submit" disabled={isSubmitting}>
            {isSubmitting ? 'Đang xử lý...' : isRegister ? 'Đăng ký' : 'Đăng nhập'}
            {!isSubmitting && <ArrowRight />}
          </button>
          {message && (
            <p className="form-message" role="alert">
              {message}
            </p>
          )}
        </form>
        <p className="auth-switch">
          {isRegister ? 'Đã có tài khoản? ' : 'Chưa có tài khoản? '}
          <Link to={isRegister ? '/dang-nhap' : '/dang-ky'}>
            {isRegister ? 'Đăng nhập' : 'Đăng ký'}
          </Link>
        </p>
        <Link className="back-home" to="/">
          ← Trở về trang chủ
        </Link>
      </div>
    </main>
  );
}
