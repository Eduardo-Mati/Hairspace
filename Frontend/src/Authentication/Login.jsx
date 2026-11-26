import { useState } from 'react';
import { Link, Navigate, useNavigate } from 'react-router-dom';
import { api } from '../lib/api';
import { useAdminAuth } from './useAdminAuth';
import './Login.css';

export function LoginScreen() {
  const navigate = useNavigate();
  const { session, login } = useAdminAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  if (session?.user?.role === 'admin') {
    return <Navigate to="/admin" replace />;
  }

  const handleLogin = async (event) => {
    event.preventDefault();
    setError('');
    setSubmitting(true);

    try {
      const data = await api.login({ email, password });
      login(data);
      navigate('/admin', { replace: true });
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <main className="login-screen">
      <section className="login-card" aria-labelledby="login-title">
        <div className="login-card__brand">Hairspace</div>
        <p className="login-card__eyebrow">Área administrativa</p>
        <h1 id="login-title">Acesse sua barbearia</h1>
        <p className="login-card__description">
          Entre com a conta de administrador vinculada à sua barbearia.
        </p>

        <form className="login-form" onSubmit={handleLogin}>
          <label htmlFor="admin-email">E-mail</label>
          <input
            id="admin-email"
            type="email"
            autoComplete="username"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            required
          />

          <label htmlFor="admin-password">Senha</label>
          <input
            id="admin-password"
            type="password"
            autoComplete="current-password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            required
          />

          {error && <p className="login-form__error" role="alert">{error}</p>}

          <button type="submit" disabled={submitting}>
            {submitting ? 'Entrando...' : 'Entrar'}
          </button>
        </form>

        <Link className="login-card__back" to="/">Voltar ao mapa</Link>
      </section>
    </main>
  );
}
