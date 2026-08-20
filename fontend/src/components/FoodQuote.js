import React, { useState, useEffect } from 'react';

const QUOTES = [
  { text: "First we eat, then we do everything else.", author: "M.F.K. Fisher" },
  { text: "Cooking is love made visible.", author: "Unknown" },
  { text: "Food is the ingredient that binds us together.", author: "Unknown" },
  { text: "Life is uncertain. Eat dessert first.", author: "Ernestine Ulmer" },
  { text: "The secret ingredient is always love.", author: "Chef's wisdom" },
  { text: "A recipe has no soul. You must bring soul to the recipe.", author: "Thomas Keller" },
  { text: "Good food is the foundation of genuine happiness.", author: "Auguste Escoffier" },
  { text: "Cooking is the art of adjustment.", author: "Jacques Pépin" },
  { text: "Tell me what you eat, and I will tell you who you are.", author: "Brillat-Savarin" },
  { text: "One cannot think well, love well, sleep well, if one has not dined well.", author: "Virginia Woolf" },
];

const FoodQuote = () => {
  const [idx, setIdx] = useState(() => Math.floor(Math.random() * QUOTES.length));
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const interval = setInterval(() => {
      setVisible(false);
      setTimeout(() => {
        setIdx((i) => (i + 1) % QUOTES.length);
        setVisible(true);
      }, 400);
    }, 7000);
    return () => clearInterval(interval);
  }, []);

  const q = QUOTES[idx];
  return (
    <div className="quote-banner" style={{ opacity: visible ? 1 : 0, transition: 'opacity 0.4s ease' }}>
      "{q.text}" <span style={{ opacity: 0.75, fontSize: '0.85rem' }}>— {q.author}</span>
    </div>
  );
};

export default FoodQuote;
