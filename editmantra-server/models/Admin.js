const mongoose = require('mongoose');

const adminSchema = new mongoose.Schema({
  name: { type: String, required: true },
  username: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  key: { type: String, default: '' },
  role: { 
    type: String, 
    required: true, 
    enum: ['admin'],  // Only admins can have the 'admin' role
    default: 'admin'  // Default to 'admin' for admins
  },
});

const Admin = mongoose.model('Admin', adminSchema);

module.exports = Admin;
