import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault(); setError(''); setLoading(true);
    try {
      await login(email, password);
      navigate('/recipes');
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed');
    } finally { setLoading(false); }
  };

  return (
    <div className="auth-page">
      <div className="auth-bg-pattern" />
      <div className="card auth-card">
        <div style={{ textAlign: 'center', marginBottom: 24 }}>
          <div style={{ fontSize: '3rem', marginBottom: 8 }}>🍲</div>
          <h2>Welcome back!</h2>
          <p className="auth-subtitle">Sign in to your family kitchen</p>
        </div>
        <form onSubmit={handleSubmit}>
          <label>Email</label>
          <div className="input-icon-wrap">
            <span className="input-icon">📧</span>
            <input type="email" value={email} onChange={e => setEmail(e.target.value)} required placeholder="you@example.com" />
          </div>
          <label>Password</label>
          <div className="input-icon-wrap">
            <span className="input-icon">🔒</span>
            <input type="password" value={password} onChange={e => setPassword(e.target.value)} required placeholder="Your password" />
          </div>
          {error && <p className="error-text">{error}</p>}
          <button className="btn" style={{ width: '100%', marginTop: 22 }} type="submit" disabled={loading}>
            {loading ? 'Signing in...' : '🍴 Sign In'}
          </button>
        </form>
        <div className="divider">or</div>
        <p style={{ textAlign: 'center', fontSize: '0.9rem', color: 'var(--muted)' }}>
          New to DinnerTalk? <Link to="/register" style={{ fontWeight: 700 }}>Create an account</Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
