import React from 'react';
import { useNavigate } from 'react-router-dom';

const formatDate = (dateStr) => {
  if (!dateStr) return '';
  return new Date(dateStr).toLocaleDateString('en-IN', { day:'numeric', month:'short', year:'numeric' });
};

const RecipeCard = ({ recipe }) => {
  const navigate = useNavigate();
  // FIX: support both old `category` (string) and new `categories` (array)
  const cats = Array.isArray(recipe.categories) && recipe.categories.length > 0
    ? recipe.categories
    : recipe.category ? [recipe.category] : ['Other'];

  return (
    <div className="card recipe-card" onClick={() => navigate(`/recipes/${recipe._id}`)}>
      <div className="recipe-img-wrap">
        {recipe.image
          ? <img src={recipe.image} alt={recipe.title} className="recipe-card-img" />
          : <div className="recipe-img-placeholder">🍽</div>
        }
      </div>
      <div className="recipe-card-body">
        <div className="recipe-tags">
          {cats.slice(0, 2).map((cat, i) => (
            <span key={i} className={`recipe-tag ${['Vegan','Vegetarian'].includes(cat) ? 'green' : ''}`}>{cat}</span>
          ))}
          {recipe.origin && (
            <span className="recipe-tag" style={{ background:'var(--gold-light)', color:'var(--gold)' }}>
              🌍 {recipe.origin}
            </span>
          )}
        </div>
        <h3>{recipe.title}</h3>
        <p className="recipe-card-desc">{recipe.description || 'No description added.'}</p>
        <div className="recipe-meta">
          <div>
            <div className="recipe-meta-author">👤 {recipe.author?.username || 'Unknown'}</div>
            <div className="recipe-meta-date">🗓 {formatDate(recipe.createdAt)}</div>
          </div>
          <div style={{ textAlign:'right' }}>
            <div>❤️ {recipe.likes?.length || 0}</div>
            {/* FIX: only show cook time if > 0 */}
            {recipe.cookTime > 0 && <div>⏱ {recipe.cookTime}m</div>}
          </div>
        </div>
      </div>
    </div>
  );
};

export default RecipeCard;
