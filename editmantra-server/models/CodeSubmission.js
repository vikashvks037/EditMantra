const mongoose = require('mongoose');

const CodeSubmissionSchema = new mongoose.Schema({
  code: { type: String, required: true },
  lang: { type: String, required: true },
  input: { type: String },
  output: { type: String },
  error: { type: String },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('CodeSubmission', CodeSubmissionSchema);
