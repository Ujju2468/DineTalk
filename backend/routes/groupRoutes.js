const express = require('express');
const Group = require('../models/Group');
const User = require('../models/User');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

// @route GET /api/groups/members  -> all registered users (to pick group members from)
router.get('/members', protect, async (req, res) => {
  try {
    const users = await User.find({ _id: { $ne: req.user._id } }).select('username email avatar');
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @route GET /api/groups  -> groups the logged-in user belongs to
router.get('/', protect, async (req, res) => {
  try {
    const groups = await Group.find({ members: req.user._id })
      .populate('members', 'username avatar')
      .populate('createdBy', 'username')
      .sort({ updatedAt: -1 });
    res.json(groups);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @route POST /api/groups  -> create a group { name, description, memberIds: [] }
router.post('/', protect, async (req, res) => {
  try {
    const { name, description, memberIds } = req.body;
    if (!name) return res.status(400).json({ message: 'Group name is required' });

    const members = Array.from(new Set([...(memberIds || []), req.user._id.toString()]));

    const group = await Group.create({
      name,
      description,
      members,
      createdBy: req.user._id
    });

    const populated = await Group.findById(group._id)
      .populate('members', 'username avatar')
      .populate('createdBy', 'username');

    res.status(201).json(populated);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @route GET /api/groups/:id
router.get('/:id', protect, async (req, res) => {
  try {
    const group = await Group.findById(req.params.id)
      .populate('members', 'username avatar')
      .populate('createdBy', 'username');
    if (!group) return res.status(404).json({ message: 'Group not found' });

    const isMember = group.members.some((m) => m._id.toString() === req.user._id.toString());
    if (!isMember) return res.status(403).json({ message: 'Not a member of this group' });

    res.json(group);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @route PUT /api/groups/:id/members  -> add/remove members { addIds: [], removeIds: [] } (creator only)
router.put('/:id/members', protect, async (req, res) => {
  try {
    const group = await Group.findById(req.params.id);
    if (!group) return res.status(404).json({ message: 'Group not found' });

    if (group.createdBy.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Only the group creator can manage members' });
    }

    const { addIds = [], removeIds = [] } = req.body;
    let members = group.members.map((m) => m.toString());
    members = members.filter((m) => !removeIds.includes(m));
    addIds.forEach((id) => { if (!members.includes(id)) members.push(id); });

    group.members = members;
    await group.save();

    const populated = await Group.findById(group._id)
      .populate('members', 'username avatar')
      .populate('createdBy', 'username');

    res.json(populated);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @route DELETE /api/groups/:id  -> (creator only)
router.delete('/:id', protect, async (req, res) => {
  try {
    const group = await Group.findById(req.params.id);
    if (!group) return res.status(404).json({ message: 'Group not found' });

    if (group.createdBy.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Only the group creator can delete this group' });
    }

    await group.deleteOne();
    res.json({ message: 'Group deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
