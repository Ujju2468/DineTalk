import React from 'react';
import { useNavigate } from 'react-router-dom';

const RecipeCard = ({ recipe }) => {
  const navigate = useNavigate();

  return (
    <div className="card recipe-card" onClick={() => navigate(`/recipes/${recipe._id}`)}>
      {recipe.image ? (
        <img src={recipe.image} alt={recipe.title} />
      ) : (
        <div className="recipe-img-placeholder" />
      )}
      <div className="recipe-card-body">
        <span className="recipe-tag">{recipe.category}</span>
        <h3>{recipe.title}</h3>
        <p style={{ fontSize: '0.85rem', color: '#8A7B6C', margin: 0 }}>
          {recipe.description?.slice(0, 70) || 'No description'}
        </p>
        <div className="recipe-meta">
          <span>by {recipe.author?.username || 'Unknown'}</span>
          <span>❤️ {recipe.likes?.length || 0} · ⏱ {recipe.cookTime || 0}m</span>
        </div>
      </div>
    </div>
  );
};

export default RecipeCard;
