const express = require('express');
const Category = require('../models/Category');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

const SEED_CATEGORIES = [
  'All', 'Breakfast', 'Lunch', 'Dinner', 'Dessert', 'Snacks', 'Beverages', 'Appetizers', 'Vegan', 'Vegetarian', 'Non-Veg', 'Other'
];

// @route GET /api/categories — fetch all global categories
router.get('/', protect, async (req, res) => {
  try {
    const count = await Category.countDocuments();
    if (count === 0) {
      const docs = SEED_CATEGORIES.map(name => ({ name, isDefault: true }));
      await Category.insertMany(docs);
    }
    const categories = await Category.find().sort({ isDefault: -1, name: 1 });
    res.json(categories);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @route POST /api/categories — add new global category
router.post('/', protect, async (req, res) => {
  try {
    const { name, emoji } = req.body;
    if (!name || !name.trim()) return res.status(400).json({ message: 'Category name required' });

    const existing = await Category.findOne({ name: { $regex: `^${name.trim()}$`, $options: 'i' } });
    if (existing) return res.status(400).json({ message: 'Category already exists' });

    const cat = await Category.create({
      name: name.trim(),
      emoji: emoji || '🏷',
      isDefault: false,
      createdBy: req.user._id
    });
    res.status(201).json(cat);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @route DELETE /api/categories/:id — delete category
router.delete('/:id', protect, async (req, res) => {
  try {
    const cat = await Category.findById(req.params.id);
    if (!cat) return res.status(404).json({ message: 'Category not found' });
    if (cat.isDefault) return res.status(400).json({ message: 'Default categories cannot be deleted' });

    await cat.deleteOne();
    res.json({ message: 'Category deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
