import React from 'react';
import { useNavigate } from 'react-router-dom';

const formatDate = (dateStr) => {
  if (!dateStr) return '';
  return new Date(dateStr).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' });
};

const RecipeCard = ({ recipe }) => {
  const navigate = useNavigate();

  const cats = Array.isArray(recipe.categories) && recipe.categories.length > 0
    ? recipe.categories
    : recipe.category ? [recipe.category] : ['Other'];

  const sectionCount = Array.isArray(recipe.sections) && recipe.sections.length > 0
    ? recipe.sections.length
    : 1;

  return (
    <div
      className="recipe-card"
      onClick={() => navigate(`/recipes/${recipe._id}`)}
      style={{
        display: 'flex',
        flexDirection: 'column',
        justify: 'space-between',
        borderRadius: 'var(--radius)',
        background: 'var(--surface)',
        border: '1.5px solid var(--border)',
        boxShadow: 'var(--shadow)',
        overflow: 'hidden',
        cursor: 'pointer',
        transition: 'all 0.25s cubic-bezier(0.4, 0, 0.2, 1)'
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.background = 'var(--surface-hover)';
        e.currentTarget.style.borderColor = 'var(--accent)';
        e.currentTarget.style.transform = 'translateY(-5px)';
        e.currentTarget.style.boxShadow = '0 16px 40px rgba(0,0,0,0.35)';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.background = 'var(--surface)';
        e.currentTarget.style.borderColor = 'var(--border)';
        e.currentTarget.style.transform = 'none';
        e.currentTarget.style.boxShadow = 'var(--shadow)';
      }}
      onMouseDown={(e) => {
        e.currentTarget.style.background = 'var(--surface-active)';
        e.currentTarget.style.borderColor = 'var(--accent-hover)';
      }}
    >
      {/* Top Image Preview & Badges */}
      <div className="recipe-img-wrap" style={{ height: 165, position: 'relative', overflow: 'hidden' }}>
        {recipe.image ? (
          <img src={recipe.image} alt={recipe.title} className="recipe-card-img" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
        ) : (
          <div className="recipe-img-placeholder" style={{ height: '100%', fontSize: '3.2rem', background: 'linear-gradient(135deg, var(--bg-elevated) 0%, var(--surface-hover) 100%)' }}>
            🍽
          </div>
        )}
        {recipe.origin && (
          <span className="badge-origin" style={{ position: 'absolute', top: 10, left: 10 }}>
            🌍 {recipe.origin}
          </span>
        )}
        {cats[0] && (
          <span className="badge-category" style={{ position: 'absolute', top: 10, right: 10 }}>
            {cats[0]}
          </span>
        )}
      </div>

      {/* Card Body */}
      <div style={{ padding: '16px 18px', flex: 1, display: 'flex', flexDirection: 'column', justify: 'space-between' }}>
        <div>
          <h3 style={{ fontSize: '1.25rem', fontFamily: 'var(--font-display)', color: 'var(--text)', marginBottom: 6, lineHeight: 1.3 }}>
            {recipe.title}
          </h3>
          <p style={{ fontSize: '0.85rem', color: 'var(--text2)', opacity: 0.9, lineHeight: 1.5, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden', marginBottom: 12 }}>
            {recipe.description || 'Delicious family recipe.'}
          </p>
        </div>

        {/* Card Footer Info */}
        <div style={{ borderTop: '1px solid var(--border)', paddingTop: 10, marginTop: 10 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.8rem', color: 'var(--muted)', fontWeight: 600 }}>
            <span>👤 {recipe.author?.username || 'Family Chef'}</span>
            <span>🗓 {formatDate(recipe.createdAt)}</span>
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 8, fontSize: '0.78rem' }}>
            <span className="badge-section">
              📌 {sectionCount} {sectionCount === 1 ? 'Section' : 'Sections'}
            </span>
            <span style={{ fontWeight: 700, color: 'var(--gold)' }}>❤️ {recipe.likes?.length || 0} Likes</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RecipeCard;
