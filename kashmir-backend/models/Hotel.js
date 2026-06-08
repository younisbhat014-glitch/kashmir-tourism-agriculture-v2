const mongoose = require('mongoose');

const hotelSchema = new mongoose.Schema({
  name: { type: String, required: true },
  stars: { type: Number, default: 3 },
  price: { type: Number, required: true },
  location: { type: String, required: true },
  image: { type: String, default: '' },
  amenities: [{ type: String }],
  rating: { type: Number, default: 4.0 },
  reviews: { type: Number, default: 0 },
  available: { type: Boolean, default: true },
}, { timestamps: true });

module.exports = mongoose.model('Hotel', hotelSchema);
