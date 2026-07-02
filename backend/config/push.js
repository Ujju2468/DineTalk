const webpush = require('web-push');

const configured = Boolean(process.env.VAPID_PUBLIC_KEY && process.env.VAPID_PRIVATE_KEY);

if (configured) {
  webpush.setVapidDetails(
    process.env.VAPID_SUBJECT || 'mailto:admin@example.com',
    process.env.VAPID_PUBLIC_KEY,
    process.env.VAPID_PRIVATE_KEY
  );
} else {
  console.warn('VAPID keys not set — push notifications disabled. Run: npx web-push generate-vapid-keys');
}

const sendPush = async (subscription, payload) => {
  if (!configured) return;
  try {
    await webpush.sendNotification(subscription, JSON.stringify(payload));
  } catch (err) {
    // Subscription likely expired/invalid — caller can decide to delete it
    throw err;
  }
};

module.exports = { webpush, sendPush, pushConfigured: configured };
