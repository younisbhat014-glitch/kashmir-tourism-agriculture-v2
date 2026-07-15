const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dns = require('dns');
const seedDefaultCatalog = require('./services/seedDefaultCatalog');
const { verifyEmailTransport } = require('./services/confirmationEmail');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;
const MONGO_RETRY_MS = Number(process.env.MONGO_RETRY_MS || 15000);
let databaseStatus = 'starting';
let databaseError = null;
let hasSeededCatalog = false;

const getMongoUri = () => String(
  process.env.MONGODB_URI
    || process.env.MONGO_URL
    || process.env.MONGO_PUBLIC_URL
    || ''
).trim();

const hasMongoDatabaseName = (uri) => /^mongodb(?:\+srv)?:\/\/[^/]+\/[^/?]+/.test(uri);

const mongoUri = getMongoUri();
const missingEnv = [
  !mongoUri ? 'MONGODB_URI or MONGO_URL' : null,
  !process.env.JWT_SECRET ? 'JWT_SECRET' : null,
].filter(Boolean);

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

const formatMongoError = (err) => {
  if (!err) return 'Unknown MongoDB error';

  if (err.codeName === 'AuthenticationFailed' || err.code === 18) {
    return 'MongoDB authentication failed. Check MONGODB_URI/MONGO_URL username, password, auth database, and database-user permissions.';
  }

  return err.message || String(err);
};

const scheduleMongoReconnect = (err) => {
  databaseStatus = 'disconnected';
  databaseError = formatMongoError(err);
  console.error(`MongoDB error: ${databaseError}`);

  if (err && (err.codeName === 'AuthenticationFailed' || err.code === 18)) {
    console.error('Backend is still running for health checks. Update MONGODB_URI/MONGO_URL in the deployment environment, then restart the backend.');
    return;
  }

  setTimeout(connectMongo, MONGO_RETRY_MS).unref();
};

async function connectMongo() {
  if (mongoose.connection.readyState === 1 || mongoose.connection.readyState === 2) {
    return;
  }

  databaseStatus = 'connecting';
  databaseError = null;

  try {
    const connectOptions = {
      serverSelectionTimeoutMS: 30000,
      socketTimeoutMS: 45000,
      family: 4,
    };

    if (!hasMongoDatabaseName(mongoUri) && process.env.MONGODB_DB_NAME) {
      connectOptions.dbName = process.env.MONGODB_DB_NAME;
    }

    await mongoose.connect(mongoUri, connectOptions);

    databaseStatus = 'connected';
    databaseError = null;
    console.log('MongoDB connected');

    if (!hasSeededCatalog) {
      hasSeededCatalog = true;
      await seedDefaultCatalog();
    }
  } catch (err) {
    scheduleMongoReconnect(err);
  }
}

mongoose.connection.on('disconnected', () => {
  if (databaseStatus !== 'starting') {
    databaseStatus = 'disconnected';
  }
});

mongoose.connection.on('error', (err) => {
  databaseError = formatMongoError(err);
});

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

app.get('/', (req, res) => {
  res.json({ message: 'Kashmir Portal Backend Running!' });
});

app.get('/health', (req, res) => {
  const connected = mongoose.connection.readyState === 1;
  res.status(connected ? 200 : 503).json({
    status: connected ? 'ok' : 'degraded',
    database: connected ? 'connected' : databaseStatus,
    databaseError,
  });
});

app.use('/api', (req, res, next) => {
  if (mongoose.connection.readyState === 1) {
    next();
    return;
  }

  res.status(503).json({
    message: 'Database is not connected. Please try again shortly.',
    database: databaseStatus,
  });
});

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
app.use('/api/chat', require('./routes/chat'));

const server = app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  verifyEmailTransport();
  connectMongo();
});

server.on('error', (err) => {
  if (err.code === 'EADDRINUSE') {
    console.error(`Port ${PORT} is already in use. Stop the existing backend or set a different PORT in .env.`);
    process.exit(1);
  }

  throw err;
});
