const mongoose = require('mongoose');
const User = require('../models/User');
const bcrypt = require('bcryptjs');
require('dotenv').config({ path: './config.env' });

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI);

async function createDistributor() {
  try {
    console.log('🌱 Creating default distributor...');
    
    // Check if distributor already exists
    const existingDistributor = await User.findOne({ userType: 'distributor' });
    if (existingDistributor) {
      console.log('✅ Distributor already exists:', existingDistributor.email);
      process.exit(0);
    }
    
    // Hash password
    const hashedPassword = await bcrypt.hash('password123', 12);
    
    // Create distributor
    const distributor = new User({
      firstName: 'Default',
      lastName: 'Distributor',
      email: 'distributor@qwipo.com',
      password: hashedPassword,
      userType: 'distributor',
      phone: '+91-9876543210',
      businessName: 'Qwipo Distributors',
      businessType: 'general',
      address: {
        street: '123 Business Street',
        city: 'Mumbai',
        state: 'Maharashtra',
        zipCode: '400001',
        country: 'India'
      },
      isActive: true,
      isVerified: true
    });
    
    await distributor.save();
    console.log('✅ Default distributor created successfully!');
    console.log('Email: distributor@qwipo.com');
    console.log('Password: password123');
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Error creating distributor:', error);
    process.exit(1);
  }
}

createDistributor();
