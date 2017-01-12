// Load mongoose package
var mongoose = require('mongoose');
// Connect to MongoDB and create/use database called todoAppTest
mongoose.connect('mongodb://localhost/impleQuestionTest');
// Create a schema
var SimpleQuestionSchema = new mongoose.Schema({
  name: String,
  question: String,
  answer: String,
  nb_point: Number,
  updated_at: { type: Date, default: Date.now },
});
// Create a model based on the schema
var SimpleQuestion = mongoose.model('SimpleQuestion', SimpleQuestionSchema);

// Create a question in memory
var question = new SimpleQuestion({name: "Première Question", question: "Quel est la taille du zizi de manuel ?", answer: "10 centimètres", nb_point = 10});
// Save it to database
question.save(function(err){
  if(err)
    console.log(err);
  else
    console.log(question);
});
