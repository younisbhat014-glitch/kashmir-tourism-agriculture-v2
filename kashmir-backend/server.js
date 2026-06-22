const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dns = require('dns');
const seedDefaultCatalog = require('./services/seedDefaultCatalog');
const { verifyEmailTransport } = require('./services/confirmationEmail');
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
app.use(express.json({ limit: '3mb' }));

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/hotels', require('./routes/hotels'));
app.use('/api/bookings', require('./routes/bookings'));
app.use('/api/crops', require('./routes/crops'));
app.use('/api/vehicles', require('./routes/vehicles'));
app.use('/api/restaurants', require('./routes/restaurants'));
app.use('/api/machines', require('./routes/machines'));
app.use('/api/admin', require('./routes/admin'));
app.use('/api/notifications', require('./routes/notifications'));

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

mongoose.connect(process.env.MONGODB_URI, {
  serverSelectionTimeoutMS: 30000,
  socketTimeoutMS: 45000,
  family: 4,
})
  .then(async () => {
    console.log('MongoDB connected');
    await seedDefaultCatalog();
    const server = app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
      verifyEmailTransport();
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
