var ChatRoom = new mongoose.Schema({
  name:  { type : String, required : true },
  messages: [{ type : mongoose.Schema.Types.ObjectId, ref: 'Message', required : true }],
  users: { type: [String]}
});

module.exports = mongoose.model('ChatRoom', ChatRoom);
