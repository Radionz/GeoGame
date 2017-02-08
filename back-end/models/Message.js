var MessageSchema = new mongoose.Schema({
  text:  { type : String, required : true },
  userFrom: { type : String, required : true },
  userFromName: { type : String, required : false },
  userTo: { type : String, required : false , default: ''},
  time: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Message', MessageSchema);
