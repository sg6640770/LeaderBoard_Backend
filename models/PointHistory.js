const mongoose = require('mongoose');

const pointHistorySchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  userName: {
    type: String,
    required: true
  },
  pointsAwarded: {
    type: Number,
    required: true,
    min: 1,
    max: 10
  },
  previousTotal: {
    type: Number,
    required: true
  },
  newTotal: {
    type: Number,
    required: true
  },
  claimedAt: {
    type: Date,
    default: Date.now
  }
});

// Index for efficient queries
pointHistorySchema.index({ userId: 1, claimedAt: -1 });
pointHistorySchema.index({ claimedAt: -1 });

module.exports = mongoose.model('PointHistory', pointHistorySchema);