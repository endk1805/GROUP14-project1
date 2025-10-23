// backend/models/User.js
const mongoose = require('mongoose');

const userSchema = new mongoose.Schema(
  {
    name:  { type: String, required: true, trim: true },
    email: { 
      type: String, required: true, unique: true, trim: true,
      match: [/^\S+@\S+\.\S+$/, 'Invalid email']
    }
  },
  { timestamps: true }
);

// ✅ Export MẶC ĐỊNH một Model
module.exports = mongoose.model('User', userSchema);
