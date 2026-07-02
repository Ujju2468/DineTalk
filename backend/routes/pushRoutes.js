const express = require('express');
const PushSubscription = require('../models/PushSubscription');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

// @route GET /api/push/vapid-public-key
router.get('/vapid-public-key', (req, res) => {
  res.json({ publicKey: process.env.VAPID_PUBLIC_KEY || null });
});

// @route POST /api/push/subscribe -> { endpoint, keys: { p256dh, auth } }
router.post('/subscribe', protect, async (req, res) => {
  try {
    const { endpoint, keys } = req.body;
    if (!endpoint || !keys) return res.status(400).json({ message: 'Invalid subscription' });

    await PushSubscription.findOneAndUpdate(
      { endpoint },
      { user: req.user._id, endpoint, keys },
      { upsert: true, new: true }
    );

    res.status(201).json({ message: 'Subscribed' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @route POST /api/push/unsubscribe -> { endpoint }
router.post('/unsubscribe', protect, async (req, res) => {
  try {
    await PushSubscription.deleteOne({ endpoint: req.body.endpoint, user: req.user._id });
    res.json({ message: 'Unsubscribed' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
