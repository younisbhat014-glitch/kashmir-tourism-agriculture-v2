const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  type: { type: String, enum: ['hotel', 'restaurant', 'vehicle', 'crop', 'machine',], required: true },
  action: { type: String, enum: ['book', 'buy', 'rent'], default: 'book' },
  itemId: { type: mongoose.Schema.Types.ObjectId },
  itemName: { type: String, required: true },
  name: { type: String },
  phone: { type: String },
  checkIn: { type: String },
  checkOut: { type: String },
  guests: { type: Number, default: 1 },
  date: { type: String },
  time: { type: String },
  from: { type: String },
  to: { type: String },
  qty: { type: Number },
  total: { type: Number },
  status: { type: String, enum: ['pending', 'confirmed', 'cancelled'], default: 'confirmed' },
}, { timestamps: true });

module.exports = mongoose.model('Booking', bookingSchema);
