const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  username: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ['admin', 'user'], default: 'user' },
  stars: { type: Number, default: 0 },
  review: { type: String, default: '' },
  feedback: { type: String, default: '' },
});

module.exports = mongoose.model('User', userSchema);
