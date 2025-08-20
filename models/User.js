const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  totalPoints: {
    type: Number,
    default: 0
  },
  rank: {
    type: Number,
    default: 0
  },
  avatar: {
    type: String,
    default: ''
  }
}, {
  timestamps: true
});

// Index for efficient ranking queries
userSchema.index({ totalPoints: -1 });

module.exports = mongoose.model('User', userSchema);