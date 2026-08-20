// Maps a recipe step's text to a visual "action" so Cook Mode can show an
// animated icon (boiling pot, chopping knife, spinning grinder, etc.) instead
// of plain text. Order matters — first match wins, so more specific actions
// (tadka, grate) are listed before generic ones (add, mix).

const ACTIONS = [
  { test: /tadka|temper|tempering/i,            icon: '🔥🫙', label: 'Tadka',        anim: 'anim-sizzle' },
  { test: /fry|saut[ée]|shallow|deep[- ]?fry/i, icon: '🍳',   label: 'Frying',       anim: 'anim-sizzle' },
  { test: /boil|simmer|blanch/i,                icon: '🫧',   label: 'Boiling',      anim: 'anim-bubble' },
  { test: /grate|grating/i,                      icon: '🧀',   label: 'Grating',      anim: 'anim-shake' },
  { test: /grind|blend|mixi|mixture|puree|paste/i, icon: '🌀', label: 'Grinding',     anim: 'anim-spin' },
  { test: /chop|cut|dice|slice|mince/i,          icon: '🔪',   label: 'Chopping',     anim: 'anim-chop' },
  { test: /whisk|beat|whip/i,                    icon: '🥄',   label: 'Whisking',     anim: 'anim-shake' },
  { test: /knead|dough/i,                        icon: '🤲',   label: 'Kneading',     anim: 'anim-press' },
  { test: /marinat/i,                            icon: '🥣',   label: 'Marinating',   anim: 'anim-pulse' },
  { test: /bake|oven|roast|grill/i,              icon: '🔥',   label: 'Baking',       anim: 'anim-glow' },
  { test: /steam/i,                              icon: '♨️',   label: 'Steaming',     anim: 'anim-bubble' },
  { test: /peel/i,                                icon: '🥔',   label: 'Peeling',      anim: 'anim-shake' },
  { test: /mix|stir|combine|toss/i,              icon: '🥣',   label: 'Mixing',       anim: 'anim-spin' },
  { test: /add|pour|sprinkle|drizzle/i,          icon: '➕',   label: 'Adding',       anim: 'anim-pulse' },
  { test: /serve|plate|garnish/i,                icon: '🍽',   label: 'Plating',      anim: 'anim-pulse' },
];

export const detectAction = (text = '') => {
  for (const a of ACTIONS) {
    if (a.test.test(text)) return a;
  }
  return { icon: '👨‍🍳', label: 'Cooking', anim: 'anim-pulse' };
};
