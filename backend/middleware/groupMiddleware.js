const Group = require('../models/Group');

// Checks group membership using :groupId in params, or groupId in body, as fallback.
const requireGroupMember = async (req, res, next) => {
  try {
    const groupId = req.params.groupId || req.body.group;
    if (!groupId) return res.status(400).json({ message: 'groupId is required' });

    const group = await Group.findById(groupId);
    if (!group) return res.status(404).json({ message: 'Group not found' });

    const isMember = group.members.some((m) => m.toString() === req.user._id.toString());
    if (!isMember) return res.status(403).json({ message: 'Not a member of this group' });

    req.group = group;
    next();
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { requireGroupMember };
