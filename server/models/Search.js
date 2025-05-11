const mongoose = require('mongoose');

const SearchSchema = new mongoose.Schema({
  userId: mongoose.Types.ObjectId,
  term: String,
  timestamp: Date
});

module.exports = mongoose.model('Search', SearchSchema);
