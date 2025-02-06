const mongoose = require('mongoose');

const mcqQuestionSchema = new mongoose.Schema({
  question: {
    type: String,
    required: true,
  },
  options: {
    type: [String],
    required: true,
    validate: [(val) => val.length === 4, 'There should be exactly 4 options.'],
  },
  correctAnswer: {
    type: String,
    required: true,
  }
}, { timestamps: true });

const MCQQuestion = mongoose.model('MCQQuestion', mcqQuestionSchema);
module.exports = MCQQuestion;
