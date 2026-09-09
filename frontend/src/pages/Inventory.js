import React, { useState, useEffect, useCallback } from 'react';
import api from '../utils/api';
import KitchenIcon, { ICON_KEYS } from '../icons/KitchenIcons';
import VisualKitchen3D from '../components/VisualKitchen3D';

const TYPES = ['All', 'Spice', 'Vegetable', 'Fruit', 'Dairy', 'Herb', 'Vessel', 'Pan', 'Wok', 'Utensil', 'Equipment', 'Other'];
const TYPE_EMOJI = { Spice: '🌶️', Vegetable: '🥕', Fruit: '🍎', Dairy: '🥛', Herb: '🌿', Vessel: '🥣', Pan: '🍳', Wok: '🥘', Utensil: '🔪', Equipment: '🔥', Other: '📦' };

const Inventory = () => {
  const [items, setItems] = useState([]);
  const [activeZone, setActiveZone] = useState('All');
  const [type, setType] = useState('All');
  const [search, setSearch] = useState('');
  const [showAdd, setShowAdd] = useState(false);
  const [editingItem, setEditingItem] = useState(null);

  // Form states
  const [newName, setNewName] = useState('');
  const [newType, setNewType] = useState('Spice');
  const [newIcon, setNewIcon] = useState('default');

  const load = useCallback(async () => {
    try {
      const res = await api.get('/kitchen-items');
      setItems(res.data);
    } catch (err) {
      console.error(err);
    }
  }, []);

  useEffect(() => { load(); }, [load]);

  const handleAdd = async (e) => {
    e.preventDefault();
    if (!newName.trim()) return;
    try {
      const res = await api.post('/kitchen-items', { name: newName.trim(), type: newType, iconKey: newIcon });
      setItems(prev => [...prev, res.data]);
      setNewName('');
      setShowAdd(false);
    } catch (err) {
      if (err.response?.data?.item) alert(`"${newName}" already exists in inventory!`);
    }
  };

  const handleEditSave = async (e) => {
    e.preventDefault();
    if (!editingItem || !editingItem.name.trim()) return;
    try {
      const res = await api.put(`/kitchen-items/${editingItem._id}`, {
        name: editingItem.name.trim(),
        type: editingItem.type,
        iconKey: editingItem.iconKey
      });
      setItems(prev => prev.map(item => item._id === editingItem._id ? res.data : item));
      setEditingItem(null);
    } catch (err) {
      console.error(err);
    }
  };

  const handleDelete = async (itemId, name) => {
    if (!window.confirm(`Delete "${name}" from kitchen inventory?`)) return;
    try {
      await api.delete(`/kitchen-items/${itemId}`);
      setItems(prev => prev.filter(item => item._id !== itemId));
    } catch (err) {
      console.error(err);
    }
  };

  // Filter items based on active 3D zone + type chip + search string
  const filteredItems = items.filter(item => {
    // 3D Zone Filter
    if (activeZone === 'Spice Box') {
      if (!['Spice', 'Herb'].includes(item.type)) return false;
    } else if (activeZone === 'Fridge') {
      if (!['Vegetable', 'Fruit', 'Dairy', 'Herb'].includes(item.type)) return false;
    } else if (activeZone === 'Counter') {
      if (!['Vessel', 'Pan', 'Wok', 'Utensil', 'Equipment', 'Other'].includes(item.type)) return false;
    }

    // Type Chip Filter
    if (type !== 'All' && item.type !== type) return false;

    // Search Query Filter
    if (search && !item.name.toLowerCase().includes(search.toLowerCase())) return false;

    return true;
  });

  const grouped = filteredItems.reduce((acc, item) => {
    acc[item.type] = acc[item.type] || [];
    acc[item.type].push(item);
    return acc;
  }, {});

  return (
    <div className="container">
      {/* 3D / SVG Visual Kitchen Display & Zone Selector */}
      <VisualKitchen3D
        activeZone={activeZone}
        onSelectZone={(zone) => {
          setActiveZone(zone);
          if (zone === 'Spice Box') setType('Spice');
          else if (zone === 'Fridge') setType('Vegetable');
          else setType('All');
        }}
        items={items}
        onAddItem={() => setShowAdd(true)}
      />

      <div className="toolbar">
        <div className="page-header" style={{ marginBottom: 0 }}>
          <h1>🧺 Kitchen Items Inventory</h1>
          <p>
            {activeZone === 'All'
              ? 'Showing all ingredients, vessels, & equipment shared by the family.'
              : `Filtered by Zone: ${activeZone}`}
          </p>
        </div>
        <button className="btn btn-secondary" onClick={() => setShowAdd(!showAdd)}>
          {showAdd ? '✕ Cancel' : '+ Add Item'}
        </button>
      </div>

      {/* CREATE (Add Item) Form */}
      {showAdd && (
        <form onSubmit={handleAdd} className="card" style={{ marginBottom: 24, marginTop: 14, border: '2px solid var(--accent)' }}>
          <h3 style={{ marginBottom: 14, color: 'var(--accent-dark)' }}>➕ Add to Kitchen Inventory (CRUD Create)</h3>
          <div style={{ display: 'flex', gap: 14, flexWrap: 'wrap' }}>
            <div style={{ flex: 2, minWidth: 160 }}>
              <label>Item Name *</label>
              <input value={newName} onChange={e => setNewName(e.target.value)} placeholder="e.g. Kashmiri Red Chili, Paneer, Clarified Butter" required />
            </div>
            <div style={{ flex: 1, minWidth: 140 }}>
              <label>Zone / Category</label>
              <select value={newType} onChange={e => setNewType(e.target.value)}>
                {TYPES.filter(t => t !== 'All').map(t => (
                  <option key={t} value={t}>
                    {TYPE_EMOJI[t]} {t}
                  </option>
                ))}
              </select>
            </div>
            <div style={{ flex: 2, minWidth: 180 }}>
              <label>Icon</label>
              <select value={newIcon} onChange={e => setNewIcon(e.target.value)}>
                <option value="default">🥄 Default</option>
                {ICON_KEYS.map(k => <option key={k} value={k}>{k}</option>)}
              </select>
            </div>
          </div>
          <div style={{ marginTop: 12, display: 'flex', alignItems: 'center', gap: 12 }}>
            <KitchenIcon iconKey={newIcon} size={40} />
            <button className="btn btn-sm" type="submit">💾 Save New Item</button>
          </div>
        </form>
      )}

      {/* UPDATE (Edit Item) Modal */}
      {editingItem && (
        <div className="onboarding-overlay" onClick={() => setEditingItem(null)}>
          <form className="onboarding-modal" onClick={(e) => e.stopPropagation()} onSubmit={handleEditSave} style={{ maxWidth: 520, padding: 24 }}>
            <h3 style={{ color: 'var(--accent-dark)', marginBottom: 14 }}>✏️ Edit Kitchen Item (CRUD Update)</h3>
            <label>Item Name *</label>
            <input value={editingItem.name} onChange={e => setEditingItem({ ...editingItem, name: e.target.value })} required />
            <label>Category</label>
            <select value={editingItem.type} onChange={e => setEditingItem({ ...editingItem, type: e.target.value })}>
              {TYPES.filter(t => t !== 'All').map(t => <option key={t} value={t}>{TYPE_EMOJI[t]} {t}</option>)}
            </select>
            <label>Icon</label>
            <select value={editingItem.iconKey} onChange={e => setEditingItem({ ...editingItem, iconKey: e.target.value })}>
              <option value="default">🥄 Default</option>
              {ICON_KEYS.map(k => <option key={k} value={k}>{k}</option>)}
            </select>
            <div style={{ display: 'flex', gap: 10, marginTop: 18 }}>
              <button className="btn" type="submit">💾 Save Changes</button>
              <button className="btn btn-outline" type="button" onClick={() => setEditingItem(null)}>Cancel</button>
            </div>
          </form>
        </div>
      )}

      {/* Category Chips Bar */}
      <div className="category-bar">
        {TYPES.map(t => (
          <div key={t} className={`category-chip ${type === t ? 'active' : ''}`} onClick={() => setType(t)}>
            {t !== 'All' && TYPE_EMOJI[t]} {t}
          </div>
        ))}
      </div>

      {/* Search Input */}
      <div style={{ marginBottom: 20 }}>
        <div className="search-wrap">
          <span className="search-icon">🔍</span>
          <input
            placeholder="Search kitchen items..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            style={{ paddingLeft: 38, borderRadius: 30, maxWidth: 320 }}
          />
        </div>
      </div>

      {/* READ & DELETE Inventory Cards Grid */}
      {filteredItems.length === 0 ? (
        <div className="empty-state">
          <div className="empty-icon">🧺</div>
          <h3>No kitchen items found</h3>
          <p>Try switching zones, clearing search, or adding a new item!</p>
        </div>
      ) : type === 'All' ? (
        Object.keys(grouped).sort().map(t => (
          <div key={t} style={{ marginBottom: 28 }}>
            <h3 style={{ marginBottom: 14, color: 'var(--accent-dark)', borderBottom: '1px solid var(--border)', paddingBottom: 6 }}>
              {TYPE_EMOJI[t]} {t} ({grouped[t].length})
            </h3>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(130px, 1fr))', gap: 14 }}>
              {grouped[t].map(item => (
                <div
                  key={item._id}
                  className="card"
                  style={{
                    textAlign: 'center',
                    padding: 12,
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justify: 'space-between',
                    position: 'relative'
                  }}
                >
                  <KitchenIcon iconKey={item.iconKey} size={48} />
                  <p style={{ fontSize: '0.82rem', fontWeight: 700, marginTop: 8, color: 'var(--text)', lineHeight: 1.3 }}>
                    {item.name}
                  </p>

                  {/* CRUD Action Buttons */}
                  <div style={{ display: 'flex', gap: 4, marginTop: 8 }}>
                    <button className="btn btn-xs btn-ghost" title="Edit Item" onClick={() => setEditingItem(item)}>
                      ✏️
                    </button>
                    <button className="btn btn-xs btn-ghost" title="Delete Item" onClick={() => handleDelete(item._id, item.name)}>
                      🗑
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(130px, 1fr))', gap: 14 }}>
          {filteredItems.map(item => (
            <div key={item._id} className="card" style={{ textAlign: 'center', padding: 12, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'space-between' }}>
              <KitchenIcon iconKey={item.iconKey} size={48} />
              <p style={{ fontSize: '0.82rem', fontWeight: 700, marginTop: 8, color: 'var(--text)', lineHeight: 1.3 }}>
                {item.name}
              </p>
              <div style={{ display: 'flex', gap: 4, marginTop: 8 }}>
                <button className="btn btn-xs btn-ghost" title="Edit Item" onClick={() => setEditingItem(item)}>
                  ✏️
                </button>
                <button className="btn btn-xs btn-ghost" title="Delete Item" onClick={() => handleDelete(item._id, item.name)}>
                  🗑
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Inventory;
