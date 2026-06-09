const mongoose = require('mongoose');

const appSettingSchema = new mongoose.Schema({
  key: { type: String, required: true, unique: true },
  value: { type: mongoose.Schema.Types.Mixed, default: true },
}, { timestamps: true });

module.exports = mongoose.model('AppSetting', appSettingSchema);
