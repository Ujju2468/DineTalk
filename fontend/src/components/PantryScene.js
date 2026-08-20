import React, { useState, useMemo } from 'react';
import { CATEGORY_ICON, DEFAULT_ICON, FLAME_SVG } from '../data/categoryIcons';

// Where each ingredient category "lives" in each scene.
const FRIDGE_ZONES = {
  doorTop: ['Beverages'],
  doorMiddle: ['Spices & Herbs', 'Oils & Condiments'],
  topShelf: ['Dairy'],
  middleShelf: ['Meat & Seafood', 'Grains & Pasta', 'Baking', 'Nuts & Seeds', 'Legumes', 'Other'],
  crisper: ['Vegetables', 'Fruits'],
};

const COUNTER_ZONES = {
  rack: ['Spices & Herbs'],
  bowl: ['Fruits'],
  basket: ['Vegetables'],
  miniFridge: ['Dairy', 'Meat & Seafood', 'Beverages'],
  cabinet: ['Grains & Pasta', 'Baking', 'Nuts & Seeds', 'Legumes', 'Oils & Condiments', 'Other'],
};

const Item = ({ ing, flashed, onClick, delay = 0 }) => (
  <div
    className={`pantry-item ${flashed ? 'pantry-item-flash' : ''}`}
    style={{ animationDelay: `${delay}ms` }}
    title={ing.name}
    onClick={() => onClick && onClick(ing)}
    dangerouslySetInnerHTML={{ __html: CATEGORY_ICON[ing.category] || DEFAULT_ICON }}
  />
);

const groupByZones = (ingredients, zones) => {
  const byCat = {};
  ingredients.forEach((i) => { (byCat[i.category] = byCat[i.category] || []).push(i); });
  const result = {};
  Object.entries(zones).forEach(([zone, cats]) => {
    result[zone] = cats.flatMap((c) => byCat[c] || []);
  });
  return result;
};

const PantryScene = ({ ingredients, onItemClick, flashedId }) => {
  const [scene, setScene] = useState('fridge'); // 'fridge' | 'counter'
  const [doorOpen, setDoorOpen] = useState(true);

  const fridgeGroups = useMemo(() => groupByZones(ingredients, FRIDGE_ZONES), [ingredients]);
  const counterGroups = useMemo(() => groupByZones(ingredients, COUNTER_ZONES), [ingredients]);

  let itemDelay = 0;
  const nextDelay = () => { itemDelay += 25; return itemDelay; };

  return (
    <div>
      <div className="pantry-toggle">
        <button className={`finder-tab ${scene === 'fridge' ? 'active' : ''}`} onClick={() => setScene('fridge')}>
          🧊 Fridge
        </button>
        <button className={`finder-tab ${scene === 'counter' ? 'active' : ''}`} onClick={() => setScene('counter')}>
          🍳 Kitchen Counter
        </button>
      </div>

      {scene === 'fridge' && (
        <div className="pantry-fridge-wrap" key="fridge">
          <div className="pantry-fridge-interior">
            <div className={`pantry-fridge-light ${doorOpen ? 'on' : ''}`} />
            <div className="pantry-shelf pantry-shelf-top">
              <span className="pantry-shelf-label">Dairy</span>
              <div className="pantry-shelf-items">
                {fridgeGroups.topShelf.map((i) => <Item key={i._id} ing={i} flashed={flashedId === i._id} onClick={onItemClick} delay={nextDelay()} />)}
              </div>
            </div>
            <div className="pantry-shelf pantry-shelf-mid">
              <span className="pantry-shelf-label">Pantry Shelf</span>
              <div className="pantry-shelf-items">
                {fridgeGroups.middleShelf.map((i) => <Item key={i._id} ing={i} flashed={flashedId === i._id} onClick={onItemClick} delay={nextDelay()} />)}
              </div>
            </div>
            <div className="pantry-drawer">
              <span className="pantry-shelf-label">🥕 Crisper</span>
              <div className="pantry-shelf-items">
                {fridgeGroups.crisper.map((i) => <Item key={i._id} ing={i} flashed={flashedId === i._id} onClick={onItemClick} delay={nextDelay()} />)}
              </div>
            </div>
          </div>

          <div
            className={`pantry-fridge-door ${doorOpen ? 'open' : ''}`}
            onClick={() => setDoorOpen((o) => !o)}
            title={doorOpen ? 'Click to close fridge' : 'Click to open fridge'}
          >
            <div className="pantry-door-rack pantry-door-rack-top">
              {fridgeGroups.doorTop.map((i) => <Item key={i._id} ing={i} flashed={flashedId === i._id} onClick={(x) => { onItemClick(x); }} delay={nextDelay()} />)}
            </div>
            <div className="pantry-door-rack pantry-door-rack-mid">
              {fridgeGroups.doorMiddle.map((i) => <Item key={i._id} ing={i} flashed={flashedId === i._id} onClick={onItemClick} delay={nextDelay()} />)}
            </div>
            <div className="pantry-door-handle" />
          </div>
        </div>
      )}

      {scene === 'counter' && (
        <div className="pantry-counter" key="counter">
          <div className="pantry-steam-wrap">
            <span className="pantry-steam s1" />
            <span className="pantry-steam s2" />
            <span className="pantry-steam s3" />
          </div>

          <div className="pantry-zone pantry-zone-stove">
            <div className="pantry-stove-flame" dangerouslySetInnerHTML={{ __html: FLAME_SVG }} />
            <span className="pantry-zone-label">Stove</span>
          </div>

          <div className="pantry-zone pantry-zone-rack">
            <span className="pantry-zone-label">Spice Rack</span>
            <div className="pantry-shelf-items pantry-rack-items">
              {counterGroups.rack.map((i, idx) => (
                <div key={i._id} className="pantry-jar-hang" style={{ animationDelay: `${idx * 0.15}s` }}>
                  <Item ing={i} flashed={flashedId === i._id} onClick={onItemClick} delay={nextDelay()} />
                </div>
              ))}
            </div>
          </div>

          <div className="pantry-zone pantry-zone-bowl">
            <span className="pantry-zone-label">Fruit Bowl</span>
            <div className="pantry-shelf-items">
              {counterGroups.bowl.map((i) => <Item key={i._id} ing={i} flashed={flashedId === i._id} onClick={onItemClick} delay={nextDelay()} />)}
            </div>
          </div>

          <div className="pantry-zone pantry-zone-basket">
            <span className="pantry-zone-label">Veggie Basket</span>
            <div className="pantry-shelf-items">
              {counterGroups.basket.map((i) => <Item key={i._id} ing={i} flashed={flashedId === i._id} onClick={onItemClick} delay={nextDelay()} />)}
            </div>
          </div>

          <div className="pantry-zone pantry-zone-minifridge">
            <span className="pantry-zone-label">Mini Fridge</span>
            <div className="pantry-shelf-items">
              {counterGroups.miniFridge.map((i) => <Item key={i._id} ing={i} flashed={flashedId === i._id} onClick={onItemClick} delay={nextDelay()} />)}
            </div>
          </div>

          <div className="pantry-zone pantry-zone-cabinet">
            <span className="pantry-zone-label">Cabinet</span>
            <div className="pantry-shelf-items">
              {counterGroups.cabinet.map((i) => <Item key={i._id} ing={i} flashed={flashedId === i._id} onClick={onItemClick} delay={nextDelay()} />)}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PantryScene;
