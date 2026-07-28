import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Register = () => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
<<<<<<< HEAD
=======
  const [loading, setLoading] = useState(false);
>>>>>>> 97de632 (Ingridents store added, cook mode added and some other things fixed)
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
<<<<<<< HEAD
    e.preventDefault();
    setError('');
=======
    e.preventDefault(); setError(''); setLoading(true);
>>>>>>> 97de632 (Ingridents store added, cook mode added and some other things fixed)
    try {
      await register(username, email, password);
      navigate('/recipes');
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed');
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
        <h2>Create account</h2>
        <form onSubmit={handleSubmit}>
          <label>Username</label>
          <input value={username} onChange={(e) => setUsername(e.target.value)} required minLength={3} />
          <label>Email</label>
          <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
          <label>Password</label>
          <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required minLength={6} />
          {error && <p className="error-text">{error}</p>}
          <button className="btn" style={{ width: '100%', marginTop: 18 }} type="submit">Register</button>
        </form>
        <p style={{ marginTop: 16, fontSize: '0.9rem' }}>
          Already have an account? <Link to="/login">Login here</Link>
=======
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
>>>>>>> 97de632 (Ingridents store added, cook mode added and some other things fixed)
        </p>
      </div>
    </div>
  );
};

export default Register;
