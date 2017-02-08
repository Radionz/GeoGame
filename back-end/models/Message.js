var MessageSchema = new mongoose.Schema({
  text:  { type : String, required : true },
  userFrom: { type : mongoose.Schema.Types.ObjectId, ref: 'User', required : true },
  userTo: { type : mongoose.Schema.Types.ObjectId, ref: 'User', required : false },
  time: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Message', MessageSchema);
