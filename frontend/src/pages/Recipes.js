import React, { useState, useEffect, useCallback } from 'react';
import api from '../utils/api';
import RecipeCard from '../components/RecipeCard';
<<<<<<< HEAD

const CATEGORIES = ['All', 'Breakfast', 'Lunch', 'Dinner', 'Dessert', 'Snacks', 'Beverages', 'Appetizers', 'Vegan', 'Vegetarian', 'Non-Veg', 'Other'];
=======
import FoodQuote from '../components/FoodQuote';

const CATEGORIES = ['All','Breakfast','Lunch','Dinner','Dessert','Snacks','Beverages','Appetizers','Vegan','Vegetarian','Non-Veg','Other'];
>>>>>>> 97de632 (Ingridents store added, cook mode added and some other things fixed)

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

<<<<<<< HEAD
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
=======
  useEffect(() => { fetchRecipes(); }, [fetchRecipes]);

  return (
    <div className="container">
      <FoodQuote />

      <div className="toolbar">
        <div className="page-header" style={{ marginBottom: 0 }}>
          <h1>Family Recipes</h1>
          <p>Everything the family has cooked up 🍲</p>
        </div>
        <div className="search-wrap">
          <span className="search-icon">🔍</span>
          <input
            placeholder="Search recipes, origins..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            style={{ paddingLeft: 38, minWidth: 220, borderRadius: 30 }}
          />
        </div>
      </div>

      <div className="category-bar">
        {CATEGORIES.map(c => (
          <div key={c} className={`category-chip ${category === c ? 'active' : ''}`} onClick={() => setCategory(c)}>
>>>>>>> 97de632 (Ingridents store added, cook mode added and some other things fixed)
            {c}
          </div>
        ))}
      </div>

      {loading ? (
<<<<<<< HEAD
        <p>Loading recipes...</p>
      ) : recipes.length === 0 ? (
        <div className="empty-state">No recipes found. Be the first to add one!</div>
      ) : (
        <div className="recipe-grid">
          {recipes.map((r) => (
            <RecipeCard key={r._id} recipe={r} />
          ))}
=======
        <div className="empty-state">
          <div className="empty-icon">🍳</div>
          <h3>Heating things up...</h3>
        </div>
      ) : recipes.length === 0 ? (
        <div className="empty-state">
          <div className="empty-icon">🍽</div>
          <h3>No recipes found</h3>
          <p>Be the first to add one for this category!</p>
        </div>
      ) : (
        <div className="recipe-grid" style={{ animation: 'fadeIn 0.4s ease' }}>
          {recipes.map(r => <RecipeCard key={r._id} recipe={r} />)}
>>>>>>> 97de632 (Ingridents store added, cook mode added and some other things fixed)
        </div>
      )}
    </div>
  );
};

export default Recipes;
