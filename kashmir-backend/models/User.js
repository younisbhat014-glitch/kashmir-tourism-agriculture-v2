const mongoose = require('mongoose');

const pushTokenSchema = new mongoose.Schema({
  token: { type: String, required: true, trim: true },
  platform: { type: String, enum: ['android', 'ios'], required: true },
  deviceId: { type: String, trim: true, default: '' },
  updatedAt: { type: Date, default: Date.now },
}, { _id: false });

const userSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  email: { type: String, required: true, unique: true, lowercase: true, trim: true },
  password: { type: String, required: true },
  role: { type: String, enum: ['user', 'admin'], default: 'user' },
  avatar: { type: String, default: 'user' },
  phone: { type: String, default: '' },
  address: { type: String, default: '' },
  pushTokens: {
    type: [pushTokenSchema],
    select: false,
    default: [],
  },
}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);
