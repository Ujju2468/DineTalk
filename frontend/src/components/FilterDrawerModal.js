import React from 'react';

const ORIGIN_OPTIONS = ['All', 'Indian', 'Italian', 'Mexican', 'Asian', 'American', 'Middle Eastern', 'French', 'Mediterranean'];
const COOK_TIME_OPTIONS = [
  { label: '⏱ Any Time', value: 0 },
  { label: '⚡️ Under 15m', value: 15 },
  { label: '🍳 Under 30m', value: 30 },
  { label: '🥘 Under 60m', value: 60 }
];

const FilterDrawerModal = ({
  isOpen,
  onClose,
  search,
  setSearch,
  originFilter,
  setOriginFilter,
  maxCookTime,
  setMaxCookTime,
  sortBy,
  setSortBy,
  category,
  setCategory,
  categories = [],
  onClearAll
}) => {
  if (!isOpen) return null;

  const activeCount = (category !== 'All' ? 1 : 0) + (originFilter !== 'All' ? 1 : 0) + (maxCookTime > 0 ? 1 : 0) + (search ? 1 : 0);

  return (
    <div className="onboarding-overlay" onClick={onClose} style={{ background: 'rgba(0,0,0,0.68)', zIndex: 300 }}>
      <div
        className="onboarding-modal"
        onClick={(e) => e.stopPropagation()}
        style={{
          maxWidth: 580,
          padding: 0,
          background: 'var(--surface)',
          border: '1.5px solid var(--border)',
          borderRadius: 'var(--radius)',
          overflow: 'hidden',
          boxShadow: 'var(--shadow-lg)',
          animation: 'slideUp 0.25s cubic-bezier(0.34, 1.56, 0.64, 1)'
        }}
      >
        {/* Header Gradient */}
        <div style={{ background: 'linear-gradient(135deg, var(--accent) 0%, var(--accent-hover) 100%)', padding: '20px 24px', color: '#FFFFFF', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <h2 style={{ color: '#FFFFFF', margin: 0, fontSize: '1.35rem', fontFamily: 'var(--font-display)' }}>
              🎛 Recipe Filters & Sorting
            </h2>
            <p style={{ color: 'rgba(255,255,255,0.85)', margin: '4px 0 0', fontSize: '0.84rem' }}>
              Refine recipes by origin, cook time, category, and sorting preference.
            </p>
          </div>
          <button className="btn btn-xs btn-ghost" style={{ color: '#FFFFFF', fontSize: '1.2rem' }} onClick={onClose}>
            ✕
          </button>
        </div>

        {/* Form Controls */}
        <div style={{ padding: 24, display: 'flex', flexDirection: 'column', gap: 20 }}>
          {/* Search Box */}
          <div>
            <label style={{ fontSize: '0.82rem', fontWeight: 800, textTransform: 'uppercase', color: 'var(--muted)', display: 'block', marginBottom: 6 }}>
              🔍 Search Keywords / Origin
            </label>
            <input
              placeholder="Search recipe title, origin (e.g. Italian, Dum), or ingredients..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              style={{ width: '100%', padding: '10px 14px', borderRadius: 20 }}
            />
          </div>

          {/* Sort By Selection */}
          <div>
            <label style={{ fontSize: '0.82rem', fontWeight: 800, textTransform: 'uppercase', color: 'var(--muted)', display: 'block', marginBottom: 6 }}>
              🔤 Sort Recipes By
            </label>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
              {[
                { id: 'newest', label: '🗓 Recently Added' },
                { id: 'az', label: '🔤 Alphabetical (A-Z)' },
                { id: 'likes', label: '❤️ Most Popular (Likes)' },
                { id: 'time', label: '⏱ Quickest Cook Time' }
              ].map((opt) => (
                <button
                  key={opt.id}
                  type="button"
                  onClick={() => setSortBy(opt.id)}
                  style={{
                    padding: '8px 12px',
                    borderRadius: 'var(--radius-sm)',
                    fontWeight: 700,
                    fontSize: '0.84rem',
                    background: sortBy === opt.id ? 'var(--accent)' : 'var(--bg-elevated)',
                    color: sortBy === opt.id ? '#FFFFFF' : 'var(--text2)',
                    border: '1.5px solid',
                    borderColor: sortBy === opt.id ? 'var(--accent-hover)' : 'var(--border)',
                    cursor: 'pointer',
                    textAlign: 'left',
                    transition: 'all var(--transition)'
                  }}
                  onMouseEnter={(e) => {
                    if (sortBy !== opt.id) {
                      e.currentTarget.style.background = 'var(--surface-hover)';
                      e.currentTarget.style.color = 'var(--text)';
                      e.currentTarget.style.borderColor = 'var(--accent)';
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (sortBy !== opt.id) {
                      e.currentTarget.style.background = 'var(--bg-elevated)';
                      e.currentTarget.style.color = 'var(--text2)';
                      e.currentTarget.style.borderColor = 'var(--border)';
                    }
                  }}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>

          {/* Origin / Cuisine */}
          <div>
            <label style={{ fontSize: '0.82rem', fontWeight: 800, textTransform: 'uppercase', color: 'var(--muted)', display: 'block', marginBottom: 6 }}>
              🌍 Cuisine / Country Origin
            </label>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
              {ORIGIN_OPTIONS.map((orig) => (
                <button
                  key={orig}
                  type="button"
                  onClick={() => setOriginFilter(orig)}
                  style={{
                    padding: '5px 12px',
                    borderRadius: 20,
                    fontWeight: 700,
                    fontSize: '0.8rem',
                    background: originFilter === orig ? 'var(--accent)' : 'var(--bg-elevated)',
                    color: originFilter === orig ? '#FFFFFF' : 'var(--text2)',
                    border: '1.5px solid',
                    borderColor: originFilter === orig ? 'var(--accent-hover)' : 'var(--border)',
                    cursor: 'pointer',
                    transition: 'all var(--transition)'
                  }}
                  onMouseEnter={(e) => {
                    if (originFilter !== orig) {
                      e.currentTarget.style.background = 'var(--surface-hover)';
                      e.currentTarget.style.color = 'var(--text)';
                      e.currentTarget.style.borderColor = 'var(--accent)';
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (originFilter !== orig) {
                      e.currentTarget.style.background = 'var(--bg-elevated)';
                      e.currentTarget.style.color = 'var(--text2)';
                      e.currentTarget.style.borderColor = 'var(--border)';
                    }
                  }}
                >
                  {orig}
                </button>
              ))}
            </div>
          </div>

          {/* Cook Time Filter */}
          <div>
            <label style={{ fontSize: '0.82rem', fontWeight: 800, textTransform: 'uppercase', color: 'var(--muted)', display: 'block', marginBottom: 6 }}>
              ⏱ Cook Time Duration
            </label>
            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
              {COOK_TIME_OPTIONS.map((ct) => (
                <button
                  key={ct.value}
                  type="button"
                  onClick={() => setMaxCookTime(ct.value)}
                  style={{
                    padding: '6px 14px',
                    borderRadius: 20,
                    fontWeight: 700,
                    fontSize: '0.8rem',
                    background: maxCookTime === ct.value ? 'var(--gold)' : 'var(--bg-elevated)',
                    color: maxCookTime === ct.value ? '#FFFFFF' : 'var(--text2)',
                    border: '1.5px solid',
                    borderColor: maxCookTime === ct.value ? 'var(--gold-hover)' : 'var(--border)',
                    cursor: 'pointer',
                    transition: 'all var(--transition)'
                  }}
                  onMouseEnter={(e) => {
                    if (maxCookTime !== ct.value) {
                      e.currentTarget.style.background = 'var(--surface-hover)';
                      e.currentTarget.style.color = 'var(--text)';
                      e.currentTarget.style.borderColor = 'var(--gold)';
                    } else {
                      e.currentTarget.style.background = 'var(--gold-hover)';
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (maxCookTime !== ct.value) {
                      e.currentTarget.style.background = 'var(--bg-elevated)';
                      e.currentTarget.style.color = 'var(--text2)';
                      e.currentTarget.style.borderColor = 'var(--border)';
                    } else {
                      e.currentTarget.style.background = 'var(--gold)';
                    }
                  }}
                >
                  {ct.label}
                </button>
              ))}
            </div>
          </div>

          {/* Action Footer */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: 14, borderTop: '1px solid var(--border)', marginTop: 10 }}>
            <div>
              {activeCount > 0 && (
                <span className="badge-section">
                  {activeCount} Filter{activeCount > 1 ? 's' : ''} Active
                </span>
              )}
            </div>

            <div style={{ display: 'flex', gap: 10 }}>
              {activeCount > 0 && (
                <button className="btn btn-sm btn-ghost" type="button" onClick={onClearAll} style={{ color: 'var(--danger)' }}>
                  🧹 Clear All
                </button>
              )}
              <button className="btn btn-sm" type="button" onClick={onClose}>
                ✓ Apply & View Recipes
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FilterDrawerModal;
