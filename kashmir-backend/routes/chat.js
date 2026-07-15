const express = require('express');
const Crop = require('../models/Crop');
const Hotel = require('../models/Hotel');
const Machine = require('../models/Machine');
const Restaurant = require('../models/Restaurant');
const Vehicle = require('../models/Vehicle');

const router = express.Router();

const trimText = (value, max = 180) => String(value || '').replace(/\s+/g, ' ').trim().slice(0, max);

const formatMoney = (amount) => {
  const number = Number(amount);
  if (!Number.isFinite(number)) return '';
  return `Rs ${number.toLocaleString('en-IN')}`;
};

const compactList = (items, formatter) => items.map(formatter).filter(Boolean).join('\n');

const buildCatalogContext = async () => {
  const [hotels, restaurants, vehicles, crops, machines] = await Promise.all([
    Hotel.find({ available: true }).sort({ rating: -1, price: 1 }).limit(8).lean(),
    Restaurant.find({ available: true }).sort({ rating: -1 }).limit(8).lean(),
    Vehicle.find({ available: true }).sort({ pricePerDay: 1 }).limit(8).lean(),
    Crop.find({ available: true }).sort({ updatedAt: -1 }).limit(10).lean(),
    Machine.find({ available: true }).sort({ rentPerDay: 1 }).limit(8).lean(),
  ]);

  return [
    'Live portal catalog:',
    'Hotels:',
    compactList(hotels, (item) => `- ${item.name}, ${item.location}, ${formatMoney(item.price)}/night, rating ${item.rating}`),
    'Restaurants:',
    compactList(restaurants, (item) => `- ${item.name}, ${item.location}, ${item.cuisine}, specialty ${trimText(item.specialty, 80)}, rating ${item.rating}`),
    'Vehicles:',
    compactList(vehicles, (item) => `- ${item.name}, ${item.type}, ${item.capacity} seats, ${formatMoney(item.pricePerDay)}/day${item.pricePerKm ? `, Rs ${item.pricePerKm}/km` : ''}`),
    'Crops:',
    compactList(crops, (item) => `- ${item.name}, ${item.location}, ${formatMoney(item.price)}/${item.unit}, seller ${item.seller}, stock ${item.stock} ${item.unit}`),
    'Machines:',
    compactList(machines, (item) => `- ${item.name}, ${item.type}, rent ${formatMoney(item.rentPerDay)}/day, buy ${formatMoney(item.buyPrice)}, owner ${item.owner}`),
  ].filter(Boolean).join('\n');
};

const fallbackAnswer = (question) => {
  const q = question.toLowerCase();

  if (q.includes('hotel') || q.includes('stay') || q.includes('room')) {
    return 'Hotels ke liye Tourism section me available stays dekho. Location, price, rating aur amenities compare karke booking kar sakte ho.';
  }

  if (q.includes('taxi') || q.includes('vehicle') || q.includes('car') || q.includes('rent')) {
    return 'Vehicle rentals ke liye Tourism section me taxi/car options available hain. Capacity, per-day rate, per-km rate aur driver option check karo.';
  }

  if (q.includes('saffron') || q.includes('crop') || q.includes('apple') || q.includes('machine') || q.includes('farm')) {
    return 'Agriculture section me crops aur machines live catalog se milenge. Price, seller, stock, rent aur buy price wahi se confirm karo.';
  }

  if (q.includes('weather') || q.includes('mausam') || q.includes('snow')) {
    return 'Kashmir weather jaldi change hota hai. Travel se pehle current forecast check karo, aur evenings ke liye jacket zaroor rakho.';
  }

  return 'Aadab! Main Kashmir Guide hoon. Aap tourism, hotels, restaurants, vehicles, bookings, crops, farming machines, weather ya budget ke baare me pooch sakte ho.';
};

const callOpenAI = async ({ question, history, catalogContext }) => {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) return null;

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), Number(process.env.CHATBOT_TIMEOUT_MS || 18000));

  const historyText = history
    .slice(-8)
    .map((message) => `${message.from === 'user' ? 'User' : 'Kashmir Guide'}: ${trimText(message.text, 500)}`)
    .join('\n');

  try {
    const response = await fetch('https://api.openai.com/v1/responses', {
      method: 'POST',
      signal: controller.signal,
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: process.env.OPENAI_MODEL || 'gpt-4.1-mini',
        input: [
          {
            role: 'system',
            content: [
              'You are Kashmir Guide, a warm expert assistant inside the Kashmir Tourism and Agriculture Portal.',
              'Answer naturally in the user language: Hinglish, Hindi, Urdu-style Roman, Kashmiri-style phrasing, or English as appropriate.',
              'Use the live portal catalog context when recommending hotels, vehicles, restaurants, crops, or machines.',
              'Keep answers useful, concise, and practical. If booking or exact availability is needed, guide the user to the relevant portal section.',
              'Do not invent live prices or availability outside the provided catalog. If unsure, say what to check next.',
            ].join(' '),
          },
          {
            role: 'user',
            content: `Catalog context:\n${catalogContext}\n\nRecent chat:\n${historyText || 'No previous messages.'}\n\nUser question:\n${question}`,
          },
        ],
        temperature: 0.55,
        max_output_tokens: 420,
      }),
    });

    if (!response.ok) {
      const details = await response.text();
      console.error('OpenAI chat error:', response.status, trimText(details, 500));
      return null;
    }

    const data = await response.json();
    return trimText(data.output_text, 1800) || null;
  } catch (error) {
    console.error('Chatbot AI request failed:', error.message);
    return null;
  } finally {
    clearTimeout(timeout);
  }
};

router.post('/', async (req, res) => {
  try {
    const question = trimText(req.body?.message, 1200);
    const history = Array.isArray(req.body?.history) ? req.body.history : [];

    if (!question) {
      return res.status(400).json({ message: 'Question is required' });
    }

    const catalogContext = await buildCatalogContext();
    const aiAnswer = await callOpenAI({ question, history, catalogContext });

    return res.json({
      answer: aiAnswer || fallbackAnswer(question),
      source: aiAnswer ? 'ai' : 'fallback',
    });
  } catch (error) {
    console.error('Chat route error:', error);
    return res.status(500).json({ message: 'Chatbot failed to answer' });
  }
});

module.exports = router;
