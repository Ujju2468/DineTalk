const express = require('express');
const KitchenItem = require('../models/KitchenItem');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

// Seed data — maps to iconKey names in frontend KitchenIcons.js
const SEED_ITEMS = [
  // Vegetables
  { name: 'Onion', type: 'Vegetable', iconKey: 'onion' },
  { name: 'Tomato', type: 'Vegetable', iconKey: 'tomato' },
  { name: 'Potato', type: 'Vegetable', iconKey: 'potato' },
  { name: 'Carrot', type: 'Vegetable', iconKey: 'carrot' },
  { name: 'Garlic', type: 'Vegetable', iconKey: 'garlic' },
  { name: 'Capsicum', type: 'Vegetable', iconKey: 'capsicum' },
  { name: 'Spinach', type: 'Vegetable', iconKey: 'spinach' },
  { name: 'Cauliflower', type: 'Vegetable', iconKey: 'cauliflower' },
  { name: 'Cabbage', type: 'Vegetable', iconKey: 'cabbage' },
  { name: 'Broccoli', type: 'Vegetable', iconKey: 'broccoli' },
  // Fruits
  { name: 'Lemon', type: 'Fruit', iconKey: 'lemon' },
  { name: 'Mango', type: 'Fruit', iconKey: 'mango' },
  { name: 'Banana', type: 'Fruit', iconKey: 'banana' },
  { name: 'Apple', type: 'Fruit', iconKey: 'apple' },
  { name: 'Coconut', type: 'Fruit', iconKey: 'coconut' },
  // Spices
  { name: 'Turmeric', type: 'Spice', iconKey: 'turmeric' },
  { name: 'Chilli Powder', type: 'Spice', iconKey: 'chilli' },
  { name: 'Cumin Seeds', type: 'Spice', iconKey: 'cumin' },
  { name: 'Black Pepper', type: 'Spice', iconKey: 'pepper' },
  { name: 'Salt', type: 'Spice', iconKey: 'salt' },
  { name: 'Cinnamon', type: 'Spice', iconKey: 'cinnamon' },
  { name: 'Mustard Seeds', type: 'Spice', iconKey: 'mustardseeds' },
  // Herbs
  { name: 'Coriander Leaves', type: 'Herb', iconKey: 'coriander' },
  { name: 'Mint', type: 'Herb', iconKey: 'mint' },
  { name: 'Curry Leaves', type: 'Herb', iconKey: 'curryleaves' },
  { name: 'Basil', type: 'Herb', iconKey: 'basil' },
  { name: 'Ginger', type: 'Herb', iconKey: 'ginger' },
  // Dairy
  { name: 'Milk', type: 'Dairy', iconKey: 'milk' },
  { name: 'Butter', type: 'Dairy', iconKey: 'butter' },
  { name: 'Paneer', type: 'Dairy', iconKey: 'paneer' },
  { name: 'Yogurt', type: 'Dairy', iconKey: 'yogurt' },
  { name: 'Cheese', type: 'Dairy', iconKey: 'cheese' },
  { name: 'Eggs', type: 'Dairy', iconKey: 'eggs' },
  // Vessels
  { name: 'Mixing Bowl', type: 'Vessel', iconKey: 'bowl' },
  { name: 'Cooking Pot', type: 'Vessel', iconKey: 'pot' },
  { name: 'Pressure Cooker', type: 'Vessel', iconKey: 'pressurecooker' },
  // Pans
  { name: 'Frying Pan', type: 'Pan', iconKey: 'fryingpan' },
  { name: 'Tawa / Griddle', type: 'Pan', iconKey: 'tawa' },
  { name: 'Saucepan', type: 'Pan', iconKey: 'saucepan' },
  // Woks
  { name: 'Kadai / Wok', type: 'Wok', iconKey: 'kadai' },
  // Utensils
  { name: 'Spatula', type: 'Utensil', iconKey: 'spatula' },
  { name: 'Ladle', type: 'Utensil', iconKey: 'ladle' },
  { name: 'Whisk', type: 'Utensil', iconKey: 'whisk' },
  { name: 'Knife', type: 'Utensil', iconKey: 'knife' },
  { name: 'Chopping Board', type: 'Utensil', iconKey: 'choppingboard' },
  { name: 'Rolling Pin', type: 'Utensil', iconKey: 'rollingpin' },
  { name: 'Grater', type: 'Utensil', iconKey: 'grater' },
  // Equipment
  { name: 'Gas Stove', type: 'Equipment', iconKey: 'gasstove' },
  { name: 'Induction Cooktop', type: 'Equipment', iconKey: 'induction' },
  { name: 'Oven', type: 'Equipment', iconKey: 'oven' },
  { name: 'Mixer Grinder', type: 'Equipment', iconKey: 'mixer' },
];

// @route GET /api/kitchen-items?type=&search=
router.get('/', protect, async (req, res) => {
  try {
    const count = await KitchenItem.countDocuments();
    if (count === 0) {
      await KitchenItem.insertMany(SEED_ITEMS);
    }

    const { type, search } = req.query;
    const filter = {};
    if (type && type !== 'All') filter.type = type;
    if (search) filter.name = { $regex: search, $options: 'i' };

    const items = await KitchenItem.find(filter).sort({ type: 1, name: 1 });
    res.json(items);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.get('/types', (req, res) => {
  const { TYPES } = require('../models/KitchenItem');
  res.json(TYPES);
});

// @route POST /api/kitchen-items — add new item to global inventory
router.post('/', protect, async (req, res) => {
  try {
    const { name, type, iconKey } = req.body;
    if (!name || !iconKey) return res.status(400).json({ message: 'Name and iconKey required' });

    const existing = await KitchenItem.findOne({ name: { $regex: `^${name}$`, $options: 'i' } });
    if (existing) return res.status(400).json({ message: 'Item already exists', item: existing });

    const item = await KitchenItem.create({
      name: name.trim(),
      type: type || 'Other',
      iconKey,
      addedBy: req.user._id
    });
    res.status(201).json(item);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @route PUT /api/kitchen-items/:id — edit kitchen item
router.put('/:id', protect, async (req, res) => {
  try {
    const { name, type, iconKey } = req.body;
    const item = await KitchenItem.findById(req.params.id);
    if (!item) return res.status(404).json({ message: 'Item not found' });

    if (name) item.name = name.trim();
    if (type) item.type = type;
    if (iconKey) item.iconKey = iconKey;

    await item.save();
    res.json(item);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @route DELETE /api/kitchen-items/:id — delete kitchen item
router.delete('/:id', protect, async (req, res) => {
  try {
    const item = await KitchenItem.findById(req.params.id);
    if (!item) return res.status(404).json({ message: 'Item not found' });

    await item.deleteOne();
    res.json({ message: 'Kitchen item deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
