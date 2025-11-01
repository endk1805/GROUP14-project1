const mongoose = require('mongoose');

// Define the schema ONCE, including all fields
const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true, // Ensure email is unique
    lowercase: true, // Store email consistently
  },
  password: {
    type: String,
    required: true,
    select: false // Hide password by default in query results
  },
  role: {
    type: String,
    enum: ['User', 'Admin'], // Allowed roles
    default: 'User', // Default role
  },
  avatar: { // Avatar field
    type: String,
    default: null // Or a default URL string
  },
  // Password reset fields
  resetPasswordToken: String,
  resetPasswordExpires: Date,

}, { timestamps: true }); // Add createdAt and updatedAt timestamps

module.exports = mongoose.model('User', userSchema);