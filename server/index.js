const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const passport = require('passport');
const session = require('express-session');
const RedisStore = require('connect-redis')(session);  // Add Redis session store
const redis = require('redis');  // Redis client
require('dotenv').config();
require('./passport');  // passport strategies

const authRoutes = require('./routes/auth');
const searchRoutes = require('./routes/search');

const app = express();
app.use(express.json());
app.use(cors({ origin: 'http://localhost:3000', credentials: true }));

// ✅ Redis session store configuration
const redisClient = redis.createClient({
  host: 'localhost', // Update with your Redis server details (or managed service)
  port: 6379, // Default Redis port
});

app.use(session({
  store: new RedisStore({ client: redisClient }),  // Use Redis to store sessions
  secret: process.env.SESSION_SECRET || 'your_secret_key',  // Use environment variable for security
  resave: false,
  saveUninitialized: false,
  cookie: { secure: process.env.NODE_ENV === 'production' },  // Set secure cookies in production
}));

app.use(passport.initialize());
app.use(passport.session());

app.use('/auth', authRoutes);
app.use('/api', searchRoutes);

const PORT = process.env.PORT || 5000;

// Updated MongoDB connection without deprecated options
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,  // Remove deprecated options
  useUnifiedTopology: true,
})
  .then(() => {
    app.listen(PORT, () => {
      console.log(`✅ Server is running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error('❌ Failed to connect to MongoDB:', err.message);
    process.exit(1); // Exit if connection fails
  });
