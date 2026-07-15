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

const joinAnswers = (answers) => answers.filter(Boolean).join('\n\n');

const normalize = (value) =>
  String(value || '')
    .toLowerCase()
    .replace(/[^\w\s]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();

const findBestMatch = (question, items, fields) => {
  const q = normalize(question);
  const tokens = q.split(' ').filter((token) => token.length > 2);

  return items
    .map((item) => {
      const haystack = normalize(fields.map((field) => item[field] || '').join(' '));
      const score = tokens.reduce((total, token) => total + (haystack.includes(token) ? 1 : 0), 0);
      return { item, score };
    })
    .filter(({ score }) => score > 0)
    .sort((a, b) => b.score - a.score)[0]?.item;
};

const listTop = (items, formatter, count = 3) => items.slice(0, count).map(formatter).join('; ');

const splitBilingualAnswer = (answer) => {
  const text = String(answer || '').trim();
  if (!text) return [];

  const delimiter = '---ENGLISH---';
  if (text.includes(delimiter)) {
    return text.split(delimiter).map((part) => trimText(part, 900)).filter(Boolean).slice(0, 2);
  }

  const withoutLabels = text
    .replace(/^Hinglish:\s*/i, '')
    .replace(/\n+\s*English:\s*/i, delimiter);

  if (withoutLabels.includes(delimiter)) {
    return withoutLabels.split(delimiter).map((part) => trimText(part, 900)).filter(Boolean).slice(0, 2);
  }

  return [trimText(text, 900)];
};

const buildCatalogData = async () => {
  const [hotels, restaurants, vehicles, crops, machines] = await Promise.all([
    Hotel.find({ available: true }).sort({ rating: -1, price: 1 }).limit(8).lean(),
    Restaurant.find({ available: true }).sort({ rating: -1 }).limit(8).lean(),
    Vehicle.find({ available: true }).sort({ pricePerDay: 1 }).limit(8).lean(),
    Crop.find({ available: true }).sort({ updatedAt: -1 }).limit(10).lean(),
    Machine.find({ available: true }).sort({ rentPerDay: 1 }).limit(8).lean(),
  ]);

  const context = [
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

  return { hotels, restaurants, vehicles, crops, machines, context };
};

const fallbackAnswer = (question, catalog) => {
  const q = question.toLowerCase();

  if (q.includes('hotel') || q.includes('stay') || q.includes('room')) {
    const hotel = findBestMatch(question, catalog.hotels, ['name', 'location', 'amenities']) || catalog.hotels[0];
    if (hotel) {
      const amenities = Array.isArray(hotel.amenities) && hotel.amenities.length ? ` Amenities: ${hotel.amenities.join(', ')}.` : '';
      return [
        `Aadab! ${hotel.name} ${hotel.location} me available hai. Price approx ${formatMoney(hotel.price)}/night, rating ${hotel.rating}/5.${amenities}`,
        `${hotel.name} is available in ${hotel.location}. The approximate price is ${formatMoney(hotel.price)} per night with a ${hotel.rating}/5 rating.${amenities}`,
      ];
    }

    return [
      'Aadab! Abhi hotel catalog empty lag raha hai, isliye exact hotel price nahi mil raha.',
      'The hotel catalog looks empty right now, so I cannot give an exact hotel price.',
    ];
  }

  if (q.includes('taxi') || q.includes('vehicle') || q.includes('car') || q.includes('rent')) {
    const vehicle = findBestMatch(question, catalog.vehicles, ['name', 'type', 'features']) || catalog.vehicles[0];
    if (vehicle) {
      const kmRate = vehicle.pricePerKm ? `, aur Rs ${vehicle.pricePerKm}/km` : '';
      const kmRateEnglish = vehicle.pricePerKm ? `, plus Rs ${vehicle.pricePerKm}/km` : '';
      return [
        `Aadab! ${vehicle.name} (${vehicle.type}) ${vehicle.capacity} logon ke liye hai. Rate approx ${formatMoney(vehicle.pricePerDay)}/day${kmRate}. Driver ${vehicle.driver ? 'included' : 'included nahi'} hai.`,
        `${vehicle.name} (${vehicle.type}) seats ${vehicle.capacity} people. The approximate rate is ${formatMoney(vehicle.pricePerDay)} per day${kmRateEnglish}. Driver is ${vehicle.driver ? 'included' : 'not included'}.`,
      ];
    }

    return [
      'Aadab! Abhi vehicle catalog empty lag raha hai, isliye exact taxi/car rate nahi mil raha.',
      'The vehicle catalog looks empty right now, so I cannot give an exact taxi or car rental rate.',
    ];
  }

  if (q.includes('saffron') || q.includes('crop') || q.includes('apple') || q.includes('machine') || q.includes('farm')) {
    const machineQuestion = q.includes('machine') || q.includes('tractor') || q.includes('rent');
    if (machineQuestion) {
      const machine = findBestMatch(question, catalog.machines, ['name', 'type', 'owner']) || catalog.machines[0];
      if (machine) {
        return [
          `Aadab! ${machine.name} (${machine.type}) ka rent approx ${formatMoney(machine.rentPerDay)}/day hai. Buy price around ${formatMoney(machine.buyPrice)} hai. Owner: ${machine.owner}.`,
          `${machine.name} (${machine.type}) rents for about ${formatMoney(machine.rentPerDay)} per day. The purchase price is around ${formatMoney(machine.buyPrice)}. Owner: ${machine.owner}.`,
        ];
      }
    }

    const crop = findBestMatch(question, catalog.crops, ['name', 'category', 'seller', 'location', 'description']) || catalog.crops[0];
    if (crop) {
      return [
        `Aadab! ${crop.name} ka current listed price ${formatMoney(crop.price)}/${crop.unit} hai. Seller ${crop.seller}, location ${crop.location}, stock ${crop.stock} ${crop.unit}. ${trimText(crop.description, 120)}`,
        `${crop.name} is currently listed at ${formatMoney(crop.price)} per ${crop.unit}. Seller: ${crop.seller}. Location: ${crop.location}. Stock: ${crop.stock} ${crop.unit}. ${trimText(crop.description, 120)}`,
      ];
    }

    return [
      'Aadab! Abhi crop/machine catalog empty lag raha hai, isliye exact price nahi mil raha.',
      'The crop or machine catalog looks empty right now, so I cannot give an exact price.',
    ];
  }

  if (q.includes('weather') || q.includes('mausam') || q.includes('snow')) {
    return [
      'Aadab! Kashmir ka mausam jaldi change hota hai. Travel se pehle current forecast check karo, aur evening ke liye jacket zaroor rakho.',
      'Kashmir weather can change quickly. Check the current forecast before travel and carry a jacket for cooler evenings.',
    ];
  }

  if (q.includes('restaurant') || q.includes('food') || q.includes('wazwan') || q.includes('khana')) {
    const restaurant = findBestMatch(question, catalog.restaurants, ['name', 'cuisine', 'location', 'specialty']) || catalog.restaurants[0];
    if (restaurant) {
      return [
        `Aadab! ${restaurant.name} ${restaurant.location} me hai. Cuisine: ${restaurant.cuisine}. Specialty: ${trimText(restaurant.specialty, 100)}. Rating ${restaurant.rating}/5, timings ${restaurant.timings}.`,
        `${restaurant.name} is in ${restaurant.location}. Cuisine: ${restaurant.cuisine}. Specialty: ${trimText(restaurant.specialty, 100)}. Rating: ${restaurant.rating}/5. Timings: ${restaurant.timings}.`,
      ];
    }
  }

  const summary = [
    catalog.hotels.length ? `hotels: ${listTop(catalog.hotels, (item) => `${item.name} ${formatMoney(item.price)}/night`)}` : '',
    catalog.vehicles.length ? `vehicles: ${listTop(catalog.vehicles, (item) => `${item.name} ${formatMoney(item.pricePerDay)}/day`)}` : '',
    catalog.crops.length ? `crops: ${listTop(catalog.crops, (item) => `${item.name} ${formatMoney(item.price)}/${item.unit}`)}` : '',
  ].filter(Boolean).join(' | ');

  return [
    summary
      ? `Aadab! Jo data abhi live hai usme ${summary}. Aap jis cheez ka naam poochoge, main uska direct price/detail bata dunga.`
      : 'Aadab! Main Kashmir Guide hoon. Aap hotel, taxi, saffron, crop, machine, restaurant ya weather ka naam poochoge to main direct detail bata dunga.',
    summary
      ? `The live catalog currently has ${summary}. Ask for any item by name and I will give the direct price or detail.`
      : 'I am Kashmir Guide. Ask about a hotel, taxi, saffron, crop, machine, restaurant, or weather and I will answer directly.',
  ];
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
              'Always answer with exactly two parts separated only by this delimiter: ---ENGLISH---',
              'Part 1 must be Hinglish with a warm Kashmir-style tone and light phrases like Aadab, zaroor, or yahan. Do not write any language label.',
              'Part 2 must be clear English explaining the same answer. Do not write any language label.',
              'Use the live portal catalog context when recommending hotels, vehicles, restaurants, crops, or machines.',
              'Answer the question directly first with names, prices, locations, sellers, stock, ratings, or rental details from the catalog. Do not merely tell the user to visit a section.',
              'Keep answers useful, concise, and practical. If booking or exact availability is needed, add it only as a final optional next step after the direct answer.',
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

    const catalog = await buildCatalogData();
    const fallbackAnswers = fallbackAnswer(question, catalog);
    const aiAnswer = await callOpenAI({ question, history, catalogContext: catalog.context });
    const answers = aiAnswer ? splitBilingualAnswer(aiAnswer) : fallbackAnswers;

    return res.json({
      answer: joinAnswers(answers),
      answers,
      source: aiAnswer ? 'ai' : 'fallback',
    });
  } catch (error) {
    console.error('Chat route error:', error);
    return res.status(500).json({ message: 'Chatbot failed to answer' });
  }
});

module.exports = router;
