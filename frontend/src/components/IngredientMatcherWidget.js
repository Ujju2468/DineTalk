import React, { useState } from 'react';
import PantryPicker from './PantryPicker';

const IngredientMatcherWidget = ({ selectedIngredients = [], onIngredientsChange, matchCount = null }) => {
  const [expanded, setExpanded] = useState(true);

  const toggleIngredient = (ingName) => {
    const norm = ingName.trim().toLowerCase();
    if (selectedIngredients.map(i => i.toLowerCase()).includes(norm)) {
      onIngredientsChange(selectedIngredients.filter(i => i.toLowerCase() !== norm));
    } else {
      onIngredientsChange([...selectedIngredients, ingName.trim()]);
    }
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

      {/* Same category-grouped picker as the Kitchen Inventory page — spices,
          vegetables, fruits, dairy, etc. — pulled live from /kitchen-items */}
      {expanded && (
        <PantryPicker
          selectedNames={selectedIngredients}
          onItemClick={(item) => toggleIngredient(item.name)}
          helperText="Tap items you have on hand. Anything new you add here is saved to your shared Kitchen Inventory too."
        />
      )}
    </div>
  );
};

export default IngredientMatcherWidget;
