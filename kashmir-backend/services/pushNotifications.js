const User = require('../models/User');

const EXPO_PUSH_URL = 'https://exp.host/--/api/v2/push/send';
const EXPO_TOKEN_PATTERN = /^(ExponentPushToken|ExpoPushToken)\[[A-Za-z0-9_-]+\]$/;

const chunk = (items, size) => {
  const groups = [];
  for (let index = 0; index < items.length; index += size) {
    groups.push(items.slice(index, index + size));
  }
  return groups;
};

const getAudienceUsers = async ({ audience, targetUser }) => {
  const query = audience === 'specific' ? { _id: targetUser } : {};
  return User.find(query).select('+pushTokens').lean();
};

const sendExpoPushNotifications = async ({ audience, targetUser, title, message, link, notificationId }) => {
  try {
    const users = await getAudienceUsers({ audience, targetUser });
    const tokens = [...new Set(
      users.flatMap((user) => user.pushTokens || [])
        .map((entry) => entry.token)
        .filter((token) => EXPO_TOKEN_PATTERN.test(token)),
    )];

    if (tokens.length === 0) {
      return { attempted: 0, accepted: 0 };
    }

    const payloads = tokens.map((to) => ({
      to,
      sound: 'default',
      title,
      body: message,
      data: {
        notificationId: String(notificationId),
        link: link || '/',
      },
      channelId: 'portal-updates',
    }));

    let accepted = 0;
    for (const payloadGroup of chunk(payloads, 100)) {
      const response = await fetch(EXPO_PUSH_URL, {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payloadGroup),
      });

      if (!response.ok) {
        throw new Error(`Expo push service responded with ${response.status}`);
      }

      const result = await response.json();
      const tickets = Array.isArray(result.data) ? result.data : [result.data];
      accepted += tickets.filter((ticket) => ticket?.status === 'ok').length;
    }

    return { attempted: tokens.length, accepted };
  } catch (error) {
    console.error('[push] Notification delivery failed:', error.message);
    return { attempted: 0, accepted: 0, error: error.message };
  }
};

module.exports = { sendExpoPushNotifications };
