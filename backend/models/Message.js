const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema(
  {
    group: { type: mongoose.Schema.Types.ObjectId, ref: 'Group', required: true },
    sender: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    text: { type: String, default: '' },
    sharedRecipe: { type: mongoose.Schema.Types.ObjectId, ref: 'Recipe', default: null },
    sharedPoll: { type: mongoose.Schema.Types.ObjectId, ref: 'Poll', default: null },
    type: { type: String, enum: ['text', 'recipe', 'poll'], default: 'text' }
  },
  { timestamps: true }
);

module.exports = mongoose.model('Message', messageSchema);
