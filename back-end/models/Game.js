var ScoreBoardSchema = new mongoose.Schema({
  user: { type : mongoose.Schema.Types.ObjectId, ref: 'User', required : true},
  score: { type : Number, default: 0 },
  questionsAnswered: [String]
});
var GameSchema = new mongoose.Schema({
    name: { type : String, required : true, index: {unique: true} },
    questions: [String],
    scoreBoard: [{ type : mongoose.Schema.Types.ObjectId, ref: 'ScoreBoard'}],
    duration: { type : Number, default: 90 },
    playerNb: { type : Number, default: 5 },
    status: { type : String, default : 'NOT_STARTED' },
    started_at: { type: Date },
    updated_at: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Game', GameSchema);
module.exports = mongoose.model('ScoreBoard', ScoreBoardSchema);
