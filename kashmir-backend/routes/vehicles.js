const express = require('express');
const router = express.Router();
const Vehicle = require('../models/Vehicle');
const { adminAuth } = require('../middleware/auth');

// Get all vehicles
router.get('/', async (req, res) => {
  try {
    const vehicles = await Vehicle.find();
    res.json(vehicles);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Add vehicle — admin only
router.post('/', adminAuth, async (req, res) => {
  try {
    const vehicle = await Vehicle.create(req.body);
    res.status(201).json(vehicle);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// Update vehicle — admin only
router.put('/:id', adminAuth, async (req, res) => {
  try {
    const vehicle = await Vehicle.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(vehicle);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Delete vehicle — admin only
router.delete('/:id', adminAuth, async (req, res) => {
  try {
    await Vehicle.findByIdAndDelete(req.params.id);
    res.json({ message: 'Vehicle deleted' });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
