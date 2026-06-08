const mongoose = require('mongoose');

const cropSchema = new mongoose.Schema({
  name: { type: String, required: true },
  category: { type: String, required: true },
  price: { type: Number, required: true },
  unit: { type: String, default: 'kg' },
  seller: { type: String, required: true },
  location: { type: String, required: true },
  image: { type: String, default: '' },
  organic: { type: Boolean, default: false },
  stock: { type: Number, default: 100 },
  description: { type: String, default: '' },
  available: { type: Boolean, default: true },
}, { timestamps: true });

module.exports = mongoose.model('Crop', cropSchema);
