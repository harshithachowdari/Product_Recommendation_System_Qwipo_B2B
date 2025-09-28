const mongoose = require('mongoose');

const personalizationSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true,
    index: true
  },
  preferences: {
    categories: [{
      category: String,
      score: { type: Number, default: 0, min: 0, max: 1 },
      lastUpdated: { type: Date, default: Date.now }
    }],
    brands: [{
      brand: String,
      score: { type: Number, default: 0, min: 0, max: 1 },
      lastUpdated: { type: Date, default: Date.now }
    }],
    priceRange: {
      min: { type: Number, default: 0 },
      max: { type: Number, default: 100000 },
      preferred: { type: Number, default: 1000 }
    },
    features: [{
      feature: String,
      weight: { type: Number, default: 0.5, min: 0, max: 1 }
    }]
  },
  behaviorProfile: {
    browsingPattern: {
      avgSessionDuration: { type: Number, default: 0 },
      pagesPerSession: { type: Number, default: 0 },
      searchFrequency: { type: Number, default: 0 },
      filterUsage: { type: Number, default: 0 }
    },
    purchasePattern: {
      avgOrderValue: { type: Number, default: 0 },
      orderFrequency: { type: Number, default: 0 },
      seasonalBuying: { type: Boolean, default: false },
      brandLoyalty: { type: Number, default: 0.5 }
    },
    devicePreference: {
      primaryDevice: { type: String, enum: ['mobile', 'tablet', 'desktop'], default: 'mobile' },
      preferredTime: { type: String, enum: ['morning', 'afternoon', 'evening', 'night'], default: 'evening' }
    }
  },
  recommendations: {
    collaborative: [{
      productId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product'
      },
      score: { type: Number, min: 0, max: 1 },
      reason: String,
      lastUpdated: { type: Date, default: Date.now }
    }],
    contentBased: [{
      productId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product'
      },
      score: { type: Number, min: 0, max: 1 },
      reason: String,
      lastUpdated: { type: Date, default: Date.now }
    }],
    hybrid: [{
      productId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product'
      },
      score: { type: Number, min: 0, max: 1 },
      reason: String,
      lastUpdated: { type: Date, default: Date.now }
    }],
    seasonal: [{
      productId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product'
      },
      score: { type: Number, min: 0, max: 1 },
      reason: String,
      season: String,
      lastUpdated: { type: Date, default: Date.now }
    }],
    bundles: [{
      bundleId: String,
      products: [{
        productId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'Product'
        },
        quantity: Number
      }],
      score: { type: Number, min: 0, max: 1 },
      reason: String,
      lastUpdated: { type: Date, default: Date.now }
    }]
  },
  searchHistory: [{
    query: String,
    filters: {
      priceRange: { min: Number, max: Number },
      brand: [String],
      rating: Number,
      availability: String
    },
    results: [{
      productId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product'
      },
      position: Number,
      clicked: Boolean,
      timeSpent: Number
    }],
    timestamp: { type: Date, default: Date.now }
  }],
  purchaseHistory: [{
    orderId: String,
    products: [{
      productId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product'
      },
      quantity: Number,
      price: Number,
      rating: Number
    }],
    orderValue: Number,
    timestamp: { type: Date, default: Date.now }
  }],
  similarUsers: [{
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    similarityScore: { type: Number, min: 0, max: 1 },
    lastUpdated: { type: Date, default: Date.now }
  }],
  lastUpdated: {
    type: Date,
    default: Date.now
  },
  version: {
    type: Number,
    default: 1
  }
}, {
  timestamps: true
});

// Indexes for better performance
personalizationSchema.index({ userId: 1 });
personalizationSchema.index({ 'preferences.categories.category': 1 });
personalizationSchema.index({ 'preferences.brands.brand': 1 });
personalizationSchema.index({ 'recommendations.collaborative.productId': 1 });
personalizationSchema.index({ 'recommendations.contentBased.productId': 1 });
personalizationSchema.index({ 'recommendations.hybrid.productId': 1 });
personalizationSchema.index({ 'recommendations.seasonal.productId': 1 });
personalizationSchema.index({ lastUpdated: -1 });

// Method to update user preferences
personalizationSchema.methods.updatePreferences = function(category, brand, score) {
  if (category) {
    const existingCategory = this.preferences.categories.find(c => c.category === category);
    if (existingCategory) {
      existingCategory.score = score;
      existingCategory.lastUpdated = new Date();
    } else {
      this.preferences.categories.push({
        category,
        score,
        lastUpdated: new Date()
      });
    }
  }
  
  if (brand) {
    const existingBrand = this.preferences.brands.find(b => b.brand === brand);
    if (existingBrand) {
      existingBrand.score = score;
      existingBrand.lastUpdated = new Date();
    } else {
      this.preferences.brands.push({
        brand,
        score,
        lastUpdated: new Date()
      });
    }
  }
  
  this.lastUpdated = new Date();
  return this.save();
};

// Method to add search history
personalizationSchema.methods.addSearchHistory = function(query, filters, results) {
  this.searchHistory.push({
    query,
    filters,
    results,
    timestamp: new Date()
  });
  
  // Keep only last 100 searches
  if (this.searchHistory.length > 100) {
    this.searchHistory = this.searchHistory.slice(-100);
  }
  
  this.lastUpdated = new Date();
  return this.save();
};

// Method to add purchase history
personalizationSchema.methods.addPurchaseHistory = function(orderId, products, orderValue) {
  this.purchaseHistory.push({
    orderId,
    products,
    orderValue,
    timestamp: new Date()
  });
  
  // Keep only last 50 purchases
  if (this.purchaseHistory.length > 50) {
    this.purchaseHistory = this.purchaseHistory.slice(-50);
  }
  
  this.lastUpdated = new Date();
  return this.save();
};

// Method to update recommendations
personalizationSchema.methods.updateRecommendations = function(type, recommendations) {
  this.recommendations[type] = recommendations.map(rec => ({
    ...rec,
    lastUpdated: new Date()
  }));
  
  this.lastUpdated = new Date();
  return this.save();
};

// Static method to find similar users
personalizationSchema.statics.findSimilarUsers = function(userId, limit = 10) {
  return this.aggregate([
    {
      $match: {
        userId: { $ne: mongoose.Types.ObjectId(userId) }
      }
    },
    {
      $lookup: {
        from: 'personalizations',
        let: { targetUserId: mongoose.Types.ObjectId(userId) },
        pipeline: [
          {
            $match: {
              $expr: { $eq: ['$userId', '$$targetUserId'] }
            }
          }
        ],
        as: 'targetUser'
      }
    },
    {
      $unwind: '$targetUser'
    },
    {
      $project: {
        userId: 1,
        similarityScore: {
          $add: [
            {
              $multiply: [
                {
                  $size: {
                    $setIntersection: [
                      '$preferences.categories.category',
                      '$targetUser.preferences.categories.category'
                    ]
                  }
                },
                0.4
              ]
            },
            {
              $multiply: [
                {
                  $size: {
                    $setIntersection: [
                      '$preferences.brands.brand',
                      '$targetUser.preferences.brands.brand'
                    ]
                  }
                },
                0.3
              ]
            },
            {
              $multiply: [
                {
                  $subtract: [
                    1,
                    {
                      $divide: [
                        {
                          $abs: {
                            $subtract: [
                              '$preferences.priceRange.preferred',
                              '$targetUser.preferences.priceRange.preferred'
                            ]
                          }
                        },
                        10000
                      ]
                    }
                  ]
                },
                0.3
              ]
            }
          ]
        }
      }
    },
    {
      $sort: { similarityScore: -1 }
    },
    {
      $limit: limit
    }
  ]);
};

// Static method to get trending products
personalizationSchema.statics.getTrendingProducts = function(category, limit = 20) {
  const pipeline = [
    {
      $unwind: '$purchaseHistory'
    },
    {
      $unwind: '$purchaseHistory.products'
    },
    {
      $match: {
        'purchaseHistory.products.category': category,
        'purchaseHistory.timestamp': {
          $gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) // Last 30 days
        }
      }
    },
    {
      $group: {
        _id: '$purchaseHistory.products.productId',
        totalQuantity: { $sum: '$purchaseHistory.products.quantity' },
        totalValue: { $sum: { $multiply: ['$purchaseHistory.products.quantity', '$purchaseHistory.products.price'] } },
        uniqueUsers: { $addToSet: '$userId' },
        avgRating: { $avg: '$purchaseHistory.products.rating' }
      }
    },
    {
      $lookup: {
        from: 'products',
        localField: '_id',
        foreignField: '_id',
        as: 'product'
      }
    },
    {
      $unwind: '$product'
    },
    {
      $project: {
        productId: '$_id',
        productName: '$product.name',
        category: '$product.category',
        brand: '$product.brand',
        price: '$product.pricing.sellingPrice',
        totalQuantity: 1,
        totalValue: 1,
        uniqueUserCount: { $size: '$uniqueUsers' },
        avgRating: 1,
        trendingScore: {
          $add: [
            { $multiply: ['$totalQuantity', 0.4] },
            { $multiply: ['$totalValue', 0.0001] },
            { $multiply: ['$uniqueUserCount', 0.3] },
            { $multiply: ['$avgRating', 0.3] }
          ]
        }
      }
    },
    {
      $sort: { trendingScore: -1 }
    },
    {
      $limit: limit
    }
  ];
  
  return this.aggregate(pipeline);
};

module.exports = mongoose.model('Personalization', personalizationSchema);
