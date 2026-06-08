import React, { useState, useRef, useEffect } from 'react';
import { Bot, MessageCircle, Send, X } from 'lucide-react';
import {
  AG_MACHINES,
  CROPS,
  HOTELS,
  RESTAURANTS,
  TOURIST_SPOTS,
  VEHICLES,
  WEATHER_DATA,
} from '../../data/appData';

const normalize = (value) =>
  value
    .toLowerCase()
    .replace(/[^\w\s]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();

const hasAny = (question, words) => words.some((word) => question.includes(word));

const formatPrice = (amount) => `Rs ${Number(amount).toLocaleString('en-IN')}`;

const listNames = (items, count = 4) => items.slice(0, count).map((item) => item.name).join(', ');

const getBestMatches = (input, items, fields) => {
  const q = normalize(input);
  const tokens = q.split(' ').filter((token) => token.length > 2);

  return items
    .map((item) => {
      const haystack = normalize(fields.map((field) => item[field] || '').join(' '));
      const score = tokens.reduce((total, token) => total + (haystack.includes(token) ? 1 : 0), 0);
      return { item, score };
    })
    .filter(({ score }) => score > 0)
    .sort((a, b) => b.score - a.score)
    .map(({ item }) => item);
};

const buildWeatherAnswer = (input) => {
  const q = normalize(input);
  const city = Object.keys(WEATHER_DATA).find((name) => q.includes(name.toLowerCase()));
  const selectedCity = city || 'Srinagar';
  const weather = WEATHER_DATA[selectedCity];

  return `${selectedCity} weather: ${weather.temp} C, ${weather.condition}, humidity ${weather.humidity}%, wind ${weather.wind} km/h. For tourism, keep a light jacket because Kashmir evenings can feel cooler.`;
};

const buildTourismAnswer = (input) => {
  const matches = getBestMatches(input, TOURIST_SPOTS, ['name', 'category', 'description', 'bestTime']);
  const spot = matches[0];

  if (spot) {
    return `${spot.name} is a good choice. It is known for ${spot.description} Entry: ${spot.entry}. Best time: ${spot.bestTime}. Rating: ${spot.rating}/5.`;
  }

  return `Top places to visit: ${listNames(TOURIST_SPOTS, 6)}. For first-time visitors, Dal Lake, Gulmarg, Pahalgam, and Sonamarg make a strong Kashmir itinerary.`;
};

const buildHotelAnswer = (input) => {
  const matches = getBestMatches(input, HOTELS, ['name', 'location', 'amenities']);
  const hotel = matches[0] || HOTELS[0];

  return `${hotel.name} in ${hotel.location} is rated ${hotel.rating}/5 and starts around ${formatPrice(hotel.price)} per night. Amenities include ${hotel.amenities.join(', ')}. Other options: ${listNames(HOTELS.filter((item) => item.id !== hotel.id), 3)}.`;
};

const buildRestaurantAnswer = (input) => {
  const matches = getBestMatches(input, RESTAURANTS, ['name', 'cuisine', 'location', 'specialty']);
  const restaurant = matches[0] || RESTAURANTS[0];

  return `${restaurant.name} at ${restaurant.location} is good for ${restaurant.cuisine}. Specialty: ${restaurant.specialty}. Timings: ${restaurant.timings}. Rating: ${restaurant.rating}/5.`;
};

const buildVehicleAnswer = (input) => {
  const matches = getBestMatches(input, VEHICLES, ['name', 'type', 'features']);
  const vehicle = matches[0] || VEHICLES[0];
  const kmText = vehicle.pricePerKm ? `, or Rs ${vehicle.pricePerKm}/km` : '';

  return `${vehicle.name} (${vehicle.type}) seats ${vehicle.capacity} people and costs about ${formatPrice(vehicle.pricePerDay)} per day${kmText}. Features: ${vehicle.features.join(', ')}.`;
};

const buildAgricultureAnswer = (input) => {
  const cropMatches = getBestMatches(input, CROPS, ['name', 'category', 'seller', 'location', 'description']);
  const machineMatches = getBestMatches(input, AG_MACHINES, ['name', 'type', 'owner']);

  if (machineMatches.length) {
    const machine = machineMatches[0];
    const status = machine.available ? 'available' : 'currently unavailable';
    return `${machine.name} is ${status}. Rent is ${formatPrice(machine.rentPerDay)} per day and buy price is around ${formatPrice(machine.buyPrice)}. Owner: ${machine.owner}.`;
  }

  const crop = cropMatches[0] || CROPS[0];
  return `${crop.name} from ${crop.location} costs about ${formatPrice(crop.price)} per ${crop.unit}. Seller: ${crop.seller}. Stock: ${crop.stock} ${crop.unit}. ${crop.description}`;
};

const buildSeasonAnswer = () =>
  'Best time for Kashmir tourism is April to October for gardens, lakes, valleys, and pleasant weather. December to February is best for snow and Gulmarg skiing. Saffron bloom is usually October to November.';

const buildBudgetAnswer = () =>
  `Approx budget: hotels start from ${formatPrice(Math.min(...HOTELS.map((hotel) => hotel.price)))}/night, vehicles from ${formatPrice(Math.min(...VEHICLES.map((vehicle) => vehicle.pricePerDay)))}/day, and crops like saffron start around Rs 450/gram.`;

const buildGeneralAnswer = (input) => {
  const q = normalize(input);

  if (hasAny(q, ['hi', 'hello', 'hey', 'namaste', 'aadab', 'salam'])) {
    return 'Aadab! Main Kashmir Guide hoon. Aap tourism, hotels, food, vehicles, weather, crops, ya farming machines ke baare mein kuch bhi pooch sakte ho.';
  }

  if (hasAny(q, ['weather', 'temp', 'rain', 'snow', 'climate', 'cold', 'warm', 'mausam'])) return buildWeatherAnswer(input);
  if (hasAny(q, ['hotel', 'stay', 'houseboat', 'room', 'accommodation', 'rehna'])) return buildHotelAnswer(input);
  if (hasAny(q, ['restaurant', 'food', 'eat', 'wazwan', 'cuisine', 'dine', 'khana'])) return buildRestaurantAnswer(input);
  if (hasAny(q, ['vehicle', 'taxi', 'car', 'shikara', 'boat', 'bike', 'bus', 'travel', 'rent'])) return buildVehicleAnswer(input);
  if (hasAny(q, ['agri', 'crop', 'farm', 'saffron', 'apple', 'walnut', 'cherry', 'tractor', 'machine', 'buy', 'sell', 'kheti'])) return buildAgricultureAnswer(input);
  if (hasAny(q, ['season', 'time', 'best', 'when', 'month', 'visit', 'kab'])) return buildSeasonAnswer();
  if (hasAny(q, ['price', 'cost', 'rate', 'cheap', 'expensive', 'budget', 'kitna'])) return buildBudgetAnswer();

  const allMatches = [
    ...getBestMatches(input, TOURIST_SPOTS, ['name', 'category', 'description']).map((item) => ({ type: 'place', item })),
    ...getBestMatches(input, HOTELS, ['name', 'location', 'amenities']).map((item) => ({ type: 'hotel', item })),
    ...getBestMatches(input, RESTAURANTS, ['name', 'cuisine', 'location', 'specialty']).map((item) => ({ type: 'restaurant', item })),
    ...getBestMatches(input, CROPS, ['name', 'category', 'seller', 'location', 'description']).map((item) => ({ type: 'crop', item })),
    ...getBestMatches(input, VEHICLES, ['name', 'type', 'features']).map((item) => ({ type: 'vehicle', item })),
  ];

  if (allMatches.length) {
    const match = allMatches[0];
    if (match.type === 'place') return buildTourismAnswer(match.item.name);
    if (match.type === 'hotel') return buildHotelAnswer(match.item.name);
    if (match.type === 'restaurant') return buildRestaurantAnswer(match.item.name);
    if (match.type === 'crop') return buildAgricultureAnswer(match.item.name);
    if (match.type === 'vehicle') return buildVehicleAnswer(match.item.name);
  }

  return 'Main aapka sawal samajh gaya. Is portal mein main Kashmir tourism, hotels, restaurants, vehicles, weather, crops, prices, aur agriculture machines par help kar sakta hoon. Thoda specific naam ya topic likho, jaise "Gulmarg", "saffron price", "hotel in Dal Lake", ya "taxi rent".';
};

const QUICK_REPLIES = ['Best places?', 'Saffron price?', 'Gulmarg weather?', 'Taxi rent'];

export default function Chatbot() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      from: 'bot',
      text: "Aadab! Welcome to Kashmir Portal. I'm your virtual guide. Ask me any question about tourism, hotels, food, vehicles, weather, crops, or farming.",
    },
  ]);
  const [input, setInput] = useState('');
  const [typing, setTyping] = useState(false);
  const bottomRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, typing]);

  const send = (text) => {
    const msg = text || input.trim();
    if (!msg) return;

    setInput('');
    setMessages((prev) => [...prev, { from: 'user', text: msg }]);
    setTyping(true);

    setTimeout(() => {
      setTyping(false);
      setMessages((prev) => [...prev, { from: 'bot', text: buildGeneralAnswer(msg) }]);
    }, 650 + Math.random() * 350);
  };

  return (
    <div className="chatbot-container">
      {open && (
        <div className="chatbot-window">
          <div className="chatbot-header">
            <div style={{ width: 40, height: 40, background: 'rgba(255,255,255,0.15)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Bot size={22} strokeWidth={2.4} />
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ fontWeight: 700, fontSize: '0.95rem' }}>Kashmir Guide</div>
              <div style={{ fontSize: '0.72rem', color: 'rgba(255,255,255,0.7)', display: 'flex', alignItems: 'center', gap: 5 }}>
                <span style={{ width: 7, height: 7, background: '#4ade80', borderRadius: '50%', display: 'inline-block' }} />
                Online Now
              </div>
            </div>
            <button onClick={() => setOpen(false)} aria-label="Close chat" style={{ background: 'none', border: 'none', color: 'white', cursor: 'pointer', width: 34, height: 34, display: 'grid', placeItems: 'center' }}>
              <X size={20} strokeWidth={2.4} />
            </button>
          </div>

          <div className="chatbot-messages">
            {messages.map((m, i) => (
              <div key={i} className={`chat-msg ${m.from}`}>
                {m.from === 'bot' && <div style={{ fontSize: '0.7rem', color: '#888', marginBottom: 3 }}>Kashmir Guide</div>}
                {m.text}
              </div>
            ))}
            {typing && (
              <div className="chat-msg bot" style={{ display: 'flex', gap: 4, alignItems: 'center' }}>
                {[0, 1, 2].map((i) => (
                  <div key={i} style={{ width: 7, height: 7, background: '#aaa', borderRadius: '50%', animation: `pulse 1s infinite ${i * 0.2}s` }} />
                ))}
              </div>
            )}
            <div ref={bottomRef} />
          </div>

          <div className="chatbot-quick-replies" style={{ padding: '8px 16px', display: 'flex', gap: 6, flexWrap: 'wrap', borderTop: '1px solid #f0f0f0' }}>
            {QUICK_REPLIES.map((q) => (
              <button key={q} onClick={() => send(q)} style={{
                fontSize: '0.75rem',
                padding: '5px 10px',
                border: '1px solid var(--kashmir-teal)',
                borderRadius: 50,
                background: 'white',
                color: 'var(--kashmir-teal)',
                cursor: 'pointer',
                fontFamily: 'Nunito',
                fontWeight: 600,
              }}
              >
                {q}
              </button>
            ))}
          </div>

          <div className="chatbot-input-row">
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && send()}
              placeholder="Ask anything..."
            />
            <button className="chatbot-send" onClick={() => send()} aria-label="Send message">
              <Send size={18} strokeWidth={2.4} />
            </button>
          </div>
        </div>
      )}

      <div className="chatbot-bubble" onClick={() => setOpen(!open)} title="Chat with Kashmir Guide">
        {open ? <X size={26} strokeWidth={2.6} /> : <MessageCircle size={30} strokeWidth={2.4} />}
      </div>
    </div>
  );
}
