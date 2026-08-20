import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import api from '../utils/api';
import { useAuth } from '../context/AuthContext';
import CookMode from '../components/CookMode';

const formatDate = (d) => new Date(d).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' });

const RecipeDetail = () => {
  const { id } = useParams();
  const [recipe, setRecipe] = useState(null);
  const [cookMode, setCookMode] = useState(false);
  const { user } = useAuth();
  const navigate = useNavigate();

  const fetchRecipe = useCallback(async () => {
    const res = await api.get(`/recipes/${id}`);
    setRecipe(res.data);
  }, [id]);

  useEffect(() => { fetchRecipe(); }, [fetchRecipe]);

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

  if (!recipe) return (
    <div className="container" style={{ textAlign: 'center', paddingTop: 80 }}>
      <div style={{ fontSize: '3rem' }}>🍲</div>
      <p style={{ color: 'var(--muted)', marginTop: 12 }}>Loading recipe...</p>
    </div>
  );

  const isOwner = user && recipe.author?._id === user._id;
  const hasLiked = recipe.likes?.some(l => l === user._id || l._id === user._id);
  const cats = Array.isArray(recipe.categories) && recipe.categories.length > 0 ? recipe.categories : recipe.category ? [recipe.category] : ['Other'];

  return (
    <div className="container" style={{ maxWidth: 860 }}>
      <Link to="/recipes" style={{ display: 'inline-flex', alignItems: 'center', gap: 6, marginBottom: 18, color: 'var(--muted)', fontWeight: 600 }}>
        ← Back to recipes
      </Link>

      {/* Hero */}
      {recipe.image ? (
        <div className="detail-hero">
          <img src={recipe.image} alt={recipe.title} />
          <div className="detail-hero-overlay">
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginBottom: 10 }}>
              {cats.map(c => <span key={c} className="recipe-tag" style={{ background: 'rgba(255,255,255,0.2)', color: 'white' }}>{c}</span>)}
            </div>
            <h1>{recipe.title}</h1>
          </div>
        </div>
      ) : (
        <div className="card" style={{ background: 'linear-gradient(135deg, var(--bg2), var(--accent-light))', textAlign: 'center', padding: '40px 20px', marginBottom: 24 }}>
          <div style={{ fontSize: '4rem', marginBottom: 12 }}>🍽</div>
          <h1 style={{ color: 'var(--accent-dark)' }}>{recipe.title}</h1>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, justifyContent: 'center', marginTop: 10 }}>
            {cats.map(c => <span key={c} className="recipe-tag">{c}</span>)}
          </div>
        </div>
      )}

      {/* Meta bar */}
      <div className="detail-meta-bar">
        <div className="detail-meta-item">
          <div className="detail-meta-label">By</div>
          <div className="detail-meta-value">👤 {recipe.author?.username}</div>
        </div>
        <div className="detail-meta-item">
          <div className="detail-meta-label">Added on</div>
          <div className="detail-meta-value">🗓 {formatDate(recipe.createdAt)}</div>
        </div>
        {recipe.cookTime > 0 && (
          <div className="detail-meta-item">
            <div className="detail-meta-label">Cook time</div>
            <div className="detail-meta-value">⏱ {recipe.cookTime} min</div>
          </div>
        )}
        {recipe.servings > 0 && (
          <div className="detail-meta-item">
            <div className="detail-meta-label">Serves</div>
            <div className="detail-meta-value">🍽 {recipe.servings} people</div>
          </div>
        )}
        {recipe.origin && (
          <div className="detail-meta-item">
            <div className="detail-meta-label">Origin</div>
            <div className="detail-meta-value">🌍 {recipe.origin}</div>
          </div>
        )}
        {recipe.region && (
          <div className="detail-meta-item">
            <div className="detail-meta-label">Region</div>
            <div className="detail-meta-value">📍 {recipe.region}</div>
          </div>
        )}
      </div>

      {recipe.description && (
        <p style={{ color: 'var(--text2)', fontSize: '1rem', lineHeight: 1.8, marginBottom: 24 }}>{recipe.description}</p>
      )}

      {/* Actions */}
      <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', marginBottom: 28 }}>
        <button className={`btn ${hasLiked ? 'btn-secondary' : 'btn-outline'}`} onClick={handleLike}>
          {hasLiked ? '❤️' : '🤍'} {recipe.likes?.length || 0} Like{recipe.likes?.length !== 1 ? 's' : ''}
        </button>
        <button className="btn" onClick={sendToChat}>💬 Share to Chat</button>
        {recipe.steps?.length > 0 && (
          <button className="btn btn-secondary" onClick={() => setCookMode(true)}>🍳 Cook Mode</button>
        )}
        {isOwner && (
          <>
            <button className="btn btn-ghost" onClick={() => navigate(`/recipes/${id}/edit`)}>✏️ Edit</button>
            <button className="btn btn-danger" onClick={handleDelete}>🗑 Delete</button>
          </>
        )}
      </div>

      {/* Floating ingredients */}
      <div className="detail-section">
        <h3>🥕 What you'll need</h3>
        <div className="floating-ingredients">
          {recipe.ingredients.map((ing, i) => (
            <div key={i} className="float-ing" style={{ animationDelay: `${i * 0.06}s` }}>
              {ing}
            </div>
          ))}
        </div>
      </div>

      {/* Steps */}
      <div className="detail-section">
        <h3>👨‍🍳 How to make it</h3>
        <ol className="steps-ol">
          {recipe.steps.map((step, i) => (
            <li key={i}>
              <div className="step-num">{i + 1}</div>
              <div style={{ lineHeight: 1.7 }}>{step}</div>
            </li>
          ))}
        </ol>
      </div>

      {cookMode && <CookMode recipe={recipe} onClose={() => setCookMode(false)} />}
    </div>
  );
};

export default RecipeDetail;
