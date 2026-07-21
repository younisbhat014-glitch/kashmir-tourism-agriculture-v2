const express = require('express');
const router = express.Router();
const Booking = require('../models/Booking');
const { auth } = require('../middleware/auth');
const { sendBookingConfirmationEmail } = require('../services/confirmationEmail');

const getDefaultPayLaterMode = (type, action) => {
  if (type === 'hotel') return 'pay_at_hotel';
  if (type === 'restaurant') return 'pay_at_restaurant';
  if (type === 'vehicle') return 'pay_to_driver';
  if (type === 'crop') return 'cash_on_delivery';
  if (type === 'machine' && action === 'rent') return 'pay_to_owner';
  return 'pay_to_seller';
};

const normalizePayment = (body) => {
  const paymentMode = body.paymentMode || getDefaultPayLaterMode(body.type, body.action);
  const isOnline = paymentMode === 'online';

  return {
    paymentMode,
    paymentMethod: isOnline ? (body.paymentMethod || 'upi') : (body.paymentMethod || 'cash'),
    paymentStatus: isOnline ? (body.paymentStatus || 'initiated') : (body.paymentStatus || 'pay_at_location'),
    paymentProvider: body.paymentProvider || (isOnline ? 'Kashmir Portal Online Payment' : undefined),
    paymentReference: body.paymentReference || (isOnline ? `KPAY-${Date.now()}` : undefined),
    paymentNote: body.paymentNote,
  };
};

// Create booking
router.post('/', auth, async (req, res) => {
  try {
    const booking = await Booking.create({
      ...req.body,
      ...normalizePayment(req.body),
      user: req.user._id,
    });

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
