const express = require('express');
const mongoose = require('mongoose');
const Notification = require('../models/Notification');
const NotificationState = require('../models/NotificationState');
const User = require('../models/User');
const { auth, adminAuth } = require('../middleware/auth');
const { sendExpoPushNotifications } = require('../services/pushNotifications');

const router = express.Router();

const userNotificationQuery = (userId) => ({
  $or: [
    { audience: 'all' },
    { audience: 'specific', targetUser: userId },
  ],
});

const normalizeLink = (value) => {
  const link = String(value || '').trim();
  if (!link) return '';
  return link.startsWith('/') && !link.startsWith('//') ? link : '';
};

router.get('/', auth, async (req, res) => {
  try {
    const notifications = await Notification.find(userNotificationQuery(req.user._id))
      .sort({ createdAt: -1 })
      .limit(40)
      .lean();

    const states = await NotificationState.find({
      user: req.user._id,
      notification: { $in: notifications.map((item) => item._id) },
    }).lean();
    const readIds = new Set(states.filter((state) => state.readAt).map((state) => String(state.notification)));

    const items = notifications.map((notification) => ({
      ...notification,
      isRead: readIds.has(String(notification._id)),
    }));

    res.json({
      notifications: items,
      unreadCount: items.filter((item) => !item.isRead).length,
    });
  } catch (error) {
    res.status(500).json({ message: 'Unable to load notifications' });
  }
});

router.patch('/read-all', auth, async (req, res) => {
  try {
    const notifications = await Notification.find(userNotificationQuery(req.user._id)).select('_id').lean();
    const now = new Date();

    await Promise.all(notifications.map((notification) => (
      NotificationState.findOneAndUpdate(
        { notification: notification._id, user: req.user._id },
        { $set: { readAt: now } },
        { upsert: true, new: true, setDefaultsOnInsert: true },
      )
    )));

    res.json({ message: 'All notifications marked as read' });
  } catch (error) {
    res.status(500).json({ message: 'Unable to update notifications' });
  }
});

router.patch('/:id/read', auth, async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ message: 'Invalid notification' });
    }

    const notification = await Notification.findOne({
      _id: req.params.id,
      ...userNotificationQuery(req.user._id),
    });
    if (!notification) {
      return res.status(404).json({ message: 'Notification not found' });
    }

    await NotificationState.findOneAndUpdate(
      { notification: notification._id, user: req.user._id },
      { $set: { readAt: new Date() } },
      { upsert: true, new: true, setDefaultsOnInsert: true },
    );

    res.json({ message: 'Notification marked as read' });
  } catch (error) {
    res.status(500).json({ message: 'Unable to update notification' });
  }
});

router.post('/push-token', auth, async (req, res) => {
  try {
    const token = String(req.body.token || '').trim();
    const platform = String(req.body.platform || '').trim().toLowerCase();
    const deviceId = String(req.body.deviceId || '').trim();

    if (!/^(ExponentPushToken|ExpoPushToken)\[[A-Za-z0-9_-]+\]$/.test(token)) {
      return res.status(400).json({ message: 'Invalid Expo push token' });
    }
    if (!['android', 'ios'].includes(platform)) {
      return res.status(400).json({ message: 'Invalid device platform' });
    }

    const user = await User.findById(req.user._id).select('+pushTokens');
    const existing = user.pushTokens.find((entry) => entry.token === token);
    if (existing) {
      existing.platform = platform;
      existing.deviceId = deviceId;
      existing.updatedAt = new Date();
    } else {
      user.pushTokens.push({ token, platform, deviceId, updatedAt: new Date() });
    }

    user.pushTokens = user.pushTokens
      .sort((left, right) => new Date(right.updatedAt) - new Date(left.updatedAt))
      .slice(0, 5);
    await user.save();

    res.json({ message: 'Push notifications enabled' });
  } catch (error) {
    res.status(500).json({ message: 'Unable to register this device' });
  }
});

router.get('/admin/history', adminAuth, async (req, res) => {
  try {
    const notifications = await Notification.find()
      .populate('targetUser', 'name email')
      .populate('createdBy', 'name email')
      .sort({ createdAt: -1 })
      .limit(100);
    res.json(notifications);
  } catch (error) {
    res.status(500).json({ message: 'Unable to load notification history' });
  }
});

router.post('/admin/send', adminAuth, async (req, res) => {
  try {
    const title = String(req.body.title || '').trim();
    const message = String(req.body.message || '').trim();
    const audience = req.body.audience === 'specific' ? 'specific' : 'all';
    const targetUser = audience === 'specific' ? req.body.targetUserId : null;

    if (!title || !message) {
      return res.status(400).json({ message: 'Title and message are required' });
    }
    if (title.length > 100 || message.length > 500) {
      return res.status(400).json({ message: 'Notification content is too long' });
    }
    if (audience === 'specific') {
      if (!mongoose.Types.ObjectId.isValid(targetUser) || !await User.exists({ _id: targetUser })) {
        return res.status(400).json({ message: 'Select a valid user' });
      }
    }

    const notification = await Notification.create({
      title,
      message,
      audience,
      targetUser,
      link: normalizeLink(req.body.link),
      createdBy: req.user._id,
    });

    const push = await sendExpoPushNotifications({
      audience,
      targetUser,
      title,
      message,
      link: notification.link,
      notificationId: notification._id,
    });

    res.status(201).json({
      message: 'Notification sent',
      notification,
      push,
    });
  } catch (error) {
    res.status(500).json({ message: 'Unable to send notification', error: error.message });
  }
});

router.delete('/admin/:id', adminAuth, async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ message: 'Invalid notification' });
    }

    const deleted = await Notification.findByIdAndDelete(req.params.id);
    if (!deleted) {
      return res.status(404).json({ message: 'Notification not found' });
    }
    await NotificationState.deleteMany({ notification: deleted._id });

    res.json({ message: 'Notification deleted' });
  } catch (error) {
    res.status(500).json({ message: 'Unable to delete notification' });
  }
});

module.exports = router;
