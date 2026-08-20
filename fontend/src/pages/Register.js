import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Register = () => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault(); setError(''); setLoading(true);
    try {
      await register(username, email, password);
      navigate('/recipes');
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed');
    } finally { setLoading(false); }
  };

  return (
    <div className="auth-page">
      <div className="auth-bg-pattern" />
      <div className="card auth-card">
        <div style={{ textAlign: 'center', marginBottom: 24 }}>
          <div style={{ fontSize: '3rem', marginBottom: 8 }}>👨‍🍳</div>
          <h2>Join the family kitchen!</h2>
          <p className="auth-subtitle">Create your DinnerTalk account</p>
        </div>
        <form onSubmit={handleSubmit}>
          <label>Username</label>
          <div className="input-icon-wrap">
            <span className="input-icon">👤</span>
            <input value={username} onChange={e => setUsername(e.target.value)} required minLength={3} placeholder="e.g. MomsCooking" />
          </div>
          <label>Email</label>
          <div className="input-icon-wrap">
            <span className="input-icon">📧</span>
            <input type="email" value={email} onChange={e => setEmail(e.target.value)} required placeholder="you@example.com" />
          </div>
          <label>Password</label>
          <div className="input-icon-wrap">
            <span className="input-icon">🔒</span>
            <input type="password" value={password} onChange={e => setPassword(e.target.value)} required minLength={6} placeholder="Min. 6 characters" />
          </div>
          {error && <p className="error-text">{error}</p>}
          <button className="btn" style={{ width: '100%', marginTop: 22 }} type="submit" disabled={loading}>
            {loading ? 'Creating account...' : '🎉 Create Account'}
          </button>
        </form>
        <div className="divider">or</div>
        <p style={{ textAlign: 'center', fontSize: '0.9rem', color: 'var(--muted)' }}>
          Already have an account? <Link to="/login" style={{ fontWeight: 700 }}>Sign in</Link>
        </p>
      </div>
    </div>
  );
};

export default Register;
