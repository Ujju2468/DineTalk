const mongoose = require('mongoose');

const ingredientSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true, unique: true },
    category: {
      type: String,
      enum: ['Vegetables', 'Fruits', 'Dairy', 'Meat & Seafood', 'Grains & Pasta', 'Spices & Herbs', 'Oils & Condiments', 'Beverages', 'Baking', 'Nuts & Seeds', 'Legumes', 'Other'],
      default: 'Other'
    },
    emoji: { type: String, default: '🥄' },
    addedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
  },
  { timestamps: true }
);

ingredientSchema.index({ name: 'text' });

module.exports = mongoose.model('Ingredient', ingredientSchema);
