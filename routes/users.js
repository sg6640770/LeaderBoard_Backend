const express = require('express');
const router = express.Router();
const User = require('../models/User');

// Get all users with rankings
router.get('/', async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;
    
    // Get total count for pagination
    const totalUsers = await User.countDocuments();
    
    const users = await User.find().sort({ totalPoints: -1 });
    
    // Update rankings
    users.forEach((user, index) => {
      user.rank = index + 1;
    });
    
    // Save updated rankings
    await Promise.all(users.map(user => user.save()));
    
    // Get paginated results
    const paginatedUsers = users.slice(skip, skip + limit);
    
    res.json({
      users: paginatedUsers,
      pagination: {
        currentPage: page,
        totalPages: Math.ceil(totalUsers / limit),
        totalUsers,
        hasNextPage: page < Math.ceil(totalUsers / limit),
        hasPrevPage: page > 1
      }
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get single user
router.get('/:id', async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Create new user
router.post('/', async (req, res) => {
  try {
    const { name } = req.body;
    
    // Check if user already exists
    const existingUser = await User.findOne({ name: name.trim() });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }
    
    const user = new User({
      name: name.trim(),
      totalPoints: 0,
      avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=random`
    });
    
    const savedUser = await user.save();
    
    // Emit to all clients
    const io = req.app.get('io');
    io.emit('userAdded', savedUser);
    
    res.status(201).json(savedUser);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Update user rankings (internal use)
router.put('/update-rankings', async (req, res) => {
  try {
    const users = await User.find().sort({ totalPoints: -1 });
    
    const updatePromises = users.map((user, index) => {
      user.rank = index + 1;
      return user.save();
    });
    
    await Promise.all(updatePromises);
    
    res.json({ message: 'Rankings updated successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;