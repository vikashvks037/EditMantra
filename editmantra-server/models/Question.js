const mongoose = require('mongoose');

const questionSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  difficulty: { type: String, enum: ['Easy', 'Medium', 'Hard'], required: true },
  testCases: { 
    type: [{ 
      input: mongoose.Schema.Types.Mixed, 
      expectedOutput: mongoose.Schema.Types.Mixed 
    }], 
    default: []  // Ensure testCases is always an array
  },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Question', questionSchema);
