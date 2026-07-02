const express = require('express');
const Message = require('../models/Message');
const { protect } = require('../middleware/authMiddleware');
const { requireGroupMember } = require('../middleware/groupMiddleware');

const router = express.Router();

// @route GET /api/messages/:groupId
router.get('/:groupId', protect, requireGroupMember, async (req, res) => {
  try {
    const messages = await Message.find({ group: req.params.groupId })
      .populate('sender', 'username avatar')
      .populate('sharedRecipe', 'title image category')
      .populate({
        path: 'sharedPoll',
        populate: [
          { path: 'options.recipe', select: 'title image category' },
          { path: 'options.votes', select: 'username' },
          { path: 'createdBy', select: 'username' }
        ]
      })
      .sort({ createdAt: 1 })
      .limit(200);
    res.json(messages);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @route POST /api/messages  -> { group, text, sharedRecipe, sharedPoll, type }
router.post('/', protect, requireGroupMember, async (req, res) => {
  try {
    const { group, text, sharedRecipe, sharedPoll, type } = req.body;
    const message = await Message.create({
      group,
      sender: req.user._id,
      text,
      sharedRecipe: sharedRecipe || null,
      sharedPoll: sharedPoll || null,
      type: type || (sharedPoll ? 'poll' : sharedRecipe ? 'recipe' : 'text')
    });
    const populated = await Message.findById(message._id)
      .populate('sender', 'username avatar')
      .populate('sharedRecipe', 'title image category')
      .populate({
        path: 'sharedPoll',
        populate: [
          { path: 'options.recipe', select: 'title image category' },
          { path: 'createdBy', select: 'username' }
        ]
      });
    res.status(201).json(populated);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
