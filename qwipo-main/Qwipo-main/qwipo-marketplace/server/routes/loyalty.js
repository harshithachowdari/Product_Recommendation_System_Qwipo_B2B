const express = require('express');
const { body, validationResult } = require('express-validator');
const User = require('../models/User');
const LoyaltyTransaction = require('../models/LoyaltyTransaction');
const { auth } = require('../middleware/auth');

const router = express.Router();

// @route   GET /api/loyalty/dashboard
// @desc    Get loyalty dashboard data
// @access  Private
router.get('/dashboard', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    
    // Get recent transactions
    const transactions = await LoyaltyTransaction.find({ userId: req.user._id })
      .sort({ createdAt: -1 })
      .limit(10);

    // Get tier benefits
    const tierBenefits = {
      bronze: {
        name: 'Bronze',
        minPoints: 0,
        benefits: ['Basic support', 'Standard delivery'],
        nextTier: 'Silver',
        pointsNeeded: 2000 - user.loyaltyPoints
      },
      silver: {
        name: 'Silver',
        minPoints: 2000,
        benefits: ['Priority support', 'Free delivery', '5% discount'],
        nextTier: 'Gold',
        pointsNeeded: 5000 - user.loyaltyPoints
      },
      gold: {
        name: 'Gold',
        minPoints: 5000,
        benefits: ['VIP support', 'Free delivery', '10% discount', 'Early access'],
        nextTier: 'Platinum',
        pointsNeeded: 10000 - user.loyaltyPoints
      },
      platinum: {
        name: 'Platinum',
        minPoints: 10000,
        benefits: ['Dedicated manager', 'Free delivery', '15% discount', 'Exclusive products'],
        nextTier: null,
        pointsNeeded: 0
      }
    };

    const currentTier = tierBenefits[user.loyaltyTier];

    res.json({
      success: true,
      data: {
        loyaltyPoints: user.loyaltyPoints,
        loyaltyTier: user.loyaltyTier,
        currentTier,
        transactions,
        stats: {
          totalEarned: await LoyaltyTransaction.aggregate([
            { $match: { userId: user._id, type: 'earned' } },
            { $group: { _id: null, total: { $sum: '$points' } } }
          ]).then(result => result[0]?.total || 0),
          totalRedeemed: await LoyaltyTransaction.aggregate([
            { $match: { userId: user._id, type: 'redeemed' } },
            { $group: { _id: null, total: { $sum: '$points' } } }
          ]).then(result => result[0]?.total || 0)
        }
      }
    });
  } catch (error) {
    console.error('Get loyalty dashboard error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// @route   GET /api/loyalty/transactions
// @desc    Get loyalty transactions
// @access  Private
router.get('/transactions', auth, async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const skip = (page - 1) * limit;

    const filter = { userId: req.user._id };
    if (req.query.type) filter.type = req.query.type;

    const transactions = await LoyaltyTransaction.find(filter)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const total = await LoyaltyTransaction.countDocuments(filter);

    res.json({
      success: true,
      data: {
        transactions,
        pagination: {
          current: page,
          pages: Math.ceil(total / limit),
          total
        }
      }
    });
  } catch (error) {
    console.error('Get loyalty transactions error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// @route   POST /api/loyalty/earn
// @desc    Earn loyalty points
// @access  Private
router.post('/earn', auth, [
  body('points').isInt({ min: 1 }).withMessage('Points must be a positive integer'),
  body('reason').trim().notEmpty().withMessage('Reason is required'),
  body('orderId').optional().isMongoId().withMessage('Invalid order ID')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    const { points, reason, orderId } = req.body;

    // Add points to user
    await req.user.addLoyaltyPoints(points, reason);

    // Emit real-time update
    req.io.to(`user_${req.user._id}`).emit('loyalty_points_updated', {
      points: req.user.loyaltyPoints,
      tier: req.user.loyaltyTier
    });

    res.json({
      success: true,
      message: 'Loyalty points earned successfully',
      data: {
        pointsEarned: points,
        totalPoints: req.user.loyaltyPoints,
        tier: req.user.loyaltyTier
      }
    });
  } catch (error) {
    console.error('Earn loyalty points error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// @route   POST /api/loyalty/redeem
// @desc    Redeem loyalty points
// @access  Private
router.post('/redeem', auth, [
  body('points').isInt({ min: 1 }).withMessage('Points must be a positive integer'),
  body('reason').trim().notEmpty().withMessage('Reason is required')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    const { points, reason } = req.body;

    // Check if user has enough points
    if (req.user.loyaltyPoints < points) {
      return res.status(400).json({
        success: false,
        message: 'Insufficient loyalty points'
      });
    }

    // Deduct points
    req.user.loyaltyPoints -= points;
    await req.user.updateLoyaltyTier();

    // Create transaction record
    await LoyaltyTransaction.create({
      userId: req.user._id,
      points: -points,
      type: 'redeemed',
      reason,
      balance: req.user.loyaltyPoints
    });

    // Emit real-time update
    req.io.to(`user_${req.user._id}`).emit('loyalty_points_updated', {
      points: req.user.loyaltyPoints,
      tier: req.user.loyaltyTier
    });

    res.json({
      success: true,
      message: 'Loyalty points redeemed successfully',
      data: {
        pointsRedeemed: points,
        totalPoints: req.user.loyaltyPoints,
        tier: req.user.loyaltyTier
      }
    });
  } catch (error) {
    console.error('Redeem loyalty points error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// @route   GET /api/loyalty/rewards
// @desc    Get available rewards
// @access  Private
router.get('/rewards', auth, async (req, res) => {
  try {
    const rewards = [
      {
        id: 'discount_5',
        name: '5% Discount',
        description: 'Get 5% off on your next order',
        pointsRequired: 500,
        type: 'discount',
        value: 5,
        available: req.user.loyaltyPoints >= 500
      },
      {
        id: 'discount_10',
        name: '10% Discount',
        description: 'Get 10% off on your next order',
        pointsRequired: 1000,
        type: 'discount',
        value: 10,
        available: req.user.loyaltyPoints >= 1000
      },
      {
        id: 'free_delivery',
        name: 'Free Delivery',
        description: 'Free delivery on your next order',
        pointsRequired: 200,
        type: 'free_delivery',
        value: 0,
        available: req.user.loyaltyPoints >= 200
      },
      {
        id: 'exclusive_access',
        name: 'Exclusive Product Access',
        description: 'Early access to new products',
        pointsRequired: 2000,
        type: 'exclusive_access',
        value: 0,
        available: req.user.loyaltyPoints >= 2000
      }
    ];

    res.json({
      success: true,
      data: {
        rewards,
        currentPoints: req.user.loyaltyPoints
      }
    });
  } catch (error) {
    console.error('Get rewards error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// @route   GET /api/loyalty/leaderboard
// @desc    Get loyalty leaderboard
// @access  Public
router.get('/leaderboard', async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 10;

    const leaderboard = await User.aggregate([
      { $match: { isActive: true } },
      { $project: { 
        firstName: 1, 
        lastName: 1, 
        businessName: 1, 
        loyaltyPoints: 1, 
        loyaltyTier: 1 
      }},
      { $sort: { loyaltyPoints: -1 } },
      { $limit: limit }
    ]);

    res.json({
      success: true,
      data: {
        leaderboard
      }
    });
  } catch (error) {
    console.error('Get leaderboard error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

module.exports = router;
