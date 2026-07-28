const express = require('express');
const Ingredient = require('../models/Ingredient');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

// Seed some common ingredients if store is empty
const SEED_INGREDIENTS = [
  { name: 'Onion', category: 'Vegetables', emoji: '🧅' },
  { name: 'Garlic', category: 'Vegetables', emoji: '🧄' },
  { name: 'Tomato', category: 'Vegetables', emoji: '🍅' },
  { name: 'Potato', category: 'Vegetables', emoji: '🥔' },
  { name: 'Carrot', category: 'Vegetables', emoji: '🥕' },
  { name: 'Spinach', category: 'Vegetables', emoji: '🥬' },
  { name: 'Ginger', category: 'Spices & Herbs', emoji: '🫚' },
  { name: 'Cumin', category: 'Spices & Herbs', emoji: '🌿' },
  { name: 'Turmeric', category: 'Spices & Herbs', emoji: '🟡' },
  { name: 'Chilli', category: 'Spices & Herbs', emoji: '🌶️' },
  { name: 'Coriander', category: 'Spices & Herbs', emoji: '🌿' },
  { name: 'Salt', category: 'Spices & Herbs', emoji: '🧂' },
  { name: 'Black Pepper', category: 'Spices & Herbs', emoji: '⚫' },
  { name: 'Chicken', category: 'Meat & Seafood', emoji: '🍗' },
  { name: 'Mutton', category: 'Meat & Seafood', emoji: '🥩' },
  { name: 'Fish', category: 'Meat & Seafood', emoji: '🐟' },
  { name: 'Eggs', category: 'Dairy', emoji: '🥚' },
  { name: 'Milk', category: 'Dairy', emoji: '🥛' },
  { name: 'Butter', category: 'Dairy', emoji: '🧈' },
  { name: 'Paneer', category: 'Dairy', emoji: '🧀' },
  { name: 'Yogurt', category: 'Dairy', emoji: '🍶' },
  { name: 'Rice', category: 'Grains & Pasta', emoji: '🍚' },
  { name: 'Wheat Flour', category: 'Grains & Pasta', emoji: '🌾' },
  { name: 'Pasta', category: 'Grains & Pasta', emoji: '🍝' },
  { name: 'Bread', category: 'Grains & Pasta', emoji: '🍞' },
  { name: 'Lentils', category: 'Legumes', emoji: '🫘' },
  { name: 'Chickpeas', category: 'Legumes', emoji: '🫘' },
  { name: 'Olive Oil', category: 'Oils & Condiments', emoji: '🫒' },
  { name: 'Mustard Oil', category: 'Oils & Condiments', emoji: '🛢️' },
  { name: 'Lemon', category: 'Fruits', emoji: '🍋' },
  { name: 'Mango', category: 'Fruits', emoji: '🥭' },
  { name: 'Banana', category: 'Fruits', emoji: '🍌' },
  { name: 'Sugar', category: 'Baking', emoji: '🍬' },
  { name: 'Baking Powder', category: 'Baking', emoji: '⬜' },
  { name: 'Cashews', category: 'Nuts & Seeds', emoji: '🥜' },
  { name: 'Almonds', category: 'Nuts & Seeds', emoji: '🌰' },
];

// @route GET /api/ingredients — all, optional ?search= or ?letter=
router.get('/', protect, async (req, res) => {
  try {
    const count = await Ingredient.countDocuments();
    if (count === 0) {
      await Ingredient.insertMany(SEED_INGREDIENTS.map(i => ({ ...i })));
    }

    const { search, letter } = req.query;
    const filter = {};
    if (search) filter.name = { $regex: search, $options: 'i' };
    if (letter) filter.name = { $regex: `^${letter}`, $options: 'i' };

    const ingredients = await Ingredient.find(filter).sort({ name: 1 });
    res.json(ingredients);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @route POST /api/ingredients — add to global store
router.post('/', protect, async (req, res) => {
  try {
    const { name, category, emoji } = req.body;
    if (!name) return res.status(400).json({ message: 'Name required' });

    const existing = await Ingredient.findOne({ name: { $regex: `^${name}$`, $options: 'i' } });
    if (existing) return res.status(400).json({ message: 'Ingredient already exists', ingredient: existing });

    const ingredient = await Ingredient.create({
      name: name.trim(),
      category: category || 'Other',
      emoji: emoji || '🥄',
      addedBy: req.user._id
    });
    res.status(201).json(ingredient);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
