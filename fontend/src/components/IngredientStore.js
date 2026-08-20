import React, { useState, useEffect, useCallback } from 'react';
import api from '../utils/api';
import PantryScene from './PantryScene';

const ALPHABET = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');

const IngredientStore = ({ onIngredientClick, showAddNew = true }) => {
  const [ingredients, setIngredients] = useState([]);
  const [view, setView] = useState('card');
  const [letter, setLetter] = useState('');
  const [search, setSearch] = useState('');
  const [showAdd, setShowAdd] = useState(false);
  const [newName, setNewName] = useState('');
  const [newCat, setNewCat] = useState('Other');
  const [newEmoji, setNewEmoji] = useState('🥄');
  const [addedFlash, setAddedFlash] = useState(null);

  const load = useCallback(async () => {
    const params = {};
    if (letter) params.letter = letter;
    if (search) params.search = search;
    const res = await api.get('/ingredients', { params });
    setIngredients(res.data);
  }, [letter, search]);

  useEffect(() => { load(); }, [load]);

  const handleAdd = async (e) => {
    e.preventDefault();
    try {
      const res = await api.post('/ingredients', { name: newName, category: newCat, emoji: newEmoji });
      setIngredients(prev => [...prev, res.data].sort((a, b) => a.name.localeCompare(b.name)));
      setNewName(''); setShowAdd(false);
    } catch (err) {
      if (err.response?.data?.ingredient) {
        alert(`"${newName}" already exists!`);
      }
    }
  };

  // FIX: click-to-add with flash feedback
  const handleClick = (ing) => {
    if (onIngredientClick) {
      onIngredientClick(ing);
      setAddedFlash(ing._id);
      setTimeout(() => setAddedFlash(null), 700);
    }
  };

  return (
    <div>
      <div className="store-header">
        <div style={{ position:'relative', flex:1 }}>
          <span style={{ position:'absolute', left:12, top:'50%', transform:'translateY(-50%)', color:'var(--muted)' }}>🔍</span>
          <input placeholder="Search ingredients..."
            value={search}
            onChange={e => { setSearch(e.target.value); setLetter(''); }}
            style={{ paddingLeft:34, borderRadius:30 }} />
        </div>
        <div style={{ display:'flex', gap:6 }}>
          <button className={`btn btn-sm ${view==='card'?'':'btn-ghost'}`} onClick={() => setView('card')}>⊞ Cards</button>
          <button className={`btn btn-sm ${view==='list'?'':'btn-ghost'}`} onClick={() => setView('list')}>☰ List</button>
          <button className={`btn btn-sm ${view==='pantry'?'':'btn-ghost'}`} onClick={() => setView('pantry')}>🏠 Pantry</button>
        </div>
        {showAddNew && (
          <button className="btn btn-sm btn-secondary" onClick={() => setShowAdd(!showAdd)}>
            {showAdd ? '✕ Cancel' : '+ Add to Store'}
          </button>
        )}
      </div>

      {showAdd && (
        <form onSubmit={handleAdd} className="card" style={{ marginBottom:14, display:'flex', gap:10, flexWrap:'wrap', alignItems:'flex-end' }}>
          <div style={{ flex:2, minWidth:140 }}>
            <label>Name *</label>
            <input value={newName} onChange={e => setNewName(e.target.value)} required placeholder="e.g. Cardamom" />
          </div>
          <div style={{ minWidth:70 }}>
            <label>Emoji</label>
            <input value={newEmoji} onChange={e => setNewEmoji(e.target.value)} style={{ width:70 }} />
          </div>
          <div style={{ flex:2, minWidth:140 }}>
            <label>Category</label>
            <select value={newCat} onChange={e => setNewCat(e.target.value)}>
              {['Vegetables','Fruits','Dairy','Meat & Seafood','Grains & Pasta','Spices & Herbs','Oils & Condiments','Beverages','Baking','Nuts & Seeds','Legumes','Other'].map(c => (
                <option key={c}>{c}</option>
              ))}
            </select>
          </div>
          <button className="btn btn-sm" type="submit">Add to Store</button>
        </form>
      )}

      <div className="alphabet-bar">
        <div className={`alpha-chip ${letter===''?'active':''}`} onClick={() => { setLetter(''); setSearch(''); }}>All</div>
        {ALPHABET.map(l => (
          <div key={l} className={`alpha-chip ${letter===l?'active':''}`} onClick={() => { setLetter(l); setSearch(''); }}>{l}</div>
        ))}
      </div>

      {onIngredientClick && (
        <p style={{ fontSize:'0.78rem', color:'var(--accent)', fontWeight:700, marginBottom:8 }}>
          👆 Click any ingredient to add it to your recipe
        </p>
      )}

      {ingredients.length === 0 && (
        <p style={{ color:'var(--muted)', fontSize:'0.85rem' }}>No ingredients found.</p>
      )}

      {view === 'pantry' ? (
        <PantryScene
          ingredients={ingredients}
          onItemClick={handleClick}
          flashedId={addedFlash}
        />
      ) : view === 'card' ? (
        <div className="ingredient-card-grid">
          {ingredients.map(ing => (
            <div
              key={ing._id}
              className="ingredient-card"
              style={{
                cursor: onIngredientClick ? 'pointer' : 'grab',
                background: addedFlash === ing._id ? 'var(--green-light)' : undefined,
                borderColor: addedFlash === ing._id ? 'var(--green)' : undefined,
                transform: addedFlash === ing._id ? 'scale(0.95)' : undefined,
                transition: 'all 0.15s ease',
              }}
              onClick={() => handleClick(ing)}
              draggable
              onDragStart={e => {
                e.dataTransfer.setData('ingredient', ing.name);
                e.dataTransfer.setData('ingredientEmoji', ing.emoji);
              }}
              title={onIngredientClick ? `Click to add ${ing.name}` : `Drag to add ${ing.name}`}
            >
              <span>{ing.emoji}</span>
              <span>{ing.name}</span>
              {addedFlash === ing._id && <span style={{ color:'var(--green)', fontSize:'0.75rem' }}>✓</span>}
            </div>
          ))}
        </div>
      ) : (
        <div style={{ border:'1px solid var(--border)', borderRadius:'var(--radius-sm)', overflow:'hidden' }}>
          {ingredients.map((ing, idx) => (
            <div
              key={ing._id}
              draggable
              onDragStart={e => {
                e.dataTransfer.setData('ingredient', ing.name);
                e.dataTransfer.setData('ingredientEmoji', ing.emoji);
              }}
              onClick={() => handleClick(ing)}
              style={{
                display:'flex', alignItems:'center', gap:10,
                padding:'10px 14px',
                borderBottom: idx < ingredients.length-1 ? '1px solid var(--border)' : 'none',
                cursor: onIngredientClick ? 'pointer' : 'grab',
                fontSize:'0.9rem', color:'var(--text2)',
                background: addedFlash === ing._id ? 'var(--green-light)' : 'transparent',
                transition:'background 0.15s',
              }}
              onMouseEnter={e => { if (addedFlash !== ing._id) e.currentTarget.style.background = 'var(--bg2)'; }}
              onMouseLeave={e => { if (addedFlash !== ing._id) e.currentTarget.style.background = 'transparent'; }}
            >
              <span style={{ fontSize:'1.1rem' }}>{ing.emoji}</span>
              <span style={{ fontWeight:600, flex:1 }}>{ing.name}</span>
              <span style={{ fontSize:'0.75rem', color:'var(--muted)' }}>{ing.category}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default IngredientStore;
