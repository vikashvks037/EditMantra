const mongoose = require('mongoose');

const ExecutionSchema = new mongoose.Schema({
  code: { type: String, required: true },
  lang: { type: String, required: true },
  input: { type: String },
  output: { type: String },
  stderr: { type: String },
  status: { type: String, default: 'completed' },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Execution', ExecutionSchema);
