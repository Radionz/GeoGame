// Load mongoose package
var mongoose = require('mongoose');

var SimpleQuestionSchema = new mongoose.Schema({
  name: String,
  question: String,
  answer: String,
  nb_point: Number,
  updated_at: { type: Date, default: Date.now },
});

module.exports = mongoose.model('SimpleQuestion', SimpleQuestionSchema);
