const mongoose = require('mongoose');
const User = require('../models/User');
require('dotenv').config();

const seedUsers = [
  { name: 'Rahul', totalPoints: 0 },
  { name: 'Kamal', totalPoints: 0 },
  { name: 'Sanak', totalPoints: 0 },
  { name: 'Priya', totalPoints: 0 },
  { name: 'Amit', totalPoints: 0 },
  { name: 'Sneha', totalPoints: 0 },
  { name: 'Vikash', totalPoints: 0 },
  { name: 'Ravi', totalPoints: 0 },
  { name: 'Anita', totalPoints: 0 },
  { name: 'Suresh', totalPoints: 0 }
];

function getRandomColor() {
  const letters = '0123456789ABCDEF';
  let color = '';
  for (let i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)];
  }
  return color;
}

async function seedDatabase() {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('✅ Connected to MongoDB');
    
    // Clear existing users
    await User.deleteMany({});
    console.log('🧹 Cleared existing users');
    
    // Create users with avatars
    const usersWithAvatars = seedUsers.map(user => ({
      ...user,
      avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(user.name)}&background=${getRandomColor()}&color=fff`
    }));
    
    // Insert seed users
    const createdUsers = await User.insertMany(usersWithAvatars);
    console.log(`👥 Created ${createdUsers.length} users`);
    
    // Update rankings
    const users = await User.find().sort({ totalPoints: -1 });
    const updatePromises = users.map((user, index) => {
      user.rank = index + 1;
      return user.save();
    });
    await Promise.all(updatePromises);
    
    console.log('🏆 Rankings updated');
    console.log('Created users:', createdUsers.map(u => ({ name: u.name, points: u.totalPoints })));
    
  } catch (error) {
    console.error('❌ Error seeding database:', error);
  } finally {
    if (mongoose.connection.readyState === 1) {
      await mongoose.connection.close();
      console.log('🔒 Database connection closed');
    }
  }
}

seedDatabase();
