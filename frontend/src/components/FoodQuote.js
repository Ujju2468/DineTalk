import React, { useState, useEffect } from 'react';

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
  const [idx, setIdx] = useState(() => Math.floor(Math.random() * QUOTES.length));
  const [moodIdx, setMoodIdx] = useState(0);
  const [visible, setVisible] = useState(true);

  const shuffleNext = () => {
    setVisible(false);
    setTimeout(() => {
      setIdx((prev) => {
        let next;
        do {
          next = Math.floor(Math.random() * QUOTES.length);
        } while (next === prev && QUOTES.length > 1);
        return next;
      });
      setMoodIdx((prev) => (prev + 1) % MOOD_TAGS.length);
      setVisible(true);
    }, 250);
  };

  useEffect(() => {
    const interval = setInterval(() => {
      shuffleNext();
    }, 10000);
    return () => clearInterval(interval);
  }, []);

  const q = QUOTES[idx];

  return (
    <div
      className="quote-banner"
      style={{
        opacity: visible ? 1 : 0,
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
        transition: 'opacity 0.3s ease'
      }}
    >
      {/* Centered Mood Tag & Quote Row */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', flexWrap: 'wrap', gap: 10 }}>
        {/* Mood Tag */}
        <span
          style={{
            fontSize: '0.74rem',
            fontWeight: 800,
            background: 'var(--badge-section-bg)',
            color: 'var(--badge-section-text)',
            border: '1px solid var(--badge-section-border)',
            padding: '2px 10px',
            borderRadius: 20
          }}
        >
          {MOOD_TAGS[moodIdx]}
        </span>

        {/* Quote Text */}
        <span style={{ fontSize: '1.12rem', fontWeight: 600, color: 'var(--text)', fontFamily: 'var(--font-display)' }}>
          “{q.text}”
        </span>

        {/* Author Subtext */}
        <span style={{ color: 'var(--muted)', fontSize: '0.86rem', fontStyle: 'italic' }}>
          — {q.author}
        </span>
      </div>

      {/* Shuffle Button (ONLY this button changes background on hover!) */}
      <button
        type="button"
        onClick={shuffleNext}
        style={{
          fontSize: '0.75rem',
          fontWeight: 700,
          color: 'var(--text2)',
          background: 'var(--bg-elevated)',
          border: '1.5px solid var(--border)',
          padding: '3px 14px',
          borderRadius: 20,
          cursor: 'pointer',
          transition: 'all 0.22s ease',
          marginTop: 2
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.background = 'var(--accent)';
          e.currentTarget.style.color = '#FFFFFF';
          e.currentTarget.style.borderColor = 'var(--accent-hover)';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.background = 'var(--bg-elevated)';
          e.currentTarget.style.color = 'var(--text2)';
          e.currentTarget.style.borderColor = 'var(--border)';
        }}
      >
        🔀 Shuffle
      </button>
    </div>
  );
};

export default FoodQuote;
