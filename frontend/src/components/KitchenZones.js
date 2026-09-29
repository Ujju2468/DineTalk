import React, { useState, useEffect, useCallback } from 'react';
import KitchenIcon from '../icons/KitchenIcons';
import { ZONE_TYPES, ZONE_LABELS, ZONE_EMOJI } from '../constants/kitchenTypes';

/**
 * KitchenZones
 * ------------
 * Full-width photo hotspot scene. Click the fridge, the shelves, or the
 * spice drawer to pop open that zone's items in a centered modal — the
 * fridge "swings open" like a real door (hinge on the left), the shelf /
 * spice drawer zones "slide open" like a drawer being pulled toward you.
 *
 * To restyle: swap public/images/kitchen-zones.jpg for your own photo, then
 * nudge the % values in HOTSPOTS so they land on the new photo's
 * fridge/shelf/drawer areas.
 */
const HOTSPOTS = [
  { zone: 'fridge',  left: 2,  top: 12, width: 14, height: 68, badgeLeft: 9,    badgeTop: 46, anim: 'door'   },
  { zone: 'shelves', left: 23, top: 55, width: 23, height: 28, badgeLeft: 34.5, badgeTop: 69, anim: 'drawer' },
  { zone: 'spices',  left: 46, top: 55, width: 24, height: 30, badgeLeft: 58,   badgeTop: 70, anim: 'drawer' },
];

const zoneItems = (items, zone) =>
  items.filter(i => (ZONE_TYPES[zone] || []).includes(i.type));

const KitchenZones = ({ items = [], onAddItem, onEditItem, onDeleteItem }) => {
  const [openZone, setOpenZone] = useState(null);
  const [closing, setClosing] = useState(false);
  const [lightsOn, setLightsOn] = useState(true);

  const closeModal = useCallback(() => {
    setClosing(true);
    setTimeout(() => { setOpenZone(null); setClosing(false); }, 360);
  }, []);

  const openModal = (zone) => {
    if (openZone === zone) return closeModal();
    setOpenZone(zone);
    setClosing(false);
  };

  // Close on Escape
  useEffect(() => {
    if (!openZone) return;
    const onKey = (e) => { if (e.key === 'Escape') closeModal(); };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [openZone, closeModal]);

  const activeHotspot = HOTSPOTS.find(h => h.zone === openZone);
  const panelItems = openZone ? zoneItems(items, openZone) : [];

  return (
    <div className="full-bleed" style={{ marginBottom: 8 }}>
      <div className="kitchen-zones-wrap kitchen-zones-wrap-flush">
        <img
          src="/images/kitchen-zones.jpg"
          alt="Interactive kitchen — click the fridge, shelves, or spice drawer"
          className="kitchen-zones-photo"
          style={{ filter: lightsOn ? 'brightness(1)' : 'brightness(0.55)', transition: 'filter 0.5s ease' }}
        />

        {HOTSPOTS.map(h => (
          <div
            key={h.zone}
            className={`kitchen-zone-hotspot${openZone === h.zone ? ' active' : ''}`}
            style={{ left: `${h.left}%`, top: `${h.top}%`, width: `${h.width}%`, height: `${h.height}%` }}
            onClick={() => openModal(h.zone)}
          >
            <div
              className="kitchen-zone-badge"
              style={{ left: `${h.badgeLeft - h.left}%`, top: `${h.badgeTop - h.top}%`, position: 'absolute' }}
            >
              <span className="dot" />
              {ZONE_EMOJI[h.zone]} {ZONE_LABELS[h.zone]}
            </div>
          </div>
        ))}

        <div className="kitchen-zones-lights-toggle" onClick={() => setLightsOn(l => !l)}>
          {lightsOn ? '💡 Lights ON' : '🌑 Lights OFF'}
        </div>
      </div>

      {!openZone && (
        <p className="kitchen-zones-hint">
          Click the <strong>Fridge</strong>, <strong>Shelves</strong> or <strong>Spice Drawer</strong> in the photo to view & manage items
        </p>
      )}

      {/* ── POPUP MODAL — fridge door swing / drawer slide-open ── */}
      {openZone && (
        <div
          className={`zone-modal-backdrop${closing ? ' closing' : ''}`}
          onClick={closeModal}
        >
          <div
            className={`zone-modal-panel zone-modal-${activeHotspot?.anim}${closing ? ' closing' : ''}`}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="zone-modal-header">
              <div>
                <h3>{ZONE_EMOJI[openZone]} {ZONE_LABELS[openZone]}</h3>
                <p>{panelItems.length} item{panelItems.length !== 1 ? 's' : ''} — shared across all kitchen users</p>
              </div>
              <div style={{ display: 'flex', gap: 8 }}>
                <button className="btn btn-sm" onClick={() => onAddItem && onAddItem(openZone)}>+ Add Item</button>
                <button className="btn btn-outline btn-sm" onClick={closeModal}>✕ Close</button>
              </div>
            </div>

            <div className="zone-modal-body">
              {panelItems.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '32px 0', color: 'var(--muted)' }}>
                  <div style={{ fontSize: '2.5rem', marginBottom: 8 }}>{ZONE_EMOJI[openZone]}</div>
                  <p style={{ margin: 0, fontWeight: 600 }}>Nothing here yet.</p>
                  <p style={{ margin: '4px 0 0', fontSize: '0.83rem' }}>Add items to this zone using the button above.</p>
                </div>
              ) : (
                <div className="zone-modal-grid">
                  {panelItems.map(item => (
                    <div key={item._id} className="zone-modal-item">
                      <KitchenIcon iconKey={item.iconKey} size={44} />
                      <p>{item.name}</p>
                      <span className="zone-modal-item-type">{item.type}</span>
                      <div style={{ display: 'flex', gap: 4, marginTop: 2 }}>
                        <button className="btn btn-xs btn-ghost" title="Edit" onClick={() => onEditItem && onEditItem(item)}>✏️</button>
                        <button className="btn btn-xs btn-ghost" title="Delete" onClick={() => onDeleteItem && onDeleteItem(item._id, item.name)}>🗑</button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default KitchenZones;
