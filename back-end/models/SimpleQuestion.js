// Load mongoose package
var mongoose = require('mongoose');

var SimpleQuestionSchema = new mongoose.Schema({
    name: String,
    question: String,
    answer: String,
    nb_point: Number,
    location: {
        type: [Number],  // [<longitude>, <latitude>]
        index: '2d'      // create the geospatial index
    },
    updated_at: { type: Date, default: Date.now }
});

module.exports = mongoose.model('SimpleQuestion', SimpleQuestionSchema);
