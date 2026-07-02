const express = require('express');
const Poll = require('../models/Poll');
const Message = require('../models/Message');
const { protect } = require('../middleware/authMiddleware');
const { requireGroupMember } = require('../middleware/groupMiddleware');

const router = express.Router();

// @route GET /api/polls/:groupId  -> latest poll for the group
router.get('/:groupId', protect, requireGroupMember, async (req, res) => {
  try {
    const poll = await Poll.findOne({ group: req.params.groupId })
      .sort({ createdAt: -1 })
      .populate('options.recipe', 'title image category')
      .populate('options.votes', 'username')
      .populate('createdBy', 'username');
    res.json(poll);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @route POST /api/polls -> { group, question, recipeIds: [], durationMinutes }
// Creates poll AND drops it into the chat feed as a message.
router.post('/', protect, requireGroupMember, async (req, res) => {
  try {
    const { group, question, recipeIds, durationMinutes } = req.body;

    if (!recipeIds || recipeIds.length < 2) {
      return res.status(400).json({ message: 'Provide at least 2 recipes to vote on' });
    }

    const duration = Number(durationMinutes) > 0 ? Number(durationMinutes) : 30;
    const startedAt = new Date();
    const expiresAt = new Date(startedAt.getTime() + duration * 60000);

    const poll = await Poll.create({
      group,
      question: question || "What's for dinner tonight?",
      options: recipeIds.map((id) => ({ recipe: id, votes: [] })),
      createdBy: req.user._id,
      durationMinutes: duration,
      startedAt,
      expiresAt
    });

    const populated = await Poll.findById(poll._id)
      .populate('options.recipe', 'title image category')
      .populate('createdBy', 'username');

    // Auto-post poll into the chat feed
    const message = await Message.create({
      group,
      sender: req.user._id,
      text: '',
      sharedPoll: poll._id,
      type: 'poll'
    });
    const populatedMessage = await Message.findById(message._id)
      .populate('sender', 'username avatar')
      .populate({
        path: 'sharedPoll',
        populate: [
          { path: 'options.recipe', select: 'title image category' },
          { path: 'createdBy', select: 'username' }
        ]
      });

    res.status(201).json({ poll: populated, message: populatedMessage });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @route PUT /api/polls/:id/vote  -> { optionIndex }
router.put('/:id/vote', protect, async (req, res) => {
  try {
    const { optionIndex } = req.body;
    const poll = await Poll.findById(req.params.id);
    if (!poll) return res.status(404).json({ message: 'Poll not found' });
    if (poll.isClosed || new Date() > poll.expiresAt) {
      return res.status(400).json({ message: 'Poll has ended' });
    }

    const userId = req.user._id.toString();
    poll.options.forEach((opt) => {
      opt.votes = opt.votes.filter((v) => v.toString() !== userId);
    });

    if (!poll.options[optionIndex]) {
      return res.status(400).json({ message: 'Invalid option' });
    }
    poll.options[optionIndex].votes.push(req.user._id);

    await poll.save();
    const populated = await Poll.findById(poll._id)
      .populate('options.recipe', 'title image category')
      .populate('options.votes', 'username')
      .populate('createdBy', 'username');

    res.json(populated);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @route PUT /api/polls/:id/close
router.put('/:id/close', protect, async (req, res) => {
  try {
    const poll = await Poll.findById(req.params.id);
    if (!poll) return res.status(404).json({ message: 'Poll not found' });
    poll.isClosed = true;
    await poll.save();
    res.json(poll);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
