import React, { useState } from 'react';
import KitchenIcon from '../icons/KitchenIcons';

/* Zone → item-type mapping */
const ZONE_TYPES = {
  fridge:   ['Vegetable','Fruit','Dairy','Herb'],
  spices:   ['Spice'],
  shelves:  ['Vessel','Pan','Wok','Utensil','Equipment','Other'],
};

const ZONE_LABELS = { fridge: '🧊 Fridge', spices: '🌶 Spice Box', shelves: '📦 Shelves' };

/* ── Utility: filter items for a zone ── */
const zoneItems = (items, zone) =>
  items.filter(i => (ZONE_TYPES[zone] || []).includes(i.type));

/* ─────────────────────────────────────────────────────────────────
   FRIDGE DOOR SVG  (left panel of kitchen scene)
───────────────────────────────────────────────────────────────── */
const FridgeSVG = ({ open, onClick }) => (
  <g onClick={onClick} style={{ cursor: 'pointer' }}>
    {/* Cabinet body */}
    <rect x="18" y="60" width="148" height="330" rx="8" fill="#2A2E35" stroke="#3E444E" strokeWidth="1.5"/>
    {/* Freezer door */}
    <rect
      x="22" y="64" width="140" height="100" rx="6"
      fill={open ? '#1C2128' : '#343840'}
      style={{ transition: 'fill 0.4s ease' }}
    />
    {/* Fridge door — rotates open */}
    <g style={{
      transformOrigin: '22px 175px',
      transform: open ? 'perspective(300px) rotateY(-55deg)' : 'perspective(300px) rotateY(0deg)',
      transition: 'transform 0.55s cubic-bezier(0.4,0,0.2,1)'
    }}>
      <rect x="22" y="168" width="140" height="218" rx="6" fill="#343840"/>
      {/* Door shelves */}
      <rect x="26" y="200" width="132" height="22" rx="3" fill="rgba(255,255,255,0.06)"/>
      <rect x="26" y="238" width="132" height="22" rx="3" fill="rgba(255,255,255,0.06)"/>
      <rect x="26" y="276" width="132" height="22" rx="3" fill="rgba(255,255,255,0.06)"/>
      {/* Door handle */}
      <rect x="149" y="255" width="6" height="60" rx="3" fill="#8A9099"/>
      {/* Brand light strip */}
      <rect x="26" y="172" width="132" height="3" rx="1.5" fill="#4FC3F7" opacity="0.5"/>
    </g>
    {/* Smart panel glow */}
    <rect x="28" y="74" width="60" height="80" rx="4" fill="#1A1F26"/>
    <rect x="30" y="76" width="56" height="76" rx="3" fill="#0D1117" opacity="0.8"/>
    <circle cx="58" cy="114" r="22" fill="#0A1628" opacity="0.9"/>
    <circle cx="58" cy="114" r="18" fill="#0B2240" opacity="0.8"/>
    <text x="58" y="110" textAnchor="middle" fill="#4FC3F7" fontSize="8" fontWeight="700">SMART</text>
    <text x="58" y="121" textAnchor="middle" fill="#4FC3F7" fontSize="6">FRIDGE</text>
    {/* Temp display */}
    <text x="104" y="105" textAnchor="middle" fill="#A0ADB8" fontSize="9">4°C</text>
    <text x="104" y="118" textAnchor="middle" fill="#5B7A8A" fontSize="7">COOL</text>
    {/* Ice & water dispenser */}
    <rect x="28" y="160" width="60" height="6" rx="2" fill="#252A30"/>
    <circle cx="38" cy="163" r="4" fill="#1E252C"/>
    <circle cx="52" cy="163" r="4" fill="#1E252C"/>
    {/* Ambient glow when open */}
    {open && <rect x="22" y="168" width="140" height="218" rx="6" fill="rgba(180,220,255,0.04)"/>}
    {/* Label */}
    <text x="92" y="402" textAnchor="middle" fill="#8A9099" fontSize="9" fontWeight="600">FRIDGE</text>
  </g>
);

/* ─────────────────────────────────────────────────────────────────
   SPICE RACK SVG  (right panel)
───────────────────────────────────────────────────────────────── */
const SpiceRackSVG = ({ open, onClick }) => (
  <g onClick={onClick} style={{ cursor: 'pointer' }}>
    {/* Cabinet frame */}
    <rect x="18" y="60" width="148" height="280" rx="8" fill="#3D2B1F" stroke="#5C3D28" strokeWidth="1.5"/>
    {/* Warm wood shelves */}
    {[0,1,2,3].map(i => (
      <rect key={i} x="24" y={80 + i*56} width="136" height="12" rx="3"
        fill="#7B4F2A" stroke="#5C3D28" strokeWidth="0.8"/>
    ))}
    {/* Under-shelf warm LEDs */}
    {[0,1,2,3].map(i => (
      <rect key={i} x="26" y={91 + i*56} width="132" height="2" rx="1"
        fill="#FFB347" opacity="0.4"/>
    ))}
    {/* Spice jar grid — 3×4 */}
    {[0,1,2,3].map(row =>
      [0,1,2].map(col => {
        const colors = ['#8B1A1A','#4A3728','#6B4E2A','#2E5E2E','#7A4E2A','#5A3525','#3A5A2A','#8B5E1A','#5A2A2A','#3A2E5A','#5A4A2A','#7A3A2A'];
        const c = colors[(row*3+col) % colors.length];
        const jx = 34 + col * 42;
        const jy = 95 + row * 56;
        return (
          <g key={`${row}-${col}`}>
            <rect x={jx} y={jy} width="28" height="38" rx="3" fill={c} opacity="0.85"/>
            <rect x={jx+3} y={jy+2} width="22" height="8" rx="2" fill="rgba(255,255,255,0.15)"/>
            <rect x={jx} y={jy} width="28" height="6" rx="3" fill="rgba(0,0,0,0.4)"/>
          </g>
        );
      })
    )}
    {/* Drawer — slides open */}
    <g style={{
      transform: open ? 'translateY(12px)' : 'translateY(0)',
      transition: 'transform 0.5s cubic-bezier(0.4,0,0.2,1)'
    }}>
      <rect x="22" y="318" width="140" height="14" rx="3" fill="#5C3D28"/>
      <rect x="68" y="321" width="48" height="5" rx="2" fill="#3D2B1F"/>
    </g>
    {/* Handle */}
    <rect x="70" y="350" width="44" height="5" rx="2.5" fill="#8B6040"/>
    {/* Glow overlay when open */}
    {open && (
      <rect x="18" y="60" width="148" height="280" rx="8"
        fill="rgba(255,180,80,0.06)" style={{ pointerEvents: 'none' }}/>
    )}
    <text x="92" y="370" textAnchor="middle" fill="#8B6040" fontSize="9" fontWeight="600">SPICE BOX</text>
  </g>
);

/* ─────────────────────────────────────────────────────────────────
   WALL SHELVES SVG (centre top)
───────────────────────────────────────────────────────────────── */
const ShelvesSVG = ({ open, onClick }) => (
  <g onClick={onClick} style={{ cursor: 'pointer' }}>
    {/* Back wall panels */}
    <rect x="10" y="10" width="364" height="200" rx="6" fill="#1E1A14" stroke="#2E2820" strokeWidth="1"/>
    {/* 3 wall shelves */}
    {[0,1,2].map(i => (
      <g key={i}>
        <rect x="16" y={20 + i*64} width="352" height="10" rx="3"
          fill="#5C4020" stroke="#3D2810" strokeWidth="0.8"/>
        {/* Under-shelf LED */}
        <rect x="18" y={29 + i*64} width="348" height="2" rx="1"
          fill="#FFB347" opacity={open ? 0.6 : 0.2}
          style={{ transition: 'opacity 0.5s ease' }}/>
        {/* Shelf items — jars */}
        {[0,1,2,3,4,5,6].map(j => {
          const jColors = ['#8B3A2A','#4A6B3A','#7A5A2A','#3A5A7A','#6B3A5A','#5A6B3A','#3A3A7A'];
          const jx = 22 + j*50;
          const jy = 32 + i*64;
          return (
            <g key={j}>
              <ellipse cx={jx+14} cy={jy+4} rx="13" ry="4" fill="#3E2810" opacity="0.6"/>
              <rect x={jx} y={jy} width="28" height="24" rx="4" fill={jColors[j % jColors.length]} opacity="0.8"/>
              <rect x={jx+2} y={jy+2} width="24" height="7" rx="3" fill="rgba(255,255,255,0.12)"/>
              <rect x={jx} y={jy} width="28" height="5" rx="4" fill="#2A1C0A" opacity="0.7"/>
            </g>
          );
        })}
      </g>
    ))}
    {/* Ambient ceiling glow bar */}
    <rect x="10" y="10" width="364" height="4" rx="2"
      fill="#FFD580"
      opacity={open ? 0.45 : 0.15}
      style={{ transition: 'opacity 0.5s ease' }}/>
    <text x="192" y="216" textAnchor="middle" fill="#5C4020" fontSize="9" fontWeight="600">WALL SHELVES</text>
  </g>
);

/* ─────────────────────────────────────────────────────────────────
   ISLAND + COUNTER TOP SVG (centre bottom)
───────────────────────────────────────────────────────────────── */
const IslandSVG = () => (
  <g>
    {/* Island marble top */}
    <rect x="10" y="10" width="364" height="60" rx="6" fill="#E8E4DC"/>
    {/* Marble veins */}
    <path d="M40 15 Q120 30 200 20 Q280 10 340 28" stroke="#D0CBC0" strokeWidth="1.2" fill="none" opacity="0.7"/>
    <path d="M20 40 Q100 28 180 42 Q260 55 350 38" stroke="#D0CBC0" strokeWidth="0.8" fill="none" opacity="0.5"/>
    {/* Island body */}
    <rect x="10" y="68" width="364" height="110" rx="0" fill="#2A2420"/>
    {/* Open shelf compartments */}
    <rect x="18" y="76" width="160" height="94" rx="4" fill="#1E1A16"/>
    <rect x="186" y="76" width="180" height="94" rx="4" fill="#1E1A16"/>
    {/* Shelf divider */}
    <rect x="18" y="120" width="160" height="4" rx="2" fill="#3D3028"/>
    {/* Jar grid in left compartment */}
    {[0,1,2,3,4].map(j => (
      <g key={j}>
        <ellipse cx={32+j*30} cy={83} rx="10" ry="3.5" fill="#3E3028" opacity="0.8"/>
        <rect x={22+j*30} y={84} width="20" height="32" rx="3" fill={['#8B6A3A','#5A4A2A','#6B5A3A','#7A6040','#4A3A28'][j]} opacity="0.9"/>
        <rect x={24+j*30} y={86} width="16" height="7" rx="2" fill="rgba(255,255,255,0.1)"/>
      </g>
    ))}
    {/* Spice tray in right compartment */}
    {[0,1,2,3,4,5].map(j => (
      <g key={j}>
        <rect x={192+j*28} y={84} width="22" height="30" rx="3"
          fill={['#8B2A2A','#5A7A2A','#7A5A1A','#2A5A7A','#7A2A5A','#3A5A1A'][j % 6]} opacity="0.85"/>
        <rect x={194+j*28} y={86} width="18" height="6" rx="2" fill="rgba(255,255,255,0.12)"/>
      </g>
    ))}
    {/* Pots lower shelf */}
    {[0,1,2].map(j => (
      <g key={j}>
        <ellipse cx={40+j*52} cy={149} rx="20" ry="7" fill="#252020"/>
        <path d={`M${20+j*52} 149 L${20+j*52} 162 Q${40+j*52} 170 ${60+j*52} 162 L${60+j*52} 149`}
          fill="#303030" stroke="#404040" strokeWidth="1"/>
        <ellipse cx={40+j*52} cy={149} rx="20" ry="7" fill="#383838"/>
        <line x1={20+j*52} y1={149} x2={14+j*52} y2={143} stroke="#505050" strokeWidth="3" strokeLinecap="round"/>
      </g>
    ))}
    {/* Counter highlights */}
    <rect x="10" y="10" width="364" height="3" rx="1.5" fill="rgba(255,255,255,0.4)"/>
  </g>
);

/* ─────────────────────────────────────────────────────────────────
   CEILING LIGHTS SVG
───────────────────────────────────────────────────────────────── */
const CeilingLights = ({ lightsOn, onToggle }) => (
  <g onClick={onToggle} style={{ cursor: 'pointer' }}>
    {/* Two pendant lights */}
    {[130, 250].map(cx => (
      <g key={cx}>
        <line x1={cx} y1="0" x2={cx} y2="32" stroke="#555" strokeWidth="2.5"/>
        <path d={`M${cx-22} 32 Q${cx} 28 ${cx+22} 32 L${cx+18} 58 Q${cx} 64 ${cx-18} 58 Z`}
          fill="#2A2A2A" stroke="#404040" strokeWidth="1"/>
        {/* Bulb glow */}
        {lightsOn && (
          <>
            <circle cx={cx} cy={52} r="10" fill="#FFE066" opacity="0.15"/>
            <circle cx={cx} cy={52} r="5" fill="#FFE066" opacity="0.6"/>
            <radialGradient id={`glow-${cx}`} cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#FFE580" stopOpacity="0.4"/>
              <stop offset="100%" stopColor="#FFE580" stopOpacity="0"/>
            </radialGradient>
            <ellipse cx={cx} cy={58} rx="60" ry="50"
              fill={`url(#glow-${cx})`} style={{ pointerEvents: 'none' }}/>
          </>
        )}
        <circle cx={cx} cy={52} r="4"
          fill={lightsOn ? '#FFE580' : '#333'}
          style={{ transition: 'fill 0.4s ease' }}/>
      </g>
    ))}
    <text x="192" y="-4" textAnchor="middle" fill="#555" fontSize="8">TAP LIGHTS</text>
  </g>
);

/* ═══════════════════════════════════════════════════════════════════
   MAIN VISUAL KITCHEN SCENE COMPONENT
═══════════════════════════════════════════════════════════════════ */
const VisualKitchenScene = ({ items = [], onAddItem, onEditItem, onDeleteItem }) => {
  const [openZone, setOpenZone] = useState(null);   // 'fridge' | 'spices' | 'shelves' | null
  const [lightsOn, setLightsOn] = useState(true);

  const toggleZone = (zone) => setOpenZone(z => z === zone ? null : zone);

  const panelItems = openZone ? zoneItems(items, openZone) : [];

  return (
    <div style={{ width: '100%', marginBottom: 32 }}>

      {/* ── Kitchen Scene SVG ── */}
      <div style={{
        position: 'relative',
        width: '100%',
        borderRadius: 'var(--radius)',
        overflow: 'hidden',
        background: lightsOn
          ? 'linear-gradient(170deg, #1A1612 0%, #2A221A 55%, #1E1A14 100%)'
          : 'linear-gradient(170deg, #0E0C0A 0%, #151210 55%, #0E0C0A 100%)',
        border: '1.5px solid var(--border)',
        transition: 'background 0.6s ease',
        boxShadow: lightsOn
          ? '0 8px 40px rgba(255,180,60,0.12), inset 0 0 80px rgba(0,0,0,0.4)'
          : '0 8px 40px rgba(0,0,0,0.5)',
      }}>
        <svg
          viewBox="0 0 760 520"
          xmlns="http://www.w3.org/2000/svg"
          style={{ display: 'block', width: '100%', maxHeight: 440 }}
        >
          <defs>
            <radialGradient id="floorGlow" cx="50%" cy="100%" r="60%">
              <stop offset="0%" stopColor="#FFB347" stopOpacity={lightsOn ? 0.12 : 0.02}/>
              <stop offset="100%" stopColor="#FFB347" stopOpacity="0"/>
            </radialGradient>
            <filter id="softShadow" x="-20%" y="-20%" width="140%" height="140%">
              <feDropShadow dx="0" dy="4" stdDeviation="6" floodColor="#000" floodOpacity="0.5"/>
            </filter>
          </defs>

          {/* Floor */}
          <rect x="0" y="400" width="760" height="120" fill="#1A1510"/>
          <rect x="0" y="400" width="760" height="120" fill="url(#floorGlow)"/>
          {/* Floor tiles */}
          {[0,1,2,3,4,5,6,7].map(i => (
            <line key={i} x1={i*100} y1="400" x2={i*100} y2="520" stroke="#221C14" strokeWidth="1"/>
          ))}
          {[400,440,480].map(y => (
            <line key={y} x1="0" y1={y} x2="760" y2={y} stroke="#221C14" strokeWidth="0.8"/>
          ))}

          {/* Back wall */}
          <rect x="0" y="0" width="760" height="410" fill="#17130F"/>

          {/* Ceiling cove LED strip */}
          <rect x="0" y="0" width="760" height="6"
            fill="#FFD580"
            opacity={lightsOn ? 0.35 : 0.04}
            style={{ transition: 'opacity 0.6s ease' }}/>

          {/* ── CEILING PENDANT LIGHTS ── */}
          <g transform="translate(190, 10)">
            <CeilingLights lightsOn={lightsOn} onToggle={() => setLightsOn(l => !l)}/>
          </g>

          {/* ── WALL SHELVES (top centre) ── */}
          <g transform="translate(192, 14)">
            <ShelvesSVG open={openZone === 'shelves'} onClick={() => toggleZone('shelves')}/>
          </g>

          {/* ── LEFT: FRIDGE ── */}
          <g transform="translate(14, 60)" filter="url(#softShadow)">
            <FridgeSVG open={openZone === 'fridge'} onClick={() => toggleZone('fridge')}/>
          </g>

          {/* ── RIGHT: SPICE RACK ── */}
          <g transform="translate(576, 60)" filter="url(#softShadow)">
            <SpiceRackSVG open={openZone === 'spices'} onClick={() => toggleZone('spices')}/>
          </g>

          {/* ── COUNTER BACK WALL (between fridge and spice, below shelves) ── */}
          <rect x="184" y="232" width="392" height="12" rx="3" fill="#5C4020"/>
          <rect x="184" y="244" width="392" height="130" rx="0" fill="#2A2218"/>
          {/* Counter top slab */}
          <rect x="174" y="370" width="412" height="16" rx="4" fill="#D8D4CC"/>
          <rect x="174" y="370" width="412" height="3" rx="2" fill="rgba(255,255,255,0.35)"/>
          {/* Gas hob */}
          <rect x="286" y="316" width="120" height="80" rx="6" fill="#1A1614"/>
          {[0,1].map(row => [0,1].map(col => (
            <circle key={`${row}-${col}`}
              cx={310+col*72} cy={336+row*40} r="14"
              fill="#252020" stroke="#3A3030" strokeWidth="1.5"/>
          )))}
          {/* Oven */}
          <rect x="432" y="296" width="100" height="80" rx="4" fill="#1E1C1A" stroke="#333" strokeWidth="1"/>
          <rect x="438" y="316" width="88" height="52" rx="3" fill="#141210"/>
          <rect x="438" y="316" width="88" height="4" rx="2" fill="#3A3028" opacity="0.8"/>
          {/* Hood / extractor */}
          <path d="M264 232 L496 232 L476 268 L284 268 Z" fill="#2A2420"/>
          <rect x="284" y="264" width="192" height="4" rx="2" fill="#FF6B6B" opacity="0.15"/>

          {/* ── ISLAND (front, bottom) ── */}
          <g transform="translate(192, 388)">
            <IslandSVG/>
          </g>

          {/* ── CLICKABLE ZONE HOTSPOT LABELS ── */}
          {/* Fridge label */}
          <rect x="20" y="416" width="170" height="22" rx="11"
            fill={openZone==='fridge' ? 'var(--accent)' : 'rgba(255,255,255,0.08)'}
            style={{ transition: 'fill 0.3s ease', cursor: 'pointer' }}
            onClick={() => toggleZone('fridge')}/>
          <text x="105" y="431" textAnchor="middle"
            fill={openZone==='fridge' ? '#fff' : '#8A9099'}
            fontSize="10" fontWeight="700" style={{ cursor:'pointer', pointerEvents:'none' }}>
            🧊 FRIDGE {openZone==='fridge' ? '▲' : '▼'}
          </text>

          {/* Shelves label */}
          <rect x="290" y="416" width="180" height="22" rx="11"
            fill={openZone==='shelves' ? 'var(--accent)' : 'rgba(255,255,255,0.08)'}
            style={{ transition: 'fill 0.3s ease', cursor: 'pointer' }}
            onClick={() => toggleZone('shelves')}/>
          <text x="380" y="431" textAnchor="middle"
            fill={openZone==='shelves' ? '#fff' : '#8A9099'}
            fontSize="10" fontWeight="700" style={{ cursor:'pointer', pointerEvents:'none' }}>
            📦 SHELVES {openZone==='shelves' ? '▲' : '▼'}
          </text>

          {/* Spice label */}
          <rect x="572" y="416" width="170" height="22" rx="11"
            fill={openZone==='spices' ? 'var(--accent)' : 'rgba(255,255,255,0.08)'}
            style={{ transition: 'fill 0.3s ease', cursor: 'pointer' }}
            onClick={() => toggleZone('spices')}/>
          <text x="657" y="431" textAnchor="middle"
            fill={openZone==='spices' ? '#fff' : '#8A9099'}
            fontSize="10" fontWeight="700" style={{ cursor:'pointer', pointerEvents:'none' }}>
            🌶 SPICE BOX {openZone==='spices' ? '▲' : '▼'}
          </text>

          {/* Lights toggle button */}
          <rect x="690" y="6" width="64" height="22" rx="11"
            fill={lightsOn ? '#FFB347' : 'rgba(255,255,255,0.06)'}
            style={{ transition: 'fill 0.4s ease', cursor: 'pointer' }}
            onClick={() => setLightsOn(l => !l)}/>
          <text x="722" y="21" textAnchor="middle"
            fill={lightsOn ? '#1A0E00' : '#666'}
            fontSize="9" fontWeight="800" style={{ cursor:'pointer', pointerEvents:'none' }}>
            {lightsOn ? '💡 ON' : '🌑 OFF'}
          </text>
        </svg>
      </div>

      {/* ── ZONE ITEM PANEL — slides open below the scene ── */}
      <div style={{
        maxHeight: openZone ? 600 : 0,
        overflow: 'hidden',
        transition: 'max-height 0.5s cubic-bezier(0.4,0,0.2,1)',
      }}>
        {openZone && (
          <div style={{
            marginTop: 16,
            background: 'var(--surface)',
            borderRadius: 'var(--radius)',
            border: '1.5px solid var(--border)',
            padding: '20px 24px',
            boxShadow: '0 4px 24px rgba(0,0,0,0.12)',
          }}>
            {/* Panel header */}
            <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:16 }}>
              <div>
                <h3 style={{ margin:0, fontFamily:'var(--font-display)', fontSize:'1.15rem', color:'var(--text)' }}>
                  {ZONE_LABELS[openZone]}
                </h3>
                <p style={{ margin:'4px 0 0', fontSize:'0.82rem', color:'var(--muted)' }}>
                  {panelItems.length} item{panelItems.length !== 1 ? 's' : ''} — shared across all kitchen users
                </p>
              </div>
              <div style={{ display:'flex', gap:8 }}>
                <button
                  className="btn btn-sm"
                  onClick={() => onAddItem && onAddItem(openZone)}
                  style={{ fontSize:'0.8rem' }}
                >
                  + Add Item
                </button>
                <button
                  className="btn btn-outline btn-sm"
                  onClick={() => setOpenZone(null)}
                  style={{ fontSize:'0.8rem' }}
                >
                  ✕ Close
                </button>
              </div>
            </div>

            {/* Items grid */}
            {panelItems.length === 0 ? (
              <div style={{ textAlign:'center', padding:'32px 0', color:'var(--muted)' }}>
                <div style={{ fontSize:'2.5rem', marginBottom:8 }}>
                  {openZone === 'fridge' ? '🧊' : openZone === 'spices' ? '🌶' : '📦'}
                </div>
                <p style={{ margin:0, fontWeight:600 }}>Nothing here yet.</p>
                <p style={{ margin:'4px 0 0', fontSize:'0.83rem' }}>
                  Add items to this zone using the button above.
                </p>
              </div>
            ) : (
              <div style={{
                display:'grid',
                gridTemplateColumns:'repeat(auto-fill, minmax(110px, 1fr))',
                gap:12
              }}>
                {panelItems.map(item => (
                  <div
                    key={item._id}
                    style={{
                      background:'var(--bg-elevated)',
                      border:'1px solid var(--border)',
                      borderRadius:'var(--radius-sm)',
                      padding:'14px 10px 10px',
                      textAlign:'center',
                      display:'flex',
                      flexDirection:'column',
                      alignItems:'center',
                      gap:6,
                      position:'relative',
                      transition:'border-color 0.2s, box-shadow 0.2s',
                    }}
                    onMouseEnter={e => {
                      e.currentTarget.style.borderColor = 'var(--accent)';
                      e.currentTarget.style.boxShadow = '0 2px 12px rgba(0,0,0,0.15)';
                    }}
                    onMouseLeave={e => {
                      e.currentTarget.style.borderColor = 'var(--border)';
                      e.currentTarget.style.boxShadow = 'none';
                    }}
                  >
                    <KitchenIcon iconKey={item.iconKey} size={44}/>
                    <p style={{
                      margin:0, fontSize:'0.78rem', fontWeight:700,
                      color:'var(--text)', lineHeight:1.3, wordBreak:'break-word'
                    }}>
                      {item.name}
                    </p>
                    <span style={{
                      fontSize:'0.68rem', color:'var(--muted)',
                      background:'var(--surface)', padding:'1px 8px',
                      borderRadius:10, border:'1px solid var(--border)'
                    }}>
                      {item.type}
                    </span>
                    {/* Edit / Delete */}
                    <div style={{ display:'flex', gap:4, marginTop:2 }}>
                      <button
                        className="btn btn-xs btn-ghost"
                        title="Edit"
                        onClick={() => onEditItem && onEditItem(item)}
                        style={{ padding:'2px 6px', fontSize:'0.7rem' }}
                      >✏️</button>
                      <button
                        className="btn btn-xs btn-ghost"
                        title="Delete"
                        onClick={() => onDeleteItem && onDeleteItem(item._id, item.name)}
                        style={{ padding:'2px 6px', fontSize:'0.7rem' }}
                      >🗑</button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      {/* ── QUICK HINT ── */}
      {!openZone && (
        <p style={{
          textAlign:'center', margin:'10px 0 0',
          fontSize:'0.8rem', color:'var(--muted)', letterSpacing:'0.03em'
        }}>
          Click the <strong>Fridge</strong>, <strong>Spice Box</strong> or <strong>Shelves</strong> to view & manage items · Toggle 💡 for ambiance
        </p>
      )}
    </div>
  );
};

export default VisualKitchenScene;
