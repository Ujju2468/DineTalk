// Small, consistent-style SVG icons — one per Ingredient category — plus a
// couple of reusable scene-decoration icons (flame, steam, handle) used by
// the Pantry fridge/counter scenes.

const svg = (inner, vb = '0 0 48 48') =>
  `<svg viewBox="${vb}" xmlns="http://www.w3.org/2000/svg">${inner}</svg>`;

export const CATEGORY_ICON = {
  'Vegetables': svg('<ellipse cx="24" cy="30" rx="16" ry="12" fill="#e0503a"/><path d="M24 18 C20 10 30 10 24 18" fill="#5c8c3e"/>'),
  'Fruits': svg('<circle cx="24" cy="26" r="14" fill="#f2b705"/><path d="M24 12 C21 6 29 6 24 12" fill="#5c8c3e"/>'),
  'Dairy': svg('<rect x="14" y="10" width="20" height="30" rx="3" fill="#fdfdfd" stroke="#ddd" stroke-width="2"/><path d="M15 10 L19 4 L29 4 L33 10 Z" fill="#dfeeff"/>'),
  'Meat & Seafood': svg('<ellipse cx="24" cy="26" rx="15" ry="11" fill="#c96b5a"/><circle cx="18" cy="22" r="2" fill="#fff5f0"/>'),
  'Grains & Pasta': svg('<rect x="14" y="12" width="20" height="26" rx="4" fill="#e8d3a0"/><rect x="14" y="12" width="20" height="8" rx="4" fill="#c9a25f"/>'),
  'Spices & Herbs': svg('<rect x="17" y="16" width="14" height="22" rx="3" fill="#d99e00"/><rect x="19" y="10" width="10" height="8" rx="2" fill="#8a5a2f"/>'),
  'Oils & Condiments': svg('<path d="M20 8 L28 8 L30 16 L30 38 Q24 42 18 38 L18 16 Z" fill="#c9a227"/>'),
  'Beverages': svg('<path d="M17 10 L31 10 L28 40 L20 40 Z" fill="#7ac1e0"/><rect x="17" y="10" width="14" height="5" fill="#4a8fae"/>'),
  'Baking': svg('<rect x="13" y="18" width="22" height="20" rx="3" fill="#f5ecd8" stroke="#e0d3ae" stroke-width="2"/><path d="M13 18 Q24 8 35 18" fill="none" stroke="#e0d3ae" stroke-width="2"/>'),
  'Nuts & Seeds': svg('<circle cx="18" cy="28" r="8" fill="#a9754f"/><circle cx="30" cy="24" r="7" fill="#c9915f"/>'),
  'Legumes': svg('<circle cx="18" cy="22" r="6" fill="#8ba85c"/><circle cx="28" cy="26" r="6" fill="#a3c46e"/><circle cx="22" cy="32" r="6" fill="#7a9c4c"/>'),
  'Other': svg('<rect x="14" y="14" width="20" height="22" rx="4" fill="#c9c9c9"/>'),
};

export const DEFAULT_ICON = CATEGORY_ICON['Other'];

// Reusable decorative bits for the scenes
export const FLAME_SVG = svg('<path d="M24 6 C16 18 14 26 24 42 C34 26 32 18 24 6 Z" fill="#f2841f"/><path d="M24 20 C20 26 20 32 24 38 C28 32 28 26 24 20 Z" fill="#fddb3a"/>');
export const DOOR_HANDLE_SVG = svg('<rect x="20" y="4" width="6" height="40" rx="3" fill="#8a8f94"/>', '0 0 46 48');
