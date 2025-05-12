const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const passport = require('passport');
const session = require('express-session');
const Redis = require('redis');
const connectRedis = require('connect-redis');  // Import connect-redis
require('dotenv').config();
require('./passport');  // passport strategies

const authRoutes = require('./routes/auth');
const searchRoutes = require('./routes/search');

const app = express();
app.use(express.json());
app.use(cors({ origin: 'http://localhost:3000', credentials: true }));

// ✅ Redis session store configuration
const redisClient = Redis.createClient({
  host: 'localhost', // Use your Redis host
  port: 6379, // Default Redis port
});

const RedisStore = connectRedis(session);  // Get RedisStore constructor from connect-redis

app.use(session({
  store: new RedisStore({
    client: redisClient,  // Use the Redis client
  }),
  secret: process.env.SESSION_SECRET || 'your_secret_key',  // Make sure to use environment variables
  resave: false,
  saveUninitialized: false,
  cookie: { secure: process.env.NODE_ENV === 'production' },  // Secure cookies for production
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
