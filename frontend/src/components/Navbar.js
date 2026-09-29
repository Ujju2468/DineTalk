import React, { useState, useRef, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import EditProfileModal from './EditProfileModal';

const NAV_LINKS = [
  { to: '/recipes',     label: '📖 Recipes'    },
  { to: '/recipes/new', label: '✨ Add Recipe'  },
  { to: '/my-recipes',  label: '👨‍🍳 My Recipes' },
  { to: '/inventory',   label: '🧺 Inventory'   },
  { to: '/groups',      label: '💬 Groups'      },
];

const ACTION_WORDS = ['STORE', 'SHARE', 'ADD', 'CHAT'];

const THEMES = [
  { id: 'cream', name: 'Rustic Cream 🍂' },
  { id: 'botanical', name: 'Forest 🌿' },
  { id: 'spice', name: 'Spice 🌅' },
  { id: 'ironcore', name: 'Ironcore 🔴' },
  { id: 'antigravity', name: 'Antigravity 🌌' },
  { id: 'jungle', name: 'Jungle 🌴' },
];

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [showDropdown, setShowDropdown] = useState(false);
  const [profileModalMode, setProfileModalMode] = useState(null);
  const dropdownRef = useRef(null);

  // Auto-hide-into-tray: scrolling down tucks the navbar away into a small
  // floating pill; scrolling up (or tapping the pill) brings it right back.
  const [navHidden, setNavHidden] = useState(false);
  const lastScrollY = useRef(0);

  useEffect(() => {
    const handleScroll = () => {
      const y = window.scrollY;
      const delta = y - lastScrollY.current;
      if (y < 90) {
        setNavHidden(false);
      } else if (delta > 6) {
        setNavHidden(true);
      } else if (delta < -6) {
        setNavHidden(false);
      }
      lastScrollY.current = y;
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Smooth Action Word Fade-in Loop (ADD -> STORE -> SHARE -> CHAT)
  const [actionIdx, setActionIdx] = useState(0);
  const [fadeWord, setFadeWord] = useState(true);

  useEffect(() => {
    const timer = setInterval(() => {
      setFadeWord(false);
      setTimeout(() => {
        setActionIdx((prev) => (prev + 1) % ACTION_WORDS.length);
        setFadeWord(true);
      }, 200);
    }, 2400);
    return () => clearInterval(timer);
  }, []);

  // Theme Engine State (Default: Rustic Cream)
  const [currentTheme, setCurrentTheme] = useState(() => {
    return localStorage.getItem('app_theme') || 'cream';
  });

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', currentTheme);
    localStorage.setItem('app_theme', currentTheme);
  }, [currentTheme]);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = () => {
    setShowDropdown(false);
    logout();
    navigate('/login');
  };

  const handleBrandClick = (e) => {
    e.preventDefault();
    window.location.reload();
  };

  // Route Active Matcher Fix (e.g. /recipes/new should NOT activate /recipes)
  const isRouteActive = (targetPath) => {
    if (targetPath === '/recipes') {
      return location.pathname === '/recipes';
    }
    return location.pathname === targetPath;
  };

  return (
    <>
      <nav className={`navbar${navHidden ? ' navbar-hidden' : ''}`}>
        {/* Brand Title (RecipeBook in Catilya Font) & Smooth Tagline Loop */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
        <a
          href="/"
          onClick={handleBrandClick}
          className="navbar-brand"
          style={{
            cursor: 'pointer',
            fontFamily: 'var(--font-brand)',
            fontSize: '1.75rem',
            letterSpacing: '0.5px'
          }}
        >
          🍲 RecipeBook
        </a>

        {/* Ultra-Smooth Action Word Loop Badge */}
        <div
          className="badge"
          style={{
            background: 'var(--accent)',
            color: 'white',
            fontWeight: 800,
            fontSize: '0.76rem',
            padding: '4px 12px',
            borderRadius: 20,
            whiteSpace: 'nowrap',
            display: 'inline-flex',
            alignItems: 'center',
            gap: 4
          }}
        >
          <span
            style={{
              color: 'var(--gold)',
              display: 'inline-block',
              transition: 'all 0.22s ease-in-out',
              opacity: fadeWord ? 1 : 0,
              transform: fadeWord ? 'translateY(0)' : 'translateY(-4px)'
            }}
          >
            {ACTION_WORDS[actionIdx]}
          </span>
          <span>RECIPES</span>
        </div>
      </div>

      {user && (
        <div className="navbar-links">
          {NAV_LINKS.map((l) => {
            const active = isRouteActive(l.to);
            return (
              <Link
                key={l.to}
                to={l.to}
                style={{
                  color: active ? 'var(--nav-active-text)' : undefined,
                  background: active ? 'var(--nav-active-bg)' : undefined,
                  border: active ? '1px solid var(--accent)' : '1px solid transparent'
                }}
              >
                {l.label}
              </Link>
            );
          })}

          {/* Theme Selector Selector Pill */}
          <select
            value={currentTheme}
            onChange={(e) => setCurrentTheme(e.target.value)}
            style={{
              padding: '5px 12px',
              borderRadius: 20,
              fontSize: '0.82rem',
              fontWeight: 700,
              background: 'var(--surface)',
              color: 'var(--text)',
              border: '1.5px solid var(--border)',
              cursor: 'pointer',
              width: 'auto'
            }}
            title="Switch App Theme"
          >
            {THEMES.map((t) => (
              <option key={t.id} value={t.id}>
                {t.name}
              </option>
            ))}
          </select>

          {/* Profile Dropdown */}
          <div className="profile-dropdown-container" ref={dropdownRef}>
            <button className="profile-trigger-btn" onClick={() => setShowDropdown(!showDropdown)}>
              <div className="profile-avatar-circle">
                {user.avatarUrl ? (
                  <img src={user.avatarUrl} alt={user.username} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                ) : (
                  user.username.charAt(0).toUpperCase()
                )}
              </div>
              <span style={{ fontWeight: 700, fontSize: '0.88rem', color: 'var(--text)' }}>
                {user.username}
              </span>
              <span style={{ fontSize: '0.7rem', color: 'var(--muted)' }}>▼</span>
            </button>

            {showDropdown && (
              <div className="profile-dropdown-menu">
                <div style={{ padding: '8px 12px 10px', borderBottom: '1px solid var(--border)', marginBottom: 4 }}>
                  <div style={{ fontWeight: 800, fontSize: '0.92rem', color: 'var(--accent)' }}>{user.username}</div>
                  <div style={{ fontSize: '0.76rem', color: 'var(--muted)' }}>{user.email}</div>
                  <div style={{ fontSize: '0.72rem', color: 'var(--gold)', marginTop: 4, fontWeight: 700 }}>
                    Theme: {THEMES.find((t) => t.id === currentTheme)?.name}
                  </div>
                </div>

                <button
                  className="profile-menu-item"
                  onClick={() => {
                    setShowDropdown(false);
                    setProfileModalMode('view');
                  }}
                >
                  👤 My Profile
                </button>

                <button
                  className="profile-menu-item"
                  onClick={() => {
                    setShowDropdown(false);
                    setProfileModalMode('edit');
                  }}
                >
                  ✏️ Edit Profile
                </button>

                <div style={{ borderTop: '1px solid var(--border)', margin: '4px 0' }} />

                <button className="profile-menu-item danger" onClick={handleLogout}>
                  🚪 Sign Out
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {profileModalMode && <EditProfileModal mode={profileModalMode} onClose={() => setProfileModalMode(null)} />}

      {!user && (
        <div className="navbar-links">
          <Link to="/login">Sign In</Link>
          <Link to="/register" className="btn btn-sm">
            Join Now
          </Link>
        </div>
      )}
      </nav>

      {/* Collapsed pill shown while the navbar is tucked away — click to bring it back */}
      <div
        className={`navbar-tray${navHidden ? ' visible' : ''}`}
        onClick={() => setNavHidden(false)}
        title="Show navigation"
      >
        <span className="tray-dot" />
        🍲 RecipeBook
      </div>
    </>
  );
};

export default Navbar;
