const mongoose = require('mongoose');

const CATEGORIES = [
  'Breakfast',
  'Lunch',
  'Dinner',
  'Dessert',
  'Snacks',
  'Beverages',
  'Appetizers',
  'Vegan',
  'Vegetarian',
  'Non-Veg',
  'Other'
];

const recipeSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    description: { type: String, default: '' },
    category: { type: String, enum: CATEGORIES, default: 'Other' },
    ingredients: [{ type: String, required: true }],
    steps: [{ type: String, required: true }],
    cookTime: { type: Number, default: 0 }, // in minutes
    servings: { type: Number, default: 1 },
    image: { type: String, default: '' },
    author: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    likes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }]
  },
  { timestamps: true }
);

recipeSchema.index({ title: 'text', description: 'text' });

module.exports = mongoose.model('Recipe', recipeSchema);
module.exports.CATEGORIES = CATEGORIES;
