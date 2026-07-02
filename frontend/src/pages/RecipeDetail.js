import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import api from '../utils/api';
import { useAuth } from '../context/AuthContext';

const RecipeDetail = () => {
  const { id } = useParams();
  const [recipe, setRecipe] = useState(null);
  const { user } = useAuth();
  const navigate = useNavigate();

  const fetchRecipe = useCallback(async () => {
    const res = await api.get(`/recipes/${id}`);
    setRecipe(res.data);
  }, [id]);

  useEffect(() => {
    fetchRecipe();
  }, [fetchRecipe]);

  const handleLike = async () => {
    const res = await api.put(`/recipes/${id}/like`);
    setRecipe({ ...recipe, likes: res.data.likes });
  };

  const handleDelete = async () => {
    if (!window.confirm('Delete this recipe?')) return;
    await api.delete(`/recipes/${id}`);
    navigate('/my-recipes');
  };

  const sendToChat = () => {
    navigate('/groups', { state: { shareRecipeId: recipe._id, shareRecipeTitle: recipe.title } });
  };

  if (!recipe) return <div className="container">Loading...</div>;

  const isOwner = user && recipe.author?._id === user._id;
  const hasLiked = recipe.likes?.some((l) => l === user._id || l._id === user._id);

  return (
    <div className="container">
      <Link to="/recipes">&larr; Back to all recipes</Link>
      <div className="card" style={{ marginTop: 14 }}>
        {recipe.image && <img src={recipe.image} alt={recipe.title} style={{ width: '100%', maxHeight: 320, objectFit: 'cover', borderRadius: 8 }} />}
        <span className="recipe-tag" style={{ marginTop: 14 }}>{recipe.category}</span>
        <h2>{recipe.title}</h2>
        <p style={{ color: '#8A7B6C' }}>{recipe.description}</p>
        <div className="recipe-meta" style={{ marginBottom: 10 }}>
          <span>by {recipe.author?.username}</span>
          <span>⏱ {recipe.cookTime} min · 🍽 {recipe.servings} servings</span>
        </div>

        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
          <button className="btn btn-outline" onClick={handleLike}>
            {hasLiked ? '❤️ Liked' : '🤍 Like'} ({recipe.likes?.length || 0})
          </button>
          <button className="btn btn-secondary" onClick={sendToChat}>💬 Share to Dinner Chat</button>
          {isOwner && (
            <>
              <button className="btn" onClick={() => navigate(`/recipes/${id}/edit`)}>Edit</button>
              <button className="btn btn-danger" onClick={handleDelete}>Delete</button>
            </>
          )}
        </div>

        <div className="detail-section">
          <h3>Ingredients</h3>
          <ul>
            {recipe.ingredients.map((ing, i) => <li key={i}>{ing}</li>)}
          </ul>
        </div>

        <div className="detail-section">
          <h3>Steps</h3>
          <ol>
            {recipe.steps.map((step, i) => <li key={i}>{step}</li>)}
          </ol>
        </div>
      </div>
    </div>
  );
};

export default RecipeDetail;
