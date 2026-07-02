import React, { useState, useEffect, useCallback } from 'react';
import api from '../utils/api';
import RecipeCard from '../components/RecipeCard';

const CATEGORIES = ['All', 'Breakfast', 'Lunch', 'Dinner', 'Dessert', 'Snacks', 'Beverages', 'Appetizers', 'Vegan', 'Vegetarian', 'Non-Veg', 'Other'];

const Recipes = () => {
  const [recipes, setRecipes] = useState([]);
  const [category, setCategory] = useState('All');
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);

  const fetchRecipes = useCallback(async () => {
    setLoading(true);
    try {
      const params = {};
      if (category !== 'All') params.category = category;
      if (search) params.search = search;
      const res = await api.get('/recipes', { params });
      setRecipes(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [category, search]);

  useEffect(() => {
    fetchRecipes();
  }, [fetchRecipes]);

  return (
    <div className="container">
      <div className="toolbar">
        <h2>All Recipes</h2>
        <input
          placeholder="Search recipes..."
          style={{ maxWidth: 280 }}
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      <div className="category-bar">
        {CATEGORIES.map((c) => (
          <div
            key={c}
            className={`category-chip ${category === c ? 'active' : ''}`}
            onClick={() => setCategory(c)}
          >
            {c}
          </div>
        ))}
      </div>

      {loading ? (
        <p>Loading recipes...</p>
      ) : recipes.length === 0 ? (
        <div className="empty-state">No recipes found. Be the first to add one!</div>
      ) : (
        <div className="recipe-grid">
          {recipes.map((r) => (
            <RecipeCard key={r._id} recipe={r} />
          ))}
        </div>
      )}
    </div>
  );
};

export default Recipes;
