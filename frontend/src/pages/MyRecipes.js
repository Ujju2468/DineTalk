import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../utils/api';

const MyRecipes = () => {
  const [recipes, setRecipes] = useState([]);
  const navigate = useNavigate();

  const fetchMine = async () => {
    const res = await api.get('/recipes/mine');
    setRecipes(res.data);
  };

  useEffect(() => {
    fetchMine();
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this recipe?')) return;
    await api.delete(`/recipes/${id}`);
    setRecipes(recipes.filter((r) => r._id !== id));
  };

  return (
    <div className="container">
      <div className="toolbar">
        <h2>My Recipes</h2>
        <button className="btn" onClick={() => navigate('/recipes/new')}>+ Add Recipe</button>
      </div>

      {recipes.length === 0 ? (
        <div className="empty-state">You haven't added any recipes yet.</div>
      ) : (
        <div className="recipe-grid">
          {recipes.map((r) => (
            <div key={r._id} className="card recipe-card">
              {r.image ? <img src={r.image} alt={r.title} /> : <div className="recipe-img-placeholder" />}
              <div className="recipe-card-body">
                <span className="recipe-tag">{r.category}</span>
                <h3>{r.title}</h3>
                <div style={{ display: 'flex', gap: 8, marginTop: 10 }}>
                  <button className="btn btn-sm btn-outline" onClick={() => navigate(`/recipes/${r._id}`)}>View</button>
                  <button className="btn btn-sm btn-secondary" onClick={() => navigate(`/recipes/${r._id}/edit`)}>Edit</button>
                  <button className="btn btn-sm btn-danger" onClick={() => handleDelete(r._id)}>Delete</button>
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
