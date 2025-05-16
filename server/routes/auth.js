const router = require('express').Router();
const passport = require('passport');
const jwt = require('jsonwebtoken');
const User = require('../models/User'); // Adjust path to your User model

const CLIENT_HOME_URL = process.env.CLIENT_HOME_URL || 'https://image-explorer-tau.vercel.app';

// Start Google OAuth flow
router.get('/google', passport.authenticate('google', { scope: ['profile'], session: false }));

// Google OAuth callback
router.get(
  '/google/callback',
  passport.authenticate('google', { session: false, failureRedirect: `${CLIENT_HOME_URL}/login/failed` }),
  (req, res) => {
    // Generate JWT
    const token = jwt.sign(
      { id: req.user._id, name: req.user.name },
      process.env.JWT_SECRET || 'your_jwt_secret',
      { expiresIn: '1h' }
    );
    // Redirect to client with token as query parameter
    res.redirect(`${CLIENT_HOME_URL}/?token=${token}`);
  }
);

// Logout (client clears localStorage)
router.get('/logout', (req, res) => {
  res.status(200).json({ message: 'Logged out' });
});

// Get current user (protected route)
router.get('/user', (req, res, next) => {
  const token = req.headers['authorization']?.split(' ')[1]; // Expect 'Bearer <token>'
  if (!token) {
    return res.status(401).json({ message: 'No token provided' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your_jwt_secret');
    User.findById(decoded.id)
      .then((user) => {
        if (!user) {
          return res.status(404).json({ message: 'User not found' });
        }
        res.json({ id: user._id, name: user.name });
      })
      .catch((err) => next(err));
  } catch (err) {
    return res.status(401).json({ message: 'Invalid token' });
  }
});

module.exports = router;