const express = require('express');
const router = express.Router();
const User = require('../models/User');
const PointHistory = require('../models/PointHistory');

// Claim points for a user
router.post('/claim', async (req, res) => {
  try {
    const { userId } = req.body;
    
    if (!userId) {
      return res.status(400).json({ message: 'User ID is required' });
    }
    
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    // Generate random points (1-10)
    const pointsAwarded = Math.floor(Math.random() * 10) + 1;
    const previousTotal = user.totalPoints;
    const newTotal = previousTotal + pointsAwarded;
    
    // Update user points
    user.totalPoints = newTotal;
    await user.save();
    
    // Create history record
    const historyRecord = new PointHistory({
      userId: user._id,
      userName: user.name,
      pointsAwarded,
      previousTotal,
      newTotal,
      claimedAt: new Date()
    });
    
    await historyRecord.save();
    
    // Update all user rankings
    const allUsers = await User.find().sort({ totalPoints: -1 });
    const updatePromises = allUsers.map((u, index) => {
      u.rank = index + 1;
      return u.save();
    });
    await Promise.all(updatePromises);
    
    // Get updated rankings
    const updatedUsers = await User.find().sort({ totalPoints: -1 });
    
    // Emit real-time updates
    const io = req.app.get('io');
    io.emit('pointsClaimed', {
      user: user.name,
      points: pointsAwarded,
      newTotal,
      leaderboard: updatedUsers
    });
    
    res.json({
      message: 'Points claimed successfully',
      pointsAwarded,
      user: {
        id: user._id,
        name: user.name,
        totalPoints: newTotal,
        rank: user.rank
      },
      leaderboard: updatedUsers
    });
    
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get point history
router.get('/history', async (req, res) => {
  try {
    const { userId } = req.query;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;
    
    let query = {};
    if (userId) {
      query.userId = userId;
    }
    
    // Get total count for pagination
    const totalRecords = await PointHistory.countDocuments(query);
    
    const history = await PointHistory.find(query)
      .sort({ claimedAt: -1 })
      .skip(skip)
      .limit(limit)
      .populate('userId', 'name avatar');
    
    res.json({
      history,
      pagination: {
        currentPage: page,
        totalPages: Math.ceil(totalRecords / limit),
        totalRecords,
        hasNextPage: page < Math.ceil(totalRecords / limit),
        hasPrevPage: page > 1
      }
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get user's point history
router.get('/history/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    const { limit = 20 } = req.query;
    
    const history = await PointHistory.find({ userId })
      .sort({ claimedAt: -1 })
      .limit(parseInt(limit));
    
    res.json(history);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;