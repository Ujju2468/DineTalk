import React, { useState, useEffect, useCallback } from 'react';
import api from '../utils/api';
import RecipeCard from '../components/RecipeCard';
import FoodQuote from '../components/FoodQuote';
import SpiralBranchLayout from '../components/SpiralBranchLayout';
import IngredientMatcherWidget from '../components/IngredientMatcherWidget';
import FilterDrawerModal from '../components/FilterDrawerModal';

const DEFAULT_CATEGORIES = ['All', 'Breakfast', 'Lunch', 'Dinner', 'Dessert', 'Snacks', 'Beverages', 'Appetizers', 'Vegan', 'Vegetarian', 'Non-Veg', 'Other'];

const Recipes = () => {
  const [recipes, setRecipes] = useState([]);
  const [categories, setCategories] = useState(DEFAULT_CATEGORIES);
  const [categoryIds, setCategoryIds] = useState({});
  const [category, setCategory] = useState('All');
  const [search, setSearch] = useState('');
  const [originFilter, setOriginFilter] = useState('All');
  const [maxCookTime, setMaxCookTime] = useState(0);
  const [sortBy, setSortBy] = useState('newest');
  const [viewMode, setViewMode] = useState('spiral');
  const [selectedIngredients, setSelectedIngredients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showFilterDrawer, setShowFilterDrawer] = useState(false);
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [suggestionPool, setSuggestionPool] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);

  // Category CRUD state
  const [showAddCat, setShowAddCat] = useState(false);
  const [newCatName, setNewCatName] = useState('');

  // Fetch Global Categories from Server
  const fetchCategories = async () => {
    try {
      const res = await api.get('/categories');
      if (Array.isArray(res.data) && res.data.length > 0) {
        setCategories(res.data.map((c) => c.name));
        setCategoryIds(Object.fromEntries(res.data.map((c) => [c.name, c._id])));
      }
    } catch (err) {
      console.warn('Fallback to local categories');
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  // Debounce the raw search input so we don't hit the API on every keystroke
  useEffect(() => {
    const t = setTimeout(() => setDebouncedSearch(search.trim()), 300);
    return () => clearTimeout(t);
  }, [search]);

  // Build a lightweight local vocabulary (titles + ingredient names) once,
  // used purely for instant client-side autocomplete suggestions
  useEffect(() => {
    const loadSuggestionPool = async () => {
      try {
        const res = await api.get('/recipes');
        const seen = new Set();
        const pool = [];
        res.data.forEach((r) => {
          const terms = [
            r.title,
            ...((r.ingredients || []).map((i) => (typeof i === 'string' ? i : i.name)))
          ];
          terms.filter(Boolean).forEach((term) => {
            const key = term.trim().toLowerCase();
            if (key && !seen.has(key)) {
              seen.add(key);
              pool.push(term.trim());
            }
          });
        });
        setSuggestionPool(pool);
      } catch (err) {
        console.warn('Could not build search suggestions');
      }
    };
    loadSuggestionPool();
  }, []);

  const fetchRecipes = useCallback(async () => {
    setLoading(true);
    try {
      const params = {};
      if (category !== 'All') params.category = category;
      if (originFilter !== 'All') params.origin = originFilter;
      if (maxCookTime > 0) params.maxCookTime = maxCookTime;
      if (debouncedSearch) params.search = debouncedSearch;
      const res = await api.get('/recipes', { params });
      setRecipes(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [category, originFilter, maxCookTime, debouncedSearch]);

  useEffect(() => {
    fetchRecipes();
  }, [fetchRecipes]);

  const handleAddCategory = async (e) => {
    e.preventDefault();
    const name = newCatName.trim();
    if (!name) return;
    try {
      const res = await api.post('/categories', { name });
      setCategories((prev) => [...prev, res.data.name]);
      setCategoryIds((prev) => ({ ...prev, [res.data.name]: res.data._id }));
      setCategory(res.data.name);
      setNewCatName('');
      setShowAddCat(false);
    } catch (err) {
      alert(err.response?.data?.message || 'Could not add category');
    }
  };

  const handleDeleteCategory = async (catToDelete, e) => {
    e.stopPropagation();
    if (DEFAULT_CATEGORIES.includes(catToDelete)) {
      alert(`Built-in category "${catToDelete}" cannot be removed.`);
      return;
    }
    if (!window.confirm(`Delete category "${catToDelete}" globally?`)) return;
    const id = categoryIds[catToDelete];
    try {
      if (id) await api.delete(`/categories/${id}`);
      setCategories((prev) => prev.filter((c) => c !== catToDelete));
      if (category === catToDelete) setCategory('All');
    } catch (err) {
      alert(err.response?.data?.message || 'Could not delete category');
    }
  };

  // Filter recipes locally by Pantry Ingredients
  const filteredRecipes = recipes.filter((r) => {
    if (selectedIngredients.length === 0) return true;
    const recipeIngs = Array.isArray(r.ingredients)
      ? r.ingredients.map((i) => (typeof i === 'string' ? i.toLowerCase() : (i.name || '').toLowerCase()))
      : [];
    return selectedIngredients.every((pantryItem) =>
      recipeIngs.some((ing) => ing.includes(pantryItem.toLowerCase()))
    );
  });

  // Sort recipes based on sortBy selection
  const sortedRecipes = [...filteredRecipes].sort((a, b) => {
    if (sortBy === 'az') return a.title.localeCompare(b.title);
    if (sortBy === 'likes') return (b.likes?.length || 0) - (a.likes?.length || 0);
    if (sortBy === 'time') return (a.cookTime || 0) - (b.cookTime || 0);
    return new Date(b.createdAt) - new Date(a.createdAt);
  });

  const activeFiltersCount = (category !== 'All' ? 1 : 0) + (originFilter !== 'All' ? 1 : 0) + (maxCookTime > 0 ? 1 : 0) + (search ? 1 : 0);

  // Case-insensitive autocomplete suggestions from recipe titles & ingredients
  const searchTrimmed = search.trim().toLowerCase();
  const suggestions = searchTrimmed.length > 0
    ? suggestionPool.filter((term) => term.toLowerCase().includes(searchTrimmed)).slice(0, 6)
    : [];

  const handleClearAllFilters = () => {
    setCategory('All');
    setOriginFilter('All');
    setMaxCookTime(0);
    setSearch('');
    setSelectedIngredients([]);
    setSortBy('newest');
  };

  const [showPantry, setShowPantry] = useState(false);

  return (
    <div className="container">
      {/* Centered Food Quote Banner */}
      <FoodQuote />

      {/* Seamless Merged Toolbar Header */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: 14,
          marginBottom: 16
        }}
      >
        {/* Seamless Merged Search Input & Filter Button */}
        <div style={{ position: 'relative', flex: '1 1 auto', maxWidth: 540 }}>
          <div className="merged-search-filter-bar">
            <div className="merged-search-input-wrap">
              <span className="search-icon">🔍</span>
              <input
                placeholder="Search recipe, cuisine, ingredients..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                onFocus={() => setShowSuggestions(true)}
                onBlur={() => setShowSuggestions(false)}
                autoComplete="off"
              />
            </div>

            <button
              type="button"
              className="merged-filter-btn"
              onClick={() => setShowFilterDrawer(true)}
              style={{
                background: activeFiltersCount > 0 ? 'var(--accent)' : undefined,
                color: activeFiltersCount > 0 ? '#FFFFFF' : undefined
              }}
            >
              <span>🎛 Filters</span>
              {activeFiltersCount > 0 && (
                <span className="badge" style={{ background: 'var(--gold)', color: '#FFFFFF', fontSize: '0.72rem' }}>
                  {activeFiltersCount}
                </span>
              )}
            </button>
          </div>

          {/* Autocomplete Suggestions Dropdown (case-insensitive match on titles + ingredients) */}
          {showSuggestions && suggestions.length > 0 && (
            <div className="search-suggestions-dropdown">
              {suggestions.map((term) => (
                <div
                  key={term}
                  className="search-suggestion-item"
                  onMouseDown={(e) => e.preventDefault()}
                  onClick={() => { setSearch(term); setShowSuggestions(false); }}
                >
                  🔍 {term}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Action Controls: Pantry Matcher Toggle & View Mode Toggle */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}>
          <button
            type="button"
            className="btn btn-sm btn-outline"
            onClick={() => setShowPantry(!showPantry)}
            style={{
              borderRadius: 30,
              fontWeight: 700,
              borderColor: selectedIngredients.length > 0 ? 'var(--accent)' : 'var(--border)',
              background: selectedIngredients.length > 0 ? 'var(--accent)' : 'var(--surface)',
              color: selectedIngredients.length > 0 ? '#FFFFFF' : 'var(--text)'
            }}
          >
            <span>🥣 Pantry Matcher</span>
            {selectedIngredients.length > 0 && (
              <span className="badge" style={{ background: 'var(--gold)', color: '#FFFFFF', fontSize: '0.72rem' }}>
                {selectedIngredients.length}
              </span>
            )}
          </button>

          <button
            type="button"
            className="btn btn-sm"
            onClick={() => setViewMode(viewMode === 'spiral' ? 'grid' : 'spiral')}
            style={{ borderRadius: 30, fontWeight: 700, background: 'var(--accent)', color: '#FFFFFF', boxShadow: 'var(--shadow)' }}
          >
            {viewMode === 'spiral' ? '🔳 Classic Grid View' : '🌀 3D Spiral Tornado View'}
          </button>
        </div>
      </div>

      {/* Interactive Filter Drawer Modal */}
      <FilterDrawerModal
        isOpen={showFilterDrawer}
        onClose={() => setShowFilterDrawer(false)}
        search={search}
        setSearch={setSearch}
        originFilter={originFilter}
        setOriginFilter={setOriginFilter}
        maxCookTime={maxCookTime}
        setMaxCookTime={setMaxCookTime}
        sortBy={sortBy}
        setSortBy={setSortBy}
        category={category}
        setCategory={setCategory}
        categories={categories}
        onClearAll={handleClearAllFilters}
      />

      {/* Optional Collapsible Pantry Ingredient Matcher */}
      {showPantry && (
        <div style={{ animation: 'slideUp 0.25s ease' }}>
          <IngredientMatcherWidget
            selectedIngredients={selectedIngredients}
            onIngredientsChange={setSelectedIngredients}
            matchCount={selectedIngredients.length > 0 ? filteredRecipes.length : null}
          />
        </div>
      )}

      {/* Category CRUD Bar */}
      <div style={{ margin: '16px 0 24px' }}>
        <div className="category-bar" style={{ flexWrap: 'wrap', gap: 8 }}>
          {categories.map((c) => (
            <div
              key={c}
              className={`category-chip ${category === c ? 'active' : ''}`}
              onClick={() => setCategory(c)}
              style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}
            >
              <span>{c}</span>
              {!DEFAULT_CATEGORIES.includes(c) && (
                <span
                  title="Remove category"
                  onClick={(e) => handleDeleteCategory(c, e)}
                  style={{ fontSize: '0.8rem', opacity: 0.7, marginLeft: 2, cursor: 'pointer' }}
                >
                  ✕
                </span>
              )}
            </div>
          ))}

          {/* + Add Custom Category Button */}
          <button
            className="category-chip"
            onClick={() => setShowAddCat(!showAddCat)}
            style={{ background: 'var(--gold-light)', color: 'var(--gold)', borderColor: 'var(--gold)' }}
          >
            {showAddCat ? '✕ Cancel' : '+ Add Category'}
          </button>
        </div>

        {/* Add Category Modal/Form */}
        {showAddCat && (
          <form
            onSubmit={handleAddCategory}
            className="card"
            style={{ marginTop: 12, padding: 14, maxWidth: 420, display: 'flex', gap: 8, animation: 'slideUp 0.2s ease' }}
          >
            <input
              placeholder="New global category name (e.g. Midnight Craving)..."
              value={newCatName}
              onChange={(e) => setNewCatName(e.target.value)}
              autoFocus
              required
            />
            <button className="btn btn-sm" type="submit" style={{ flexShrink: 0 }}>
              + Add
            </button>
          </form>
        )}
      </div>

      {/* Recipe Display View (Spiral Tornado vs Classic Grid) */}
      {loading ? (
        <div className="empty-state">
          <div className="empty-icon">🍳</div>
          <h3>Heating things up...</h3>
        </div>
      ) : sortedRecipes.length === 0 ? (
        <div className="empty-state">
          <div className="empty-icon">🍽</div>
          <h3>No matching recipes found</h3>
          <p>Try clearing your active filters or searching another keyword!</p>
          <button className="btn btn-sm btn-outline" onClick={handleClearAllFilters} style={{ marginTop: 12 }}>
            🧹 Clear All Filters
          </button>
        </div>
      ) : viewMode === 'spiral' ? (
        <SpiralBranchLayout recipes={sortedRecipes} />
      ) : (
        <div className="recipe-grid" style={{ animation: 'fadeIn 0.4s ease' }}>
          {sortedRecipes.map((r) => (
            <RecipeCard key={r._id} recipe={r} />
          ))}
        </div>
      )}
    </div>
  );
};

export default Recipes;
