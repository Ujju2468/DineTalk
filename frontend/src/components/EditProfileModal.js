import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';

const EditProfileModal = ({ onClose, mode = 'edit' }) => {
  const { user, updateUser } = useAuth();
  const [username, setUsername] = useState(user?.username || '');
  const [avatarUrl, setAvatarUrl] = useState(user?.avatarUrl || '');
  const [country, setCountry] = useState(user?.country || 'India');
  const [bio, setBio] = useState(user?.bio || 'Family Master Chef 👨‍🍳');
  const [saved, setSaved] = useState(false);

  const handleSave = (e) => {
    e.preventDefault();
    updateUser({
      username: username.trim() || user.username,
      avatarUrl: avatarUrl.trim(),
      country: country.trim(),
      bio: bio.trim()
    });
    setSaved(true);
    setTimeout(() => {
      setSaved(false);
      onClose();
    }, 800);
  };

  if (!user) return null;

  return (
    <div className="onboarding-overlay" onClick={onClose}>
      <div className="onboarding-modal" onClick={(e) => e.stopPropagation()} style={{ maxWidth: 520, padding: 0 }}>
        {/* Header */}
        <div style={{ background: 'linear-gradient(135deg, var(--accent-dark) 0%, var(--accent) 100%)', padding: '24px 28px', color: 'white' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h2 style={{ color: 'white', margin: 0, fontSize: '1.4rem', fontFamily: 'var(--font-display)' }}>
              {mode === 'view' ? '👤 Chef Profile' : '✏️ Edit Profile'}
            </h2>
            <button className="btn btn-xs btn-ghost" style={{ color: 'white' }} onClick={onClose}>
              ✕
            </button>
          </div>
          <p style={{ color: 'rgba(255,255,255,0.85)', margin: '4px 0 0', fontSize: '0.88rem' }}>
            {mode === 'view' ? 'Your family recipe store profile credentials.' : 'Update your username, avatar, and tagline.'}
          </p>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSave} style={{ padding: 24 }}>
          {/* Avatar Preview */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 20 }}>
            <div
              style={{
                width: 64,
                height: 64,
                borderRadius: '50%',
                background: 'linear-gradient(135deg, var(--accent), var(--gold))',
                color: 'white',
                fontSize: '1.8rem',
                fontWeight: 800,
                display: 'flex',
                alignItems: 'center',
                justify: 'center',
                overflow: 'hidden',
                border: '3px solid var(--border)'
              }}
            >
              {avatarUrl ? <img src={avatarUrl} alt={username} style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> : username.charAt(0).toUpperCase()}
            </div>
            <div>
              <h3 style={{ margin: 0, color: 'var(--accent-dark)' }}>{username || user.username}</h3>
              <p style={{ margin: '2px 0 0', color: 'var(--muted)', fontSize: '0.82rem' }}>📧 {user.email}</p>
            </div>
          </div>

          {mode === 'edit' ? (
            <>
              <label>Username</label>
              <input value={username} onChange={(e) => setUsername(e.target.value)} required />

              <label>Avatar Photo URL (Optional)</label>
              <input value={avatarUrl} onChange={(e) => setAvatarUrl(e.target.value)} placeholder="https://example.com/avatar.jpg" />

              <label>Country / Region</label>
              <input value={country} onChange={(e) => setCountry(e.target.value)} placeholder="e.g. India, USA, Canada" />

              <label>Bio / Tagline</label>
              <input value={bio} onChange={(e) => setBio(e.target.value)} placeholder="e.g. Master Biryani Chef 🍲" />

              {saved && <p className="success-text">✓ Profile updated successfully!</p>}

              <div style={{ display: 'flex', gap: 10, marginTop: 20 }}>
                <button className="btn" type="submit">
                  💾 Save Profile
                </button>
                <button className="btn btn-outline" type="button" onClick={onClose}>
                  Cancel
                </button>
              </div>
            </>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              <div className="card" style={{ background: 'var(--bg)', padding: 14 }}>
                <div style={{ fontSize: '0.78rem', color: 'var(--muted)', fontWeight: 700, textTransform: 'uppercase' }}>Bio</div>
                <div style={{ fontWeight: 600, fontSize: '0.95rem', color: 'var(--text)' }}>{user.bio || bio}</div>
              </div>
              <div className="card" style={{ background: 'var(--bg)', padding: 14 }}>
                <div style={{ fontSize: '0.78rem', color: 'var(--muted)', fontWeight: 700, textTransform: 'uppercase' }}>Location</div>
                <div style={{ fontWeight: 600, fontSize: '0.95rem', color: 'var(--text)' }}>🌍 {user.country || country}</div>
              </div>
              <button className="btn btn-outline" type="button" onClick={onClose} style={{ marginTop: 10 }}>
                Close
              </button>
            </div>
          )}
        </form>
      </div>
    </div>
  );
};

export default EditProfileModal;
