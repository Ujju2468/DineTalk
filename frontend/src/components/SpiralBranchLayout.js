import React from 'react';
import { useNavigate } from 'react-router-dom';

const formatDate = (dateStr) => {
  if (!dateStr) return '';
  return new Date(dateStr).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' });
};

const SpiralBranchLayout = ({ recipes = [] }) => {
  const navigate = useNavigate();

  if (!recipes || recipes.length === 0) return null;

  return (
    <div
      style={{
        position: 'relative',
        maxWidth: 1040,
        margin: '36px auto 60px',
        padding: '20px 0',
        perspective: 1200
      }}
    >
      {/* Central Line Gradient (#8E5745 -> #D39858 -> #758956) */}
      <div
        style={{
          position: 'absolute',
          top: 0,
          bottom: 0,
          left: '50%',
          width: 5,
          transform: 'translateX(-50%)',
          background: 'linear-gradient(180deg, var(--accent) 0%, var(--gold) 50%, var(--sage) 100%)',
          borderRadius: 4,
          boxShadow: '0 0 16px var(--accent)',
          zIndex: 0
        }}
      />

      {/* Alternate Spiral Branch Cards */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 36, position: 'relative', zIndex: 1 }}>
        {recipes.map((recipe, index) => {
          const isLeft = index % 2 === 0;
          const rotateDeg = isLeft ? -5 : 5;
          const cats = Array.isArray(recipe.categories) && recipe.categories.length > 0 ? recipe.categories : [recipe.category || 'Other'];
          const sectionCount = Array.isArray(recipe.sections) ? recipe.sections.length : 1;

          return (
            <div
              key={recipe._id}
              onClick={() => navigate(`/recipes/${recipe._id}`)}
              style={{
                display: 'flex',
                justifyContent: isLeft ? 'flex-start' : 'flex-end',
                position: 'relative',
                width: '100%',
                paddingLeft: isLeft ? 0 : '52%',
                paddingRight: isLeft ? '52%' : 0
              }}
            >
              {/* Node (Normal: Bg #1E1C12, Border #8E5745, Text #D39858 | Hover: Bg #8E5745, Border #D39858, Text #FFFFFF) */}
              <div
                className="spiral-node-badge"
                style={{
                  position: 'absolute',
                  left: '50%',
                  top: '50%',
                  transform: 'translate(-50%, -50%)',
                  width: 28,
                  height: 28,
                  borderRadius: '50%',
                  background: 'var(--surface)',
                  border: '2.5px solid var(--accent)',
                  color: 'var(--gold)',
                  boxShadow: '0 0 12px var(--gold)',
                  zIndex: 2,
                  display: 'flex',
                  alignItems: 'center',
                  justify: 'center',
                  fontSize: '0.74rem',
                  fontWeight: 800,
                  transition: 'all 0.3s ease'
                }}
              >
                {index + 1}
              </div>

              {/* 3D Twirling Card Container (Bg: #1E1C12, Border: #33301B | Hover Bg: #252216, Border: #8E5745) */}
              <div
                className="card"
                style={{
                  width: '100%',
                  maxWidth: 440,
                  borderRadius: 'var(--radius)',
                  background: 'var(--surface)',
                  backdropFilter: 'blur(14px)',
                  border: '1.5px solid var(--border)',
                  boxShadow: 'var(--shadow-lg)',
                  cursor: 'pointer',
                  transform: `rotateY(${rotateDeg}deg) rotateZ(${isLeft ? -1 : 1}deg)`,
                  transition: 'all 0.35s cubic-bezier(0.34, 1.56, 0.64, 1)',
                  overflow: 'hidden'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = 'var(--surface-hover)';
                  e.currentTarget.style.borderColor = 'var(--accent)';
                  e.currentTarget.style.transform = `scale(1.03) rotateY(0deg) translateY(-6px)`;
                  e.currentTarget.style.boxShadow = '0 16px 40px rgba(0,0,0,.35)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = 'var(--surface)';
                  e.currentTarget.style.borderColor = 'var(--border)';
                  e.currentTarget.style.transform = `rotateY(${rotateDeg}deg) rotateZ(${isLeft ? -1 : 1}deg)`;
                  e.currentTarget.style.boxShadow = 'var(--shadow-lg)';
                }}
              >
                {/* Image Banner */}
                <div style={{ height: 175, position: 'relative', overflow: 'hidden' }}>
                  {recipe.image ? (
                    <img src={recipe.image} alt={recipe.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  ) : (
                    <div className="recipe-img-placeholder" style={{ height: '100%', fontSize: '3rem', background: 'linear-gradient(135deg, var(--bg-elevated) 0%, var(--surface-hover) 100%)' }}>
                      🍽
                    </div>
                  )}
                  {recipe.origin && (
                    <span className="badge-origin" style={{ position: 'absolute', top: 10, left: 10 }}>
                      🌍 {recipe.origin}
                    </span>
                  )}
                  <span className="badge-category" style={{ position: 'absolute', top: 10, right: 10 }}>
                    {cats[0]}
                  </span>
                </div>

                {/* Content Details */}
                <div style={{ padding: '16px 20px' }}>
                  <h3 style={{ fontSize: '1.25rem', fontFamily: 'var(--font-display)', color: 'var(--text)', marginBottom: 6, lineHeight: 1.3 }}>
                    {recipe.title}
                  </h3>
                  <p style={{ fontSize: '0.86rem', color: 'var(--text2)', opacity: 0.92, lineHeight: 1.5, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden', marginBottom: 12 }}>
                    {recipe.description || 'Home-cooked family recipe.'}
                  </p>

                  <div style={{ borderTop: '1px solid var(--border)', paddingTop: 10, display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.8rem', color: 'var(--muted)' }}>
                    <span>👤 {recipe.author?.username || 'Family Chef'}</span>
                    <span>🗓 {formatDate(recipe.createdAt)}</span>
                    {recipe.cookTime > 0 && <span style={{ fontWeight: 700, color: 'var(--text)' }}>⏱ {recipe.cookTime} m</span>}
                    <span className="badge-section">
                      📌 {sectionCount} Sec
                    </span>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default SpiralBranchLayout;
