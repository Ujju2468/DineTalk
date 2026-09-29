import React, { useState, useEffect, useCallback, useMemo } from 'react';
import api from '../utils/api';
import KitchenIcon, { ICON_KEYS } from '../icons/KitchenIcons';
import { TYPES, TYPE_EMOJI } from '../constants/kitchenTypes';

/**
 * PantryPicker
 * ------------
 * The SAME category-grouped grid used on the /inventory page (spices,
 * vegetables, fruits, etc.), reused wherever the user needs to pick from
 * their kitchen items — the Pantry Matcher and the Recipe Form ingredient
 * step. It always reads live from the shared Kitchen Inventory
 * (`/kitchen-items`), so anything added in one place shows up in the others.
 *
 * Props:
 *  - selectedNames: string[]  — names (any case) currently selected/added
 *  - onItemClick(item)        — fired when a pantry card is clicked
 *  - allowCustomAdd: boolean  — show "add new item to inventory" affordance
 *      when a search doesn't match anything (default true)
 *  - helperText: string       — small hint line under the header
 */
const PantryPicker = ({
  selectedNames = [],
  onItemClick,
  allowCustomAdd = true,
  helperText = 'Click an item to add it. This list is the same one as your Kitchen Inventory.'
}) => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [type, setType] = useState('All');
  const [search, setSearch] = useState('');
  const [showCustomForm, setShowCustomForm] = useState(false);
  const [customType, setCustomType] = useState('Other');
  const [customIcon, setCustomIcon] = useState('default');
  const [justAdded, setJustAdded] = useState(null);

  const load = useCallback(async () => {
    try {
      const res = await api.get('/kitchen-items');
      setItems(Array.isArray(res.data) ? res.data : []);
    } catch (err) {
      setItems([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { load(); }, [load]);

  const selectedSet = useMemo(
    () => new Set(selectedNames.map(n => n.toLowerCase())),
    [selectedNames]
  );

  const filteredItems = items.filter(item => {
    if (type !== 'All' && item.type !== type) return false;
    if (search && !item.name.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  const grouped = filteredItems.reduce((acc, item) => {
    acc[item.type] = acc[item.type] || [];
    acc[item.type].push(item);
    return acc;
  }, {});

  const exactMatchExists = items.some(
    i => i.name.toLowerCase() === search.trim().toLowerCase()
  );

  const handleClick = (item) => {
    onItemClick && onItemClick(item);
    setJustAdded(item._id);
    setTimeout(() => setJustAdded(null), 600);
  };

  const handleCustomAdd = async (e) => {
    e.preventDefault();
    const name = search.trim();
    if (!name) return;
    try {
      const res = await api.post('/kitchen-items', { name, type: customType, iconKey: customIcon });
      setItems(prev => [...prev, res.data]);
      handleClick(res.data);
      setSearch('');
      setShowCustomForm(false);
    } catch (err) {
      // Item already existed (race) — just try to use it
      if (err.response?.data?.item) {
        handleClick(err.response.data.item);
        setSearch('');
      }
    }
  };

  const renderCard = (item) => {
    const isSelected = selectedSet.has(item.name.toLowerCase());
    return (
      <div
        key={item._id}
        className={`pantry-picker-card${isSelected ? ' selected' : ''}${justAdded === item._id ? ' flash' : ''}`}
        onClick={() => handleClick(item)}
        title={isSelected ? `${item.name} — click to remove` : `Click to add ${item.name}`}
      >
        <KitchenIcon iconKey={item.iconKey} size={40} />
        <p>{item.name}</p>
        {isSelected && <span className="pantry-picker-check">✓</span>}
      </div>
    );
  };

  return (
    <div className="pantry-picker">
      {helperText && <p className="pantry-picker-hint">{helperText}</p>}

      {/* Search */}
      <div className="search-wrap" style={{ marginBottom: 12 }}>
        <span className="search-icon">🔍</span>
        <input
          placeholder="Search or type a new item..."
          value={search}
          onChange={e => { setSearch(e.target.value); setShowCustomForm(false); }}
          style={{ paddingLeft: 38, borderRadius: 30, maxWidth: 340 }}
        />
      </div>

      {/* Category chips — identical structure/style to the Inventory page */}
      <div className="category-bar">
        {TYPES.map(t => (
          <div key={t} className={`category-chip ${type === t ? 'active' : ''}`} onClick={() => setType(t)}>
            {t !== 'All' && TYPE_EMOJI[t]} {t}
          </div>
        ))}
      </div>

      {/* "Not in your kitchen yet" — add straight to the shared inventory */}
      {allowCustomAdd && search.trim() && !exactMatchExists && !loading && (
        <div className="pantry-picker-addnew">
          {!showCustomForm ? (
            <button type="button" className="btn btn-sm btn-secondary" onClick={() => setShowCustomForm(true)}>
              ➕ "{search.trim()}" isn't in your inventory yet — add it
            </button>
          ) : (
            <form onSubmit={handleCustomAdd} className="pantry-picker-addnew-form">
              <span>Add <strong>{search.trim()}</strong> to Kitchen Inventory as:</span>
              <select value={customType} onChange={e => setCustomType(e.target.value)}>
                {TYPES.filter(t => t !== 'All').map(t => (
                  <option key={t} value={t}>{TYPE_EMOJI[t]} {t}</option>
                ))}
              </select>
              <select value={customIcon} onChange={e => setCustomIcon(e.target.value)}>
                <option value="default">🥄 Default icon</option>
                {ICON_KEYS.map(k => <option key={k} value={k}>{k}</option>)}
              </select>
              <button className="btn btn-xs" type="submit">Save & Add</button>
              <button className="btn btn-xs btn-ghost" type="button" onClick={() => setShowCustomForm(false)}>Cancel</button>
            </form>
          )}
        </div>
      )}

      {/* Grouped grid — same layout as Inventory page */}
      {loading ? (
        <p style={{ color: 'var(--muted)', fontSize: '0.85rem' }}>Loading your kitchen items…</p>
      ) : filteredItems.length === 0 ? (
        <div className="empty-state" style={{ padding: '24px 0' }}>
          <div className="empty-icon">🧺</div>
          <p style={{ margin: 0, fontWeight: 600 }}>Nothing found.</p>
          <p style={{ margin: '4px 0 0', fontSize: '0.83rem' }}>Try another zone, clear search, or add it above.</p>
        </div>
      ) : type === 'All' ? (
        Object.keys(grouped).sort().map(t => (
          <div key={t} className="pantry-picker-group">
            <h4>{TYPE_EMOJI[t]} {t} <span>({grouped[t].length})</span></h4>
            <div className="pantry-picker-grid">
              {grouped[t].map(renderCard)}
            </div>
          </div>
        ))
      ) : (
        <div className="pantry-picker-grid">
          {filteredItems.map(renderCard)}
        </div>
      )}
    </div>
  );
};

export default PantryPicker;
