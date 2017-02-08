var ScoreBoardSchema = new mongoose.Schema({
  userId: { type : String, required : true, index: {unique: true} },
  score: { type : Number, default: 0 },
  questionsAnswered: [String]
});
var GameSchema = new mongoose.Schema({
    name: { type : String, required : true, index: {unique: true} },
    questions: [String],
    scoreBoard: [ScoreBoardSchema],
    duration: { type : Number, default: 90 },
    playerNb: { type : Number, default: 5 },
    status: { type : String, default : 'NOT_STARTED' },
    started_at: { type: Date },
    updated_at: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Game', GameSchema);
