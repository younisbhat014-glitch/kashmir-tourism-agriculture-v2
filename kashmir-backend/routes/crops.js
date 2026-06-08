const express = require('express');
const router = express.Router();
const Crop = require('../models/Crop');
const { auth, adminAuth } = require('../middleware/auth');

// Get all crops
router.get('/', async (req, res) => {
  try {
    const crops = await Crop.find();
    res.json(crops);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Add crop — admin only
router.post('/', auth, async (req, res) => {
  try {
    const crop = await Crop.create({
      ...req.body,
      seller: req.body.seller || req.user.name,
    });
    res.status(201).json(crop);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// Update crop — admin only
router.put('/:id', adminAuth, async (req, res) => {
  try {
    const crop = await Crop.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(crop);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Delete crop — admin only
router.delete('/:id', adminAuth, async (req, res) => {
  try {
    await Crop.findByIdAndDelete(req.params.id);
    res.json({ message: 'Crop deleted' });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
