import React, { useState, useRef, useCallback, forwardRef, useImperativeHandle } from 'react';
import KitchenIcon from '../icons/KitchenIcons';

/**
 * Visual "cook it" stage. Drag or click an inventory item -> it flies into
 * the pan on the stove, hands give a little stir, and it's logged as an
 * added ingredient. Purely a fun/visual front-end for building the
 * ingredients list — calls onAdd(item) once the animation completes.
 */
const CookingStage = forwardRef(({ onAdd, addedItems = [] }, ref) => {
  const [flying, setFlying] = useState(null);
  const [stirring, setStirring] = useState(false);
  const stageRef = useRef(null);
  const panRef = useRef(null);

  const triggerCook = useCallback((item, sourceEl) => {
    if (flying) return;
    const stageBox = stageRef.current?.getBoundingClientRect();
    const panBox = panRef.current?.getBoundingClientRect();
    const srcBox = sourceEl?.getBoundingClientRect ? sourceEl.getBoundingClientRect() : null;

    if (!stageBox || !panBox) {
      onAdd && onAdd(item);
      return;
    }

    const fromX = srcBox ? srcBox.left - stageBox.left + srcBox.width / 2 : stageBox.width / 2;
    const fromY = srcBox ? srcBox.top - stageBox.top + srcBox.height / 2 : 20;
    const toX = panBox.left - stageBox.left + panBox.width / 2;
    const toY = panBox.top - stageBox.top + panBox.height / 2;

    setFlying({ item, fromX, fromY, toX, toY });

    setTimeout(() => {
      setFlying(null);
      setStirring(true);
      onAdd && onAdd(item);
      setTimeout(() => setStirring(false), 700);
    }, 550);
  }, [flying, onAdd]);

  useImperativeHandle(ref, () => ({ cook: triggerCook }));

  const handleDrop = (e) => {
    e.preventDefault();
    const name = e.dataTransfer.getData('kitchenItemName');
    const iconKey = e.dataTransfer.getData('kitchenItemIcon');
    if (!name) return;
    triggerCook({ name, iconKey }, null);
  };

  return (
    <div>
      <div
        ref={stageRef}
        onDragOver={e => e.preventDefault()}
        onDrop={handleDrop}
        style={{
          position: 'relative',
          height: 300,
          borderRadius: 'var(--radius)',
          background: 'linear-gradient(180deg, #F0E4D0 0%, #E8D5B7 65%, #D4B896 100%)',
          overflow: 'hidden',
          border: '2px solid var(--border2)',
        }}
      >
        {/* Counter shadow line */}
        <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: 90, background: 'linear-gradient(180deg, transparent, rgba(107,66,38,0.15))' }} />

        {/* Stove / induction */}
        <div style={{ position: 'absolute', bottom: 30, left: '50%', transform: 'translateX(-50%)', width: 180, height: 30, background: '#3C3C3C', borderRadius: 8 }} />
        <div style={{ position: 'absolute', bottom: 55, left: '50%', transform: 'translateX(-50%)', width: 140, height: 10, background: '#2C2C2C', borderRadius: 20 }} />

        {/* Pan / kadai — the drop target */}
        <div
          ref={panRef}
          style={{
            position: 'absolute', bottom: 58, left: '50%', transform: 'translateX(-50%)',
            width: 110, height: 55, borderRadius: '50%',
            background: 'radial-gradient(ellipse at center, #6B4226 0%, #4A2E18 70%)',
            border: '4px solid #3C3C3C',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            animation: stirring ? 'pulse 0.35s ease 2' : 'none',
            boxShadow: '0 4px 14px rgba(0,0,0,0.25)',
          }}
        >
          {addedItems.length > 0 && (
            <div style={{ fontSize: '1.4rem', opacity: 0.9 }}>🍲</div>
          )}
        </div>

        {/* Steam when stirring */}
        {stirring && (
          <>
            <div className="steam-puff" style={{ left: '46%' }} />
            <div className="steam-puff" style={{ left: '52%', animationDelay: '0.15s' }} />
            <div className="steam-puff" style={{ left: '58%', animationDelay: '0.3s' }} />
          </>
        )}

        {/* Two hands (appear near pan when stirring) */}
        <div style={{
          position: 'absolute', bottom: 40, left: '38%',
          fontSize: '2.2rem',
          transform: stirring ? 'rotate(-15deg) translateY(-4px)' : 'rotate(-5deg)',
          transition: 'transform 0.3s ease',
        }}>🤚</div>
        <div style={{
          position: 'absolute', bottom: 40, right: '38%',
          fontSize: '2.2rem',
          transform: stirring ? 'rotate(15deg) translateY(-4px) scaleX(-1)' : 'rotate(5deg) scaleX(-1)',
          transition: 'transform 0.3s ease',
        }}>🤚</div>

        {/* Flying ingredient animation */}
        {flying && (
          <div
            key={flying.item.name + Date.now()}
            style={{
              position: 'absolute',
              left: flying.fromX, top: flying.fromY,
              width: 40, height: 40,
              transform: 'translate(-50%, -50%)',
              animation: 'flyToPan 0.55s ease-in forwards',
              '--fly-to-x': `${flying.toX - flying.fromX}px`,
              '--fly-to-y': `${flying.toY - flying.fromY}px`,
              zIndex: 5,
            }}
          >
            <KitchenIcon iconKey={flying.item.iconKey} size={40} />
          </div>
        )}

        {addedItems.length === 0 && !flying && (
          <div style={{ position: 'absolute', top: 16, left: '50%', transform: 'translateX(-50%)', fontSize: '0.8rem', color: 'var(--muted)', fontWeight: 700, textAlign: 'center', width: '80%' }}>
            👆 Click or drag ingredients below into the pan!
          </div>
        )}
      </div>

      {/* Cooked ingredients log */}
      {addedItems.length > 0 && (
        <div style={{ marginTop: 12, display: 'flex', flexWrap: 'wrap', gap: 8 }}>
          {addedItems.map((it, i) => (
            <div key={i} className="dropped-chip" style={{ animation: 'popIn 0.3s ease' }}>
              <KitchenIcon iconKey={it.iconKey} size={18} />
              <span>{it.name}</span>
            </div>
          ))}
        </div>
      )}

      <style>{`
        @keyframes flyToPan {
          0% { transform: translate(-50%, -50%) scale(1) rotate(0deg); opacity: 1; }
          70% { transform: translate(calc(-50% + var(--fly-to-x)), calc(-50% + var(--fly-to-y))) scale(0.7) rotate(180deg); opacity: 1; }
          100% { transform: translate(calc(-50% + var(--fly-to-x)), calc(-50% + var(--fly-to-y))) scale(0.2) rotate(220deg); opacity: 0; }
        }
        .steam-puff {
          position: absolute; bottom: 90px; width: 14px; height: 14px;
          background: rgba(255,255,255,0.5); border-radius: 50%;
          animation: steamRise 0.9s ease-out forwards;
        }
        @keyframes steamRise {
          0% { transform: translateY(0) scale(0.6); opacity: 0.7; }
          100% { transform: translateY(-40px) scale(1.4); opacity: 0; }
        }
      `}</style>
    </div>
  );
});

export default CookingStage;
