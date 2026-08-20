import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const NAV_LINKS = [
  { to: '/recipes',      label: '📖 Recipes'     },
  { to: '/recipes/new',  label: '✨ Add Recipe'   },
  { to: '/recipes/make', label: '🍲 What to Cook?' },
  { to: '/my-recipes',   label: '👨‍🍳 My Recipes'  },
  { to: '/groups',       label: '💬 Groups'       },
];

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [open, setOpen] = useState(false);

  const handleLogout = () => { logout(); navigate('/login'); setOpen(false); };
  const closeMenu = () => setOpen(false);

  return (
    <nav className="navbar">
      <Link to="/" className="navbar-brand" onClick={closeMenu}>
        🍲 Recipe&CHAT
      </Link>

      {user && (
        <button
          className="navbar-toggle"
          aria-label="Toggle menu"
          onClick={() => setOpen(o => !o)}
        >
          {open ? '✕' : '☰'}
        </button>
      )}

      {user && (
        <div className={`navbar-links ${open ? 'navbar-links-open' : ''}`}>
          {NAV_LINKS.map(l => (
            <Link
              key={l.to}
              to={l.to}
              onClick={closeMenu}
              style={{
                color: location.pathname.startsWith(l.to) && l.to !== '/' ? 'var(--accent)' : undefined,
                background: location.pathname.startsWith(l.to) && l.to !== '/' ? 'var(--accent-light)' : undefined,
              }}
            >
              {l.label}
            </Link>
          ))}
          <span className="nav-user">Hi, {user.username} 👋</span>
          <button className="btn btn-outline btn-sm" onClick={handleLogout}>Logout</button>
        </div>
      )}

      {!user && (
        <div className="navbar-links">
          <Link to="/login">Sign In</Link>
          <Link to="/register" className="btn btn-sm">Join Now</Link>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
