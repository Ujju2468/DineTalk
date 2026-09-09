const express = require('express');
const Comment = require('../models/Comment');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

router.get('/:recipeId', async (req, res) => {
  try {
    const comments = await Comment.find({ recipe: req.params.recipeId })
      .populate('author', 'username avatar')
      .sort({ createdAt: 1 });
    res.json(comments);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.post('/:recipeId', protect, async (req, res) => {
  try {
    const { text, parentComment } = req.body;
    if (!text) {
      return res.status(400).json({ message: 'Text is required' });
    }
    
    const comment = await Comment.create({
      recipe: req.params.recipeId,
      author: req.user._id,
      text,
      parentComment: parentComment || null
    });
    
    const populated = await comment.populate('author', 'username avatar');
    res.status(201).json(populated);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.delete('/:commentId', protect, async (req, res) => {
  try {
    const comment = await Comment.findById(req.params.commentId);
    if (!comment) {
      return res.status(404).json({ message: 'Comment not found' });
    }
    
    if (comment.author.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized' });
    }
    
    await comment.deleteOne();
    // Also delete all replies
    await Comment.deleteMany({ parentComment: req.params.commentId });
    
    res.json({ message: 'Comment and replies deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
