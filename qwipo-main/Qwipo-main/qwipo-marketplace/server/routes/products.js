const express = require('express');
const { body, validationResult } = require('express-validator');
const Product = require('../models/Product');
const User = require('../models/User');
const { auth, authorize } = require('../middleware/auth');

const router = express.Router();

// @route   GET /api/products
// @desc    Get all products with filtering and pagination
// @access  Public
router.get('/', async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const skip = (page - 1) * limit;

    // Build filter
    const filter = { isActive: true, 'inventory.isInStock': true };
    
    if (req.query.category) filter.category = req.query.category;
    if (req.query.subcategory) filter.subcategory = req.query.subcategory;
    if (req.query.brand) filter.brand = new RegExp(req.query.brand, 'i');
    if (req.query.minPrice) filter['pricing.sellingPrice'] = { $gte: parseFloat(req.query.minPrice) };
    if (req.query.maxPrice) {
      filter['pricing.sellingPrice'] = {
        ...filter['pricing.sellingPrice'],
        $lte: parseFloat(req.query.maxPrice)
      };
    }
    if (req.query.isFeatured) filter.isFeatured = req.query.isFeatured === 'true';
    if (req.query.isSeasonal) filter.isSeasonal = req.query.isSeasonal === 'true';

    // Build sort
    let sort = {};
    if (req.query.sortBy) {
      switch (req.query.sortBy) {
        case 'price_asc':
          sort = { 'pricing.sellingPrice': 1 };
          break;
        case 'price_desc':
          sort = { 'pricing.sellingPrice': -1 };
          break;
        case 'rating':
          sort = { 'rating.average': -1 };
          break;
        case 'newest':
          sort = { createdAt: -1 };
          break;
        case 'name':
          sort = { name: 1 };
          break;
        default:
          sort = { createdAt: -1 };
      }
    } else {
      sort = { createdAt: -1 };
    }

    const products = await Product.find(filter)
      .populate('distributor', 'businessName businessType')
      .sort(sort)
      .skip(skip)
      .limit(limit);

    const total = await Product.countDocuments(filter);

    res.json({
      success: true,
      data: {
        products,
        pagination: {
          current: page,
          pages: Math.ceil(total / limit),
          total
        }
      }
    });
  } catch (error) {
    console.error('Get products error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// @route   GET /api/products/by-location
// @desc    Get products by distributor location (city/state) or coordinates
// @access  Public
router.get('/by-location', async (req, res) => {
  try {
    const { city, state, lat, lng, radiusKm = 25, page = 1, limit = 20 } = req.query;

    const skip = (parseInt(page) - 1) * parseInt(limit);

    let distributorIds = [];

    if ((city && state) || (lat && lng)) {
      if (city && state) {
        const distributors = await User.find({
          userType: 'distributor',
          'address.city': new RegExp(`^${city}$`, 'i'),
          'address.state': new RegExp(`^${state}$`, 'i')
        }).select('_id');
        distributorIds = distributors.map(d => d._id);
      } else if (lat && lng) {
        // Find distributors near coordinates if they have geocoordinates
        const distributors = await User.find({
          userType: 'distributor',
          'address.location': {
            $near: {
              $geometry: { type: 'Point', coordinates: [parseFloat(lng), parseFloat(lat)] },
              $maxDistance: parseFloat(radiusKm) * 1000
            }
          }
        }).select('_id');
        distributorIds = distributors.map(d => d._id);
      }
    }

    const productFilter = {
      isActive: true,
      'inventory.isInStock': true,
      ...(distributorIds.length ? { distributor: { $in: distributorIds } } : {})
    };

    const products = await Product.find(productFilter)
      .populate('distributor', 'businessName businessType address')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    const total = await Product.countDocuments(productFilter);

    res.json({
      success: true,
      data: {
        products,
        pagination: {
          current: parseInt(page),
          pages: Math.ceil(total / parseInt(limit)),
          total
        }
      }
    });
  } catch (error) {
    console.error('Get products by location error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// @route   GET /api/products/search
// @desc    Search products
// @access  Public
router.get('/search', async (req, res) => {
  try {
    const { q, page = 1, limit = 20 } = req.query;

    if (!q || q.trim().length < 2) {
      return res.status(400).json({
        success: false,
        message: 'Search query must be at least 2 characters'
      });
    }

    const skip = (parseInt(page) - 1) * parseInt(limit);

    // Text search with scoring
    const products = await Product.find(
      {
        $text: { $search: q },
        isActive: true,
        'inventory.isInStock': true
      },
      { score: { $meta: 'textScore' } }
    )
    .populate('distributor', 'businessName businessType')
    .sort({ score: { $meta: 'textScore' }, 'rating.average': -1 })
    .skip(skip)
    .limit(parseInt(limit));

    const total = await Product.countDocuments({
      $text: { $search: q },
      isActive: true,
      'inventory.isInStock': true
    });

    res.json({
      success: true,
      data: {
        products,
        pagination: {
          current: parseInt(page),
          pages: Math.ceil(total / parseInt(limit)),
          total
        },
        query: q
      }
    });
  } catch (error) {
    console.error('Search products error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// @route   GET /api/products/seasonal
// @desc    Get seasonal products
// @access  Public
router.get('/seasonal', async (req, res) => {
  try {
    const products = await Product.getSeasonalProducts()
      .populate('distributor', 'businessName businessType')
      .limit(20);

    res.json({
      success: true,
      data: {
        products
      }
    });
  } catch (error) {
    console.error('Get seasonal products error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// @route   GET /api/products/featured
// @desc    Get featured products
// @access  Public
router.get('/featured', async (req, res) => {
  try {
    const products = await Product.find({
      isFeatured: true,
      isActive: true,
      'inventory.isInStock': true
    })
    .populate('distributor', 'businessName businessType')
    .sort({ 'rating.average': -1, createdAt: -1 })
    .limit(20);

    res.json({
      success: true,
      data: {
        products
      }
    });
  } catch (error) {
    console.error('Get featured products error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// @route   GET /api/products/:id
// @desc    Get single product
// @access  Public
router.get('/:id', async (req, res) => {
  try {
    const product = await Product.findById(req.params.id)
      .populate('distributor', 'businessName businessType address')
      .populate('reviews.userId', 'firstName lastName');

    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }

    res.json({
      success: true,
      data: {
        product
      }
    });
  } catch (error) {
    console.error('Get product error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// @route   POST /api/products
// @desc    Create new product
// @access  Private/Distributor
router.post('/', auth, authorize('distributor'), [
  body('name').trim().notEmpty().withMessage('Product name is required'),
  body('description').trim().notEmpty().withMessage('Description is required'),
  body('category').isIn(['grocery', 'electronics', 'clothing', 'pharmacy', 'home', 'beauty', 'sports', 'books', 'toys', 'automotive', 'other']).withMessage('Invalid category'),
  body('subcategory').trim().notEmpty().withMessage('Subcategory is required'),
  body('brand').trim().notEmpty().withMessage('Brand is required'),
  body('sku').trim().notEmpty().withMessage('SKU is required'),
  body('pricing.mrp').isNumeric().withMessage('MRP must be a number'),
  body('pricing.sellingPrice').isNumeric().withMessage('Selling price must be a number'),
  body('pricing.distributorPrice').isNumeric().withMessage('Distributor price must be a number'),
  body('inventory.quantity').isInt({ min: 0 }).withMessage('Quantity must be a non-negative integer')
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

    const productData = {
      ...req.body,
      distributor: req.user._id
    };

    const product = await Product.create(productData);

    res.status(201).json({
      success: true,
      message: 'Product created successfully',
      data: {
        product
      }
    });
  } catch (error) {
    console.error('Create product error:', error);
    if (error.code === 11000) {
      return res.status(400).json({
        success: false,
        message: 'Product with this SKU already exists'
      });
    }
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// @route   PUT /api/products/:id
// @desc    Update product
// @access  Private/Distributor
router.put('/:id', auth, authorize('distributor'), async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }

    // Check if user owns this product
    if (product.distributor.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to update this product'
      });
    }

    const allowedUpdates = [
      'name', 'description', 'category', 'subcategory', 'brand',
      'pricing', 'inventory', 'specifications', 'tags', 'isFeatured'
    ];

    allowedUpdates.forEach(field => {
      if (req.body[field] !== undefined) {
        product[field] = req.body[field];
      }
    });

    await product.save();

    res.json({
      success: true,
      message: 'Product updated successfully',
      data: {
        product
      }
    });
  } catch (error) {
    console.error('Update product error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// @route   DELETE /api/products/:id
// @desc    Delete product
// @access  Private/Distributor
router.delete('/:id', auth, authorize('distributor'), async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }

    // Check if user owns this product
    if (product.distributor.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to delete this product'
      });
    }

    product.isActive = false;
    await product.save();

    res.json({
      success: true,
      message: 'Product deactivated successfully'
    });
  } catch (error) {
    console.error('Delete product error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// @route   POST /api/products/:id/review
// @desc    Add product review
// @access  Private
router.post('/:id/review', auth, [
  body('rating').isInt({ min: 1, max: 5 }).withMessage('Rating must be between 1 and 5'),
  body('comment').optional().trim().isLength({ max: 500 }).withMessage('Comment cannot exceed 500 characters')
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

    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }

    await product.addReview(req.user._id, req.body.rating, req.body.comment);

    res.json({
      success: true,
      message: 'Review added successfully'
    });
  } catch (error) {
    console.error('Add review error:', error);
    if (error.message === 'User has already reviewed this product') {
      return res.status(400).json({
        success: false,
        message: error.message
      });
    }
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

module.exports = router;
