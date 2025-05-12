const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const passport = require('passport');
const session = require('express-session');
const Redis = require('redis');
const RedisStore = require('connect-redis').default; // Import the default export
require('dotenv').config();
require('./passport'); // passport strategies

const authRoutes = require('./routes/auth');
const searchRoutes = require('./routes/search');

const app = express();
app.use(express.json());
app.use(cors({ origin: 'http://localhost:3000', credentials: true }));

// ✅ Redis session store configuration
const redisClient = Redis.createClient({
  url: process.env.REDIS_URL || 'redis://localhost:6379', // Use Redis URL or fallback to localhost
});

redisClient.connect().catch((err) => {
  console.error('❌ Failed to connect to Redis:', err.message);
});

// Configure session with RedisStore
app.use(
  session({
    store: new RedisStore({
      client: redisClient, // Pass the Redis client
    }),
    secret: process.env.SESSION_SECRET || 'your_secret_key',
    resave: false,
    saveUninitialized: false,
    cookie: { secure: process.env.NODE_ENV === 'production' },
  })
);

app.use(passport.initialize());
app.use(passport.session());

app.use('/auth', authRoutes);
app.use('/api', searchRoutes);

const PORT = process.env.PORT || 5000;

mongoose
  .connect(process.env.MONGO_URI, {
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