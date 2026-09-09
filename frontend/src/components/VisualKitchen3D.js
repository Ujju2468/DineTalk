import React, { useState } from 'react';

const SPICE_BOX_ITEMS = [
  { name: 'Haldi (Turmeric)', color: '#E5A93C', emoji: '🟡', desc: 'Golden warmth & immunity' },
  { name: 'Jeera (Cumin)', color: '#8C6747', emoji: '🟤', desc: 'Earthy aroma' },
  { name: 'Rai (Mustard)', color: '#3A2E2B', emoji: '⚫️', desc: 'Pungent temper' },
  { name: 'Lal Mirch (Chili)', color: '#D93829', emoji: '🌶️', desc: 'Fiery heat' },
  { name: 'Garam Masala', color: '#664229', emoji: '🤎', desc: 'Aromatic spice blend' },
  { name: 'Elaichi (Cardamom)', color: '#6A8E4E', emoji: '🟢', desc: 'Sweet fragrance' },
  { name: 'Laung (Cloves)', color: '#4A3326', emoji: '🟤', desc: 'Intense flavor' },
];

const VisualKitchen3D = ({ activeZone, onSelectZone, items = [], onEditItem, onDeleteItem, onAddItem }) => {
  const [hoveredZone, setHoveredZone] = useState(null);
  const [showSpiceBoxModal, setShowSpiceBoxModal] = useState(false);

  return (
    <div style={{ marginBottom: 28 }}>
      {/* 3D / SVG Kitchen Scene Container */}
      <div
        className="card"
        style={{
          background: 'linear-gradient(180deg, #2A1D17 0%, #1F1511 100%)',
          color: 'white',
          borderRadius: 'var(--radius)',
          padding: '24px 20px',
          boxShadow: 'var(--shadow-lg)',
          border: '2px solid #4A3326',
          position: 'relative',
          overflow: 'hidden'
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
          <div>
            <h2 style={{ color: '#F7D08A', margin: 0, fontSize: '1.4rem', fontFamily: 'var(--font-display)' }}>
              🏛 Interactive 3D Kitchen & Mom's Spice Box
            </h2>
            <p style={{ color: '#C8B097', margin: '4px 0 0', fontSize: '0.85rem' }}>
              Tap any zone in the kitchen (Spice Box, Fridge, Counter, Pantry) to view & manage inventory!
            </p>
          </div>
          <div style={{ display: 'flex', gap: 8 }}>
            <button
              className={`btn btn-xs ${activeZone === 'All' ? '' : 'btn-outline'}`}
              onClick={() => onSelectZone('All')}
              style={{ color: activeZone === 'All' ? 'white' : '#F7D08A', borderColor: '#F7D08A' }}
            >
              🌐 View All
            </button>
            <button className="btn btn-xs btn-secondary" onClick={() => onAddItem()}>
              + Add Item
            </button>
          </div>
        </div>

        {/* Isometric SVG Kitchen Scene */}
        <div
          style={{
            position: 'relative',
            width: '100%',
            height: 320,
            background: 'radial-gradient(circle at 50% 30%, #3D2B22 0%, #1A120E 100%)',
            borderRadius: 12,
            border: '1px solid #5A4032',
            display: 'flex',
            align: 'center',
            justify: 'center'
          }}
        >
          <svg viewBox="0 0 900 420" style={{ width: '100%', height: '100%', overflow: 'visible' }}>
            <defs>
              <linearGradient id="fridgeGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#4A6572" />
                <stop offset="100%" stopColor="#232F34" />
              </linearGradient>
              <linearGradient id="counterGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#A0724E" />
                <stop offset="100%" stopColor="#704D33" />
              </linearGradient>
              <linearGradient id="brassGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#F5D061" />
                <stop offset="50%" stopColor="#E5A93C" />
                <stop offset="100%" stopColor="#9E6B18" />
              </linearGradient>
              <filter id="glow">
                <feGaussianBlur stdDeviation="4" result="coloredBlur" />
                <feMerge>
                  <feMergeNode in="coloredBlur" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>
            </defs>

            {/* Kitchen Floor lines */}
            <polygon points="50,400 850,400 780,240 120,240" fill="#2D1F18" stroke="#3D2B22" strokeWidth="2" />

            {/* ZONE 1: REFRIGERATOR (Left side) */}
            <g
              onClick={() => onSelectZone('Fridge')}
              onMouseEnter={() => setHoveredZone('Fridge')}
              onMouseLeave={() => setHoveredZone(null)}
              style={{ cursor: 'pointer', transition: 'all 0.3s' }}
            >
              {/* Main Fridge Body */}
              <rect
                x="80"
                y="60"
                width="150"
                height="290"
                rx="10"
                fill="url(#fridgeGrad)"
                stroke={activeZone === 'Fridge' || hoveredZone === 'Fridge' ? '#64B5F6' : '#37474F'}
                strokeWidth={activeZone === 'Fridge' || hoveredZone === 'Fridge' ? '4' : '2'}
                filter={activeZone === 'Fridge' || hoveredZone === 'Fridge' ? 'url(#glow)' : undefined}
              />
              {/* Freezer line */}
              <line x1="80" y1="170" x2="230" y2="170" stroke="#263238" strokeWidth="3" />
              {/* Handles */}
              <rect x="215" y="90" width="8" height="60" rx="4" fill="#ECEFF1" />
              <rect x="215" y="195" width="8" height="70" rx="4" fill="#ECEFF1" />
              {/* Fridge Label */}
              <text x="155" y="125" textAnchor="middle" fill="#E0F7FA" fontSize="14" fontWeight="bold">
                🧊 FRIDGE
              </text>
              <text x="155" y="145" textAnchor="middle" fill="#B2EBF2" fontSize="10">
                Veggies & Dairy
              </text>
              <text x="155" y="245" textAnchor="middle" fontSize="24">
                🥛🥕🥦🧀
              </text>
            </g>

            {/* ZONE 2: KITCHEN COUNTER & CABINETS (Center) */}
            <g
              onClick={() => onSelectZone('Counter')}
              onMouseEnter={() => setHoveredZone('Counter')}
              onMouseLeave={() => setHoveredZone(null)}
              style={{ cursor: 'pointer', transition: 'all 0.3s' }}
            >
              {/* Upper Cabinets */}
              <rect
                x="270"
                y="50"
                width="340"
                height="90"
                rx="6"
                fill="#4E342E"
                stroke={activeZone === 'Counter' || hoveredZone === 'Counter' ? '#FFB74D' : '#3E2723'}
                strokeWidth="2"
              />
              <line x1="440" y1="50" x2="440" y2="140" stroke="#3E2723" strokeWidth="2" />
              <text x="440" y="95" textAnchor="middle" fill="#FFE0B2" fontSize="13" fontWeight="bold">
                🚪 CABINETS & PANTRY
              </text>

              {/* Countertop */}
              <polygon points="250,210 630,210 650,330 230,330" fill="url(#counterGrad)" stroke="#5D4037" strokeWidth="2" />
              {/* Counter Base */}
              <rect x="250" y="270" width="380" height="80" fill="#3E2723" />
              <text x="440" y="260" textAnchor="middle" fill="#FFF8E1" fontSize="15" fontWeight="bold">
                🍳 COUNTERTOP
              </text>
              <text x="440" y="285" textAnchor="middle" fontSize="22">
                🥣 🍳 🫖 🔪
              </text>
            </g>

            {/* ZONE 3: MOM'S TRADITIONAL SPICE BOX (Masala Dabba - Right side) */}
            <g
              onClick={() => {
                onSelectZone('Spice Box');
                setShowSpiceBoxModal(true);
              }}
              onMouseEnter={() => setHoveredZone('Spice Box')}
              onMouseLeave={() => setHoveredZone(null)}
              style={{ cursor: 'pointer', transition: 'all 0.3s' }}
            >
              {/* Outer Brass Circle */}
              <circle
                cx="740"
                cy="200"
                r="90"
                fill="url(#brassGrad)"
                stroke={activeZone === 'Spice Box' || hoveredZone === 'Spice Box' ? '#FFF' : '#B8860B'}
                strokeWidth={activeZone === 'Spice Box' || hoveredZone === 'Spice Box' ? '5' : '3'}
                filter={activeZone === 'Spice Box' || hoveredZone === 'Spice Box' ? 'url(#glow)' : undefined}
              />
              {/* Inner Rim */}
              <circle cx="740" cy="200" r="80" fill="#654321" stroke="#DAA520" strokeWidth="2" />

              {/* 7 Spice Compartments (Masala Dabba Layout) */}
              <circle cx="740" cy="200" r="22" fill="#E5A93C" stroke="#FFF" strokeWidth="1.5" />
              <circle cx="740" cy="142" r="18" fill="#D93829" stroke="#FFF" strokeWidth="1" />
              <circle cx="790" cy="170" r="18" fill="#8C6747" stroke="#FFF" strokeWidth="1" />
              <circle cx="790" cy="230" r="18" fill="#3A2E2B" stroke="#FFF" strokeWidth="1" />
              <circle cx="740" cy="258" r="18" fill="#6A8E4E" stroke="#FFF" strokeWidth="1" />
              <circle cx="690" cy="230" r="18" fill="#664229" stroke="#FFF" strokeWidth="1" />
              <circle cx="690" cy="170" r="18" fill="#4A3326" stroke="#FFF" strokeWidth="1" />

              <text x="740" y="315" textAnchor="middle" fill="#F7D08A" fontSize="14" fontWeight="bold">
                🌶️ MOM'S SPICE BOX
              </text>
              <text x="740" y="335" textAnchor="middle" fill="#C8B097" fontSize="11">
                (Tap to open Masala Dabba)
              </text>
            </g>
          </svg>
        </div>

        {/* Zone Filter Chips Bar */}
        <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', marginTop: 16, justifyContent: 'center' }}>
          <button
            className={`btn btn-sm ${activeZone === 'All' ? '' : 'btn-outline'}`}
            onClick={() => onSelectZone('All')}
          >
            🌐 All Items ({items.length})
          </button>
          <button
            className={`btn btn-sm ${activeZone === 'Spice Box' ? '' : 'btn-outline'}`}
            onClick={() => {
              onSelectZone('Spice Box');
              setShowSpiceBoxModal(true);
            }}
          >
            🌶️ Mom's Spice Box
          </button>
          <button
            className={`btn btn-sm ${activeZone === 'Fridge' ? '' : 'btn-outline'}`}
            onClick={() => onSelectZone('Fridge')}
          >
            🧊 Refrigerator (Veggies & Dairy)
          </button>
          <button
            className={`btn btn-sm ${activeZone === 'Counter' ? '' : 'btn-outline'}`}
            onClick={() => onSelectZone('Counter')}
          >
            🍳 Counter & Cabinets
          </button>
        </div>
      </div>

      {/* Mom's Spice Box (Masala Dabba) Interactive Modal */}
      {showSpiceBoxModal && (
        <div className="onboarding-overlay" onClick={() => setShowSpiceBoxModal(false)}>
          <div className="onboarding-modal" onClick={(e) => e.stopPropagation()} style={{ maxWidth: 680 }}>
            <div style={{ background: 'linear-gradient(135deg, #7A4B1A 0%, #4A2B0F 100%)', padding: '24px 28px', color: 'white' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <h2 style={{ color: '#F7D08A', margin: 0, fontFamily: 'var(--font-display)' }}>
                  🌶️ Mom's Traditional Spice Box (Masala Dabba)
                </h2>
                <button className="btn btn-xs btn-ghost" style={{ color: 'white' }} onClick={() => setShowSpiceBoxModal(false)}>
                  ✕ Close
                </button>
              </div>
              <p style={{ color: '#E2D1C3', margin: '6px 0 0', fontSize: '0.9rem' }}>
                Traditional Indian spice compartments for essential aromatics & seasoning.
              </p>
            </div>

            <div style={{ padding: 24 }}>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: 14 }}>
                {SPICE_BOX_ITEMS.map((spice, idx) => (
                  <div
                    key={idx}
                    className="card"
                    style={{
                      border: `2px solid ${spice.color}`,
                      background: 'var(--surface)',
                      textAlign: 'center',
                      padding: 14,
                      position: 'relative'
                    }}
                  >
                    <div style={{ fontSize: '2rem', marginBottom: 4 }}>{spice.emoji}</div>
                    <div style={{ fontWeight: 700, fontSize: '0.92rem', color: 'var(--text)' }}>{spice.name}</div>
                    <div style={{ fontSize: '0.76rem', color: 'var(--muted)', marginTop: 2 }}>{spice.desc}</div>
                  </div>
                ))}
              </div>

              <div style={{ marginTop: 20, textAlign: 'center' }}>
                <button
                  className="btn"
                  onClick={() => {
                    setShowSpiceBoxModal(false);
                    onSelectZone('Spice Box');
                  }}
                >
                  ➕ Manage Spice Items in Inventory
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default VisualKitchen3D;
