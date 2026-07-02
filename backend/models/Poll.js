const mongoose = require('mongoose');

const optionSchema = new mongoose.Schema({
  recipe: { type: mongoose.Schema.Types.ObjectId, ref: 'Recipe', required: true },
  votes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }]
});

const pollSchema = new mongoose.Schema(
  {
    group: { type: mongoose.Schema.Types.ObjectId, ref: 'Group', required: true },
    question: { type: String, required: true, default: "What's for dinner tonight?" },
    options: [optionSchema],
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    durationMinutes: { type: Number, required: true, default: 30 },
    startedAt: { type: Date, default: Date.now },
    expiresAt: { type: Date, required: true },
    isClosed: { type: Boolean, default: false },
    // tracks which users already got the "ending soon" reminder, so voters/already-reminded are skipped
    remindedUsers: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }]
  },
  { timestamps: true }
);

module.exports = mongoose.model('Poll', pollSchema);

