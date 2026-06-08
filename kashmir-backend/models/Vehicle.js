const mongoose = require('mongoose');

const vehicleSchema = new mongoose.Schema({
  name: { type: String, required: true },
  type: { type: String, required: true },
  capacity: { type: Number, required: true },
  pricePerDay: { type: Number, required: true },
  pricePerKm: { type: Number, default: null },
  driver: { type: Boolean, default: true },
  image: { type: String, default: '' },
  features: [{ type: String }],
  available: { type: Boolean, default: true },
}, { timestamps: true });

module.exports = mongoose.model('Vehicle', vehicleSchema);
