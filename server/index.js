const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const passport = require('passport');
const session = require('express-session'); // ⬅️ use this instead
require('dotenv').config();
require('./passport'); // passport strategies

const authRoutes = require('./routes/auth');
const searchRoutes = require('./routes/search');

const app = express();
app.use(express.json());
app.use(cors({ origin: 'http://localhost:3000', credentials: true }));

// ✅ Add express-session
app.use(session({
  secret: 'your_secret_key', // replace with a strong key in production
  resave: false,
  saveUninitialized: false,
}));

app.use(passport.initialize());
app.use(passport.session());

app.use('/auth', authRoutes);
app.use('/api', searchRoutes);


mongoose.connect(process.env.MONGO_URI)
  .then(() => app.listen(5000, () => console.log('Server running on port 5000')))
  .catch(err => console.log(err));
