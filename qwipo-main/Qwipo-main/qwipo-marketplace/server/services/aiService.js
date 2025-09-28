const axios = require('axios');
const Product = require('../models/Product');
const UserBehavior = require('../models/UserBehavior');
const Personalization = require('../models/Personalization');
const PurchasePattern = require('../models/PurchasePattern');

class AIService {
  constructor() {
    this.apiKey = process.env.OPENAI_API_KEY;
    this.baseURL = 'https://api.openai.com/v1';
  }

  // Enhanced recommendation system with multiple algorithms
  async generateRecommendations(userId, limit = 10) {
    try {
      const userProfile = await Personalization.findOne({ userId });
      if (!userProfile) {
        return await this.getTrendingProducts(limit);
      }

      const [collaborative, contentBased, seasonal, bundles] = await Promise.all([
        this.getCollaborativeRecommendations(userId, limit),
        this.getContentBasedRecommendations(userId, limit),
        this.getSeasonalRecommendations(userId, limit),
        this.getPersonalizedBundles(userId, limit)
      ]);

      // Hybrid approach: combine different recommendation types
      const hybridRecommendations = this.combineRecommendations({
        collaborative,
        contentBased,
        seasonal,
        bundles
      }, limit);

      return hybridRecommendations;
    } catch (error) {
      console.error('Error generating AI recommendations:', error);
      return await this.getTrendingProducts(limit);
    }
  }

  // Collaborative Filtering Recommendations
  async getCollaborativeRecommendations(userId, limit) {
    try {
      const userProfile = await Personalization.findOne({ userId });
      if (!userProfile || userProfile.similarUsers.length === 0) {
        return await this.getFallbackProducts(limit);
      }

      const similarUserIds = userProfile.similarUsers.map(u => u.userId);
      
      // Get products purchased by similar users
      const pipeline = [
        {
          $match: {
            userId: { $in: similarUserIds },
            behaviorType: 'purchase'
          }
        },
        {
          $group: {
            _id: '$productId',
            purchaseCount: { $sum: 1 },
            avgRating: { $avg: '$productDetails.rating' }
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
            product: 1,
            score: {
              $add: [
                { $multiply: ['$purchaseCount', 0.6] },
                { $multiply: ['$avgRating', 0.4] }
              ]
            }
          }
        },
        {
          $sort: { score: -1 }
        },
        {
          $limit: limit
        }
      ];

      const results = await UserBehavior.aggregate(pipeline);
      
      if (results.length === 0) {
        return await this.getFallbackProducts(limit);
      }
      
      return results.map(r => ({
        productId: r.productId,
        product: r.product,
        score: r.score,
        reason: 'Users with similar preferences also bought this',
        type: 'collaborative'
      }));
    } catch (error) {
      console.error('Error in collaborative recommendations:', error);
      return await this.getFallbackProducts(limit);
    }
  }

  // Content-Based Recommendations
  async getContentBasedRecommendations(userId, limit) {
    try {
      const userProfile = await Personalization.findOne({ userId });
      if (!userProfile) return await this.getFallbackProducts(limit);

      const userCategories = userProfile.preferences.categories
        .filter(c => c.score > 0.5)
        .map(c => c.category);
      
      const userBrands = userProfile.preferences.brands
        .filter(b => b.score > 0.5)
        .map(b => b.brand);

      if (userCategories.length === 0) return await this.getFallbackProducts(limit);

      const pipeline = [
        {
          $match: {
            category: { $in: userCategories },
            isActive: true,
            'inventory.isInStock': true
          }
        },
        {
          $project: {
            product: '$$ROOT',
            score: {
              $add: [
                {
                  $multiply: [
                    {
                      $cond: [
                        { $in: ['$brand', userBrands] },
                        0.4,
                        0
                      ]
                    },
                    1
                  ]
                },
                {
                  $multiply: [
                    {
                      $divide: [
                        '$rating.average',
                        5
                      ]
                    },
                    0.3
                  ]
                },
                {
                  $multiply: [
                    {
                      $divide: [
                        '$discountPercentage',
                        100
                      ]
                    },
                    0.2
                  ]
                },
                {
                  $multiply: [
                    {
                      $cond: [
                        { $eq: ['$isFeatured', true] },
                        0.1,
                        0
                      ]
                    },
                    1
                  ]
                }
              ]
            }
          }
        },
        {
          $sort: { score: -1 }
        },
        {
          $limit: limit
        }
      ];

      const results = await Product.aggregate(pipeline);
      
      if (results.length === 0) {
        return await this.getFallbackProducts(limit);
      }
      
      return results.map(r => ({
        productId: r.product._id,
        product: r.product,
        score: r.score,
        reason: 'Matches your preferences and interests',
        type: 'content-based'
      }));
    } catch (error) {
      console.error('Error in content-based recommendations:', error);
      return await this.getFallbackProducts(limit);
    }
  }

  // Seasonal Recommendations
  async getSeasonalRecommendations(userId, limit) {
    try {
      const currentMonth = new Date().getMonth() + 1;
      const season = this.getSeasonFromMonth(currentMonth);
      
      // Get seasonal products
      const seasonalProducts = await Product.getSeasonalProducts();
      
      // Get user's seasonal preferences
      const userProfile = await Personalization.findOne({ userId });
      const userCategories = userProfile?.preferences.categories
        .filter(c => c.score > 0.3)
        .map(c => c.category) || [];

      const filteredProducts = seasonalProducts.filter(p => 
        userCategories.length === 0 || userCategories.includes(p.category)
      );

      if (filteredProducts.length === 0) {
        return await this.getFallbackProducts(limit);
      }
      
      return filteredProducts.slice(0, limit).map(product => ({
        productId: product._id,
        product,
        score: 0.8,
        reason: `Perfect for ${season} season`,
        type: 'seasonal'
      }));
    } catch (error) {
      console.error('Error in seasonal recommendations:', error);
      return await this.getFallbackProducts(limit);
    }
  }

  // Personalized Bundles
  async getPersonalizedBundles(userId, limit) {
    try {
      const userProfile = await Personalization.findOne({ userId });
      if (!userProfile) return [];

      // Get user's purchase patterns
      const purchasePatterns = await PurchasePattern.find({ userId })
        .sort({ orderDate: -1 })
        .limit(10);

      if (purchasePatterns.length === 0) return [];

      // Analyze frequently bought together items
      const frequentlyBoughtTogether = this.analyzeFrequentlyBoughtTogether(purchasePatterns);
      
      const bundles = [];
      for (const [category, products] of Object.entries(frequentlyBoughtTogether)) {
        if (products.length >= 2) {
          bundles.push({
            bundleId: `bundle_${category}_${Date.now()}`,
            products: products.slice(0, 3), // Max 3 products per bundle
            score: 0.7,
            reason: `Frequently bought together in ${category}`,
            type: 'bundle',
            category
          });
        }
      }

      return bundles.slice(0, limit);
    } catch (error) {
      console.error('Error in personalized bundles:', error);
      return [];
    }
  }

  // Analyze frequently bought together items
  analyzeFrequentlyBoughtTogether(purchasePatterns) {
    const categoryProducts = {};
    
    purchasePatterns.forEach(pattern => {
      pattern.products.forEach(product => {
        if (!categoryProducts[product.category]) {
          categoryProducts[product.category] = [];
        }
        categoryProducts[product.category].push({
          productId: product.productId,
          quantity: product.quantity,
          frequency: 1
        });
      });
    });

    // Count frequencies and sort
    Object.keys(categoryProducts).forEach(category => {
      const productCounts = {};
      categoryProducts[category].forEach(item => {
        if (!productCounts[item.productId]) {
          productCounts[item.productId] = 0;
        }
        productCounts[item.productId] += item.frequency;
      });

      categoryProducts[category] = Object.entries(productCounts)
        .map(([productId, count]) => ({ productId, count }))
        .sort((a, b) => b.count - a.count);
    });

    return categoryProducts;
  }

  // Get trending products
  async getTrendingProducts(limit) {
    try {
      const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
      
      const pipeline = [
        {
          $match: {
            behaviorType: 'view_product',
            timestamp: { $gte: thirtyDaysAgo }
          }
        },
        {
          $group: {
            _id: '$productId',
            viewCount: { $sum: 1 },
            uniqueUsers: { $addToSet: '$userId' }
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
            product: 1,
            score: {
              $add: [
                { $multiply: ['$viewCount', 0.6] },
                { $multiply: [{ $size: '$uniqueUsers' }, 0.4] }
              ]
            }
          }
        },
        {
          $sort: { score: -1 }
        },
        {
          $limit: limit
        }
      ];

      const results = await UserBehavior.aggregate(pipeline);
      
      // If no behavior data exists, fallback to popular products
      if (results.length === 0) {
        return await this.getFallbackProducts(limit);
      }
      
      return results.map(r => ({
        productId: r.productId,
        product: r.product,
        score: r.score,
        reason: 'Trending now',
        type: 'trending'
      }));
    } catch (error) {
      console.error('Error getting trending products:', error);
      return await this.getFallbackProducts(limit);
    }
  }

  // Fallback method to get products when no behavior data exists
  async getFallbackProducts(limit) {
    try {
      const products = await Product.find({
        isActive: true,
        'inventory.isInStock': true
      })
      .sort({ 'rating.average': -1, 'rating.count': -1, createdAt: -1 })
      .limit(limit)
      .populate('distributor', 'businessName businessType');

      return products.map(product => ({
        productId: product._id,
        product: product,
        score: product.rating.average * 0.5 + (product.rating.count / 100) * 0.3 + 0.2,
        reason: 'Popular products',
        type: 'trending'
      }));
    } catch (error) {
      console.error('Error getting fallback products:', error);
      return [];
    }
  }

  // Combine different recommendation types
  combineRecommendations(recommendations, limit) {
    const combined = [];
    const productScores = new Map();

    // Weight different recommendation types
    const weights = {
      collaborative: 0.3,
      contentBased: 0.4,
      seasonal: 0.2,
      bundles: 0.1
    };

    Object.entries(recommendations).forEach(([type, recs]) => {
      recs.forEach(rec => {
        const key = rec.productId || rec.bundleId;
        const weightedScore = rec.score * (weights[type] || 0.1);
        
        if (productScores.has(key)) {
          productScores.get(key).score += weightedScore;
        } else {
          productScores.set(key, {
            ...rec,
            score: weightedScore,
            originalType: type
          });
        }
      });
    });

    // Sort by combined score and return top results
    return Array.from(productScores.values())
      .sort((a, b) => b.score - a.score)
      .slice(0, limit);
  }

  // Enhanced semantic search
  async semanticSearch(query, filters = {}, limit = 20) {
    try {
      // Generate query embedding
      const queryEmbedding = await this.generateSearchEmbeddings(query);
      
      // Build search pipeline
      const pipeline = [
        {
          $match: {
            isActive: true,
            'inventory.isInStock': true,
            ...this.buildSearchFilters(filters)
          }
        },
        {
          $addFields: {
            similarity: {
              $cond: [
                { $gt: [{ $size: '$aiEmbedding' }, 0] },
                this.calculateCosineSimilarity(queryEmbedding, '$aiEmbedding'),
                0
              ]
            }
          }
        },
        {
          $match: {
            similarity: { $gte: 0.3 } // Minimum similarity threshold
          }
        },
        {
          $sort: { similarity: -1 }
        },
        {
          $limit: limit
        }
      ];

      const results = await Product.aggregate(pipeline);
      return results;
    } catch (error) {
      console.error('Error in semantic search:', error);
      return [];
    }
  }

  // Build search filters from query parameters
  buildSearchFilters(filters) {
    const matchFilters = {};
    
    if (filters.category) {
      matchFilters.category = filters.category;
    }
    
    if (filters.subcategory) {
      matchFilters.subcategory = filters.subcategory;
    }
    
    if (filters.brand) {
      matchFilters.brand = { $in: filters.brand };
    }
    
    if (filters.minPrice || filters.maxPrice) {
      matchFilters['pricing.sellingPrice'] = {};
      if (filters.minPrice) {
        matchFilters['pricing.sellingPrice'].$gte = filters.minPrice;
      }
      if (filters.maxPrice) {
        matchFilters['pricing.sellingPrice'].$lte = filters.maxPrice;
      }
    }
    
    if (filters.minRating) {
      matchFilters['rating.average'] = { $gte: filters.minRating };
    }

    return matchFilters;
  }

  // Get season from month
  getSeasonFromMonth(month) {
    if (month >= 3 && month <= 5) return 'spring';
    if (month >= 6 && month <= 8) return 'summer';
    if (month >= 9 && month <= 11) return 'autumn';
    return 'winter';
  }

  // Generate search embeddings
  async generateSearchEmbeddings(searchQuery) {
    try {
      const response = await axios.post(`${this.baseURL}/embeddings`, {
        input: searchQuery,
        model: 'text-embedding-ada-002'
      }, {
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json'
        }
      });

      return response.data.data[0].embedding;
    } catch (error) {
      console.error('Error generating search embeddings:', error);
      throw new Error('Failed to generate search embeddings');
    }
  }

  // Calculate cosine similarity
  calculateCosineSimilarity(vecA, vecB) {
    if (vecA.length !== vecB.length) return 0;
    
    let dotProduct = 0;
    let normA = 0;
    let normB = 0;
    
    for (let i = 0; i < vecA.length; i++) {
      dotProduct += vecA[i] * vecB[i];
      normA += vecA[i] * vecA[i];
      normB += vecB[i] * vecB[i];
    }
    
    if (normA === 0 || normB === 0) return 0;
    
    return dotProduct / (Math.sqrt(normA) * Math.sqrt(normB));
  }

  // Track user behavior
  async trackUserBehavior(userId, sessionId, behaviorType, data) {
    try {
      const behavior = new UserBehavior({
        userId,
        sessionId,
        behaviorType,
        ...data
      });
      
      await behavior.save();
      
      // Update user personalization profile
      await this.updateUserProfile(userId, behaviorType, data);
      
      return behavior;
    } catch (error) {
      console.error('Error tracking user behavior:', error);
    }
  }

  // Update user profile based on behavior
  async updateUserProfile(userId, behaviorType, data) {
    try {
      let userProfile = await Personalization.findOne({ userId });
      
      if (!userProfile) {
        userProfile = new Personalization({ userId });
      }

      switch (behaviorType) {
        case 'search':
          await userProfile.addSearchHistory(data.searchQuery, data.filters, data.results);
          break;
        case 'view_product':
          if (data.productId) {
            await userProfile.updatePreferences(data.category, data.brand, 0.1);
          }
          break;
        case 'purchase':
          if (data.products) {
            await userProfile.addPurchaseHistory(data.orderId, data.products, data.orderValue);
          }
          break;
      }

      // Update similar users periodically
      if (Math.random() < 0.1) { // 10% chance
        const similarUsers = await Personalization.findSimilarUsers(userId, 5);
        userProfile.similarUsers = similarUsers.map(u => ({
          userId: u.userId,
          similarityScore: u.similarityScore,
          lastUpdated: new Date()
        }));
        await userProfile.save();
      }
    } catch (error) {
      console.error('Error updating user profile:', error);
    }
  }

  // Generate product embeddings for semantic search
  async generateProductEmbedding(product) {
    try {
      const features = this.extractProductFeatures(product);
      return features.slice(0, 16); // Return first 16 features as embedding
    } catch (error) {
      console.error('Error generating product embedding:', error);
      return [];
    }
  }

  // Extract features from product for ML model
  extractProductFeatures(product) {
    const features = [];
    
    // Category encoding (one-hot)
    const categories = ['grocery', 'electronics', 'clothing', 'pharmacy', 'home', 'beauty', 'sports', 'books', 'toys', 'automotive'];
    const categoryIndex = categories.indexOf(product.category) || 0;
    features.push(categoryIndex / categories.length);
    
    // Price normalization (assuming max price is 10000)
    features.push(Math.min(product.pricing.sellingPrice / 10000, 1));
    
    // Rating normalization
    features.push(product.rating.average / 5);
    
    // Review count normalization (assuming max reviews is 1000)
    features.push(Math.min(product.rating.count / 1000, 1));
    
    // Stock status
    features.push(product.inventory.isInStock ? 1 : 0);
    
    // Featured status
    features.push(product.isFeatured ? 1 : 0);
    
    // Seasonal status
    features.push(product.isSeasonal ? 1 : 0);
    
    // Brand popularity (simplified)
    features.push(Math.random()); // In real implementation, this would be based on brand data
    
    // Product age (days since creation)
    const ageInDays = (Date.now() - new Date(product.createdAt).getTime()) / (1000 * 60 * 60 * 24);
    features.push(Math.min(ageInDays / 365, 1)); // Normalize to 1 year
    
    // Discount percentage
    const discount = product.pricing.mrp > product.pricing.sellingPrice 
      ? (product.pricing.mrp - product.pricing.sellingPrice) / product.pricing.mrp 
      : 0;
    features.push(discount);
    
    return features;
  }
}

module.exports = new AIService();



