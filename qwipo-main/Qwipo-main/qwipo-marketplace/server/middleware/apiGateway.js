const rateLimit = require('express-rate-limit');
const { body, validationResult } = require('express-validator');

// API Gateway middleware for request validation, rate limiting, and routing
class APIGateway {
  constructor() {
    this.rateLimiters = new Map();
    this.setupRateLimiters();
  }

  // Setup different rate limiters for different endpoints
  setupRateLimiters() {
    // General API rate limiter
    this.rateLimiters.set('general', rateLimit({
      windowMs: 15 * 60 * 1000, // 15 minutes
      max: 100, // limit each IP to 100 requests per windowMs
      message: {
        success: false,
        message: 'Too many requests from this IP, please try again later.'
      },
      standardHeaders: true,
      legacyHeaders: false,
    }));

    // Strict rate limiter for auth endpoints
    this.rateLimiters.set('auth', rateLimit({
      windowMs: 15 * 60 * 1000, // 15 minutes
      max: process.env.NODE_ENV === 'development' ? 100 : 5, // More lenient in development
      message: {
        success: false,
        message: 'Too many authentication attempts, please try again later.'
      },
      standardHeaders: true,
      legacyHeaders: false,
    }));

    // Moderate rate limiter for search endpoints
    this.rateLimiters.set('search', rateLimit({
      windowMs: 1 * 60 * 1000, // 1 minute
      max: 30, // limit each IP to 30 requests per minute
      message: {
        success: false,
        message: 'Too many search requests, please try again later.'
      },
      standardHeaders: true,
      legacyHeaders: false,
    }));

    // Recommendation rate limiter
    this.rateLimiters.set('recommendations', rateLimit({
      windowMs: 1 * 60 * 1000, // 1 minute
      max: 20, // limit each IP to 20 requests per minute
      message: {
        success: false,
        message: 'Too many recommendation requests, please try again later.'
      },
      standardHeaders: true,
      legacyHeaders: false,
    }));
  }

  // Get rate limiter by type
  getRateLimiter(type = 'general') {
    return this.rateLimiters.get(type) || this.rateLimiters.get('general');
  }

  // Request validation middleware
  validateRequest = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array()
      });
    }
    next();
  };

  // API key validation middleware
  validateAPIKey = (req, res, next) => {
    const apiKey = req.headers['x-api-key'];
    
    if (!apiKey) {
      return res.status(401).json({
        success: false,
        message: 'API key is required'
      });
    }

    // In production, validate against database
    const validAPIKeys = process.env.VALID_API_KEYS?.split(',') || ['demo-api-key'];
    
    if (!validAPIKeys.includes(apiKey)) {
      return res.status(401).json({
        success: false,
        message: 'Invalid API key'
      });
    }

    next();
  };

  // Request logging middleware
  logRequest = (req, res, next) => {
    const start = Date.now();
    
    res.on('finish', () => {
      const duration = Date.now() - start;
      console.log(`${req.method} ${req.originalUrl} - ${res.statusCode} - ${duration}ms`);
    });
    
    next();
  };

  // CORS configuration
  corsOptions = {
    origin: function (origin, callback) {
      const allowedOrigins = process.env.ALLOWED_ORIGINS?.split(',') || [
        'http://localhost:3000',
        'http://localhost:3001'
      ];
      
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error('Not allowed by CORS'));
      }
    },
    credentials: true,
    optionsSuccessStatus: 200
  };

  // Request sanitization middleware
  sanitizeRequest = (req, res, next) => {
    // Remove potentially dangerous characters
    const sanitizeString = (str) => {
      if (typeof str !== 'string') return str;
      return str.replace(/[<>\"']/g, '');
    };

    // Sanitize query parameters
    if (req.query) {
      Object.keys(req.query).forEach(key => {
        req.query[key] = sanitizeString(req.query[key]);
      });
    }

    // Sanitize body parameters
    if (req.body) {
      Object.keys(req.body).forEach(key => {
        if (typeof req.body[key] === 'string') {
          req.body[key] = sanitizeString(req.body[key]);
        }
      });
    }

    next();
  };

  // Response formatting middleware
  formatResponse = (req, res, next) => {
    const originalSend = res.send;
    
    res.send = function (data) {
      // Only format JSON responses
      if (res.get('Content-Type')?.includes('application/json')) {
        try {
          const parsed = JSON.parse(data);
          if (!parsed.success && !parsed.error) {
            data = JSON.stringify({
              success: true,
              data: parsed,
              timestamp: new Date().toISOString()
            });
          }
        } catch (e) {
          // Not JSON, send as is
        }
      }
      
      originalSend.call(this, data);
    };
    
    next();
  };

  // Error handling middleware
  errorHandler = (err, req, res, next) => {
    console.error('API Gateway Error:', err);
    
    // CORS error
    if (err.message === 'Not allowed by CORS') {
      return res.status(403).json({
        success: false,
        message: 'CORS policy violation'
      });
    }

    // Rate limit error
    if (err.status === 429) {
      return res.status(429).json({
        success: false,
        message: 'Rate limit exceeded'
      });
    }

    // Default error
    res.status(500).json({
      success: false,
      message: 'Internal server error',
      ...(process.env.NODE_ENV === 'development' && { error: err.message })
    });
  };

  // Health check endpoint
  healthCheck = (req, res) => {
    res.json({
      success: true,
      message: 'API Gateway is healthy',
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      version: process.env.npm_package_version || '1.0.0'
    });
  };

  // Metrics endpoint
  getMetrics = (req, res) => {
    const metrics = {
      success: true,
      data: {
        uptime: process.uptime(),
        memory: process.memoryUsage(),
        cpu: process.cpuUsage(),
        timestamp: new Date().toISOString()
      }
    };
    
    res.json(metrics);
  };

  // Request validation rules
  validationRules = {
    // User registration validation
    registerUser: [
      body('firstName').trim().isLength({ min: 2, max: 50 }).withMessage('First name must be 2-50 characters'),
      body('lastName').trim().isLength({ min: 2, max: 50 }).withMessage('Last name must be 2-50 characters'),
      body('email').isEmail().normalizeEmail().withMessage('Valid email is required'),
      body('password').isLength({ min: 8 }).withMessage('Password must be at least 8 characters'),
      body('userType').isIn(['retailer', 'distributor']).withMessage('User type must be retailer or distributor'),
      body('phone').matches(/^\+?[\d\s-()]+$/).withMessage('Valid phone number is required')
    ],

    // Product creation validation
    createProduct: [
      body('name').trim().isLength({ min: 3, max: 200 }).withMessage('Product name must be 3-200 characters'),
      body('description').trim().isLength({ min: 10, max: 2000 }).withMessage('Description must be 10-2000 characters'),
      body('category').isIn(['grocery', 'electronics', 'clothing', 'pharmacy', 'home', 'beauty', 'sports', 'books', 'toys', 'automotive', 'other']).withMessage('Valid category is required'),
      body('brand').trim().isLength({ min: 2, max: 100 }).withMessage('Brand must be 2-100 characters'),
      body('pricing.sellingPrice').isNumeric().isFloat({ min: 0 }).withMessage('Valid selling price is required'),
      body('pricing.mrp').isNumeric().isFloat({ min: 0 }).withMessage('Valid MRP is required'),
      body('inventory.quantity').isInt({ min: 0 }).withMessage('Valid quantity is required')
    ],

    // Search validation
    searchProducts: [
      body('query').optional().trim().isLength({ min: 1, max: 100 }).withMessage('Search query must be 1-100 characters'),
      body('category').optional().isIn(['grocery', 'electronics', 'clothing', 'pharmacy', 'home', 'beauty', 'sports', 'books', 'toys', 'automotive', 'other']).withMessage('Valid category is required'),
      body('minPrice').optional().isNumeric().isFloat({ min: 0 }).withMessage('Valid minimum price is required'),
      body('maxPrice').optional().isNumeric().isFloat({ min: 0 }).withMessage('Valid maximum price is required')
    ]
  };
}

module.exports = new APIGateway();
