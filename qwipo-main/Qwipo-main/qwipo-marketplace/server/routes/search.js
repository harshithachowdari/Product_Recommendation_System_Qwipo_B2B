const express = require('express');
const router = express.Router();
const Product = require('../models/Product');
const { auth } = require('../middleware/auth');

// Enhanced search with AI-powered semantic search
router.get('/', auth, async (req, res) => {
  try {
    const { q, category, subcategory, brand, minPrice, maxPrice, minRating, sortBy, page = 1, limit = 20, semantic = false } = req.query;
    
    let products = [];
    let totalCount = 0;
    
    if (semantic === 'true' && q) {
      // Use AI-powered semantic search
      const aiService = require('../services/aiService');
      const filters = {
        category,
        subcategory,
        brand: brand ? brand.split(',') : undefined,
        minPrice: minPrice ? parseFloat(minPrice) : undefined,
        maxPrice: maxPrice ? parseFloat(maxPrice) : undefined,
        minRating: minRating ? parseFloat(minRating) : undefined
      };
      
      products = await aiService.semanticSearch(q, filters, parseInt(limit));
      totalCount = products.length;
    } else {
      // Traditional text-based search
      const searchQuery = {};
      
      // Text search
      if (q) {
        searchQuery.$text = { $search: q };
      }
      
      // Category filter
      if (category) {
        searchQuery.category = category;
      }
      
      // Subcategory filter
      if (subcategory) {
        searchQuery.subcategory = subcategory;
      }
      
      // Brand filter
      if (brand) {
        searchQuery.brand = { $in: brand.split(',') };
      }
      
      // Price range filter
      if (minPrice || maxPrice) {
        searchQuery['pricing.sellingPrice'] = {};
        if (minPrice) {
          searchQuery['pricing.sellingPrice'].$gte = parseFloat(minPrice);
        }
        if (maxPrice) {
          searchQuery['pricing.sellingPrice'].$lte = parseFloat(maxPrice);
        }
      }
      
      // Rating filter
      if (minRating) {
        searchQuery['rating.average'] = { $gte: parseFloat(minRating) };
      }
      
      // Only show active and in-stock products
      searchQuery.isActive = true;
      searchQuery['inventory.isInStock'] = true;
      
      // Build sort options
      let sortOptions = {};
      switch (sortBy) {
        case 'price_asc':
          sortOptions = { 'pricing.sellingPrice': 1 };
          break;
        case 'price_desc':
          sortOptions = { 'pricing.sellingPrice': -1 };
          break;
        case 'rating':
          sortOptions = { 'rating.average': -1 };
          break;
        case 'newest':
          sortOptions = { createdAt: -1 };
          break;
        case 'popular':
          sortOptions = { 'rating.count': -1 };
          break;
        default:
          if (q) {
            sortOptions = { score: { $meta: 'textScore' } };
          } else {
            sortOptions = { createdAt: -1 };
          }
      }
      
      // Calculate pagination
      const skip = (parseInt(page) - 1) * parseInt(limit);
      
      // Execute search
      products = await Product.find(searchQuery)
        .populate('distributor', 'businessName businessType')
        .sort(sortOptions)
        .skip(skip)
        .limit(parseInt(limit));
      
      // Get total count for pagination
      totalCount = await Product.countDocuments(searchQuery);
    }
    
    // Track search behavior
    if (q) {
      const aiService = require('../services/aiService');
      await aiService.trackUserBehavior(req.user.id, req.sessionID, 'search', {
        searchQuery: q,
        filters: {
          priceRange: { min: minPrice, max: maxPrice },
          brand: brand ? brand.split(',') : [],
          rating: minRating,
          availability: 'in_stock'
        },
        results: {
          totalResults: totalCount,
          clickedPosition: 0,
          timeSpent: 0
        }
      });
    }
    
    // Calculate pagination info
    const totalPages = Math.ceil(totalCount / parseInt(limit));
    const hasNextPage = parseInt(page) < totalPages;
    const hasPrevPage = parseInt(page) > 1;
    
    res.json({
      success: true,
      data: {
        products,
        pagination: {
          currentPage: parseInt(page),
          totalPages,
          totalCount,
          hasNextPage,
          hasPrevPage,
          limit: parseInt(limit)
        },
        filters: {
          query: q,
          category,
          subcategory,
          brand: brand ? brand.split(',') : [],
          minPrice: minPrice ? parseFloat(minPrice) : null,
          maxPrice: maxPrice ? parseFloat(maxPrice) : null,
          minRating: minRating ? parseFloat(minRating) : null,
          sortBy,
          semantic: semantic === 'true'
        }
      }
    });
  } catch (error) {
    console.error('Search error:', error);
    res.status(500).json({
      success: false,
      message: 'Search failed'
    });
  }
});

// Get search suggestions with AI enhancement
router.get('/suggestions', auth, async (req, res) => {
  try {
    const { q } = req.query;
    
    if (!q || q.length < 2) {
      return res.json({
        success: true,
        data: []
      });
    }
    
    // Get suggestions from product names, brands, and tags
    const suggestions = await Product.aggregate([
      {
        $match: {
          isActive: true,
          $or: [
            { name: { $regex: q, $options: 'i' } },
            { brand: { $regex: q, $options: 'i' } },
            { tags: { $regex: q, $options: 'i' } },
            { searchKeywords: { $regex: q, $options: 'i' } }
          ]
        }
      },
      {
        $group: {
          _id: null,
          names: { $addToSet: '$name' },
          brands: { $addToSet: '$brand' },
          tags: { $addToSet: '$tags' },
          keywords: { $addToSet: '$searchKeywords' }
        }
      },
      {
        $project: {
          suggestions: {
            $concatArrays: [
              { $slice: ['$names', 8] },
              { $slice: ['$brands', 5] },
              { $slice: [{ $reduce: { input: '$tags', initialValue: [], in: { $concatArrays: ['$$value', '$$this'] } } }, 3] },
              { $slice: [{ $reduce: { input: '$keywords', initialValue: [], in: { $concatArrays: ['$$value', '$$this'] } } }, 2] }
            ]
          }
        }
      }
    ]);
    
    const result = suggestions.length > 0 ? suggestions[0].suggestions : [];
    
    // Remove duplicates and limit results
    const uniqueSuggestions = [...new Set(result)].slice(0, 15);
    
    res.json({
      success: true,
      data: uniqueSuggestions
    });
  } catch (error) {
    console.error('Suggestions error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get suggestions'
    });
  }
});

// Get enhanced search filters
router.get('/filters', auth, async (req, res) => {
  try {
    const { category } = req.query;
    
    const matchQuery = { isActive: true, 'inventory.isInStock': true };
    if (category) {
      matchQuery.category = category;
    }
    
    const filters = await Product.aggregate([
      { $match: matchQuery },
      {
        $group: {
          _id: null,
          categories: { $addToSet: '$category' },
          subcategories: { $addToSet: '$subcategory' },
          brands: { $addToSet: '$brand' },
          minPrice: { $min: '$pricing.sellingPrice' },
          maxPrice: { $max: '$pricing.sellingPrice' },
          minRating: { $min: '$rating.average' },
          maxRating: { $max: '$rating.average' },
          priceRanges: {
            $push: {
              $switch: {
                branches: [
                  { case: { $lt: ['$pricing.sellingPrice', 100] }, then: 'Under ₹100' },
                  { case: { $lt: ['$pricing.sellingPrice', 500] }, then: '₹100 - ₹500' },
                  { case: { $lt: ['$pricing.sellingPrice', 1000] }, then: '₹500 - ₹1000' },
                  { case: { $lt: ['$pricing.sellingPrice', 5000] }, then: '₹1000 - ₹5000' },
                  { case: { $gte: ['$pricing.sellingPrice', 5000] }, then: 'Above ₹5000' }
                ],
                default: 'Other'
              }
            }
          }
        }
      }
    ]);
    
    const result = filters.length > 0 ? filters[0] : {
      categories: [],
      subcategories: [],
      brands: [],
      minPrice: 0,
      maxPrice: 0,
      minRating: 0,
      maxRating: 5,
      priceRanges: []
    };
    
    // Count price ranges
    const priceRangeCounts = {};
    result.priceRanges.forEach(range => {
      priceRangeCounts[range] = (priceRangeCounts[range] || 0) + 1;
    });
    
    res.json({
      success: true,
      data: {
        ...result,
        priceRanges: Object.entries(priceRangeCounts).map(([range, count]) => ({ range, count }))
      }
    });
  } catch (error) {
    console.error('Filters error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get filters'
    });
  }
});

// Get search analytics for admin
router.get('/analytics', auth, async (req, res) => {
  try {
    const { startDate, endDate } = req.query;
    
    const start = startDate ? new Date(startDate) : new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
    const end = endDate ? new Date(endDate) : new Date();
    
    const UserBehavior = require('../models/UserBehavior');
    const analytics = await UserBehavior.getSearchAnalytics(start, end);
    
    res.json({
      success: true,
      data: analytics
    });
  } catch (error) {
    console.error('Search analytics error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get search analytics'
    });
  }
});

// Track search result clicks
router.post('/track-click', auth, async (req, res) => {
  try {
    const { productId, position, searchQuery, timeSpent } = req.body;
    
    const aiService = require('../services/aiService');
    await aiService.trackUserBehavior(req.user.id, req.sessionID, 'search_click', {
      productId,
      searchQuery,
      results: {
        clickedPosition: position,
        timeSpent
      }
    });
    
    res.json({
      success: true,
      message: 'Click tracked successfully'
    });
  } catch (error) {
    console.error('Track click error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to track click'
    });
  }
});

module.exports = router;