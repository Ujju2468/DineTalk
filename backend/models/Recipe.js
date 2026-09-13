const mongoose = require('mongoose');

const stepSchema = new mongoose.Schema({
  instructionText: { type: String, default: '' },
  timerSeconds: { type: Number, default: 0 }
});

const sectionSchema = new mongoose.Schema({
  name: { type: String, required: true, default: 'Instructions' },
  order: { type: Number, default: 0 },
  steps: [stepSchema]
});

const recipeSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    description: { type: String, default: '' },
    origin: { type: String, default: '' },
    region: { type: String, default: '' },
    categories: [{ type: String, trim: true }],
    ingredients: [{ type: String, required: true }],
    steps: [{ type: String }],
    sections: [sectionSchema],
    cookTime: { type: Number, default: 0 },
    servings: { type: Number, default: 1 },
    image: { type: String, default: '' },
    author: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    likes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }]
  },
  { timestamps: true }
);

module.exports = mongoose.model('Recipe', recipeSchema);
