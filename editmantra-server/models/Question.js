const mongoose = require('mongoose');

const questionSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  difficulty: {
    type: String,
    enum: ['Easy', 'Medium', 'Hard'],
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const Question = mongoose.model('Question', questionSchema);

module.exports = Question;
