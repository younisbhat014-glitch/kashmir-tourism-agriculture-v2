const express = require('express');
const router = express.Router();
const User = require('../models/User');
const Booking = require('../models/Booking');
const Hotel = require('../models/Hotel');
const Crop = require('../models/Crop');
const Vehicle = require('../models/Vehicle');
const Restaurant = require('../models/Restaurant');
const Machine = require('../models/Machine');
const { adminAuth } = require('../middleware/auth');

// Stats
router.get('/stats', adminAuth, async (req, res) => {
  try {
    const totalUsers = await User.countDocuments({ role: 'user' });
    const totalBookings = await Booking.countDocuments();
    const totalAdmins = await User.countDocuments({ role: 'admin' });
    const totalHotels = await Hotel.countDocuments();
    const totalCrops = await Crop.countDocuments();
    const totalVehicles = await Vehicle.countDocuments();
    const totalMachines = await Machine.countDocuments();
    res.json({ totalUsers, totalBookings, totalAdmins, totalHotels, totalCrops, totalVehicles, totalMachines });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Get all users
router.get('/users', adminAuth, async (req, res) => {
  try {
    const users = await User.find().select('-password').sort({ createdAt: -1 });
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Get all bookings
router.get('/bookings', adminAuth, async (req, res) => {
  try {
    const bookings = await Booking.find().populate('user', 'name email').sort({ createdAt: -1 });
    res.json(bookings);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Make admin
router.put('/make-admin/:id', adminAuth, async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(req.params.id, { role: 'admin' }, { new: true });
    res.json({ message: `${user.name} is now admin!`, user });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Delete user
router.delete('/users/:id', adminAuth, async (req, res) => {
  try {
    await User.findByIdAndDelete(req.params.id);
    res.json({ message: 'User deleted' });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
