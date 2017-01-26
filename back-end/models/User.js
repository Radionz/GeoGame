var UserSchema = new mongoose.Schema({
  name:  { type : String, required : true },
  email: { type : String, required : true, index: {unique: true} },
  password: { type : String, required : true },
  updated_at: { type: Date, default: Date.now }
});

module.exports = mongoose.model('User', UserSchema);
