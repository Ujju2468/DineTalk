import React, { useState, useEffect, useCallback } from 'react';
import api from '../utils/api';
import KitchenIcon from '../icons/KitchenIcons';

const TYPES = ['All','Vegetable','Fruit','Spice','Dairy','Herb','Vessel','Pan','Wok','Utensil','Equipment'];

const KitchenTray = ({ onItemActivate }) => {
  const [items, setItems] = useState([]);
  const [type, setType] = useState('All');
  const [search, setSearch] = useState('');

  const load = useCallback(async () => {
    const params = {};
    if (type !== 'All') params.type = type;
    if (search) params.search = search;
    const res = await api.get('/kitchen-items', { params });
    setItems(res.data);
  }, [type, search]);

  useEffect(() => { load(); }, [load]);

  return (
    <div>
      <div style={{ display: 'flex', gap: 8, marginBottom: 10, flexWrap: 'wrap' }}>
        <input
          placeholder="Search inventory..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          style={{ maxWidth: 220, borderRadius: 30 }}
        />
      </div>
      <div className="category-bar" style={{ paddingBottom: 10 }}>
        {TYPES.map(t => (
          <div key={t} className={`category-chip ${type === t ? 'active' : ''}`} onClick={() => setType(t)}>{t}</div>
        ))}
      </div>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10, maxHeight: 220, overflowY: 'auto', padding: 4 }}>
        {items.map(item => (
          <div
            key={item._id}
            draggable
            onDragStart={e => {
              e.dataTransfer.setData('kitchenItemName', item.name);
              e.dataTransfer.setData('kitchenItemIcon', item.iconKey);
            }}
            onClick={(e) => onItemActivate(item, e.currentTarget)}
            title={`Click or drag ${item.name} into the pan`}
            style={{
              width: 76, textAlign: 'center', padding: '10px 6px',
              borderRadius: 'var(--radius-sm)', background: 'var(--surface)',
              border: '1.5px solid var(--border)', cursor: 'pointer',
              transition: 'all 0.15s ease',
            }}
            onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--accent)'; e.currentTarget.style.transform = 'translateY(-2px)'; }}
            onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--border)'; e.currentTarget.style.transform = 'translateY(0)'; }}
          >
            <KitchenIcon iconKey={item.iconKey} size={36} />
            <p style={{ fontSize: '0.7rem', fontWeight: 700, marginTop: 4, color: 'var(--text2)', lineHeight: 1.2 }}>{item.name}</p>
          </div>
        ))}
        {items.length === 0 && <p style={{ color: 'var(--muted)', fontSize: '0.85rem' }}>No items found.</p>}
      </div>
    </div>
  );
};

export default KitchenTray;
