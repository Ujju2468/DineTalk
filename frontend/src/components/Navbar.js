import React from 'react';
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
    </nav>
  );
};

export default Navbar;
