const mongoose = require('mongoose');

const purchasePatternSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true
  },
  orderId: {
    type: String,
    required: true,
    unique: true
  },
  products: [{
    productId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Product',
      required: true
    },
    quantity: {
      type: Number,
      required: true,
      min: 1
    },
    price: {
      type: Number,
      required: true
    },
    category: String,
    subcategory: String,
    brand: String
  }],
  orderValue: {
    type: Number,
    required: true
  },
  orderDate: {
    type: Date,
    required: true,
    index: true
  },
  season: {
    type: String,
    enum: ['spring', 'summer', 'monsoon', 'autumn', 'winter'],
    required: true
  },
  festival: {
    type: String,
    enum: [
      'diwali', 'holi', 'eid', 'christmas', 'dussehra', 'rakhi', 
      'karva_chauth', 'navratri', 'ganesh_chaturthi', 'none'
    ],
    default: 'none'
  },
  dayOfWeek: {
    type: Number,
    min: 0,
    max: 6, // 0 = Sunday, 6 = Saturday
    required: true
  },
  timeOfDay: {
    type: String,
    enum: ['morning', 'afternoon', 'evening', 'night'],
    required: true
  },
  paymentMethod: {
    type: String,
    enum: ['credit_card', 'debit_card', 'upi', 'net_banking', 'cash_on_delivery'],
    required: true
  },
  deliveryAddress: {
    city: String,
    state: String,
    pincode: String,
    type: {
      type: String,
      enum: ['home', 'office', 'other']
    }
  },
  repeatOrder: {
    type: Boolean,
    default: false
  },
  previousOrderId: {
    type: String,
    ref: 'PurchasePattern'
  },
  categoryPreferences: [{
    category: String,
    frequency: Number,
    avgOrderValue: Number
  }],
  brandPreferences: [{
    brand: String,
    frequency: Number,
    avgOrderValue: Number
  }],
  seasonalProducts: [{
    productId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Product'
    },
    season: String,
    festival: String
  }],
  metadata: {
    type: Map,
    of: mongoose.Schema.Types.Mixed
  }
}, {
  timestamps: true
});

// Indexes for better performance
purchasePatternSchema.index({ userId: 1, orderDate: -1 });
purchasePatternSchema.index({ season: 1, orderDate: -1 });
purchasePatternSchema.index({ festival: 1, orderDate: -1 });
purchasePatternSchema.index({ categoryPreferences: 1 });
purchasePatternSchema.index({ brandPreferences: 1 });

// Static method to get seasonal demand patterns
purchasePatternSchema.statics.getSeasonalDemand = function(startDate, endDate) {
  const pipeline = [
    {
      $match: {
        orderDate: {
          $gte: startDate,
          $lte: endDate
        }
      }
    },
    {
      $unwind: '$products'
    },
    {
      $group: {
        _id: {
          season: '$season',
          category: '$products.category',
          subcategory: '$products.subcategory'
        },
        totalQuantity: { $sum: '$products.quantity' },
        totalValue: { $sum: { $multiply: ['$products.quantity', '$products.price'] } },
        orderCount: { $sum: 1 },
        uniqueUsers: { $addToSet: '$userId' }
      }
    },
    {
      $project: {
        season: '$_id.season',
        category: '$_id.category',
        subcategory: '$_id.subcategory',
        totalQuantity: 1,
        totalValue: 1,
        orderCount: 1,
        uniqueUserCount: { $size: '$uniqueUsers' },
        avgOrderValue: { $divide: ['$totalValue', '$orderCount'] }
      }
    },
    {
      $sort: { season: 1, totalValue: -1 }
    }
  ];
  
  return this.aggregate(pipeline);
};

// Static method to get festival trends
purchasePatternSchema.statics.getFestivalTrends = function(startDate, endDate) {
  const pipeline = [
    {
      $match: {
        orderDate: {
          $gte: startDate,
          $lte: endDate
        },
        festival: { $ne: 'none' }
      }
    },
    {
      $unwind: '$products'
    },
    {
      $group: {
        _id: {
          festival: '$festival',
          category: '$products.category',
          brand: '$products.brand'
        },
        totalQuantity: { $sum: '$products.quantity' },
        totalValue: { $sum: { $multiply: ['$products.quantity', '$products.price'] } },
        orderCount: { $sum: 1 },
        uniqueUsers: { $addToSet: '$userId' }
      }
    },
    {
      $project: {
        festival: '$_id.festival',
        category: '$_id.category',
        brand: '$_id.brand',
        totalQuantity: 1,
        totalValue: 1,
        orderCount: 1,
        uniqueUserCount: { $size: '$uniqueUsers' },
        avgOrderValue: { $divide: ['$totalValue', '$orderCount'] }
      }
    },
    {
      $sort: { festival: 1, totalValue: -1 }
    }
  ];
  
  return this.aggregate(pipeline);
};

// Static method to get repeat order patterns
purchasePatternSchema.statics.getRepeatOrderPatterns = function(startDate, endDate) {
  const pipeline = [
    {
      $match: {
        orderDate: {
          $gte: startDate,
          $lte: endDate
        },
        repeatOrder: true
      }
    },
    {
      $group: {
        _id: '$userId',
        totalOrders: { $sum: 1 },
        avgOrderValue: { $avg: '$orderValue' },
        categories: { $addToSet: '$products.category' },
        brands: { $addToSet: '$products.brand' },
        orderDates: { $push: '$orderDate' },
        firstOrder: { $min: '$orderDate' },
        lastOrder: { $max: '$orderDate' }
      }
    },
    {
      $project: {
        userId: '$_id',
        totalOrders: 1,
        avgOrderValue: 1,
        categoryCount: { $size: '$categories' },
        brandCount: { $size: '$brands' },
        orderFrequency: {
          $divide: [
            { $subtract: ['$lastOrder', '$firstOrder'] },
            { $multiply: ['$totalOrders', 24 * 60 * 60 * 1000] } // Convert to days
          ]
        },
        categories: 1,
        brands: 1
      }
    },
    {
      $sort: { totalOrders: -1 }
    }
  ];
  
  return this.aggregate(pipeline);
};

// Static method to get category preferences by user
purchasePatternSchema.statics.getUserCategoryPreferences = function(userId, startDate, endDate) {
  const pipeline = [
    {
      $match: {
        userId: mongoose.Types.ObjectId(userId),
        orderDate: {
          $gte: startDate,
          $lte: endDate
        }
      }
    },
    {
      $unwind: '$products'
    },
    {
      $group: {
        _id: '$products.category',
        totalQuantity: { $sum: '$products.quantity' },
        totalValue: { $sum: { $multiply: ['$products.quantity', '$products.price'] } },
        orderCount: { $sum: 1 },
        avgPrice: { $avg: '$products.price' },
        brands: { $addToSet: '$products.brand' }
      }
    },
    {
      $project: {
        category: '$_id',
        totalQuantity: 1,
        totalValue: 1,
        orderCount: 1,
        avgPrice: 1,
        brandCount: { $size: '$brands' },
        brands: 1,
        preferenceScore: {
          $add: [
            { $multiply: ['$totalQuantity', 0.4] },
            { $multiply: ['$totalValue', 0.0001] },
            { $multiply: ['$orderCount', 0.6] }
          ]
        }
      }
    },
    {
      $sort: { preferenceScore: -1 }
    }
  ];
  
  return this.aggregate(pipeline);
};

// Static method to get time-based patterns
purchasePatternSchema.statics.getTimeBasedPatterns = function(startDate, endDate) {
  const pipeline = [
    {
      $match: {
        orderDate: {
          $gte: startDate,
          $lte: endDate
        }
      }
    },
    {
      $group: {
        _id: {
          dayOfWeek: '$dayOfWeek',
          timeOfDay: '$timeOfDay'
        },
        totalOrders: { $sum: 1 },
        totalValue: { $sum: '$orderValue' },
        avgOrderValue: { $avg: '$orderValue' },
        uniqueUsers: { $addToSet: '$userId' }
      }
    },
    {
      $project: {
        dayOfWeek: '$_id.dayOfWeek',
        timeOfDay: '$_id.timeOfDay',
        totalOrders: 1,
        totalValue: 1,
        avgOrderValue: 1,
        uniqueUserCount: { $size: '$uniqueUsers' }
      }
    },
    {
      $sort: { dayOfWeek: 1, timeOfDay: 1 }
    }
  ];
  
  return this.aggregate(pipeline);
};

module.exports = mongoose.model('PurchasePattern', purchasePatternSchema);
