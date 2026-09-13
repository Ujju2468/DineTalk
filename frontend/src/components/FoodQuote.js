import React, { useState, useEffect, useRef, useCallback } from 'react';

const QUOTES = [
  { text: "First we eat, then we do everything else. 🍽", author: "M.F.K. Fisher" },
  { text: "Cooking is love made edible! 🍲", author: "Grandma's Secret" },
  { text: "Food is the ingredient that binds the family together. ❤️", author: "Family Motto" },
  { text: "Life is uncertain. Eat dessert first! 🍰", author: "Ernestine Ulmer" },
  { text: "The secret ingredient is always a pinch of love & extra garlic! 🧄", author: "Chef's Wisdom" },
  { text: "A recipe has no soul. You must bring soul to the recipe! 👨‍🍳", author: "Thomas Keller" },
  { text: "Good food is the foundation of genuine happiness! ✨", author: "Auguste Escoffier" },
  { text: "Happiness is home-cooked biryani on a Sunday afternoon! 🍛", author: "Family Circle" },
  { text: "One cannot think well, love well, sleep well, if one has not dined well! 🥐", author: "Virginia Woolf" },
  { text: "Nothing brings people together like good food and warm chatter! 💬", author: "RecipeBook" }
];

const MOOD_TAGS = ['TASTY 😋', 'YUM 🍲', 'DELICIOUS 🍽', 'FINGERLICKING 🤌'];

const FoodQuote = () => {
  const [idx, setIdx] = useState(0);
  const [moodIdx, setMoodIdx] = useState(0);
  const [visible, setVisible] = useState(true);
  const idxRef = useRef(0);
  const timerRef = useRef(null);

  const advance = useCallback((targetIdx) => {
    const next = targetIdx !== undefined
      ? targetIdx
      : (idxRef.current + 1) % QUOTES.length;

    setVisible(false);
    setTimeout(() => {
      idxRef.current = next;
      setIdx(next);
      setMoodIdx(m => (m + 1) % MOOD_TAGS.length);
      setVisible(true);
    }, 450);
  }, []);

  const resetTimer = useCallback(() => {
    if (timerRef.current) clearInterval(timerRef.current);
    timerRef.current = setInterval(() => advance(), 10000);
  }, [advance]);

  useEffect(() => {
    // start on a random quote
    const start = Math.floor(Math.random() * QUOTES.length);
    idxRef.current = start;
    setIdx(start);
    resetTimer();
    return () => clearInterval(timerRef.current);
  }, [resetTimer]);

  const handleShuffle = () => {
    let next;
    do { next = Math.floor(Math.random() * QUOTES.length); }
    while (next === idxRef.current && QUOTES.length > 1);
    resetTimer();   // reset the 10s clock on manual shuffle
    advance(next);
  };

  const q = QUOTES[idx];

  return (
    <div
      className="quote-banner"
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? 'translateY(0)' : 'translateY(8px)',
        transition: 'opacity 0.45s ease, transform 0.45s ease',
        background: 'transparent',
        width: '100%',
        maxWidth: 850,
        margin: '0 auto 20px',
        padding: '8px 16px',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        textAlign: 'center',
        gap: 8,
        userSelect: 'none',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', flexWrap: 'wrap', gap: 10 }}>
        <span style={{
          fontSize: '0.74rem', fontWeight: 800,
          background: 'var(--badge-section-bg)', color: 'var(--badge-section-text)',
          border: '1px solid var(--badge-section-border)', padding: '2px 10px', borderRadius: 20
        }}>
          {MOOD_TAGS[moodIdx]}
        </span>
        <span style={{ fontSize: '1.12rem', fontWeight: 600, color: 'var(--text)', fontFamily: 'var(--font-display)' }}>
          "{q.text}"
        </span>
        <span style={{ color: 'var(--muted)', fontSize: '0.86rem', fontStyle: 'italic' }}>
          — {q.author}
        </span>
      </div>

      {/* Static shuffle button — no hover, no background change, no animation */}
      <button
        type="button"
        onClick={handleShuffle}
        style={{
          fontSize: '0.75rem', fontWeight: 700,
          color: 'var(--text2)',
          background: 'var(--bg-elevated)',
          border: '1.5px solid var(--border)',
          padding: '3px 14px', borderRadius: 20,
          cursor: 'pointer', marginTop: 2,
          outline: 'none', boxShadow: 'none',
        }}
      >
        🔀 Shuffle
      </button>
    </div>
  );
};

export default FoodQuote;
