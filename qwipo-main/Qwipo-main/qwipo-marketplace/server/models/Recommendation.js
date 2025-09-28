const mongoose = require('mongoose');

const recommendationSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  productId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product',
    required: true
  },
  type: {
    type: String,
    enum: ['personalized', 'seasonal', 'trending', 'bundle', 'similar'],
    required: true
  },
  score: {
    type: Number,
    required: true,
    min: 0,
    max: 1
  },
  reason: {
    type: String,
    maxlength: [500, 'Reason cannot exceed 500 characters']
  },
  metadata: {
    algorithm: { type: String, default: 'collaborative_filtering' },
    confidence: { type: Number, min: 0, max: 1 },
    features: [String]
  },
  isActive: {
    type: Boolean,
    default: true
  },
  expiresAt: {
    type: Date,
    default: function() {
      // Recommendations expire after 7 days
      return new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
    }
  }
}, {
  timestamps: true
});

// Indexes
recommendationSchema.index({ userId: 1, type: 1, score: -1 });
recommendationSchema.index({ productId: 1 });
recommendationSchema.index({ expiresAt: 1 });
recommendationSchema.index({ isActive: 1 });

// Static method to get user recommendations
recommendationSchema.statics.getUserRecommendations = function(userId, limit = 20) {
  return this.find({
    userId,
    isActive: true,
    expiresAt: { $gt: new Date() }
  })
  .populate('productId')
  .sort({ score: -1, createdAt: -1 })
  .limit(limit);
};

module.exports = mongoose.model('Recommendation', recommendationSchema);
