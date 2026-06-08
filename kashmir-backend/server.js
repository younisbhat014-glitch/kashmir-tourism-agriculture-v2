const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dns = require('dns');
const bcrypt = require('bcryptjs');
const User = require('./models/User');
const Machine = require('./models/Machine');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

const requiredEnv = ['MONGODB_URI', 'JWT_SECRET'];
const missingEnv = requiredEnv.filter((key) => !process.env[key]);

if (missingEnv.length > 0) {
  console.error(`Missing required environment variables: ${missingEnv.join(', ')}`);
  process.exit(1);
}

const configuredOrigins = [
  process.env.FRONTEND_URL,
  ...(process.env.FRONTEND_URLS ? process.env.FRONTEND_URLS.split(',') : []),
]
  .map((origin) => origin && origin.trim())
  .filter(Boolean);

const isAllowedOrigin = (origin) => {
  if (!origin) return true;
  return configuredOrigins.includes(origin)
    || /^https:\/\/[a-z0-9-]+\.up\.railway\.app$/.test(origin)
    || /^http:\/\/(localhost|127\.0\.0\.1):517\d$/.test(origin);
};

mongoose.set('strictQuery', false);
dns.setServers(['8.8.8.8', '1.1.1.1']);

// Middleware
app.use(cors({
  origin(origin, callback) {
    if (isAllowedOrigin(origin)) {
      callback(null, true);
      return;
    }

    callback(new Error(`CORS blocked origin: ${origin}`));
  },
  credentials: true,
}));
app.use(express.json());

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/hotels', require('./routes/hotels'));
app.use('/api/bookings', require('./routes/bookings'));
app.use('/api/crops', require('./routes/crops'));
app.use('/api/vehicles', require('./routes/vehicles'));
app.use('/api/restaurants', require('./routes/restaurants'));
app.use('/api/machines', require('./routes/machines'));
app.use('/api/admin', require('./routes/admin'));

// Test route
app.get('/', (req, res) => {
  res.json({ message: 'Kashmir Portal Backend Running!' });
});

app.get('/health', (req, res) => {
  res.json({
    status: 'ok',
    database: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected',
  });
});

const seedDevelopmentUsers = async () => {
  if (process.env.NODE_ENV !== 'development') return;

  const demoUsers = [
    { name: 'Admin Kashmir', email: 'admin@kashmir.com', password: 'admin123', role: 'admin', avatar: 'admin' },
    { name: 'Amir Wani', email: 'user@kashmir.com', password: 'user123', role: 'user', avatar: 'user' },
  ];

  for (const demoUser of demoUsers) {
    const exists = await User.exists({ email: demoUser.email });
    if (exists) continue;

    const hashedPassword = await bcrypt.hash(demoUser.password, 10);
    await User.create({
      name: demoUser.name,
      email: demoUser.email,
      password: hashedPassword,
      role: demoUser.role,
      avatar: demoUser.avatar,
    });
  }
};

const seedDevelopmentMachines = async () => {
  if (await Machine.exists({})) return;

  await Machine.insertMany([
    { name: 'Mahindra Tractor 575', type: 'Tractor', hp: 45, buyPrice: 680000, rentPerDay: 2500, image: 'https://assets.tractorjunction.com/tractor-junction/assets/images/tractor-images/tractor-image-0-1731604906.webp?width=538&height=320', available: true, owner: 'Malik Farm Rentals' },
    { name: 'Combined Harvester', type: 'Harvester', hp: 80, buyPrice: 1800000, rentPerDay: 8000, image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRR_Le5rgbHLvP3T1GgOzzNZjhqcPRTu0osMw&s', available: true, owner: 'AgriTech Kashmir' },
    { name: 'Rotavator (7 ft)', type: 'Attachment', buyPrice: 85000, rentPerDay: 700, image: 'https://5.imimg.com/data5/SELLER/Default/2024/5/423345404/GI/AP/BE/88644821/spike-rotavator-agritron-500x500.jpg', available: true, owner: 'Farm Equipment Co.' },
    { name: 'Sprinkler Irrigation Set', type: 'Irrigation', buyPrice: 45000, rentPerDay: 400, image: 'https://5.imimg.com/data5/SELLER/Default/2024/5/415084128/FC/ZC/HS/2503855/sprinkler-irrigation-system.png', available: false, owner: 'Irrigation Depot' },
    { name: 'Potato Digger', type: 'Harvester', buyPrice: 120000, rentPerDay: 1200, image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRXwkdT7rGeQ-a6b7ggV8yu-upgskFg7yEqCQ&s', available: true, owner: 'Bhat Agri Solutions' },
    { name: 'Mini Power Tiller', type: 'Tiller', hp: 9, buyPrice: 95000, rentPerDay: 900, image: 'https://toolz4industry.com/wp-content/uploads/2023/05/power-gold-71cc-power-tiller-12.jpg', available: true, owner: 'SmallFarm Tools' },
  ]);
};

mongoose.connect(process.env.MONGODB_URI, {
  serverSelectionTimeoutMS: 30000,
  socketTimeoutMS: 45000,
  family: 4,
})
  .then(async () => {
    console.log('MongoDB connected');
    await seedDevelopmentUsers();
    await seedDevelopmentMachines();
    const server = app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });

    server.on('error', (err) => {
      if (err.code === 'EADDRINUSE') {
        console.error(`Port ${PORT} is already in use. Stop the existing backend or set a different PORT in .env.`);
        process.exit(1);
      }

      throw err;
    });
  })
  .catch((err) => {
    console.error('MongoDB error:', err);
    process.exit(1);
  });
