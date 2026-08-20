import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../utils/api';

const formatDate = (d) => new Date(d).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });

const MyRecipes = () => {
  const [recipes, setRecipes] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    api.get('/recipes/mine').then(res => setRecipes(res.data));
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this recipe?')) return;
    await api.delete(`/recipes/${id}`);
    setRecipes(r => r.filter(x => x._id !== id));
  };

  return (
    <div className="container">
      <div className="toolbar">
        <div className="page-header" style={{ marginBottom: 0 }}>
          <h1>My Recipes</h1>
          <p>Recipes you've added to the family cookbook</p>
        </div>
        <button className="btn" onClick={() => navigate('/recipes/new')}>✨ Add Recipe</button>
      </div>

      {recipes.length === 0 ? (
        <div className="empty-state" style={{ marginTop: 40 }}>
          <div className="empty-icon">👨‍🍳</div>
          <h3>Your cookbook is empty</h3>
          <p style={{ marginBottom: 20 }}>Start sharing your first recipe with the family!</p>
          <button className="btn" onClick={() => navigate('/recipes/new')}>✨ Add My First Recipe</button>
        </div>
      ) : (
        <div className="recipe-grid">
          {recipes.map(r => (
            <div key={r._id} className="card recipe-card" style={{ cursor: 'default' }}>
              <div className="recipe-img-wrap" onClick={() => navigate(`/recipes/${r._id}`)} style={{ cursor: 'pointer' }}>
                {r.image
                  ? <img src={r.image} alt={r.title} className="recipe-card-img" />
                  : <div className="recipe-img-placeholder">🍽</div>
                }
              </div>
              <div className="recipe-card-body">
                <div className="recipe-tags">
                  {(r.categories || ['Other']).slice(0, 2).map((c, i) => (
                    <span key={i} className="recipe-tag">{c}</span>
                  ))}
                </div>
                <h3 style={{ cursor: 'pointer' }} onClick={() => navigate(`/recipes/${r._id}`)}>{r.title}</h3>
                <div className="recipe-meta" style={{ marginBottom: 12 }}>
                  <span>🗓 {formatDate(r.createdAt)}</span>
                  <span>❤️ {r.likes?.length || 0}</span>
                </div>
                <div style={{ display: 'flex', gap: 8 }}>
                  <button className="btn btn-sm btn-outline" onClick={() => navigate(`/recipes/${r._id}`)}>View</button>
                  <button className="btn btn-sm btn-ghost" onClick={() => navigate(`/recipes/${r._id}/edit`)}>✏️ Edit</button>
                  <button className="btn btn-sm btn-danger" onClick={() => handleDelete(r._id)}>🗑</button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyRecipes;
