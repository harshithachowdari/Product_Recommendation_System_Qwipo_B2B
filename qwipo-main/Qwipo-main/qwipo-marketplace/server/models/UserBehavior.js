const mongoose = require('mongoose');

const userBehaviorSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true
  },
  sessionId: {
    type: String,
    required: true,
    index: true
  },
  behaviorType: {
    type: String,
    required: true,
    enum: [
      'search', 'view_product', 'add_to_cart', 'remove_from_cart', 
      'purchase', 'wishlist_add', 'wishlist_remove', 'category_browse',
      'filter_apply', 'sort_apply', 'recommendation_click', 'bundle_view'
    ]
  },
  productId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product',
    index: true
  },
  category: {
    type: String,
    index: true
  },
  subcategory: {
    type: String,
    index: true
  },
  searchQuery: {
    type: String,
    trim: true
  },
  searchFilters: {
    priceRange: {
      min: Number,
      max: Number
    },
    brand: [String],
    rating: Number,
    availability: String
  },
  searchResults: {
    totalResults: Number,
    clickedPosition: Number,
    timeSpent: Number // in seconds
  },
  productDetails: {
    price: Number,
    brand: String,
    category: String,
    subcategory: String,
    rating: Number,
    discountPercentage: Number
  },
  userContext: {
    deviceType: {
      type: String,
      enum: ['mobile', 'tablet', 'desktop']
    },
    browser: String,
    os: String,
    screenResolution: String
  },
  location: {
    city: String,
    state: String,
    country: String,
    coordinates: {
      type: {
        type: String,
        enum: ['Point'],
        default: 'Point'
      },
      coordinates: {
        type: [Number], // [longitude, latitude]
        default: [0, 0]
      }
    }
  },
  timestamp: {
    type: Date,
    default: Date.now,
    index: true
  },
  metadata: {
    type: Map,
    of: mongoose.Schema.Types.Mixed
  }
}, {
  timestamps: true
});

// Indexes for better performance
userBehaviorSchema.index({ userId: 1, timestamp: -1 });
userBehaviorSchema.index({ behaviorType: 1, timestamp: -1 });
userBehaviorSchema.index({ category: 1, timestamp: -1 });
userBehaviorSchema.index({ productId: 1, timestamp: -1 });
userBehaviorSchema.index({ sessionId: 1, timestamp: -1 });

// Static method to get user behavior analytics
userBehaviorSchema.statics.getUserAnalytics = function(userId, startDate, endDate) {
  const pipeline = [
    {
      $match: {
        userId: mongoose.Types.ObjectId(userId),
        timestamp: {
          $gte: startDate,
          $lte: endDate
        }
      }
    },
    {
      $group: {
        _id: '$behaviorType',
        count: { $sum: 1 },
        avgTimeSpent: { $avg: '$searchResults.timeSpent' },
        uniqueProducts: { $addToSet: '$productId' },
        categories: { $addToSet: '$category' }
      }
    }
  ];
  
  return this.aggregate(pipeline);
};

// Static method to get search analytics
userBehaviorSchema.statics.getSearchAnalytics = function(startDate, endDate) {
  const pipeline = [
    {
      $match: {
        behaviorType: 'search',
        timestamp: {
          $gte: startDate,
          $lte: endDate
        }
      }
    },
    {
      $group: {
        _id: '$searchQuery',
        count: { $sum: 1 },
        avgResults: { $avg: '$searchResults.totalResults' },
        avgClickPosition: { $avg: '$searchResults.clickedPosition' },
        avgTimeSpent: { $avg: '$searchResults.timeSpent' }
      }
    },
    {
      $sort: { count: -1 }
    },
    {
      $limit: 50
    }
  ];
  
  return this.aggregate(pipeline);
};

// Static method to get product interaction analytics
userBehaviorSchema.statics.getProductAnalytics = function(startDate, endDate) {
  const pipeline = [
    {
      $match: {
        behaviorType: { $in: ['view_product', 'add_to_cart', 'purchase'] },
        timestamp: {
          $gte: startDate,
          $lte: endDate
        }
      }
    },
    {
      $group: {
        _id: '$productId',
        views: {
          $sum: { $cond: [{ $eq: ['$behaviorType', 'view_product'] }, 1, 0] }
        },
        cartAdds: {
          $sum: { $cond: [{ $eq: ['$behaviorType', 'add_to_cart'] }, 1, 0] }
        },
        purchases: {
          $sum: { $cond: [{ $eq: ['$behaviorType', 'purchase'] }, 1, 0] }
        },
        avgTimeSpent: { $avg: '$searchResults.timeSpent' }
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
        subcategory: '$product.subcategory',
        brand: '$product.brand',
        price: '$product.pricing.sellingPrice',
        views: 1,
        cartAdds: 1,
        purchases: 1,
        conversionRate: {
          $multiply: [
            { $divide: ['$purchases', '$views'] },
            100
          ]
        },
        cartConversionRate: {
          $multiply: [
            { $divide: ['$purchases', '$cartAdds'] },
            100
          ]
        }
      }
    },
    {
      $sort: { views: -1 }
    }
  ];
  
  return this.aggregate(pipeline);
};

// Static method to get category preferences
userBehaviorSchema.statics.getCategoryPreferences = function(userId, startDate, endDate) {
  const pipeline = [
    {
      $match: {
        userId: mongoose.Types.ObjectId(userId),
        category: { $exists: true, $ne: null },
        timestamp: {
          $gte: startDate,
          $lte: endDate
        }
      }
    },
    {
      $group: {
        _id: '$category',
        totalInteractions: { $sum: 1 },
        uniqueProducts: { $addToSet: '$productId' },
        avgTimeSpent: { $avg: '$searchResults.timeSpent' },
        behaviorTypes: { $push: '$behaviorType' }
      }
    },
    {
      $project: {
        category: '$_id',
        totalInteractions: 1,
        uniqueProductCount: { $size: '$uniqueProducts' },
        avgTimeSpent: 1,
        searchCount: {
          $size: {
            $filter: {
              input: '$behaviorTypes',
              cond: { $eq: ['$$this', 'search'] }
            }
          }
        },
        viewCount: {
          $size: {
            $filter: {
              input: '$behaviorTypes',
              cond: { $eq: ['$$this', 'view_product'] }
            }
          }
        },
        purchaseCount: {
          $size: {
            $filter: {
              input: '$behaviorTypes',
              cond: { $eq: ['$$this', 'purchase'] }
            }
          }
        }
      }
    },
    {
      $sort: { totalInteractions: -1 }
    }
  ];
  
  return this.aggregate(pipeline);
};

// Static method to get seasonal trends
userBehaviorSchema.statics.getSeasonalTrends = function(startDate, endDate) {
  const pipeline = [
    {
      $match: {
        timestamp: {
          $gte: startDate,
          $lte: endDate
        }
      }
    },
    {
      $group: {
        _id: {
          month: { $month: '$timestamp' },
          category: '$category'
        },
        totalInteractions: { $sum: 1 },
        uniqueUsers: { $addToSet: '$userId' },
        avgTimeSpent: { $avg: '$searchResults.timeSpent' }
      }
    },
    {
      $project: {
        month: '$_id.month',
        category: '$_id.category',
        totalInteractions: 1,
        uniqueUserCount: { $size: '$uniqueUsers' },
        avgTimeSpent: 1
      }
    },
    {
      $sort: { month: 1, totalInteractions: -1 }
    }
  ];
  
  return this.aggregate(pipeline);
};

module.exports = mongoose.model('UserBehavior', userBehaviorSchema);
