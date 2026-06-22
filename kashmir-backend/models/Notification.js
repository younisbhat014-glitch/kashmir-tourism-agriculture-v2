const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true,
    maxlength: 100,
  },
  message: {
    type: String,
    required: true,
    trim: true,
    maxlength: 500,
  },
  audience: {
    type: String,
    enum: ['all', 'specific'],
    default: 'all',
  },
  targetUser: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    default: null,
  },
  link: {
    type: String,
    trim: true,
    default: '',
    maxlength: 250,
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
}, { timestamps: true });

notificationSchema.index({ createdAt: -1 });
notificationSchema.index({ audience: 1, targetUser: 1, createdAt: -1 });

module.exports = mongoose.model('Notification', notificationSchema);
