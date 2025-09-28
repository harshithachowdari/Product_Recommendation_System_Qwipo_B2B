const express = require('express');
const mongoose = require('mongoose');
const router = express.Router();
const UserBehavior = require('../models/UserBehavior');
const PurchasePattern = require('../models/PurchasePattern');
const Personalization = require('../models/Personalization');
const { auth } = require('../middleware/auth');

// Get user behavior analytics
router.get('/user-behavior/:userId', auth, async (req, res) => {
  try {
    const { userId } = req.params;
    const { startDate, endDate } = req.query;
    
    const start = startDate ? new Date(startDate) : new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
    const end = endDate ? new Date(endDate) : new Date();
    
    const analytics = await UserBehavior.getUserAnalytics(userId, start, end);
    
    res.json({
      success: true,
      data: analytics
    });
  } catch (error) {
    console.error('Error fetching user behavior analytics:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch user behavior analytics'
    });
  }
});

// Get search analytics
router.get('/search-analytics', auth, async (req, res) => {
  try {
    const { startDate, endDate } = req.query;
    
    const start = startDate ? new Date(startDate) : new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
    const end = endDate ? new Date(endDate) : new Date();
    
    const analytics = await UserBehavior.getSearchAnalytics(start, end);
    
    res.json({
      success: true,
      data: analytics
    });
  } catch (error) {
    console.error('Error fetching search analytics:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch search analytics'
    });
  }
});

// Get product interaction analytics
router.get('/product-analytics', auth, async (req, res) => {
  try {
    const { startDate, endDate } = req.query;
    
    const start = startDate ? new Date(startDate) : new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
    const end = endDate ? new Date(endDate) : new Date();
    
    const analytics = await UserBehavior.getProductAnalytics(start, end);
    
    res.json({
      success: true,
      data: analytics
    });
  } catch (error) {
    console.error('Error fetching product analytics:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch product analytics'
    });
  }
});

// Get category preferences
router.get('/category-preferences/:userId', auth, async (req, res) => {
  try {
    const { userId } = req.params;
    const { startDate, endDate } = req.query;
    
    const start = startDate ? new Date(startDate) : new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
    const end = endDate ? new Date(endDate) : new Date();
    
    const preferences = await UserBehavior.getCategoryPreferences(userId, start, end);
    
    res.json({
      success: true,
      data: preferences
    });
  } catch (error) {
    console.error('Error fetching category preferences:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch category preferences'
    });
  }
});

// Get seasonal trends
router.get('/seasonal-trends', auth, async (req, res) => {
  try {
    const { startDate, endDate } = req.query;
    
    const start = startDate ? new Date(startDate) : new Date(Date.now() - 365 * 24 * 60 * 60 * 1000);
    const end = endDate ? new Date(endDate) : new Date();
    
    const trends = await UserBehavior.getSeasonalTrends(start, end);
    
    res.json({
      success: true,
      data: trends
    });
  } catch (error) {
    console.error('Error fetching seasonal trends:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch seasonal trends'
    });
  }
});

// Get purchase pattern analytics
router.get('/purchase-patterns', auth, async (req, res) => {
  try {
    const { startDate, endDate } = req.query;
    
    const start = startDate ? new Date(startDate) : new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
    const end = endDate ? new Date(endDate) : new Date();
    
    const [seasonalDemand, festivalTrends, repeatPatterns, timePatterns] = await Promise.all([
      PurchasePattern.getSeasonalDemand(start, end),
      PurchasePattern.getFestivalTrends(start, end),
      PurchasePattern.getRepeatOrderPatterns(start, end),
      PurchasePattern.getTimeBasedPatterns(start, end)
    ]);
    
    res.json({
      success: true,
      data: {
        seasonalDemand,
        festivalTrends,
        repeatPatterns,
        timePatterns
      }
    });
  } catch (error) {
    console.error('Error fetching purchase patterns:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch purchase patterns'
    });
  }
});

// Get user category preferences from purchase patterns
router.get('/user-category-preferences/:userId', auth, async (req, res) => {
  try {
    const { userId } = req.params;
    const { startDate, endDate } = req.query;
    
    const start = startDate ? new Date(startDate) : new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
    const end = endDate ? new Date(endDate) : new Date();
    
    const preferences = await PurchasePattern.getUserCategoryPreferences(userId, start, end);
    
    res.json({
      success: true,
      data: preferences
    });
  } catch (error) {
    console.error('Error fetching user category preferences:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch user category preferences'
    });
  }
});

// Track user behavior
router.post('/track-behavior', auth, async (req, res) => {
  try {
    const { sessionId, behaviorType, data } = req.body;
    const userId = req.user.id;
    
    const aiService = require('../services/aiService');
    const behavior = await aiService.trackUserBehavior(userId, sessionId, behaviorType, data);
    
    res.json({
      success: true,
      data: behavior
    });
  } catch (error) {
    console.error('Error tracking user behavior:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to track user behavior'
    });
  }
});

// Get trending products
router.get('/trending-products', auth, async (req, res) => {
  try {
    const { category, limit = 20 } = req.query;
    
    const aiService = require('../services/aiService');
    const trending = await aiService.getTrendingProducts(parseInt(limit));
    
    res.json({
      success: true,
      data: trending
    });
  } catch (error) {
    console.error('Error fetching trending products:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch trending products'
    });
  }
});

// Get dashboard analytics summary
router.get('/dashboard-summary', auth, async (req, res) => {
  try {
    const userId = req.user.id;
    const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
    const now = new Date();
    
    const [
      userAnalytics,
      searchAnalytics,
      productAnalytics,
      categoryPreferences,
      trendingProducts
    ] = await Promise.all([
      UserBehavior.getUserAnalytics(userId, thirtyDaysAgo, now),
      UserBehavior.getSearchAnalytics(thirtyDaysAgo, now),
      UserBehavior.getProductAnalytics(thirtyDaysAgo, now),
      UserBehavior.getCategoryPreferences(userId, thirtyDaysAgo, now),
      require('../services/aiService').getTrendingProducts(10)
    ]);
    
    res.json({
      success: true,
      data: {
        userAnalytics,
        searchAnalytics: searchAnalytics.slice(0, 10),
        productAnalytics: productAnalytics.slice(0, 10),
        categoryPreferences,
        trendingProducts
      }
    });
  } catch (error) {
    console.error('Error fetching dashboard summary:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch dashboard summary'
    });
  }
});

// Get location-based product analytics
router.get('/location-analytics', auth, async (req, res) => {
  try {
    const { startDate, endDate } = req.query;
    
    const start = startDate ? new Date(startDate) : new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
    const end = endDate ? new Date(endDate) : new Date();
    
    // Get location-based purchase patterns
    const pipeline = [
      {
        $match: {
          behaviorType: 'purchase',
          timestamp: { $gte: start, $lte: end },
          'location.city': { $exists: true }
        }
      },
      {
        $group: {
          _id: {
            city: '$location.city',
            state: '$location.state',
            productId: '$productId'
          },
          totalSales: { $sum: { $multiply: ['$productDetails.price', '$productDetails.quantity'] } },
          totalOrders: { $sum: 1 },
          avgOrderValue: { $avg: { $multiply: ['$productDetails.price', '$productDetails.quantity'] } }
        }
      },
      {
        $lookup: {
          from: 'products',
          localField: '_id.productId',
          foreignField: '_id',
          as: 'product'
        }
      },
      {
        $unwind: '$product'
      },
      {
        $group: {
          _id: {
            city: '$_id.city',
            state: '$_id.state'
          },
          totalSales: { $sum: '$totalSales' },
          totalOrders: { $sum: '$totalOrders' },
          avgOrderValue: { $avg: '$avgOrderValue' },
          topProducts: {
            $push: {
              productId: '$_id.productId',
              productName: '$product.name',
              category: '$product.category',
              sales: '$totalSales'
            }
          }
        }
      },
      {
        $project: {
          location: {
            city: '$_id.city',
            state: '$_id.state'
          },
          totalSales: 1,
          totalOrders: 1,
          avgOrderValue: 1,
          topProducts: {
            $slice: [
              {
                $sortArray: {
                  input: '$topProducts',
                  sortBy: { sales: -1 }
                }
              },
              5
            ]
          }
        }
      },
      {
        $sort: { totalSales: -1 }
      }
    ];

    const locationAnalytics = await UserBehavior.aggregate(pipeline);
    
    res.json({
      success: true,
      data: locationAnalytics
    });
  } catch (error) {
    console.error('Error fetching location analytics:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch location analytics'
    });
  }
});

// Get product performance by location
router.get('/product-location-performance/:productId', auth, async (req, res) => {
  try {
    const { productId } = req.params;
    const { startDate, endDate } = req.query;
    
    const start = startDate ? new Date(startDate) : new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
    const end = endDate ? new Date(endDate) : new Date();
    
    const pipeline = [
      {
        $match: {
          productId: mongoose.Types.ObjectId(productId),
          behaviorType: 'purchase',
          timestamp: { $gte: start, $lte: end },
          'location.city': { $exists: true }
        }
      },
      {
        $group: {
          _id: {
            city: '$location.city',
            state: '$location.state'
          },
          totalSales: { $sum: { $multiply: ['$productDetails.price', '$productDetails.quantity'] } },
          totalQuantity: { $sum: '$productDetails.quantity' },
          totalOrders: { $sum: 1 },
          uniqueCustomers: { $addToSet: '$userId' }
        }
      },
      {
        $project: {
          location: {
            city: '$_id.city',
            state: '$_id.state'
          },
          totalSales: 1,
          totalQuantity: 1,
          totalOrders: 1,
          uniqueCustomers: { $size: '$uniqueCustomers' },
          avgOrderValue: { $divide: ['$totalSales', '$totalOrders'] }
        }
      },
      {
        $sort: { totalSales: -1 }
      }
    ];

    const productLocationPerformance = await UserBehavior.aggregate(pipeline);
    
    res.json({
      success: true,
      data: productLocationPerformance
    });
  } catch (error) {
    console.error('Error fetching product location performance:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch product location performance'
    });
  }
});

module.exports = router;
