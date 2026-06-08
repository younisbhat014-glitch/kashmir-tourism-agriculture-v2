const mongoose = require('mongoose');

const restaurantSchema = new mongoose.Schema({
  name: { type: String, required: true },
  cuisine: { type: String, required: true },
  price: { type: String, default: '₹₹' },
  location: { type: String, required: true },
  rating: { type: Number, default: 4.0 },
  specialty: { type: String, default: '' },
  image: { type: String, default: '' },
  timings: { type: String, default: '9am - 10pm' },
  available: { type: Boolean, default: true },
}, { timestamps: true });

module.exports = mongoose.model('Restaurant', restaurantSchema);
