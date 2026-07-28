import React from 'react';
<<<<<<< HEAD
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="navbar">
      <Link to="/" className="navbar-brand">🍲 DinnerTalk</Link>
      <div className="navbar-links">
        {user ? (
          <>
            <Link to="/recipes">Recipes</Link>
            <Link to="/recipes/new">Add Recipe</Link>
            <Link to="/my-recipes">My Recipes</Link>
            <Link to="/groups">Groups</Link>
            <span style={{ color: '#8A7B6C' }}>Hi, {user.username}</span>
            <button className="btn btn-outline btn-sm" onClick={handleLogout}>Logout</button>
          </>
        ) : (
          <>
            <Link to="/login">Login</Link>
            <Link to="/register" className="btn btn-sm">Register</Link>
          </>
        )}
      </div>
=======
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const NAV_LINKS = [
  { to: '/recipes',     label: '📖 Recipes'    },
  { to: '/recipes/new', label: '✨ Add Recipe'  },
  { to: '/my-recipes',  label: '👨‍🍳 My Recipes' },
  { to: '/groups',      label: '💬 Groups'      },
];

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  

  const handleLogout = () => { logout(); navigate('/login'); };

  return (
    <nav className="navbar">
      <Link to="/" className="navbar-brand">
        🍲 Recipe&CHAT
      </Link>

      {user && (
        <div className="navbar-links">
          {NAV_LINKS.map(l => (
            <Link
              key={l.to}
              to={l.to}
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
>>>>>>> 97de632 (Ingridents store added, cook mode added and some other things fixed)
    </nav>
  );
};

export default Navbar;
