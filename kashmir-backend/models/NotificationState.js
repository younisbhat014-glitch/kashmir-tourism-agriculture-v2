const mongoose = require('mongoose');

const notificationStateSchema = new mongoose.Schema({
  notification: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Notification',
    required: true,
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  readAt: {
    type: Date,
    default: null,
  },
}, { timestamps: true });

notificationStateSchema.index({ notification: 1, user: 1 }, { unique: true });
notificationStateSchema.index({ user: 1, readAt: 1 });

module.exports = mongoose.model('NotificationState', notificationStateSchema);
