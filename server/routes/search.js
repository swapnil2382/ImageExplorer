const router = require('express').Router();
const axios = require('axios');
const Search = require('../models/Search');

const isAuthenticated = (req, res, next) => {
  if (req.user) return next();
  res.status(401).send('Not logged in');
};

// POST /api/search
router.post('/search', isAuthenticated, async (req, res) => {
  const { term } = req.body;
  const userId = req.user._id;
  await Search.create({ term, userId, timestamp: new Date() });

  const response = await axios.get(`https://api.unsplash.com/search/photos`, {
    params: { query: term },
    headers: { Authorization: `Client-ID ${process.env.UNSPLASH_ACCESS_KEY}` }
  });

  res.json(response.data.results);
});

// GET /api/history
router.get('/history', isAuthenticated, async (req, res) => {
  const history = await Search.find({ userId: req.user._id }).sort({ timestamp: -1 });
  res.json(history);
});

// GET /api/top-searches
router.get('/top-searches', async (req, res) => {
  const topTerms = await Search.aggregate([
    { $group: { _id: "$term", count: { $sum: 1 } } },
    { $sort: { count: -1 } },
    { $limit: 5 }
  ]);
  res.json(topTerms);
});

module.exports = router;
