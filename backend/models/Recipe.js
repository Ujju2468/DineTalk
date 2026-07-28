const mongoose = require('mongoose');

const CATEGORIES = [
<<<<<<< HEAD
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
=======
  'Breakfast','Lunch','Dinner','Dessert','Snacks',
  'Beverages','Appetizers','Vegan','Vegetarian','Non-Veg','Other'
>>>>>>> 97de632 (Ingridents store added, cook mode added and some other things fixed)
];

const recipeSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    description: { type: String, default: '' },
<<<<<<< HEAD
    category: { type: String, enum: CATEGORIES, default: 'Other' },
    ingredients: [{ type: String, required: true }],
    steps: [{ type: String, required: true }],
    cookTime: { type: Number, default: 0 }, // in minutes
=======
    origin: { type: String, default: '' },
    region: { type: String, default: '' },
    categories: [{ type: String, enum: CATEGORIES }],
    otherCategory: { type: String, default: '' }, // FIX: custom text when "Other" selected
    ingredients: [{ type: String, required: true }],
    steps: [{ type: String, required: true }],
    cookTime: { type: Number, default: 0 },
>>>>>>> 97de632 (Ingridents store added, cook mode added and some other things fixed)
    servings: { type: Number, default: 1 },
    image: { type: String, default: '' },
    author: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    likes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }]
  },
  { timestamps: true }
);

<<<<<<< HEAD
recipeSchema.index({ title: 'text', description: 'text' });

=======
>>>>>>> 97de632 (Ingridents store added, cook mode added and some other things fixed)
module.exports = mongoose.model('Recipe', recipeSchema);
module.exports.CATEGORIES = CATEGORIES;
