const express = require('express');
const router = express.Router();
const Product = require('../models/Product');
const Personalization = require('../models/Personalization');
const { auth } = require('../middleware/auth');

// Get AI-powered personalized recommendations
router.get('/', auth, async (req, res) => {
  try {
    const { limit = 10, type = 'all' } = req.query;
    const userId = req.user.id;
    
    const aiService = require('../services/aiService');
    const recommendations = await aiService.generateRecommendations(userId, parseInt(limit));
    
    res.json({
      success: true,
      data: recommendations
    });
  } catch (error) {
    console.error('Get recommendations error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get recommendations'
    });
  }
});

// Get collaborative filtering recommendations
router.get('/collaborative', auth, async (req, res) => {
  try {
    const { limit = 10 } = req.query;
    const userId = req.user.id;
    
    const aiService = require('../services/aiService');
    const recommendations = await aiService.getCollaborativeRecommendations(userId, parseInt(limit));
    
    res.json({
      success: true,
      data: recommendations
    });
  } catch (error) {
    console.error('Get collaborative recommendations error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get collaborative recommendations'
    });
  }
});

// Get content-based recommendations
router.get('/content-based', auth, async (req, res) => {
  try {
    const { limit = 10 } = req.query;
    const userId = req.user.id;
    
    const aiService = require('../services/aiService');
    const recommendations = await aiService.getContentBasedRecommendations(userId, parseInt(limit));
    
    res.json({
      success: true,
      data: recommendations
    });
  } catch (error) {
    console.error('Get content-based recommendations error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get content-based recommendations'
    });
  }
});

// Get seasonal recommendations
router.get('/seasonal', auth, async (req, res) => {
  try {
    const { limit = 10 } = req.query;
    const userId = req.user.id;
    
    const aiService = require('../services/aiService');
    const recommendations = await aiService.getSeasonalRecommendations(userId, parseInt(limit));
    
    res.json({
      success: true,
      data: recommendations
    });
  } catch (error) {
    console.error('Get seasonal recommendations error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get seasonal recommendations'
    });
  }
});

// Get personalized bundles
router.get('/bundles', auth, async (req, res) => {
  try {
    const { limit = 5 } = req.query;
    const userId = req.user.id;
    
    const aiService = require('../services/aiService');
    const bundles = await aiService.getPersonalizedBundles(userId, parseInt(limit));
    
    res.json({
      success: true,
      data: bundles
    });
  } catch (error) {
    console.error('Get personalized bundles error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get personalized bundles'
    });
  }
});

// Get trending products
router.get('/trending', auth, async (req, res) => {
  try {
    const { limit = 10, category } = req.query;
    
    const aiService = require('../services/aiService');
    let trending = await aiService.getTrendingProducts(parseInt(limit));
    
    // Filter by category if specified
    if (category) {
      trending = trending.filter(item => item.product.category === category);
    }
    
    res.json({
      success: true,
      data: trending
    });
  } catch (error) {
    console.error('Get trending recommendations error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get trending recommendations'
    });
  }
});

// Get similar products
router.get('/similar/:productId', auth, async (req, res) => {
  try {
    const { productId } = req.params;
    const { limit = 5 } = req.query;
    
    // Get the target product
    const targetProduct = await Product.findById(productId);
    if (!targetProduct) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }
    
    // Find similar products based on category and brand
    const similarProducts = await Product.find({
      _id: { $ne: productId },
      category: targetProduct.category,
      isActive: true,
      'inventory.isInStock': true
    })
      .sort({ 'rating.average': -1 })
      .limit(parseInt(limit))
      .populate('distributor', 'businessName businessType');
    
    const recommendations = similarProducts.map(product => ({
      productId: product._id,
      product,
      reason: `Similar to ${targetProduct.name}`,
      type: 'similar'
    }));
    
    res.json({
      success: true,
      data: recommendations
    });
  } catch (error) {
    console.error('Get similar products error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get similar products'
    });
  }
});

// Get user personalization profile
router.get('/profile', auth, async (req, res) => {
  try {
    const userId = req.user.id;
    
    const profile = await Personalization.findOne({ userId });
    if (!profile) {
      return res.json({
        success: true,
        data: {
          preferences: {
            categories: [],
            brands: [],
            priceRange: { min: 0, max: 100000, preferred: 1000 }
          },
          behaviorProfile: {
            browsingPattern: {
              avgSessionDuration: 0,
              pagesPerSession: 0,
              searchFrequency: 0,
              filterUsage: 0
            },
            purchasePattern: {
              avgOrderValue: 0,
              orderFrequency: 0,
              seasonalBuying: false,
              brandLoyalty: 0.5
            }
          }
        }
      });
    }
    
    res.json({
      success: true,
      data: profile
    });
  } catch (error) {
    console.error('Get user profile error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get user profile'
    });
  }
});

// Update user preferences
router.post('/preferences', auth, async (req, res) => {
  try {
    const { category, brand, score } = req.body;
    const userId = req.user.id;
    
    let profile = await Personalization.findOne({ userId });
    if (!profile) {
      profile = new Personalization({ userId });
    }
    
    await profile.updatePreferences(category, brand, score);
    
    res.json({
      success: true,
      message: 'Preferences updated successfully'
    });
  } catch (error) {
    console.error('Update preferences error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update preferences'
    });
  }
});

// Get recommendation explanation
router.get('/explain/:productId', auth, async (req, res) => {
  try {
    const { productId } = req.params;
    const userId = req.user.id;
    
    // Get user profile
    const profile = await Personalization.findOne({ userId });
    if (!profile) {
      return res.status(404).json({
        success: false,
        message: 'User profile not found'
      });
    }
    
    // Get product details
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }
    
    // Generate explanation based on user preferences
    const explanations = [];
    
    // Check category preference
    const categoryPref = profile.preferences.categories.find(c => c.category === product.category);
    if (categoryPref && categoryPref.score > 0.5) {
      explanations.push(`You frequently browse ${product.category} products`);
    }
    
    // Check brand preference
    const brandPref = profile.preferences.brands.find(b => b.brand === product.brand);
    if (brandPref && brandPref.score > 0.5) {
      explanations.push(`You prefer ${product.brand} brand`);
    }
    
    // Check price range
    if (product.pricing.sellingPrice >= profile.preferences.priceRange.min && 
        product.pricing.sellingPrice <= profile.preferences.priceRange.max) {
      explanations.push('This product fits your preferred price range');
    }
    
    // Check if it's trending
    const aiService = require('../services/aiService');
    const trending = await aiService.getTrendingProducts(20);
    const isTrending = trending.some(t => t.productId.toString() === productId);
    if (isTrending) {
      explanations.push('This product is trending now');
    }
    
    // Check if it's seasonal
    if (product.isSeasonal) {
      const currentMonth = new Date().getMonth() + 1;
      if (product.seasonalMonths.includes(currentMonth)) {
        explanations.push('This product is perfect for the current season');
      }
    }
    
    res.json({
      success: true,
      data: {
        productId,
        explanations: explanations.length > 0 ? explanations : ['Recommended based on your browsing history']
      }
    });
  } catch (error) {
    console.error('Get recommendation explanation error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get recommendation explanation'
    });
  }
});

// Get reminders (placeholder endpoint)
router.get('/reminders', auth, async (req, res) => {
  try {
    const userId = req.user.id;
    
    // Return empty reminders for now
    res.json({
      success: true,
      data: {
        reminders: []
      }
    });
  } catch (error) {
    console.error('Get reminders error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get reminders'
    });
  }
});

// Track recommendation interaction
router.post('/track-interaction', auth, async (req, res) => {
  try {
    const { productId, action, recommendationType } = req.body;
    const userId = req.user.id;
    
    const aiService = require('../services/aiService');
    await aiService.trackUserBehavior(userId, req.sessionID, 'recommendation_click', {
      productId,
      recommendationType,
      action
    });
    
    res.json({
      success: true,
      message: 'Interaction tracked successfully'
    });
  } catch (error) {
    console.error('Track recommendation interaction error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to track interaction'
    });
  }
});

module.exports = router;