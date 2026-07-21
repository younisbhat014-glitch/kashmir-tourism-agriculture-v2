const express = require('express');
const crypto = require('crypto');
const Razorpay = require('razorpay');
const router = express.Router();
const { auth } = require('../middleware/auth');

const KEY_ID = process.env.RAZORPAY_KEY_ID;
const KEY_SECRET = process.env.RAZORPAY_KEY_SECRET;
const isConfigured = Boolean(KEY_ID && KEY_SECRET);

const razorpay = isConfigured
  ? new Razorpay({ key_id: KEY_ID, key_secret: KEY_SECRET })
  : null;

// Public key + config status for the frontend checkout popup
router.get('/config', (req, res) => {
  res.json({ configured: isConfigured, keyId: isConfigured ? KEY_ID : null });
});

// Create a Razorpay order for the given amount (in rupees)
router.post('/order', auth, async (req, res) => {
  if (!isConfigured) {
    return res.status(503).json({
      message: 'Razorpay is not configured. Set RAZORPAY_KEY_ID and RAZORPAY_KEY_SECRET in the backend environment.',
    });
  }

  try {
    const rupees = Number(req.body.amount);
    if (!Number.isFinite(rupees) || rupees <= 0) {
      return res.status(400).json({ message: 'A valid amount (in rupees) is required.' });
    }

    const order = await razorpay.orders.create({
      amount: Math.round(rupees * 100), // paise
      currency: 'INR',
      receipt: `rcpt_${Date.now()}`,
      notes: {
        item: String(req.body.item || 'Portal Booking').slice(0, 250),
        userId: String(req.user._id),
      },
    });

    res.json({ orderId: order.id, amount: order.amount, currency: order.currency, keyId: KEY_ID });
  } catch (err) {
    res.status(500).json({ message: 'Could not create payment order', error: err.message });
  }
});

// Verify the payment signature returned by the checkout popup
router.post('/verify', auth, (req, res) => {
  if (!isConfigured) {
    return res.status(503).json({ message: 'Razorpay is not configured.' });
  }

  const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;
  if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
    return res.status(400).json({ message: 'Missing payment verification fields.' });
  }

  const expected = crypto
    .createHmac('sha256', KEY_SECRET)
    .update(`${razorpay_order_id}|${razorpay_payment_id}`)
    .digest('hex');

  const expectedBuf = Buffer.from(expected);
  const receivedBuf = Buffer.from(String(razorpay_signature));
  const valid = expectedBuf.length === receivedBuf.length
    && crypto.timingSafeEqual(expectedBuf, receivedBuf);

  if (!valid) {
    return res.status(400).json({ verified: false, message: 'Payment signature verification failed.' });
  }

  res.json({
    verified: true,
    paymentStatus: 'paid',
    paymentProvider: 'Razorpay',
    paymentReference: razorpay_payment_id,
    orderId: razorpay_order_id,
  });
});

module.exports = router;
