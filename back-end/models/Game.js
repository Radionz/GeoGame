var GameSchema = new mongoose.Schema({
    name: { type : String, required : true, index: {unique: true} },
    questions: [String],
    scoreBoard: [{ type : mongoose.Schema.Types.ObjectId, ref: 'ScoreBoard'}],
    duration: { type : Number, default: 90 },
    playerNb: { type : Number, default: 5 },
    status: { type : String, default : 'NOT_STARTED' },
    started_at: { type: Date },
    updated_at: { type: Date, default: function(){return new Date().getTime()} }
});

module.exports = mongoose.model('Game', GameSchema);
