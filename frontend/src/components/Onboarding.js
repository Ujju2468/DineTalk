import React, { useState } from 'react';

const illustrations = [
  // Slide 1: Welcome - house/kitchen scene
  <svg viewBox="0 0 280 180" xmlns="http://www.w3.org/2000/svg" width="100%" height="180">
    <rect width="280" height="180" fill="#FDF6EE"/>
    {/* Table */}
    <rect x="40" y="120" width="200" height="12" rx="4" fill="#C9962A" opacity="0.7"/>
    <rect x="60" y="132" width="8" height="30" rx="2" fill="#A07820"/>
    <rect x="212" y="132" width="8" height="30" rx="2" fill="#A07820"/>
    {/* Big pot */}
    <ellipse cx="140" cy="105" rx="50" ry="18" fill="#C85A1E"/>
    <rect x="90" y="90" width="100" height="30" rx="8" fill="#C85A1E"/>
    <ellipse cx="140" cy="90" rx="50" ry="16" fill="#D9622B"/>
    {/* Steam */}
    <path d="M120 75 Q115 60 120 50" stroke="#8B5E3C" strokeWidth="2.5" fill="none" strokeLinecap="round" opacity="0.5"/>
    <path d="M140 70 Q135 55 140 45" stroke="#8B5E3C" strokeWidth="2.5" fill="none" strokeLinecap="round" opacity="0.5"/>
    <path d="M160 75 Q155 60 160 50" stroke="#8B5E3C" strokeWidth="2.5" fill="none" strokeLinecap="round" opacity="0.5"/>
    {/* Spoon */}
    <rect x="174" y="75" width="5" height="35" rx="2" fill="#6B4226"/>
    <ellipse cx="176.5" cy="73" rx="6" ry="8" fill="#8B5E3C"/>
    {/* Stars */}
    <text x="30" y="50" fontSize="20">✨</text>
    <text x="220" y="40" fontSize="16">🍲</text>
  </svg>,

  // Slide 2: Recipe book
  <svg viewBox="0 0 280 180" xmlns="http://www.w3.org/2000/svg" width="100%" height="180">
    <rect width="280" height="180" fill="#FDF6EE"/>
    {/* Book */}
    <rect x="60" y="30" width="160" height="120" rx="8" fill="#C85A1E"/>
    <rect x="70" y="30" width="150" height="120" rx="8" fill="#FFFCF7"/>
    <rect x="70" y="30" width="10" height="120" rx="2" fill="#E8D5B7"/>
    {/* Lines on book */}
    <rect x="90" y="55" width="110" height="4" rx="2" fill="#E8D5B7"/>
    <rect x="90" y="68" width="90" height="4" rx="2" fill="#E8D5B7"/>
    <rect x="90" y="81" width="100" height="4" rx="2" fill="#E8D5B7"/>
    <rect x="90" y="94" width="80" height="4" rx="2" fill="#E8D5B7"/>
    {/* Heart */}
    <text x="168" y="118" fontSize="28">❤️</text>
    {/* Title line */}
    <rect x="90" y="38" width="70" height="8" rx="3" fill="#C85A1E" opacity="0.4"/>
    {/* Fork & spoon decoration */}
    <text x="22" y="100" fontSize="28">🍴</text>
    <text x="228" y="80" fontSize="22">📖</text>
  </svg>,

  // Slide 3: Ingredient store / pantry
  <svg viewBox="0 0 280 180" xmlns="http://www.w3.org/2000/svg" width="100%" height="180">
    <rect width="280" height="180" fill="#FDF6EE"/>
    {/* Shelf 1 */}
    <rect x="30" y="60" width="220" height="8" rx="3" fill="#C9962A" opacity="0.6"/>
    {/* Shelf 2 */}
    <rect x="30" y="120" width="220" height="8" rx="3" fill="#C9962A" opacity="0.6"/>
    {/* Jars/items on shelf 1 */}
    <rect x="50" y="35" width="24" height="25" rx="4" fill="#5C7A3E" opacity="0.8"/>
    <rect x="48" y="32" width="28" height="6" rx="2" fill="#476130"/>
    <rect x="85" y="38" width="22" height="22" rx="4" fill="#C85A1E" opacity="0.8"/>
    <rect x="83" y="35" width="26" height="5" rx="2" fill="#A04315"/>
    <rect x="120" y="33" width="26" height="27" rx="4" fill="#C9962A" opacity="0.8"/>
    <rect x="118" y="30" width="30" height="6" rx="2" fill="#A07820"/>
    <rect x="160" y="37" width="22" height="23" rx="4" fill="#8B5E3C" opacity="0.8"/>
    <rect x="195" y="35" width="24" height="25" rx="4" fill="#5C7A3E" opacity="0.7"/>
    {/* Items on shelf 2 */}
    <text x="45" y="115" fontSize="22">🧅</text>
    <text x="85" y="115" fontSize="22">🍅</text>
    <text x="125" y="115" fontSize="22">🥕</text>
    <text x="165" y="115" fontSize="22">🧄</text>
    <text x="205" y="115" fontSize="22">🌶️</text>
    {/* Drag arrow hint */}
    <path d="M140 145 L140 160" stroke="#C85A1E" strokeWidth="2" markerEnd="url(#arrow)" strokeDasharray="4 2"/>
    <text x="100" y="175" fontSize="11" fill="#9C7A5B" fontFamily="sans-serif">drag into your recipe</text>
  </svg>,

  // Slide 4: Groups/chat bubbles
  <svg viewBox="0 0 280 180" xmlns="http://www.w3.org/2000/svg" width="100%" height="180">
    <rect width="280" height="180" fill="#FDF6EE"/>
    {/* Chat bubble 1 */}
    <rect x="30" y="30" width="140" height="44" rx="16" fill="#C85A1E"/>
    <polygon points="50,74 30,90 70,74" fill="#C85A1E"/>
    <text x="50" y="58" fontSize="12" fill="white" fontFamily="sans-serif">What's for dinner? 🍽</text>
    {/* Chat bubble 2 */}
    <rect x="110" y="95" width="140" height="44" rx="16" fill="#5C7A3E"/>
    <polygon points="230,95 250,80 210,95" fill="#5C7A3E"/>
    <text x="125" y="123" fontSize="12" fill="white" fontFamily="sans-serif">Let's vote! 🗳 </text>
    {/* Poll bar mini */}
    <rect x="30" y="150" width="200" height="10" rx="5" fill="#E8D5B7"/>
    <rect x="30" y="150" width="130" height="10" rx="5" fill="#C9962A"/>
    <text x="30" y="175" fontSize="11" fill="#9C7A5B" fontFamily="sans-serif">Biryani  65% 🏆</text>
    <text x="180" y="175" fontSize="11" fill="#9C7A5B" fontFamily="sans-serif">Pizza 35%</text>
  </svg>,

  // Slide 5: Ready to go!
  <svg viewBox="0 0 280 180" xmlns="http://www.w3.org/2000/svg" width="100%" height="180">
    <rect width="280" height="180" fill="#FDF6EE"/>
    {/* Plate */}
    <ellipse cx="140" cy="110" rx="80" ry="55" fill="#E8D5B7"/>
    <ellipse cx="140" cy="108" rx="65" ry="44" fill="#FFFCF7"/>
    {/* Food on plate */}
    <ellipse cx="140" cy="108" rx="42" ry="30" fill="#C85A1E" opacity="0.7"/>
    <ellipse cx="130" cy="100" rx="18" ry="12" fill="#C9962A" opacity="0.8"/>
    <ellipse cx="155" cy="112" rx="15" ry="10" fill="#5C7A3E" opacity="0.8"/>
    {/* Fork & Knife */}
    <rect x="46" y="75" width="5" height="60" rx="2" fill="#8B5E3C"/>
    <rect x="44" y="75" width="2" height="25" rx="1" fill="#8B5E3C"/>
    <rect x="50" y="75" width="2" height="25" rx="1" fill="#8B5E3C"/>
    <rect x="224" y="75" width="5" height="60" rx="2" fill="#8B5E3C"/>
    <path d="M224 75 Q229 85 224 100" stroke="#8B5E3C" strokeWidth="5" fill="none"/>
    {/* Stars */}
    <text x="100" y="40" fontSize="22">🎉</text>
    <text x="145" y="38" fontSize="18">⭐</text>
    <text x="175" y="45" fontSize="14">✨</text>
  </svg>
];

const SLIDES = [
  { title: 'Welcome to DinnerTalk!', desc: "Your family's cozy corner for recipes, dinner chats, and deciding what to cook — together." },
  { title: 'Share Your Recipes', desc: "Add secret family recipes with ingredients, steps, photos & origin story. Everyone browses, loves, and cooks them." },
  { title: 'The Ingredient Store 🥕', desc: "A shared family pantry! Click or drag any ingredient into your recipe. Add new ones — they're saved for everyone." },
  { title: 'Groups, Chat & Polls 💬', desc: "Create groups — cousins, parents, friends. Chat in real time, share recipes, start dinner polls and vote before time runs out!" },
  { title: "You're all set! 🎉", desc: "Add your first recipe or explore what the family's cooked up. Bon appétit!" }
];

const Onboarding = ({ onDone }) => {
  const [current, setCurrent] = useState(0);
  const slide = SLIDES[current];
  const isLast = current === SLIDES.length - 1;

  const next = () => { if (isLast) { onDone(); return; } setCurrent(c => c + 1); };
  const prev = () => setCurrent(c => c - 1);

  return (
    <div className="onboarding-overlay" onClick={e => e.target === e.currentTarget && onDone()}>
      <div className="onboarding-modal">
        <div style={{ background: 'linear-gradient(135deg, var(--bg2) 0%, var(--accent-light) 100%)', overflow: 'hidden' }}>
          <div key={current} style={{ animation: 'fadeIn 0.35s ease' }}>
            {illustrations[current]}
          </div>
        </div>

        <div className="onboarding-body">
          <h2>{slide.title}</h2>
          <p>{slide.desc}</p>

          <div className="onboarding-dots">
            {SLIDES.map((_, i) => (
              <div key={i} className={`onboarding-dot ${i === current ? 'active' : ''}`} onClick={() => setCurrent(i)} style={{ cursor: 'pointer' }} />
            ))}
          </div>

          <div className="onboarding-footer">
            <button className="btn btn-ghost btn-sm" onClick={onDone}>Skip</button>
            <div style={{ display: 'flex', gap: 8 }}>
              {current > 0 && <button className="btn btn-ghost btn-sm" onClick={prev}>← Back</button>}
              <button className="btn" onClick={next}>
                {isLast ? "🍴 Let's cook!" : 'Next →'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Onboarding;
