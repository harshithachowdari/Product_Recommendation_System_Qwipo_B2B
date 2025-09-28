const axios = require('axios');

class OpenAIService {
  constructor() {
    this.apiKey = process.env.OPENAI_API_KEY;
    this.baseURL = 'https://api.openai.com/v1';
    this.model = 'gpt-3.5-turbo';
  }

  // Generate product recommendations using OpenAI
  async generateProductRecommendations(userProfile, products, limit = 10) {
    try {
      if (!this.apiKey || this.apiKey === 'your-openai-api-key') {
        console.log('OpenAI API key not configured, using fallback recommendations');
        return this.getFallbackRecommendations(products, limit);
      }

      const prompt = this.buildRecommendationPrompt(userProfile, products);
      
      const response = await axios.post(`${this.baseURL}/chat/completions`, {
        model: this.model,
        messages: [
          {
            role: 'system',
            content: 'You are an expert product recommendation system for a B2B marketplace. Provide personalized product recommendations based on user preferences and behavior patterns.'
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        max_tokens: 1000,
        temperature: 0.7
      }, {
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json'
        }
      });

      const recommendations = this.parseRecommendations(response.data.choices[0].message.content, products);
      return recommendations.slice(0, limit);

    } catch (error) {
      console.error('Error generating OpenAI recommendations:', error);
      return this.getFallbackRecommendations(products, limit);
    }
  }

  // Generate product descriptions using OpenAI
  async generateProductDescription(product) {
    try {
      if (!this.apiKey || this.apiKey === 'your-openai-api-key') {
        return product.description; // Return existing description
      }

      const prompt = `Generate a compelling product description for a B2B marketplace for the following product:
      
      Name: ${product.name}
      Category: ${product.category}
      Brand: ${product.brand}
      Current Description: ${product.description}
      
      Make it professional, highlight key benefits for retailers, and keep it under 200 words.`;

      const response = await axios.post(`${this.baseURL}/chat/completions`, {
        model: this.model,
        messages: [
          {
            role: 'system',
            content: 'You are a professional copywriter specializing in B2B product descriptions for retail marketplaces.'
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        max_tokens: 300,
        temperature: 0.8
      }, {
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json'
        }
      });

      return response.data.choices[0].message.content.trim();

    } catch (error) {
      console.error('Error generating product description:', error);
      return product.description;
    }
  }

  // Generate search suggestions using OpenAI
  async generateSearchSuggestions(query, context = {}) {
    try {
      if (!this.apiKey || this.apiKey === 'your-openai-api-key') {
        return this.getFallbackSearchSuggestions(query);
      }

      const prompt = `Generate 5 relevant search suggestions for a B2B marketplace based on the query: "${query}"
      
      Context:
      - User type: ${context.userType || 'retailer'}
      - Category: ${context.category || 'any'}
      - Previous searches: ${context.previousSearches?.join(', ') || 'none'}
      
      Return only the suggestions, one per line, without numbering.`;

      const response = await axios.post(`${this.baseURL}/chat/completions`, {
        model: this.model,
        messages: [
          {
            role: 'system',
            content: 'You are a search assistant for a B2B marketplace. Generate relevant, professional search suggestions.'
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        max_tokens: 200,
        temperature: 0.6
      }, {
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json'
        }
      });

      const suggestions = response.data.choices[0].message.content
        .split('\n')
        .map(s => s.trim())
        .filter(s => s.length > 0)
        .slice(0, 5);

      return suggestions;

    } catch (error) {
      console.error('Error generating search suggestions:', error);
      return this.getFallbackSearchSuggestions(query);
    }
  }

  // Generate bundle recommendations using OpenAI
  async generateBundleRecommendations(products, userProfile) {
    try {
      if (!this.apiKey || this.apiKey === 'your-openai-api-key') {
        return this.getFallbackBundles(products);
      }

      const productList = products.slice(0, 20).map(p => 
        `${p.name} (${p.category}, ₹${p.pricing.sellingPrice})`
      ).join('\n');

      const prompt = `Create 3 product bundles for a B2B marketplace based on these products:
      
      ${productList}
      
      User Profile:
      - Preferred categories: ${userProfile?.preferences?.categories?.map(c => c.category).join(', ') || 'any'}
      - Budget range: ₹${userProfile?.preferences?.priceRange?.min || 0} - ₹${userProfile?.preferences?.priceRange?.max || 10000}
      
      For each bundle, provide:
      1. Bundle name
      2. 3-5 products that work well together
      3. Reason why they complement each other
      4. Estimated total value
      
      Format as JSON with bundles array.`;

      const response = await axios.post(`${this.baseURL}/chat/completions`, {
        model: this.model,
        messages: [
          {
            role: 'system',
            content: 'You are a product bundling expert for B2B marketplaces. Create logical, valuable product bundles.'
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        max_tokens: 800,
        temperature: 0.7
      }, {
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json'
        }
      });

      try {
        const bundles = JSON.parse(response.data.choices[0].message.content);
        return bundles.bundles || [];
      } catch (parseError) {
        console.error('Error parsing bundle recommendations:', parseError);
        return this.getFallbackBundles(products);
      }

    } catch (error) {
      console.error('Error generating bundle recommendations:', error);
      return this.getFallbackBundles(products);
    }
  }

  // Generate personalized marketing content
  async generateMarketingContent(product, userProfile) {
    try {
      if (!this.apiKey || this.apiKey === 'your-openai-api-key') {
        return this.getFallbackMarketingContent(product);
      }

      const prompt = `Generate personalized marketing content for a B2B retailer about this product:
      
      Product: ${product.name}
      Category: ${product.category}
      Brand: ${product.brand}
      Price: ₹${product.pricing.sellingPrice}
      Description: ${product.description}
      
      User Profile:
      - Business type: ${userProfile?.businessType || 'retail'}
      - Preferred categories: ${userProfile?.preferences?.categories?.map(c => c.category).join(', ') || 'any'}
      
      Generate:
      1. A compelling subject line for email marketing
      2. A short promotional message (2-3 sentences)
      3. Key selling points for retailers
      
      Keep it professional and focused on business benefits.`;

      const response = await axios.post(`${this.baseURL}/chat/completions`, {
        model: this.model,
        messages: [
          {
            role: 'system',
            content: 'You are a B2B marketing specialist creating personalized content for retail marketplaces.'
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        max_tokens: 400,
        temperature: 0.8
      }, {
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json'
        }
      });

      return response.data.choices[0].message.content.trim();

    } catch (error) {
      console.error('Error generating marketing content:', error);
      return this.getFallbackMarketingContent(product);
    }
  }

  // Build recommendation prompt
  buildRecommendationPrompt(userProfile, products) {
    const productList = products.slice(0, 50).map(p => 
      `- ${p.name} (${p.category}, ${p.brand}, ₹${p.pricing.sellingPrice}, Rating: ${p.rating.average}/5)`
    ).join('\n');

    return `Based on this user profile and available products, recommend the best products:

    User Profile:
    - Preferred categories: ${userProfile?.preferences?.categories?.map(c => c.category).join(', ') || 'any'}
    - Preferred brands: ${userProfile?.preferences?.brands?.map(b => b.brand).join(', ') || 'any'}
    - Budget range: ₹${userProfile?.preferences?.priceRange?.min || 0} - ₹${userProfile?.preferences?.priceRange?.max || 10000}
    - Business type: ${userProfile?.businessType || 'retail'}

    Available Products:
    ${productList}

    Provide 10 personalized recommendations with:
    1. Product name
    2. Reason for recommendation
    3. Confidence score (1-10)
    4. Business benefit

    Format as JSON with recommendations array.`;
  }

  // Parse recommendations from OpenAI response
  parseRecommendations(response, products) {
    try {
      const parsed = JSON.parse(response);
      return parsed.recommendations || [];
    } catch (error) {
      console.error('Error parsing recommendations:', error);
      return this.getFallbackRecommendations(products, 10);
    }
  }

  // Fallback methods when OpenAI is not available
  getFallbackRecommendations(products, limit) {
    return products
      .sort((a, b) => (b.rating.average * b.rating.count) - (a.rating.average * a.rating.count))
      .slice(0, limit)
      .map(product => ({
        productId: product._id,
        product: product,
        score: product.rating.average * 0.5 + (product.rating.count / 100) * 0.3 + 0.2,
        reason: 'Popular choice based on ratings',
        type: 'fallback'
      }));
  }

  getFallbackSearchSuggestions(query) {
    const commonSearches = [
      'rice', 'oil', 'spices', 'dairy products', 'beverages',
      'cleaning supplies', 'office supplies', 'kitchen essentials'
    ];
    
    return commonSearches
      .filter(s => s.toLowerCase().includes(query.toLowerCase()))
      .slice(0, 5);
  }

  getFallbackBundles(products) {
    const bundles = [];
    const categories = [...new Set(products.map(p => p.category))];
    
    categories.slice(0, 3).forEach(category => {
      const categoryProducts = products.filter(p => p.category === category).slice(0, 3);
      if (categoryProducts.length >= 2) {
        bundles.push({
          bundleId: `bundle_${category}_${Date.now()}`,
          name: `${category} Essentials Bundle`,
          products: categoryProducts,
          reason: `Essential products for ${category}`,
          estimatedValue: categoryProducts.reduce((sum, p) => sum + p.pricing.sellingPrice, 0)
        });
      }
    });
    
    return bundles;
  }

  getFallbackMarketingContent(product) {
    return {
      subject: `New ${product.category} product: ${product.name}`,
      message: `Discover ${product.name} by ${product.brand} - perfect for your ${product.category} inventory. High quality at competitive pricing.`,
      sellingPoints: [
        'High quality product',
        'Competitive pricing',
        'Trusted brand',
        'Fast delivery available'
      ]
    };
  }
}

module.exports = new OpenAIService();
