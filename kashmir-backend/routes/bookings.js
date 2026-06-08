const express = require('express');
const router = express.Router();
const Booking = require('../models/Booking');
const { auth } = require('../middleware/auth');
const { sendBookingConfirmationEmail } = require('../services/confirmationEmail');

// Create booking
router.post('/', auth, async (req, res) => {
  try {
    const booking = await Booking.create({ ...req.body, user: req.user._id });

    sendBookingConfirmationEmail({ booking, user: req.user }).catch((err) => {
      console.error(`[email] Confirmation failed for booking ${booking._id}:`, err.message);
    });

    res.status(201).json(booking);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// Get my bookings
router.get('/my', auth, async (req, res) => {
  try {
    const bookings = await Booking.find({ user: req.user._id }).sort({ createdAt: -1 });
    res.json(bookings);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Delete booking
router.delete('/:id', auth, async (req, res) => {
  try {
    await Booking.findOneAndDelete({ _id: req.params.id, user: req.user._id });
    res.json({ message: 'Booking cancelled' });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
