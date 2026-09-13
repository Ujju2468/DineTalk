import React, { useState, useEffect } from 'react';
import api from '../utils/api';
import KitchenIcon from '../icons/KitchenIcons';

// Fallback list only — used if the real pantry can't be reached or is still empty
const POPULAR_INGREDIENTS = [
  { name: 'Chicken', emoji: '🍗' },
  { name: 'Rice', emoji: '🍚' },
  { name: 'Eggs', emoji: '🥚' },
  { name: 'Tomatoes', emoji: '🍅' },
  { name: 'Onions', emoji: '🧅' },
  { name: 'Potatoes', emoji: '🥔' },
  { name: 'Yogurt', emoji: '🥣' },
  { name: 'Flour', emoji: '🌾' },
  { name: 'Garlic', emoji: '🧄' },
  { name: 'Cheese', emoji: '🧀' },
  { name: 'Paneer', emoji: '🧀' },
  { name: 'Pasta', emoji: '🍝' },
  { name: 'Butter', emoji: '🧈' }
];

const IngredientMatcherWidget = ({ selectedIngredients = [], onIngredientsChange, matchCount = null }) => {
  const [customInput, setCustomInput] = useState('');
  const [expanded, setExpanded] = useState(true);
  const [pantryItems, setPantryItems] = useState(null); // null = still loading

  // Pull from the real, shared kitchen inventory so this reflects what's actually in stock
  useEffect(() => {
    const loadPantry = async () => {
      try {
        const res = await api.get('/kitchen-items');
        setPantryItems(Array.isArray(res.data) ? res.data : []);
      } catch (err) {
        setPantryItems([]);
      }
    };
    loadPantry();
  }, []);

  const availableItems = pantryItems && pantryItems.length > 0
    ? pantryItems.map((it) => ({ name: it.name, iconKey: it.iconKey }))
    : POPULAR_INGREDIENTS;

  const toggleIngredient = (ingName) => {
    const norm = ingName.trim().toLowerCase();
    if (selectedIngredients.map(i => i.toLowerCase()).includes(norm)) {
      onIngredientsChange(selectedIngredients.filter(i => i.toLowerCase() !== norm));
    } else {
      onIngredientsChange([...selectedIngredients, ingName.trim()]);
    }
  };

  const handleAddCustom = (e) => {
    e.preventDefault();
    if (!customInput.trim()) return;
    toggleIngredient(customInput.trim());
    setCustomInput('');
  };

  return (
    <div
      className="card"
      style={{
        background: 'var(--surface)',
        border: '1.5px solid var(--border)',
        borderRadius: 'var(--radius)',
        padding: '20px 24px',
        marginBottom: 24,
        boxShadow: 'var(--shadow)',
        position: 'relative',
        overflow: 'hidden'
      }}
    >
      {/* Header Bar */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 10, marginBottom: 12 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <h3 style={{ fontSize: '1.2rem', color: 'var(--text)', fontFamily: 'var(--font-display)', margin: 0, display: 'flex', alignItems: 'center', gap: 8 }}>
            <span>🥣</span> What Ingredients Do You Have?
          </h3>
          {selectedIngredients.length > 0 && (
            <span
              style={{
                fontSize: '0.74rem',
                fontWeight: 800,
                background: 'var(--accent)',
                color: '#FFFFFF',
                padding: '2px 10px',
                borderRadius: 20
              }}
            >
              {selectedIngredients.length} Selected
            </span>
          )}
        </div>

        <button
          type="button"
          className="btn btn-xs btn-ghost"
          onClick={() => setExpanded(!expanded)}
          style={{ fontWeight: 700, color: 'var(--gold)', borderRadius: 20 }}
        >
          {expanded ? '▲ Hide Pantry' : '▼ Tap to Pick Ingredients'}
        </button>
      </div>

      <p style={{ fontSize: '0.86rem', color: 'var(--muted)', margin: '0 0 16px', lineHeight: 1.4 }}>
        Tap your available kitchen ingredients to instantly match delicious recipes you can make right now.
      </p>

      {/* Live Match Count Feedback */}
      {matchCount !== null && selectedIngredients.length > 0 && (
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 8,
            padding: '10px 16px',
            borderRadius: 'var(--radius-sm)',
            marginBottom: 16,
            fontSize: '0.85rem',
            fontWeight: 700,
            background: matchCount > 0 ? 'var(--accent)' : 'var(--bg-elevated)',
            color: matchCount > 0 ? '#FFFFFF' : 'var(--muted)',
            border: matchCount > 0 ? 'none' : '1px solid var(--border)'
          }}
        >
          <span>{matchCount > 0 ? '✨' : '😕'}</span>
          <span>
            {matchCount > 0
              ? `${matchCount} recipe${matchCount === 1 ? '' : 's'} you can make right now!`
              : 'No recipes match yet — try removing an ingredient.'}
          </span>
        </div>
      )}

      {/* Selected Pantry Bar */}
      {selectedIngredients.length > 0 && (
        <div
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            gap: 8,
            alignItems: 'center',
            background: 'var(--bg-elevated)',
            border: '1px solid var(--border)',
            padding: '10px 14px',
            borderRadius: 'var(--radius-sm)',
            marginBottom: 16
          }}
        >
          <span style={{ fontSize: '0.76rem', fontWeight: 800, color: 'var(--gold)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
            Matching Pantry:
          </span>
          {selectedIngredients.map((ing) => (
            <span
              key={ing}
              style={{
                background: 'var(--accent)',
                color: '#FFFFFF',
                padding: '4px 12px',
                borderRadius: 20,
                fontSize: '0.8rem',
                fontWeight: 700,
                display: 'inline-flex',
                alignItems: 'center',
                gap: 6,
                cursor: 'pointer',
                transition: 'all var(--transition)'
              }}
              onClick={() => toggleIngredient(ing)}
              title="Click to remove"
            >
              <span>{ing}</span>
              <span style={{ opacity: 0.8, fontSize: '0.75rem' }}>✕</span>
            </span>
          ))}
          <button
            className="btn btn-xs btn-ghost"
            onClick={() => onIngredientsChange([])}
            style={{ fontSize: '0.75rem', color: 'var(--danger)', marginLeft: 'auto' }}
          >
            Clear Pantry
          </button>
        </div>
      )}

      {/* Ingredient Chip Selection */}
      {expanded && (
        <div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginBottom: 16 }}>
            {availableItems.map((item) => {
              const isSelected = selectedIngredients.map(i => i.toLowerCase()).includes(item.name.toLowerCase());
              return (
                <button
                  key={item.name}
                  type="button"
                  onClick={() => toggleIngredient(item.name)}
                  style={{
                    fontSize: '0.84rem',
                    fontWeight: 700,
                    padding: '7px 15px',
                    borderRadius: 24,
                    cursor: 'pointer',
                    background: isSelected ? 'var(--accent)' : 'var(--bg-elevated)',
                    color: isSelected ? '#FFFFFF' : 'var(--text)',
                    border: '1.5px solid',
                    borderColor: isSelected ? 'var(--accent-hover)' : 'var(--border)',
                    boxShadow: isSelected ? '0 4px 12px rgba(0,0,0,0.15)' : 'none',
                    transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: 6
                  }}
                  onMouseEnter={(e) => {
                    if (!isSelected) {
                      e.currentTarget.style.background = 'var(--surface-hover)';
                      e.currentTarget.style.borderColor = 'var(--accent)';
                      e.currentTarget.style.transform = 'translateY(-2px)';
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (!isSelected) {
                      e.currentTarget.style.background = 'var(--bg-elevated)';
                      e.currentTarget.style.borderColor = 'var(--border)';
                      e.currentTarget.style.transform = 'none';
                    }
                  }}
                >
                  {item.iconKey ? <KitchenIcon iconKey={item.iconKey} size={20} /> : <span>{item.emoji}</span>}
                  <span>{item.name}</span>
                  {isSelected && <span style={{ marginLeft: 2 }}>✓</span>}
                </button>
              );
            })}
          </div>

          {/* Add Custom Extra Ingredient Form */}
          <form onSubmit={handleAddCustom} style={{ display: 'flex', gap: 8, maxWidth: 400 }}>
            <input
              placeholder="Add extra ingredient (e.g. Cinnamon, Ginger)..."
              value={customInput}
              onChange={(e) => setCustomInput(e.target.value)}
              style={{ fontSize: '0.85rem', padding: '9px 16px', borderRadius: 20 }}
            />
            <button className="btn btn-sm" type="submit" style={{ flexShrink: 0, borderRadius: 20 }}>
              + Add to Pantry
            </button>
          </form>
        </div>
      )}
    </div>
  );
};

export default IngredientMatcherWidget;
