const mongoose = require('mongoose');
  const bcrypt = require('bcryptjs');

  const userSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: [true, 'First name is required'],
    trim: true,
    maxlength: [50, 'First name cannot exceed 50 characters']
  },
  lastName: {
    type: String,
    required: [true, 'Last name is required'],
    trim: true,
    maxlength: [50, 'Last name cannot exceed 50 characters']
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    lowercase: true,
    match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Please enter a valid email']
  },
  password: {
    type: String,
    required: [true, 'Password is required'],
    minlength: [8, 'Password must be at least 8 characters'],
    select: false
  },
  userType: {
    type: String,
    enum: ['retailer', 'distributor'],
    required: [true, 'User type is required']
  },
  phone: {
    type: String,
    required: [true, 'Phone number is required'],
    match: [/^\+?[\d\s-()]+$/, 'Please enter a valid phone number']
  },
  businessName: {
    type: String,
    required: false,
    trim: true,
    maxlength: [100, 'Business name cannot exceed 100 characters']
  },
  businessType: {
    type: String,
    enum: ['grocery', 'electronics', 'clothing', 'pharmacy', 'general', 'other'],
    required: false
  },
  address: {
    street: { type: String, trim: true },
    city: { type: String, required: true, trim: true },
    state: { type: String, required: true, trim: true },
    zipCode: { type: String, required: true, trim: true },
    country: { type: String, default: 'India', trim: true },
    location: {
      type: {
        type: String,
        enum: ['Point']
      },
      coordinates: {
        // [longitude, latitude]
        type: [Number],
        validate: {
          validator: function(v) {
            return !v || (Array.isArray(v) && v.length === 2);
          },
          message: 'Coordinates must be [lng, lat]'
        }
      }
    }
  },
  profileImage: {
    type: String,
    default: null
  },
  isEmailVerified: {
    type: Boolean,
    default: false
  },
  isPhoneVerified: {
    type: Boolean,
    default: false
  },
  isActive: {
    type: Boolean,
    default: true
  },
  lastLogin: {
    type: Date,
    default: null
  },
  passwordResetToken: String,
  passwordResetExpires: Date,
  emailVerificationToken: String,
  emailVerificationExpires: Date,
  refreshTokens: [{
    token: String,
    createdAt: { type: Date, default: Date.now, expires: 2592000 } // 30 days
  }],
  preferences: {
    notifications: {
      email: { type: Boolean, default: true },
      sms: { type: Boolean, default: false },
      push: { type: Boolean, default: true }
    },
    language: { type: String, default: 'en' },
    currency: { type: String, default: 'INR' }
  },
  loyaltyPoints: {
    type: Number,
    default: 0
  },
  loyaltyTier: {
    type: String,
    enum: ['bronze', 'silver', 'gold', 'platinum'],
    default: 'bronze'
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Indexes for better performance (avoid duplicate indexes from unique fields)
userSchema.index({ userType: 1 });
userSchema.index({ businessType: 1 });
userSchema.index({ 'address.city': 1, 'address.state': 1 });
userSchema.index({ loyaltyTier: 1 });
// Geo index to enable nearby queries
userSchema.index({ 'address.location': '2dsphere' });

// Virtual for full name
userSchema.virtual('fullName').get(function() {
  return `${this.firstName} ${this.lastName}`;
});
// Pre-save middleware to hash password
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  
  try {
    const salt = await bcrypt.genSalt(parseInt(process.env.BCRYPT_ROUNDS) || 12);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

// Method to check password
userSchema.methods.comparePassword = async function(candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

// Method to update loyalty tier
userSchema.methods.updateLoyaltyTier = function() {
  if (this.loyaltyPoints >= 10000) {
    this.loyaltyTier = 'platinum';
  } else if (this.loyaltyPoints >= 5000) {
    this.loyaltyTier = 'gold';
  } else if (this.loyaltyPoints >= 2000) {
    this.loyaltyTier = 'silver';
  } else {
    this.loyaltyTier = 'bronze';
  }
  return this.save();
};

// Method to add loyalty points
userSchema.methods.addLoyaltyPoints = async function(points, reason = 'Purchase') {
  this.loyaltyPoints += points;
  await this.updateLoyaltyTier();
  
  // Log the transaction
  const LoyaltyTransaction = mongoose.model('LoyaltyTransaction');
  await LoyaltyTransaction.create({
    userId: this._id,
    points: points,
    type: 'earned',
    reason: reason,
    balance: this.loyaltyPoints
  });
  
  return this;
};

module.exports = mongoose.model('User', userSchema);
