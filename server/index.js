const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const passport = require('passport');
const session = require('express-session');
const Redis = require('redis');
const RedisStore = require('connect-redis')(session);  // Correct import and initialization
require('dotenv').config();
require('./passport');  // passport strategies

const authRoutes = require('./routes/auth');
const searchRoutes = require('./routes/search');

const app = express();
app.use(express.json());
app.use(cors({ origin: 'http://localhost:3000', credentials: true }));

// Redis client configuration
const redisClient = Redis.createClient({
  host: process.env.REDIS_HOST || 'localhost', // Use environment variable or default
  port: process.env.REDIS_PORT || 6379, // Use environment variable or default port
});

// Handle Redis connection errors
redisClient.on('error', (err) => {
  console.error('Redis Client Error', err);
});

// Connect Redis client
redisClient.connect().catch(console.error);

app.use(session({
  store: new RedisStore({ client: redisClient }),
  secret: process.env.SESSION_SECRET || 'your_secret_key',
  resave: false,
  saveUninitialized: false,
  cookie: { 
    secure: process.env.NODE_ENV === 'production',
    httpOnly: true,
    maxAge: 1000 * 60 * 60 * 24 // 24 hours
  }
}));

app.use(passport.initialize());
app.use(passport.session());

app.use('/auth', authRoutes);
app.use('/api', searchRoutes);

const PORT = process.env.PORT || 5000;

mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(() => {
    app.listen(PORT, () => {
      console.log(`✅ Server is running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error('❌ Failed to connect to MongoDB:', err.message);
    process.exit(1);
  });