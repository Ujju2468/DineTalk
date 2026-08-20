import React, { useState, useEffect, useCallback } from 'react';
import api from '../utils/api';
import IngredientStore from '../components/IngredientStore';
import CookMode from '../components/CookMode';

// Normalizes text for loose matching (lowercase, trimmed).
const norm = (s) => s.toLowerCase().trim();

const FindRecipe = () => {
  const [tab, setTab] = useState('search'); // 'search' | 'fridge'

  // --- "I know what I want" path ---
  const [query, setQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [searching, setSearching] = useState(false);

  const runSearch = useCallback(async (q) => {
    if (!q.trim()) { setSearchResults([]); return; }
    setSearching(true);
    try {
      const res = await api.get('/recipes', { params: { search: q } });
      setSearchResults(res.data);
    } finally {
      setSearching(false);
    }
  }, []);

  useEffect(() => {
    const t = setTimeout(() => runSearch(query), 350);
    return () => clearTimeout(t);
  }, [query, runSearch]);

  // --- "No clue, what can I make?" path ---
  const [selected, setSelected] = useState([]); // [{_id, name, emoji}]
  const [allRecipes, setAllRecipes] = useState(null); // lazy-loaded once
  const [matches, setMatches] = useState([]);

  const ensureRecipesLoaded = useCallback(async () => {
    if (allRecipes) return allRecipes;
    const res = await api.get('/recipes');
    setAllRecipes(res.data);
    return res.data;
  }, [allRecipes]);

  useEffect(() => {
    if (tab === 'fridge') ensureRecipesLoaded();
  }, [tab, ensureRecipesLoaded]);

  useEffect(() => {
    if (!allRecipes || selected.length === 0) { setMatches([]); return; }
    const have = selected.map((s) => norm(s.name));

    const ranked = allRecipes
      .map((r) => {
        const need = r.ingredients || [];
        const haveCount = need.filter((ing) =>
          have.some((h) => norm(ing).includes(h) || h.includes(norm(ing)))
        ).length;
        return { recipe: r, haveCount, total: need.length, missing: need.length - haveCount };
      })
      .filter((m) => m.haveCount > 0)
      .sort((a, b) => (b.haveCount / b.total) - (a.haveCount / a.total) || b.haveCount - a.haveCount);

    setMatches(ranked);
  }, [allRecipes, selected]);

  const addIngredient = (ing) => {
    setSelected((prev) => (prev.some((p) => p._id === ing._id) ? prev : [...prev, ing]));
  };
  const removeIngredient = (id) => setSelected((prev) => prev.filter((p) => p._id !== id));

  // --- Cook Mode launch ---
  const [cookRecipe, setCookRecipe] = useState(null);
  const openCookMode = async (recipeOrId) => {
    if (typeof recipeOrId === 'string') {
      const res = await api.get(`/recipes/${recipeOrId}`);
      setCookRecipe(res.data);
    } else {
      setCookRecipe(recipeOrId);
    }
  };

  return (
    <div className="container" style={{ maxWidth: 780 }}>
      <h2 style={{ marginBottom: 6 }}>🍲 What should I cook?</h2>
      <p style={{ color: 'var(--muted)', marginBottom: 20 }}>
        Know exactly what you want, or just see what you can make from what's in the fridge — either way, jump straight into Cook Mode.
      </p>

      <div className="finder-tabs">
        <div className={`finder-tab ${tab === 'search' ? 'active' : ''}`} onClick={() => setTab('search')}>
          🔍 I know what I want
        </div>
        <div className={`finder-tab ${tab === 'fridge' ? 'active' : ''}`} onClick={() => setTab('fridge')}>
          🥶 What can I make?
        </div>
      </div>

      {tab === 'search' && (
        <div>
          <input
            placeholder="e.g. Dal, Paneer Butter Masala, Poha..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            style={{ marginBottom: 16 }}
          />
          {searching && <p style={{ color: 'var(--muted)' }}>Searching...</p>}
          {!searching && query && searchResults.length === 0 && (
            <p style={{ color: 'var(--muted)' }}>No recipes found for "{query}".</p>
          )}
          {searchResults.map((r) => (
            <div key={r._id} className="finder-result-card" onClick={() => openCookMode(r)}>
              <div style={{ fontSize: '1.8rem' }}>🍽</div>
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: 700 }}>{r.title}</div>
                <div style={{ fontSize: '0.8rem', color: 'var(--muted)' }}>by {r.author?.username}</div>
              </div>
              <button className="btn btn-sm">🍳 Cook Mode</button>
            </div>
          ))}
        </div>
      )}

      {tab === 'fridge' && (
        <div>
          <div className="finder-selected-bar">
            {selected.length === 0 && (
              <span style={{ color: 'var(--muted)', fontSize: '0.85rem' }}>
                Click ingredients below to add what you've got at home...
              </span>
            )}
            {selected.map((s) => (
              <span key={s._id} className="finder-chip">
                {s.emoji} {s.name}
                <button onClick={() => removeIngredient(s._id)}>✕</button>
              </span>
            ))}
          </div>

          {selected.length > 0 && (
            <div style={{ marginBottom: 20 }}>
              <h4 style={{ marginBottom: 10, fontSize: '0.9rem', color: 'var(--muted)' }}>
                {matches.length > 0 ? `You can make ${matches.length} recipe${matches.length !== 1 ? 's' : ''}:` : 'No matching recipes yet — add more ingredients.'}
              </h4>
              {matches.map(({ recipe, haveCount, total }) => (
                <div key={recipe._id} className="finder-result-card" onClick={() => openCookMode(recipe)}>
                  <div style={{ fontSize: '1.8rem' }}>🍽</div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontWeight: 700 }}>{recipe.title}</div>
                    <div style={{ fontSize: '0.8rem', color: 'var(--muted)' }}>by {recipe.author?.username}</div>
                  </div>
                  <span className={`finder-match-badge ${haveCount === total ? 'finder-match-full' : 'finder-match-partial'}`}>
                    {haveCount === total ? '✅ Full match' : `${haveCount}/${total} have it`}
                  </span>
                </div>
              ))}
            </div>
          )}

          <IngredientStore onIngredientClick={addIngredient} showAddNew={false} />
        </div>
      )}

      {cookRecipe && (
        <CookMode
          recipe={cookRecipe}
          onClose={() => setCookRecipe(null)}
        />
      )}
    </div>
  );
};

export default FindRecipe;
