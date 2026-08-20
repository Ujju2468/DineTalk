const mongoose = require('mongoose');

const CATEGORIES = [
  'Breakfast','Lunch','Dinner','Dessert','Snacks',
  'Beverages','Appetizers','Vegan','Vegetarian','Non-Veg','Other'
];

const recipeSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    description: { type: String, default: '' },
    origin: { type: String, default: '' },
    region: { type: String, default: '' },
    categories: [{ type: String, enum: CATEGORIES }],
    otherCategory: { type: String, default: '' }, // FIX: custom text when "Other" selected
    ingredients: [{ type: String, required: true }],
    steps: [{ type: String, required: true }],
    cookTime: { type: Number, default: 0 },
    servings: { type: Number, default: 1 },
    image: { type: String, default: '' },
    author: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    likes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }]
  },
  { timestamps: true }
);

module.exports = mongoose.model('Recipe', recipeSchema);
module.exports.CATEGORIES = CATEGORIES;
