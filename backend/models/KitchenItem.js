const mongoose = require('mongoose');

const TYPES = [
  'Vegetable', 'Fruit', 'Spice', 'Dairy', 'Herb',
  'Vessel', 'Pan', 'Wok', 'Utensil', 'Equipment', 'Other'
];

const kitchenItemSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true, unique: true },
    type: { type: String, enum: TYPES, default: 'Other' },
    iconKey: { type: String, required: true }, // maps to a React SVG icon component
    addedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
  },
  { timestamps: true }
);

kitchenItemSchema.index({ name: 'text' });

module.exports = mongoose.model('KitchenItem', kitchenItemSchema);
module.exports.TYPES = TYPES;
