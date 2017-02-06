// Load mongoose package
var mongoose = require('mongoose');

var SimpleQuestionSchema = new mongoose.Schema({
    name: { type : String, required : true, index: {unique: true} },
    question: String,
    radius: { type: Number, default: '10' },
    answer: String,
    nb_point: Number,
    loc: {
        type: { type: String, default: 'Point' },
        coordinates: [Number]
    },
    updated_at: { type: Date, default: Date.now }
});

SimpleQuestionSchema.index({loc:'2dsphere'});

module.exports = mongoose.model('SimpleQuestion', SimpleQuestionSchema);
