import React from 'react';

/**
 * Lightweight inline SVG icon set for the Kitchen Inventory.
 * Each icon is a simple, small (<1kb), consistent-style vector —
 * warm rustic palette, flat shapes, no external assets.
 */

const ICONS = {
  // ===== VEGETABLES =====
  onion: (
    <svg viewBox="0 0 60 60"><ellipse cx="30" cy="36" rx="18" ry="20" fill="#D9A6C2"/><path d="M30 16 L26 6 M30 16 L34 6 M30 16 L30 4" stroke="#7A9B57" strokeWidth="2" fill="none" strokeLinecap="round"/><path d="M15 30 Q30 24 45 30" stroke="#B77FA0" strokeWidth="1.5" fill="none" opacity="0.6"/><path d="M14 40 Q30 34 46 40" stroke="#B77FA0" strokeWidth="1.5" fill="none" opacity="0.6"/></svg>
  ),
  tomato: (
    <svg viewBox="0 0 60 60"><circle cx="30" cy="34" r="20" fill="#D9432E"/><path d="M22 18 Q30 10 38 18 M18 20 Q30 8 42 20" stroke="#5C7A3E" strokeWidth="3" fill="none" strokeLinecap="round"/><ellipse cx="24" cy="28" rx="5" ry="7" fill="#F0705A" opacity="0.5"/></svg>
  ),
  potato: (
    <svg viewBox="0 0 60 60"><ellipse cx="30" cy="32" rx="22" ry="16" fill="#C89A5B" transform="rotate(-8 30 32)"/><circle cx="20" cy="28" r="1.5" fill="#8B6A3C"/><circle cx="34" cy="24" r="1.5" fill="#8B6A3C"/><circle cx="40" cy="36" r="1.5" fill="#8B6A3C"/><circle cx="24" cy="40" r="1.5" fill="#8B6A3C"/></svg>
  ),
  carrot: (
    <svg viewBox="0 0 60 60"><path d="M28 14 Q30 44 32 52 Q34 44 28 14 Z" fill="#E8792E"/><path d="M28 14 L22 4 M31 12 L28 2 M34 14 L38 4" stroke="#5C7A3E" strokeWidth="2.5" fill="none" strokeLinecap="round"/></svg>
  ),
  garlic: (
    <svg viewBox="0 0 60 60"><path d="M30 12 C20 12 16 24 18 36 C19 44 24 50 30 50 C36 50 41 44 42 36 C44 24 40 12 30 12 Z" fill="#F0E8D8"/><path d="M30 12 L30 4" stroke="#C9A96A" strokeWidth="2" strokeLinecap="round"/><path d="M22 20 Q30 26 38 20 M20 30 Q30 36 40 30" stroke="#D9C79A" strokeWidth="1.5" fill="none"/></svg>
  ),
  capsicum: (
    <svg viewBox="0 0 60 60"><path d="M30 18 C18 18 14 32 18 42 C21 50 39 50 42 42 C46 32 42 18 30 18 Z" fill="#5C9A4A"/><rect x="27" y="8" width="6" height="12" rx="2" fill="#3E6B2E"/></svg>
  ),
  spinach: (
    <svg viewBox="0 0 60 60"><path d="M30 50 L30 30" stroke="#3E6B2E" strokeWidth="3" strokeLinecap="round"/><path d="M30 30 C18 26 14 14 18 6 C28 10 32 22 30 30 Z" fill="#4C8A3A"/><path d="M30 30 C42 26 46 14 42 6 C32 10 28 22 30 30 Z" fill="#5C9A4A"/></svg>
  ),
  cauliflower: (
    <svg viewBox="0 0 60 60"><circle cx="22" cy="24" r="8" fill="#F5F0E4"/><circle cx="34" cy="20" r="9" fill="#FAF6EC"/><circle cx="40" cy="30" r="8" fill="#F5F0E4"/><circle cx="26" cy="32" r="9" fill="#FAF6EC"/><path d="M20 40 Q30 46 42 40 L40 32 Q30 38 22 32 Z" fill="#5C9A4A"/></svg>
  ),
  cabbage: (
    <svg viewBox="0 0 60 60"><circle cx="30" cy="32" r="20" fill="#8FB86A"/><path d="M30 32 m-14 0 a14 14 0 1 0 28 0 a14 14 0 1 0 -28 0" fill="none" stroke="#6B9A4A" strokeWidth="1.5"/><path d="M30 32 m-8 0 a8 8 0 1 0 16 0 a8 8 0 1 0 -16 0" fill="none" stroke="#6B9A4A" strokeWidth="1.5"/></svg>
  ),
  broccoli: (
    <svg viewBox="0 0 60 60"><rect x="26" y="36" width="8" height="16" rx="2" fill="#C9A96A"/><circle cx="22" cy="24" r="9" fill="#3E6B2E"/><circle cx="34" cy="20" r="10" fill="#4C8A3A"/><circle cx="40" cy="30" r="8" fill="#3E6B2E"/></svg>
  ),
  // ===== FRUITS =====
  lemon: (
    <svg viewBox="0 0 60 60"><ellipse cx="30" cy="32" rx="18" ry="14" fill="#F0D048"/><path d="M12 32 L6 32 M48 32 L54 32" stroke="#F0D048" strokeWidth="4" strokeLinecap="round"/></svg>
  ),
  mango: (
    <svg viewBox="0 0 60 60"><path d="M20 20 C10 30 12 48 26 52 C40 55 48 42 44 28 C41 18 30 12 20 20 Z" fill="#E8A22E"/><path d="M20 20 C24 16 30 14 34 16" fill="none" stroke="#5C7A3E" strokeWidth="2" strokeLinecap="round"/></svg>
  ),
  banana: (
    <svg viewBox="0 0 60 60"><path d="M16 44 C16 24 30 12 44 14 C42 12 38 10 34 10" fill="none" stroke="#E8D048" strokeWidth="9" strokeLinecap="round"/><path d="M14 46 L18 42" stroke="#8B6A3C" strokeWidth="3" strokeLinecap="round"/></svg>
  ),
  apple: (
    <svg viewBox="0 0 60 60"><circle cx="26" cy="34" r="15" fill="#D9432E"/><circle cx="38" cy="34" r="13" fill="#E8543E"/><path d="M30 20 L30 12 Q35 10 38 14" stroke="#5C7A3E" strokeWidth="2.5" fill="none" strokeLinecap="round"/></svg>
  ),
  coconut: (
    <svg viewBox="0 0 60 60"><circle cx="30" cy="34" r="18" fill="#6B4226"/><circle cx="30" cy="34" r="12" fill="#F5F0E4"/><circle cx="24" cy="22" r="1.5" fill="#3E2818"/><circle cx="34" cy="20" r="1.5" fill="#3E2818"/><circle cx="30" cy="26" r="1.5" fill="#3E2818"/></svg>
  ),
  // ===== SPICES =====
  turmeric: (
    <svg viewBox="0 0 60 60"><rect x="16" y="24" width="28" height="20" rx="4" fill="#F0A020"/><circle cx="30" cy="34" r="10" fill="#E89010"/><text x="30" y="38" fontSize="10" textAnchor="middle">🟡</text></svg>
  ),
  chilli: (
    <svg viewBox="0 0 60 60"><path d="M20 14 Q16 24 22 40 Q26 50 34 46 Q40 42 34 30 Q28 18 20 14 Z" fill="#D9432E"/><path d="M20 14 Q16 10 12 12" stroke="#5C7A3E" strokeWidth="2.5" fill="none" strokeLinecap="round"/></svg>
  ),
  cumin: (
    <svg viewBox="0 0 60 60"><ellipse cx="24" cy="26" rx="10" ry="5" fill="#8B6A3C" transform="rotate(-20 24 26)"/><ellipse cx="36" cy="34" rx="10" ry="5" fill="#A07C4C" transform="rotate(15 36 34)"/><ellipse cx="26" cy="42" rx="9" ry="4.5" fill="#8B6A3C" transform="rotate(-10 26 42)"/></svg>
  ),
  pepper: (
    <svg viewBox="0 0 60 60"><circle cx="22" cy="24" r="4" fill="#2C2418"/><circle cx="34" cy="20" r="4" fill="#3C3020"/><circle cx="40" cy="32" r="4" fill="#2C2418"/><circle cx="26" cy="36" r="4" fill="#3C3020"/><circle cx="34" cy="42" r="4" fill="#2C2418"/><circle cx="18" cy="38" r="4" fill="#3C3020"/></svg>
  ),
  salt: (
    <svg viewBox="0 0 60 60"><path d="M20 20 L40 20 L36 48 L24 48 Z" fill="#F5F0E4" stroke="#D4C4A8" strokeWidth="1.5"/><rect x="18" y="14" width="24" height="8" rx="3" fill="#C9962A"/></svg>
  ),
  cinnamon: (
    <svg viewBox="0 0 60 60"><rect x="24" y="12" width="12" height="36" rx="6" fill="#A0703E"/><rect x="26" y="12" width="4" height="36" rx="2" fill="#8B5E32"/></svg>
  ),
  mustardseeds: (
    <svg viewBox="0 0 60 60"><circle cx="22" cy="26" r="5" fill="#C9962A"/><circle cx="34" cy="22" r="5" fill="#D9A62E"/><circle cx="40" cy="34" r="5" fill="#C9962A"/><circle cx="26" cy="38" r="5" fill="#D9A62E"/><circle cx="18" cy="38" r="4" fill="#C9962A"/></svg>
  ),
  // ===== HERBS =====
  coriander: (
    <svg viewBox="0 0 60 60"><path d="M30 50 L30 20" stroke="#3E6B2E" strokeWidth="2.5"/><ellipse cx="22" cy="24" rx="7" ry="4" fill="#5C9A4A" transform="rotate(-30 22 24)"/><ellipse cx="38" cy="20" rx="7" ry="4" fill="#4C8A3A" transform="rotate(30 38 20)"/><ellipse cx="30" cy="14" rx="7" ry="4" fill="#5C9A4A"/></svg>
  ),
  mint: (
    <svg viewBox="0 0 60 60"><path d="M30 50 L30 16" stroke="#3E6B2E" strokeWidth="2.5"/><ellipse cx="20" cy="24" rx="9" ry="6" fill="#6BA854" transform="rotate(-25 20 24)"/><ellipse cx="40" cy="24" rx="9" ry="6" fill="#5C9A4A" transform="rotate(25 40 24)"/><ellipse cx="20" cy="38" rx="9" ry="6" fill="#6BA854" transform="rotate(-25 20 38)"/><ellipse cx="40" cy="38" rx="9" ry="6" fill="#5C9A4A" transform="rotate(25 40 38)"/></svg>
  ),
  curryleaves: (
    <svg viewBox="0 0 60 60"><path d="M30 50 L30 14" stroke="#5C4226" strokeWidth="2"/><ellipse cx="24" cy="20" rx="5" ry="3" fill="#3E6B2E"/><ellipse cx="36" cy="24" rx="5" ry="3" fill="#4C8A3A"/><ellipse cx="24" cy="30" rx="5" ry="3" fill="#3E6B2E"/><ellipse cx="36" cy="34" rx="5" ry="3" fill="#4C8A3A"/><ellipse cx="24" cy="40" rx="5" ry="3" fill="#3E6B2E"/></svg>
  ),
  basil: (
    <svg viewBox="0 0 60 60"><path d="M30 50 L30 24" stroke="#3E6B2E" strokeWidth="2.5"/><ellipse cx="30" cy="18" rx="10" ry="8" fill="#4C8A3A"/><ellipse cx="18" cy="28" rx="9" ry="7" fill="#5C9A4A"/><ellipse cx="42" cy="28" rx="9" ry="7" fill="#5C9A4A"/></svg>
  ),
  ginger: (
    <svg viewBox="0 0 60 60"><path d="M18 34 Q16 24 24 22 Q22 16 30 16 Q28 24 36 22 Q42 20 44 30 Q46 40 38 44 Q30 48 24 44 Q16 42 18 34 Z" fill="#D9B878"/></svg>
  ),
  // ===== DAIRY =====
  milk: (
    <svg viewBox="0 0 60 60"><path d="M22 14 L38 14 L38 22 L42 28 L42 50 L18 50 L18 28 L22 22 Z" fill="#FAFAF5" stroke="#D4C4A8" strokeWidth="1.5"/><rect x="18" y="34" width="24" height="8" fill="#5C9AC8"/></svg>
  ),
  butter: (
    <svg viewBox="0 0 60 60"><rect x="14" y="24" width="32" height="20" rx="4" fill="#F0D060"/><rect x="14" y="24" width="32" height="7" rx="3" fill="#F5E090"/></svg>
  ),
  paneer: (
    <svg viewBox="0 0 60 60"><rect x="16" y="20" width="28" height="24" rx="2" fill="#FAF6E8"/><rect x="16" y="20" width="28" height="24" rx="2" fill="none" stroke="#E8DCC0" strokeWidth="1.5"/><line x1="16" y1="30" x2="44" y2="30" stroke="#E8DCC0" strokeWidth="1"/><line x1="30" y1="20" x2="30" y2="44" stroke="#E8DCC0" strokeWidth="1"/></svg>
  ),
  yogurt: (
    <svg viewBox="0 0 60 60"><path d="M20 20 L40 20 L37 48 L23 48 Z" fill="#FAFAF5" stroke="#D4C4A8" strokeWidth="1.5"/><ellipse cx="30" cy="20" rx="10" ry="3" fill="#FFFFFF"/></svg>
  ),
  cheese: (
    <svg viewBox="0 0 60 60"><path d="M12 40 L48 40 L40 18 L20 18 Z" fill="#F0C048"/><circle cx="26" cy="30" r="2" fill="#D9A82E"/><circle cx="34" cy="34" r="1.5" fill="#D9A82E"/></svg>
  ),
  eggs: (
    <svg viewBox="0 0 60 60"><ellipse cx="24" cy="34" rx="10" ry="13" fill="#FAF0DC"/><ellipse cx="38" cy="38" rx="10" ry="13" fill="#F5E8D0"/></svg>
  ),
  // ===== VESSELS =====
  bowl: (
    <svg viewBox="0 0 60 60"><path d="M12 28 Q12 46 30 46 Q48 46 48 28 Z" fill="#D9622B"/><ellipse cx="30" cy="28" rx="18" ry="5" fill="#E8792E"/></svg>
  ),
  pot: (
    <svg viewBox="0 0 60 60"><rect x="14" y="24" width="32" height="22" rx="3" fill="#8B8B8B"/><ellipse cx="30" cy="24" rx="16" ry="4" fill="#A0A0A0"/><rect x="8" y="28" width="6" height="4" rx="2" fill="#6B6B6B"/><rect x="46" y="28" width="6" height="4" rx="2" fill="#6B6B6B"/></svg>
  ),
  pressurecooker: (
    <svg viewBox="0 0 60 60"><path d="M14 30 Q14 48 30 48 Q46 48 46 30 Z" fill="#A8A8A8"/><ellipse cx="30" cy="30" rx="16" ry="5" fill="#C0C0C0"/><rect x="26" y="14" width="8" height="10" rx="2" fill="#8B8B8B"/><circle cx="30" cy="12" r="3" fill="#6B6B6B"/></svg>
  ),
  // ===== PANS =====
  fryingpan: (
    <svg viewBox="0 0 60 60"><ellipse cx="26" cy="34" rx="16" ry="9" fill="#5A5A5A"/><ellipse cx="26" cy="32" rx="16" ry="9" fill="#707070"/><rect x="40" y="28" width="16" height="5" rx="2.5" fill="#8B5E32"/></svg>
  ),
  tawa: (
    <svg viewBox="0 0 60 60"><ellipse cx="28" cy="32" rx="20" ry="8" fill="#3C3C3C"/><ellipse cx="28" cy="30" rx="20" ry="8" fill="#525252"/><rect x="44" y="26" width="12" height="4.5" rx="2" fill="#8B5E32"/></svg>
  ),
  saucepan: (
    <svg viewBox="0 0 60 60"><rect x="16" y="26" width="26" height="18" rx="3" fill="#909090"/><ellipse cx="29" cy="26" rx="13" ry="4" fill="#A8A8A8"/><rect x="40" y="22" width="14" height="4.5" rx="2" fill="#3C3C3C"/></svg>
  ),
  // ===== WOK =====
  kadai: (
    <svg viewBox="0 0 60 60"><path d="M10 26 Q10 48 30 48 Q50 48 50 26" fill="none" stroke="#4A4A4A" strokeWidth="5" strokeLinecap="round"/><circle cx="10" cy="24" r="3.5" fill="#3C3C3C"/><circle cx="50" cy="24" r="3.5" fill="#3C3C3C"/></svg>
  ),
  // ===== UTENSILS =====
  spatula: (
    <svg viewBox="0 0 60 60"><rect x="27" y="18" width="6" height="30" rx="3" fill="#8B5E32"/><path d="M18 10 L42 10 L38 22 L22 22 Z" fill="#3C3C3C"/></svg>
  ),
  ladle: (
    <svg viewBox="0 0 60 60"><rect x="27" y="16" width="6" height="30" rx="3" fill="#8B5E32"/><ellipse cx="24" cy="16" rx="12" ry="8" fill="#707070"/></svg>
  ),
  whisk: (
    <svg viewBox="0 0 60 60"><rect x="27" y="10" width="6" height="16" rx="3" fill="#C9962A"/><path d="M22 26 Q30 44 38 26 M20 26 Q30 48 40 26 M24 26 Q30 40 36 26" stroke="#A8A8A8" strokeWidth="2" fill="none" strokeLinecap="round"/></svg>
  ),
  knife: (
    <svg viewBox="0 0 60 60"><rect x="8" y="30" width="18" height="6" rx="2" fill="#6B4226"/><path d="M26 26 L50 30 L26 36 Z" fill="#C0C0C0"/></svg>
  ),
  choppingboard: (
    <svg viewBox="0 0 60 60"><rect x="10" y="16" width="40" height="28" rx="4" fill="#C9A96A"/><circle cx="46" cy="20" r="2.5" fill="#A0703E"/></svg>
  ),
  rollingpin: (
    <svg viewBox="0 0 60 60"><rect x="14" y="26" width="32" height="10" rx="5" fill="#D9B878"/><rect x="6" y="28" width="8" height="6" rx="3" fill="#A0703E"/><rect x="46" y="28" width="8" height="6" rx="3" fill="#A0703E"/></svg>
  ),
  grater: (
    <svg viewBox="0 0 60 60"><path d="M20 10 L40 14 L34 48 L18 44 Z" fill="#B8B8B8"/><circle cx="24" cy="20" r="1.2" fill="#808080"/><circle cx="30" cy="22" r="1.2" fill="#808080"/><circle cx="26" cy="30" r="1.2" fill="#808080"/><circle cx="32" cy="32" r="1.2" fill="#808080"/><circle cx="24" cy="38" r="1.2" fill="#808080"/></svg>
  ),
  // ===== EQUIPMENT =====
  gasstove: (
    <svg viewBox="0 0 60 60"><rect x="8" y="34" width="44" height="14" rx="3" fill="#3C3C3C"/><circle cx="30" cy="34" r="12" fill="#525252"/><circle cx="30" cy="34" r="7" fill="#2C2418"/><path d="M30 27 L30 24 M23 30 L21 28 M37 30 L39 28" stroke="#D9622B" strokeWidth="2" strokeLinecap="round"/></svg>
  ),
  induction: (
    <svg viewBox="0 0 60 60"><rect x="8" y="24" width="44" height="24" rx="4" fill="#2C2C2C"/><circle cx="30" cy="36" r="13" fill="#1C1C1C"/><circle cx="30" cy="36" r="9" fill="none" stroke="#4A9AC8" strokeWidth="1.5"/><circle cx="30" cy="36" r="5" fill="none" stroke="#4A9AC8" strokeWidth="1.5"/></svg>
  ),
  oven: (
    <svg viewBox="0 0 60 60"><rect x="10" y="12" width="40" height="36" rx="4" fill="#4A4A4A"/><rect x="14" y="20" width="32" height="20" rx="2" fill="#2C2418"/><rect x="14" y="14" width="32" height="4" rx="2" fill="#707070"/><circle cx="20" cy="16" r="1.5" fill="#D9622B"/></svg>
  ),
  mixer: (
    <svg viewBox="0 0 60 60"><rect x="20" y="30" width="20" height="18" rx="3" fill="#D9622B"/><rect x="24" y="14" width="12" height="18" rx="3" fill="#E8E8E8"/><ellipse cx="30" cy="14" rx="6" ry="3" fill="#C0C0C0"/></svg>
  ),
  // ===== DEFAULT =====
  default: (
    <svg viewBox="0 0 60 60"><circle cx="30" cy="30" r="20" fill="#E8D5B7"/><text x="30" y="38" fontSize="20" textAnchor="middle">🥄</text></svg>
  )
};

const KitchenIcon = ({ iconKey, size = 40 }) => {
  const svg = ICONS[iconKey] || ICONS.default;
  return (
    <div style={{ width: size, height: size, display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}>
      {React.cloneElement(svg, { width: size, height: size })}
    </div>
  );
};

export const ICON_KEYS = Object.keys(ICONS).filter(k => k !== 'default');
export default KitchenIcon;
