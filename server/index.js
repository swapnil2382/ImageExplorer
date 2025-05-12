const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const passport = require('passport');
const session = require('express-session');
require('dotenv').config(); // Load environment variables
require('./passport'); // Passport strategies file

const authRoutes = require('./routes/auth');
const searchRoutes = require('./routes/search');

// Create express app
const app = express();

// Middleware
app.use(express.json());
app.use(cors({ origin: 'http://localhost:3000', credentials: true }));

// Use express-session
app.use(session({
  secret: process.env.SESSION_SECRET || 'your_secret_key', // Use secret from .env or fallback
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: process.env.NODE_ENV === 'production', // Use secure cookies in production (ensure you use HTTPS in production)
    httpOnly: true, // Helps prevent XSS attacks
    maxAge: 24 * 60 * 60 * 1000, // 1 day expiry time for session
  },
}));

// Initialize passport
app.use(passport.initialize());
app.use(passport.session());

// Routes
app.use('/auth', authRoutes);
app.use('/api', searchRoutes);

// MongoDB Connection
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
    process.exit(1); // Optional: Exit process if DB connection fails
  });
