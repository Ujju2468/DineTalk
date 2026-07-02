const cron = require('node-cron');
const Poll = require('../models/Poll');
const Group = require('../models/Group');
const PushSubscription = require('../models/PushSubscription');
const { sendPush, pushConfigured } = require('../config/push');

const REMINDER_WINDOW_MINUTES = 5; // send "ending soon" reminder when <= 5 min left

const notifyUser = async (io, userId, payload) => {
  // In-app (socket) reminder
  io.to(`user:${userId}`).emit('pollReminder', payload);

  // Push notification (best-effort)
  if (pushConfigured) {
    const subs = await PushSubscription.find({ user: userId });
    await Promise.all(
      subs.map((sub) =>
        sendPush(sub, { title: payload.title, body: payload.body, url: payload.url }).catch(async (err) => {
          // Clean up dead subscriptions (expired/unsubscribed)
          if (err.statusCode === 410 || err.statusCode === 404) {
            await PushSubscription.deleteOne({ _id: sub._id });
          }
        })
      )
    );
  }
};

const startPollScheduler = (io) => {
  // Runs every minute
  cron.schedule('* * * * *', async () => {
    try {
      const now = new Date();

      // 1. Send "ending soon" reminders, skipping users who already voted or were already reminded
      const endingSoon = await Poll.find({
        isClosed: false,
        expiresAt: { $gt: now, $lte: new Date(now.getTime() + REMINDER_WINDOW_MINUTES * 60000) }
      }).populate('group', 'members name');

      for (const poll of endingSoon) {
        const votedUserIds = new Set(
          poll.options.flatMap((opt) => opt.votes.map((v) => v.toString()))
        );
        const alreadyReminded = new Set(poll.remindedUsers.map((u) => u.toString()));

        const toRemind = poll.group.members
          .map((m) => m.toString())
          .filter((id) => !votedUserIds.has(id) && !alreadyReminded.has(id));

        if (toRemind.length > 0) {
          await Promise.all(
            toRemind.map((userId) =>
              notifyUser(io, userId, {
                title: '⏰ Poll ending soon!',
                body: `"${poll.question}" closes in under ${REMINDER_WINDOW_MINUTES} min — vote now in ${poll.group.name}`,
                url: `/groups/${poll.group._id}/chat`
              })
            )
          );
          poll.remindedUsers.push(...toRemind);
          await poll.save();
        }
      }

      // 2. Auto-close expired polls
      const expired = await Poll.find({ isClosed: false, expiresAt: { $lte: now } });
      for (const poll of expired) {
        poll.isClosed = true;
        await poll.save();
        io.to(`group:${poll.group}`).emit('pollUpdated', poll);
      }
    } catch (err) {
      console.error('Poll scheduler error:', err.message);
    }
  });

  console.log('Poll reminder/auto-close scheduler started (runs every minute)');
};

module.exports = startPollScheduler;
