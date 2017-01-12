

var GameSchema = new mongoose.Schema({
    name: String,
    questions: [{type: mongoose.Schema.Types.ObjectId, ref: 'SimpleQuestion'}],
    scoreBoard: [{name: String, score: Number}],
    duration: Number,
    status: String,
    started_at: { type: Date },
    updated_at: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Game', GameSchema);
