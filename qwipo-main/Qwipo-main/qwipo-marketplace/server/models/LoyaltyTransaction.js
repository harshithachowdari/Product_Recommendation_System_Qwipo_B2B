const mongoose = require('mongoose');

const loyaltyTransactionSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  points: {
    type: Number,
    required: true
  },
  type: {
    type: String,
    enum: ['earned', 'redeemed', 'expired', 'bonus'],
    required: true
  },
  reason: {
    type: String,
    required: true,
    maxlength: [200, 'Reason cannot exceed 200 characters']
  },
  orderId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Order',
    default: null
  },
  balance: {
    type: Number,
    required: true,
    min: 0
  },
  expiresAt: {
    type: Date,
    default: function() {
      // Points expire after 1 year
      return new Date(Date.now() + 365 * 24 * 60 * 60 * 1000);
    }
  },
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

// Indexes
loyaltyTransactionSchema.index({ userId: 1, createdAt: -1 });
loyaltyTransactionSchema.index({ type: 1 });
loyaltyTransactionSchema.index({ expiresAt: 1 });
loyaltyTransactionSchema.index({ isActive: 1 });

module.exports = mongoose.model('LoyaltyTransaction', loyaltyTransactionSchema);
