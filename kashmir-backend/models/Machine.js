const mongoose = require('mongoose');

const machineSchema = new mongoose.Schema({
  name: { type: String, required: true },
  type: { type: String, required: true },
  hp: { type: Number, default: null },
  buyPrice: { type: Number, required: true },
  rentPerDay: { type: Number, required: true },
  image: { type: String, default: '' },
  owner: { type: String, required: true },
  available: { type: Boolean, default: true },
}, { timestamps: true });

module.exports = mongoose.model('Machine', machineSchema);
