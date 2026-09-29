/**
 * Single source of truth for kitchen item categories.
 *
 * Used by: Inventory page, Pantry Matcher (IngredientMatcherWidget), and the
 * "Ingredients" step of the Recipe Form (via PantryPicker).
 *
 * Keeping this in one file means all three surfaces always show the exact
 * same zones/categories — add a type here once and it shows up everywhere.
 * Must stay in sync with backend/models/KitchenItem.js `TYPES`.
 */
export const TYPES = [
  'All', 'Spice', 'Vegetable', 'Fruit', 'Dairy', 'Herb',
  'Vessel', 'Pan', 'Wok', 'Utensil', 'Equipment', 'Other'
];

export const TYPE_EMOJI = {
  Spice: '🌶️',
  Vegetable: '🥕',
  Fruit: '🍎',
  Dairy: '🥛',
  Herb: '🌿',
  Vessel: '🥣',
  Pan: '🍳',
  Wok: '🥘',
  Utensil: '🔪',
  Equipment: '🔥',
  Other: '📦'
};

// Which categories live behind each visual "zone" on the Inventory page
export const ZONE_TYPES = {
  fridge: ['Vegetable', 'Fruit', 'Dairy', 'Herb'],
  spices: ['Spice'],
  shelves: ['Vessel', 'Pan', 'Wok', 'Utensil', 'Equipment', 'Other']
};

export const ZONE_LABELS = {
  fridge: 'Fridge',
  spices: 'Spice Drawer',
  shelves: 'Shelves & Cookware'
};

export const ZONE_EMOJI = {
  fridge: '🧊',
  spices: '🌶️',
  shelves: '📦'
};
