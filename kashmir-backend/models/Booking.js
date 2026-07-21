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
  paymentMode: {
    type: String,
    enum: ['online', 'pay_at_hotel', 'pay_at_restaurant', 'pay_to_driver', 'cash_on_delivery', 'pay_to_seller', 'pay_to_owner'],
    default: 'pay_at_hotel',
  },
  paymentMethod: {
    type: String,
    enum: ['card', 'upi', 'netbanking', 'wallet', 'cash', 'provider'],
    default: 'cash',
  },
  paymentStatus: {
    type: String,
    enum: ['pending', 'initiated', 'paid', 'failed', 'pay_at_location'],
    default: 'pay_at_location',
  },
  paymentProvider: { type: String },
  paymentReference: { type: String },
  paymentNote: { type: String },
  status: { type: String, enum: ['pending', 'confirmed', 'cancelled'], default: 'confirmed' },
}, { timestamps: true });

module.exports = mongoose.model('Booking', bookingSchema);
