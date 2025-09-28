const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Product name is required'],
    trim: true,
    maxlength: [200, 'Product name cannot exceed 200 characters']
  },
  description: {
    type: String,
    required: [true, 'Product description is required'],
    maxlength: [2000, 'Description cannot exceed 2000 characters']
  },
  category: {
    type: String,
    required: [true, 'Product category is required'],
    enum: [
      'grocery', 'electronics', 'clothing', 'pharmacy', 'home', 'beauty',
      'sports', 'books', 'toys', 'automotive', 'other'
    ]
  },
  subcategory: {
    type: String,
    required: [true, 'Product subcategory is required'],
    trim: true
  },
  brand: {
    type: String,
    required: [true, 'Brand is required'],
    trim: true,
    maxlength: [100, 'Brand name cannot exceed 100 characters']
  },
  sku: {
    type: String,
    required: [true, 'SKU is required'],
    unique: true,
    trim: true,
    uppercase: true
  },
  barcode: {
    type: String,
    unique: true,
    sparse: true,
    trim: true
  },
  images: [{
    url: { type: String, required: true },
    alt: { type: String, default: '' },
    isPrimary: { type: Boolean, default: false }
  }],
  pricing: {
    mrp: { type: Number, required: true, min: 0 },
    sellingPrice: { type: Number, required: true, min: 0 },
    distributorPrice: { type: Number, required: true, min: 0 },
    currency: { type: String, default: 'INR' }
  },
  inventory: {
    quantity: { type: Number, required: true, min: 0 },
    reserved: { type: Number, default: 0 },
    minStockLevel: { type: Number, default: 10 },
    maxStockLevel: { type: Number, default: 1000 },
    isInStock: { type: Boolean, default: true }
  },
  specifications: {
    weight: { type: String, trim: true },
    dimensions: { type: String, trim: true },
    color: { type: String, trim: true },
    material: { type: String, trim: true },
    expiryDate: { type: Date },
    manufacturingDate: { type: Date },
    countryOfOrigin: { type: String, default: 'India' }
  },
  tags: [{
    type: String,
    trim: true,
    lowercase: true
  }],
  isActive: {
    type: Boolean,
    default: true
  },
  isFeatured: {
    type: Boolean,
    default: false
  },
  isSeasonal: {
    type: Boolean,
    default: false
  },
  seasonalMonths: [{
    type: Number,
    min: 1,
    max: 12
  }],
  rating: {
    average: { type: Number, default: 0, min: 0, max: 5 },
    count: { type: Number, default: 0 }
  },
  reviews: [{
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    rating: { type: Number, required: true, min: 1, max: 5 },
    comment: { type: String, maxlength: 500 },
    createdAt: { type: Date, default: Date.now }
  }],
  distributor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  searchKeywords: [{
    type: String,
    trim: true,
    lowercase: true
  }],
  aiEmbedding: {
    type: [Number],
    default: []
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Indexes for better performance
productSchema.index({ name: 'text', description: 'text', brand: 'text', tags: 'text' });
productSchema.index({ category: 1, subcategory: 1 });
productSchema.index({ brand: 1 });
productSchema.index({ sku: 1 });
productSchema.index({ 'pricing.sellingPrice': 1 });
productSchema.index({ 'inventory.isInStock': 1 });
productSchema.index({ isFeatured: 1 });
productSchema.index({ isSeasonal: 1, seasonalMonths: 1 });
productSchema.index({ 'rating.average': -1 });
productSchema.index({ createdAt: -1 });
productSchema.index({ distributor: 1 });

// Virtual for availability status
productSchema.virtual('availabilityStatus').get(function() {
  if (!this.isActive) return 'inactive';
  if (this.inventory.quantity <= 0) return 'out_of_stock';
  if (this.inventory.quantity <= this.inventory.minStockLevel) return 'low_stock';
  return 'in_stock';
});

// Virtual for discount percentage
productSchema.virtual('discountPercentage').get(function() {
  if (this.pricing.mrp <= this.pricing.sellingPrice) return 0;
  return Math.round(((this.pricing.mrp - this.pricing.sellingPrice) / this.pricing.mrp) * 100);
});

// Pre-save middleware to update search keywords
productSchema.pre('save', function(next) {
  if (this.isModified('name') || this.isModified('description') || this.isModified('brand')) {
    const keywords = [
      ...this.name.toLowerCase().split(' '),
      ...this.description.toLowerCase().split(' '),
      ...this.brand.toLowerCase().split(' '),
      ...this.tags
    ].filter(keyword => keyword.length > 2);
    
    this.searchKeywords = [...new Set(keywords)];
  }
  next();
});

// Method to update inventory
productSchema.methods.updateInventory = function(quantity, operation = 'set') {
  if (operation === 'add') {
    this.inventory.quantity += quantity;
  } else if (operation === 'subtract') {
    this.inventory.quantity = Math.max(0, this.inventory.quantity - quantity);
  } else {
    this.inventory.quantity = quantity;
  }
  
  this.inventory.isInStock = this.inventory.quantity > 0;
  return this.save();
};

// Method to add review
productSchema.methods.addReview = async function(userId, rating, comment = '') {
  // Check if user already reviewed
  const existingReview = this.reviews.find(review => review.userId.toString() === userId.toString());
  if (existingReview) {
    throw new Error('User has already reviewed this product');
  }
  
  this.reviews.push({ userId, rating, comment });
  
  // Update average rating
  const totalRating = this.reviews.reduce((sum, review) => sum + review.rating, 0);
  this.rating.average = totalRating / this.reviews.length;
  this.rating.count = this.reviews.length;
  
  return this.save();
};

// Static method to get seasonal products
productSchema.statics.getSeasonalProducts = function() {
  const currentMonth = new Date().getMonth() + 1;
  return this.find({
    isSeasonal: true,
    seasonalMonths: currentMonth,
    isActive: true,
    'inventory.isInStock': true
  });
};

module.exports = mongoose.model('Product', productSchema);
