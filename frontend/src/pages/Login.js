import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
<<<<<<< HEAD
=======
  const [loading, setLoading] = useState(false);
>>>>>>> 97de632 (Ingridents store added, cook mode added and some other things fixed)
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
<<<<<<< HEAD
    e.preventDefault();
    setError('');
=======
    e.preventDefault(); setError(''); setLoading(true);
>>>>>>> 97de632 (Ingridents store added, cook mode added and some other things fixed)
    try {
      await login(email, password);
      navigate('/recipes');
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed');
<<<<<<< HEAD
    }
=======
    } finally { setLoading(false); }
>>>>>>> 97de632 (Ingridents store added, cook mode added and some other things fixed)
  };

  return (
    <div className="auth-page">
<<<<<<< HEAD
      <div className="card auth-card">
        <h2>Welcome back</h2>
        <form onSubmit={handleSubmit}>
          <label>Email</label>
          <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
          <label>Password</label>
          <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
          {error && <p className="error-text">{error}</p>}
          <button className="btn" style={{ width: '100%', marginTop: 18 }} type="submit">Login</button>
        </form>
        <p style={{ marginTop: 16, fontSize: '0.9rem' }}>
          No account? <Link to="/register">Register here</Link>
=======
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
>>>>>>> 97de632 (Ingridents store added, cook mode added and some other things fixed)
        </p>
      </div>
    </div>
  );
};

export default Login;
