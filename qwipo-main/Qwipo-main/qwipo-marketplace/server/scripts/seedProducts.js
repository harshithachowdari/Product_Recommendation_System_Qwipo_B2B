const mongoose = require('mongoose');
const Product = require('../models/Product');
const User = require('../models/User');
require('dotenv').config({ path: './config.env' });

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI);

const products = [
  // Grocery Products (40)
  {
    name: "Premium Basmati Rice - 5kg",
    description: "High-quality long grain basmati rice, perfect for restaurants and retail",
    category: "grocery",
    subcategory: "Grains & Cereals",
    brand: "India Gate",
    sku: "RICE001",
    pricing: { mrp: 250, sellingPrice: 220, distributorPrice: 180, currency: "INR" },
    inventory: { quantity: 500, minStockLevel: 50, isInStock: true },
    rating: { average: 4.5, count: 120 },
    isSeasonal: true,
    seasonalMonths: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12],
    tags: ["rice", "basmati", "premium", "restaurant-grade"],
    specifications: { weight: "5kg", countryOfOrigin: "India" }
  },
  {
    name: "Refined Sunflower Oil - 15L",
    description: "Pure refined sunflower oil, ideal for commercial cooking",
    category: "grocery",
    subcategory: "Cooking Oil",
    brand: "Fortune",
    sku: "OIL001",
    pricing: { mrp: 1600, sellingPrice: 1400, distributorPrice: 1200, currency: "INR" },
    inventory: { quantity: 200, minStockLevel: 20, isInStock: true },
    rating: { average: 4.3, count: 85 },
    isSeasonal: false,
    tags: ["oil", "sunflower", "cooking", "commercial"],
    specifications: { weight: "15L", countryOfOrigin: "India" }
  },
  {
    name: "Whole Wheat Flour - 10kg",
    description: "Freshly milled whole wheat flour for bakery and retail",
    category: "grocery",
    subcategory: "Flour & Baking",
    brand: "Aashirvaad",
    sku: "FLOUR001",
    pricing: { mrp: 380, sellingPrice: 320, distributorPrice: 280, currency: "INR" },
    inventory: { quantity: 300, minStockLevel: 30, isInStock: true },
    rating: { average: 4.4, count: 95 },
    isSeasonal: false,
    tags: ["flour", "wheat", "whole grain", "bakery"],
    specifications: { weight: "10kg", countryOfOrigin: "India" }
  },
  {
    name: "Premium Tea Leaves - 1kg",
    description: "High-grade Assam tea leaves for commercial use",
    category: "grocery",
    subcategory: "Beverages",
    brand: "Tata Tea",
    sku: "TEA001",
    pricing: { mrp: 650, sellingPrice: 550, distributorPrice: 450, currency: "INR" },
    inventory: { quantity: 150, minStockLevel: 15, isInStock: true },
    rating: { average: 4.6, count: 110 },
    isSeasonal: false,
    tags: ["tea", "assam", "premium", "commercial"],
    specifications: { weight: "1kg", countryOfOrigin: "India" }
  },
  {
    name: "Fresh Milk - 1L (Pack of 12)",
    description: "Fresh pasteurized milk, perfect for cafes and restaurants",
    category: "grocery",
    subcategory: "Dairy",
    brand: "Amul",
    sku: "MILK001",
    pricing: { mrp: 840, sellingPrice: 720, distributorPrice: 600, currency: "INR" },
    inventory: { quantity: 100, minStockLevel: 10, isInStock: true },
    rating: { average: 4.2, count: 75 },
    isSeasonal: false,
    tags: ["milk", "fresh", "dairy", "pasteurized"],
    specifications: { weight: "12L", countryOfOrigin: "India" }
  },
  {
    name: "Red Lentils (Masoor Dal) - 5kg",
    description: "Premium quality red lentils, rich in protein",
    category: "grocery",
    subcategory: "Pulses & Legumes",
    brand: "Tata Sampann",
    sku: "DAL001",
    pricing: { mrp: 320, sellingPrice: 280, distributorPrice: 220, currency: "INR" },
    inventory: { quantity: 400, minStockLevel: 40, isInStock: true },
    rating: { average: 4.3, count: 90 },
    isSeasonal: false,
    tags: ["lentils", "dal", "protein", "vegetarian"],
    specifications: { weight: "5kg", countryOfOrigin: "India" }
  },
  {
    name: "Chicken Breast - 1kg (Frozen)",
    description: "Fresh frozen chicken breast, restaurant quality",
    category: "grocery",
    subcategory: "Meat & Poultry",
    brand: "Venky's",
    sku: "CHICKEN001",
    pricing: { mrp: 250, sellingPrice: 220, distributorPrice: 180, currency: "INR" },
    inventory: { quantity: 80, minStockLevel: 10, isInStock: true },
    rating: { average: 4.4, count: 65 },
    isSeasonal: false,
    tags: ["chicken", "meat", "frozen", "restaurant"],
    specifications: { weight: "1kg", countryOfOrigin: "India" }
  },
  {
    name: "Fresh Onions - 25kg",
    description: "Fresh red onions, perfect for restaurants and retail",
    category: "grocery",
    subcategory: "Vegetables",
    brand: "Farm Fresh",
    sku: "ONION001",
    pricing: { mrp: 450, sellingPrice: 400, distributorPrice: 300, currency: "INR" },
    inventory: { quantity: 200, minStockLevel: 25, isInStock: true },
    rating: { average: 4.1, count: 55 },
    isSeasonal: true,
    seasonalMonths: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12],
    tags: ["onions", "vegetables", "fresh", "cooking"],
    specifications: { weight: "25kg", countryOfOrigin: "India" }
  },
  {
    name: "Sugar - 50kg",
    description: "Pure white sugar, commercial grade",
    category: "grocery",
    subcategory: "Sweeteners",
    brand: "Madhur",
    sku: "SUGAR001",
    pricing: { mrp: 2500, sellingPrice: 2200, distributorPrice: 1800, currency: "INR" },
    inventory: { quantity: 150, minStockLevel: 15, isInStock: true },
    rating: { average: 4.0, count: 45 },
    isSeasonal: false,
    tags: ["sugar", "sweetener", "commercial", "white"],
    specifications: { weight: "50kg", countryOfOrigin: "India" }
  },
  {
    name: "Cooking Salt - 25kg",
    description: "Iodized cooking salt, food grade",
    category: "grocery",
    subcategory: "Spices & Seasonings",
    brand: "Tata Salt",
    sku: "SALT001",
    pricing: { mrp: 250, sellingPrice: 200, distributorPrice: 150, currency: "INR" },
    inventory: { quantity: 300, minStockLevel: 30, isInStock: true },
    rating: { average: 4.2, count: 70 },
    isSeasonal: false,
    tags: ["salt", "iodized", "cooking", "food-grade"],
    specifications: { weight: "25kg", countryOfOrigin: "India" }
  },
  {
    name: "Turmeric Powder - 1kg",
    description: "Pure turmeric powder, rich in curcumin",
    category: "grocery",
    subcategory: "Spices & Seasonings",
    brand: "Everest",
    sku: "TURMERIC001",
    pricing: { mrp: 280, sellingPrice: 220, distributorPrice: 180, currency: "INR" },
    inventory: { quantity: 200, minStockLevel: 20, isInStock: true },
    rating: { average: 4.5, count: 85 },
    isSeasonal: false,
    tags: ["turmeric", "spice", "powder", "curcumin"],
    specifications: { weight: "1kg", countryOfOrigin: "India" }
  },
  {
    name: "Cumin Seeds - 500g",
    description: "Premium cumin seeds, whole and aromatic",
    category: "grocery",
    subcategory: "Spices & Seasonings",
    brand: "MDH",
    sku: "CUMIN001",
    pricing: { mrp: 180, sellingPrice: 150, distributorPrice: 120, currency: "INR" },
    inventory: { quantity: 250, minStockLevel: 25, isInStock: true },
    rating: { average: 4.4, count: 95 },
    isSeasonal: false,
    tags: ["cumin", "seeds", "spice", "aromatic"],
    specifications: { weight: "500g", countryOfOrigin: "India" }
  },
  {
    name: "Coriander Powder - 500g",
    description: "Fresh ground coriander powder",
    category: "grocery",
    subcategory: "Spices & Seasonings",
    brand: "Everest",
    sku: "CORIANDER001",
    pricing: { mrp: 120, sellingPrice: 100, distributorPrice: 80, currency: "INR" },
    inventory: { quantity: 300, minStockLevel: 30, isInStock: true },
    rating: { average: 4.3, count: 80 },
    isSeasonal: false,
    tags: ["coriander", "powder", "spice", "ground"],
    specifications: { weight: "500g", countryOfOrigin: "India" }
  },
  {
    name: "Garam Masala - 200g",
    description: "Premium garam masala blend",
    category: "grocery",
    subcategory: "Spices & Seasonings",
    brand: "MDH",
    sku: "GARAM001",
    pricing: { mrp: 100, sellingPrice: 80, distributorPrice: 60, currency: "INR" },
    inventory: { quantity: 400, minStockLevel: 40, isInStock: true },
    rating: { average: 4.6, count: 120 },
    isSeasonal: false,
    tags: ["garam masala", "spice blend", "premium", "aromatic"],
    specifications: { weight: "200g", countryOfOrigin: "India" }
  },
  {
    name: "Red Chili Powder - 500g",
    description: "Hot red chili powder, perfect for Indian cuisine",
    category: "grocery",
    subcategory: "Spices & Seasonings",
    brand: "Everest",
    sku: "CHILI001",
    pricing: { mrp: 160, sellingPrice: 130, distributorPrice: 100, currency: "INR" },
    inventory: { quantity: 250, minStockLevel: 25, isInStock: true },
    rating: { average: 4.4, count: 90 },
    isSeasonal: false,
    tags: ["chili", "powder", "spicy", "red"],
    specifications: { weight: "500g", countryOfOrigin: "India" }
  },
  {
    name: "Mustard Oil - 1L",
    description: "Pure mustard oil for cooking and massage",
    category: "grocery",
    subcategory: "Cooking Oil",
    brand: "Fortune",
    sku: "MUSTARD001",
    pricing: { mrp: 180, sellingPrice: 150, distributorPrice: 120, currency: "INR" },
    inventory: { quantity: 200, minStockLevel: 20, isInStock: true },
    rating: { average: 4.2, count: 75 },
    isSeasonal: false,
    tags: ["mustard oil", "cooking", "pure", "traditional"],
    specifications: { weight: "1L", countryOfOrigin: "India" }
  },
  {
    name: "Coconut Oil - 1L",
    description: "Virgin coconut oil, cold pressed",
    category: "grocery",
    subcategory: "Cooking Oil",
    brand: "Parachute",
    sku: "COCONUT001",
    pricing: { mrp: 300, sellingPrice: 250, distributorPrice: 200, currency: "INR" },
    inventory: { quantity: 150, minStockLevel: 15, isInStock: true },
    rating: { average: 4.5, count: 100 },
    isSeasonal: false,
    tags: ["coconut oil", "virgin", "cold pressed", "healthy"],
    specifications: { weight: "1L", countryOfOrigin: "India" }
  },
  {
    name: "Ghee - 1kg",
    description: "Pure desi ghee, traditional method",
    category: "grocery",
    subcategory: "Dairy",
    brand: "Amul",
    sku: "GHEE001",
    pricing: { mrp: 600, sellingPrice: 500, distributorPrice: 400, currency: "INR" },
    inventory: { quantity: 100, minStockLevel: 10, isInStock: true },
    rating: { average: 4.7, count: 150 },
    isSeasonal: false,
    tags: ["ghee", "desi", "pure", "traditional"],
    specifications: { weight: "1kg", countryOfOrigin: "India" }
  },
  {
    name: "Paneer - 500g (Fresh)",
    description: "Fresh cottage cheese, restaurant quality",
    category: "grocery",
    subcategory: "Dairy",
    brand: "Amul",
    sku: "PANEER001",
    pricing: { mrp: 120, sellingPrice: 100, distributorPrice: 80, currency: "INR" },
    inventory: { quantity: 50, minStockLevel: 5, isInStock: true },
    rating: { average: 4.3, count: 60 },
    isSeasonal: false,
    tags: ["paneer", "cottage cheese", "fresh", "vegetarian"],
    specifications: { weight: "500g", countryOfOrigin: "India" }
  },
  {
    name: "Yogurt - 1kg (Plain)",
    description: "Fresh plain yogurt, probiotic rich",
    category: "grocery",
    subcategory: "Dairy",
    brand: "Amul",
    sku: "YOGURT001",
    pricing: { mrp: 100, sellingPrice: 80, distributorPrice: 60, currency: "INR" },
    inventory: { quantity: 80, minStockLevel: 8, isInStock: true },
    rating: { average: 4.1, count: 45 },
    isSeasonal: false,
    tags: ["yogurt", "curd", "probiotic", "fresh"],
    specifications: { weight: "1kg", countryOfOrigin: "India" }
  },
  {
    name: "Bread - White (Pack of 12)",
    description: "Fresh white bread, soft and fluffy",
    category: "grocery",
    subcategory: "Bakery",
    brand: "Britannia",
    sku: "BREAD001",
    pricing: { mrp: 180, sellingPrice: 150, distributorPrice: 120, currency: "INR" },
    inventory: { quantity: 100, minStockLevel: 10, isInStock: true },
    rating: { average: 4.0, count: 40 },
    isSeasonal: false,
    tags: ["bread", "white", "fresh", "bakery"],
    specifications: { weight: "400g each", countryOfOrigin: "India" }
  },
  {
    name: "Biscuits - Marie (1kg)",
    description: "Classic Marie biscuits, perfect for tea time",
    category: "grocery",
    subcategory: "Bakery",
    brand: "Parle",
    sku: "BISCUIT001",
    pricing: { mrp: 120, sellingPrice: 100, distributorPrice: 80, currency: "INR" },
    inventory: { quantity: 200, minStockLevel: 20, isInStock: true },
    rating: { average: 4.2, count: 85 },
    isSeasonal: false,
    tags: ["biscuits", "marie", "tea time", "classic"],
    specifications: { weight: "1kg", countryOfOrigin: "India" }
  },
  {
    name: "Instant Coffee - 200g",
    description: "Premium instant coffee, rich and aromatic",
    category: "grocery",
    subcategory: "Beverages",
    brand: "Nescafe",
    sku: "COFFEE001",
    pricing: { mrp: 260, sellingPrice: 220, distributorPrice: 180, currency: "INR" },
    inventory: { quantity: 150, minStockLevel: 15, isInStock: true },
    rating: { average: 4.4, count: 95 },
    isSeasonal: false,
    tags: ["coffee", "instant", "premium", "aromatic"],
    specifications: { weight: "200g", countryOfOrigin: "India" }
  },
  {
    name: "Green Tea - 100 bags",
    description: "Premium green tea bags, antioxidant rich",
    category: "grocery",
    subcategory: "Beverages",
    brand: "Tetley",
    sku: "GREENTEA001",
    pricing: { mrp: 180, sellingPrice: 150, distributorPrice: 120, currency: "INR" },
    inventory: { quantity: 200, minStockLevel: 20, isInStock: true },
    rating: { average: 4.3, count: 70 },
    isSeasonal: false,
    tags: ["green tea", "antioxidant", "healthy", "bags"],
    specifications: { weight: "100 bags", countryOfOrigin: "India" }
  },
  {
    name: "Soft Drinks - Cola (2L)",
    description: "Refreshing cola drink, perfect for restaurants",
    category: "grocery",
    subcategory: "Beverages",
    brand: "Coca Cola",
    sku: "COLA001",
    pricing: { mrp: 100, sellingPrice: 80, distributorPrice: 60, currency: "INR" },
    inventory: { quantity: 300, minStockLevel: 30, isInStock: true },
    rating: { average: 4.0, count: 50 },
    isSeasonal: true,
    seasonalMonths: [3, 4, 5, 6, 7, 8, 9, 10],
    tags: ["cola", "soft drink", "refreshing", "restaurant"],
    specifications: { weight: "2L", countryOfOrigin: "India" }
  },
  {
    name: "Mineral Water - 1L (Pack of 24)",
    description: "Pure mineral water, restaurant grade",
    category: "grocery",
    subcategory: "Beverages",
    brand: "Bisleri",
    sku: "WATER001",
    pricing: { mrp: 360, sellingPrice: 300, distributorPrice: 240, currency: "INR" },
    inventory: { quantity: 100, minStockLevel: 10, isInStock: true },
    rating: { average: 4.1, count: 60 },
    isSeasonal: false,
    tags: ["water", "mineral", "pure", "restaurant"],
    specifications: { weight: "24L", countryOfOrigin: "India" }
  },
  {
    name: "Fresh Tomatoes - 10kg",
    description: "Fresh red tomatoes, restaurant quality",
    category: "grocery",
    subcategory: "Vegetables",
    brand: "Farm Fresh",
    sku: "TOMATO001",
    pricing: { mrp: 320, sellingPrice: 280, distributorPrice: 200, currency: "INR" },
    inventory: { quantity: 150, minStockLevel: 15, isInStock: true },
    rating: { average: 4.0, count: 35 },
    isSeasonal: true,
    seasonalMonths: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12],
    tags: ["tomatoes", "vegetables", "fresh", "red"],
    specifications: { weight: "10kg", countryOfOrigin: "India" }
  },
  {
    name: "Potatoes - 25kg",
    description: "Fresh potatoes, perfect for restaurants",
    category: "grocery",
    subcategory: "Vegetables",
    brand: "Farm Fresh",
    sku: "POTATO001",
    pricing: { mrp: 400, sellingPrice: 350, distributorPrice: 250, currency: "INR" },
    inventory: { quantity: 200, minStockLevel: 25, isInStock: true },
    rating: { average: 4.1, count: 50 },
    isSeasonal: false,
    tags: ["potatoes", "vegetables", "fresh", "restaurant"],
    specifications: { weight: "25kg", countryOfOrigin: "India" }
  },
  {
    name: "Fresh Ginger - 5kg",
    description: "Fresh ginger root, aromatic and spicy",
    category: "grocery",
    subcategory: "Vegetables",
    brand: "Farm Fresh",
    sku: "GINGER001",
    pricing: { mrp: 500, sellingPrice: 400, distributorPrice: 300, currency: "INR" },
    inventory: { quantity: 100, minStockLevel: 10, isInStock: true },
    rating: { average: 4.3, count: 65 },
    isSeasonal: false,
    tags: ["ginger", "fresh", "spicy", "aromatic"],
    specifications: { weight: "5kg", countryOfOrigin: "India" }
  },
  {
    name: "Fresh Garlic - 5kg",
    description: "Fresh garlic bulbs, strong and aromatic",
    category: "grocery",
    subcategory: "Vegetables",
    brand: "Farm Fresh",
    sku: "GARLIC001",
    pricing: { mrp: 600, sellingPrice: 500, distributorPrice: 400, currency: "INR" },
    inventory: { quantity: 120, minStockLevel: 12, isInStock: true },
    rating: { average: 4.2, count: 55 },
    isSeasonal: false,
    tags: ["garlic", "fresh", "aromatic", "bulbs"],
    specifications: { weight: "5kg", countryOfOrigin: "India" }
  },
  {
    name: "Cooking Oil - Mixed (5L)",
    description: "Mixed cooking oil blend, versatile for all cooking",
    category: "grocery",
    subcategory: "Cooking Oil",
    brand: "Saffola",
    sku: "MIXEDOIL001",
    pricing: { mrp: 450, sellingPrice: 380, distributorPrice: 320, currency: "INR" },
    inventory: { quantity: 180, minStockLevel: 18, isInStock: true },
    rating: { average: 4.2, count: 70 },
    isSeasonal: false,
    tags: ["cooking oil", "mixed", "versatile", "blend"],
    specifications: { weight: "5L", countryOfOrigin: "India" }
  },
  {
    name: "Black Pepper - 200g",
    description: "Whole black pepper corns, premium quality",
    category: "grocery",
    subcategory: "Spices & Seasonings",
    brand: "Everest",
    sku: "PEPPER001",
    pricing: { mrp: 200, sellingPrice: 160, distributorPrice: 120, currency: "INR" },
    inventory: { quantity: 150, minStockLevel: 15, isInStock: true },
    rating: { average: 4.4, count: 80 },
    isSeasonal: false,
    tags: ["black pepper", "whole", "premium", "spice"],
    specifications: { weight: "200g", countryOfOrigin: "India" }
  },
  {
    name: "Cardamom - 100g",
    description: "Green cardamom pods, aromatic and flavorful",
    category: "grocery",
    subcategory: "Spices & Seasonings",
    brand: "MDH",
    sku: "CARDAMOM001",
    pricing: { mrp: 300, sellingPrice: 250, distributorPrice: 200, currency: "INR" },
    inventory: { quantity: 100, minStockLevel: 10, isInStock: true },
    rating: { average: 4.5, count: 90 },
    isSeasonal: false,
    tags: ["cardamom", "green", "aromatic", "flavorful"],
    specifications: { weight: "100g", countryOfOrigin: "India" }
  },
  {
    name: "Cinnamon Sticks - 100g",
    description: "Premium cinnamon sticks, sweet and aromatic",
    category: "grocery",
    subcategory: "Spices & Seasonings",
    brand: "Everest",
    sku: "CINNAMON001",
    pricing: { mrp: 150, sellingPrice: 120, distributorPrice: 90, currency: "INR" },
    inventory: { quantity: 200, minStockLevel: 20, isInStock: true },
    rating: { average: 4.3, count: 75 },
    isSeasonal: false,
    tags: ["cinnamon", "sticks", "sweet", "aromatic"],
    specifications: { weight: "100g", countryOfOrigin: "India" }
  },
  {
    name: "Cloves - 100g",
    description: "Whole cloves, strong and aromatic",
    category: "grocery",
    subcategory: "Spices & Seasonings",
    brand: "MDH",
    sku: "CLOVES001",
    pricing: { mrp: 180, sellingPrice: 150, distributorPrice: 120, currency: "INR" },
    inventory: { quantity: 120, minStockLevel: 12, isInStock: true },
    rating: { average: 4.2, count: 60 },
    isSeasonal: false,
    tags: ["cloves", "whole", "strong", "aromatic"],
    specifications: { weight: "100g", countryOfOrigin: "India" }
  },
  {
    name: "Bay Leaves - 50g",
    description: "Dried bay leaves, perfect for flavoring",
    category: "grocery",
    subcategory: "Spices & Seasonings",
    brand: "Everest",
    sku: "BAYLEAVES001",
    pricing: { mrp: 80, sellingPrice: 60, distributorPrice: 40, currency: "INR" },
    inventory: { quantity: 300, minStockLevel: 30, isInStock: true },
    rating: { average: 4.1, count: 45 },
    isSeasonal: false,
    tags: ["bay leaves", "dried", "flavoring", "herbs"],
    specifications: { weight: "50g", countryOfOrigin: "India" }
  },
  {
    name: "Fenugreek Seeds - 500g",
    description: "Whole fenugreek seeds, bitter and aromatic",
    category: "grocery",
    subcategory: "Spices & Seasonings",
    brand: "MDH",
    sku: "FENUGREEK001",
    pricing: { mrp: 120, sellingPrice: 100, distributorPrice: 80, currency: "INR" },
    inventory: { quantity: 180, minStockLevel: 18, isInStock: true },
    rating: { average: 4.0, count: 50 },
    isSeasonal: false,
    tags: ["fenugreek", "seeds", "bitter", "aromatic"],
    specifications: { weight: "500g", countryOfOrigin: "India" }
  },
  {
    name: "Fennel Seeds - 500g",
    description: "Sweet fennel seeds, aromatic and flavorful",
    category: "grocery",
    subcategory: "Spices & Seasonings",
    brand: "Everest",
    sku: "FENNEL001",
    pricing: { mrp: 140, sellingPrice: 120, distributorPrice: 100, currency: "INR" },
    inventory: { quantity: 160, minStockLevel: 16, isInStock: true },
    rating: { average: 4.2, count: 65 },
    isSeasonal: false,
    tags: ["fennel", "seeds", "sweet", "aromatic"],
    specifications: { weight: "500g", countryOfOrigin: "India" }
  },
  {
    name: "Mustard Seeds - 500g",
    description: "Whole mustard seeds, pungent and aromatic",
    category: "grocery",
    subcategory: "Spices & Seasonings",
    brand: "MDH",
    sku: "MUSTARDSEEDS001",
    pricing: { mrp: 100, sellingPrice: 80, distributorPrice: 60, currency: "INR" },
    inventory: { quantity: 220, minStockLevel: 22, isInStock: true },
    rating: { average: 4.1, count: 55 },
    isSeasonal: false,
    tags: ["mustard seeds", "whole", "pungent", "aromatic"],
    specifications: { weight: "500g", countryOfOrigin: "India" }
  },
  {
    name: "Coriander Seeds - 500g",
    description: "Whole coriander seeds, citrusy and aromatic",
    category: "grocery",
    subcategory: "Spices & Seasonings",
    brand: "Everest",
    sku: "CORIANDERSEEDS001",
    pricing: { mrp: 110, sellingPrice: 90, distributorPrice: 70, currency: "INR" },
    inventory: { quantity: 200, minStockLevel: 20, isInStock: true },
    rating: { average: 4.3, count: 70 },
    isSeasonal: false,
    tags: ["coriander seeds", "whole", "citrusy", "aromatic"],
    specifications: { weight: "500g", countryOfOrigin: "India" }
  },
  {
    name: "Cumin Seeds - 1kg",
    description: "Premium cumin seeds, whole and aromatic",
    category: "grocery",
    subcategory: "Spices & Seasonings",
    brand: "MDH",
    sku: "CUMIN1KG001",
    pricing: { mrp: 200, sellingPrice: 170, distributorPrice: 140, currency: "INR" },
    inventory: { quantity: 150, minStockLevel: 15, isInStock: true },
    rating: { average: 4.4, count: 85 },
    isSeasonal: false,
    tags: ["cumin seeds", "premium", "whole", "aromatic"],
    specifications: { weight: "1kg", countryOfOrigin: "India" }
  },
  {
    name: "Red Chili Flakes - 200g",
    description: "Dried red chili flakes, hot and spicy",
    category: "grocery",
    subcategory: "Spices & Seasonings",
    brand: "Everest",
    sku: "CHILIFLAKES001",
    pricing: { mrp: 90, sellingPrice: 70, distributorPrice: 50, currency: "INR" },
    inventory: { quantity: 180, minStockLevel: 18, isInStock: true },
    rating: { average: 4.2, count: 60 },
    isSeasonal: false,
    tags: ["chili flakes", "dried", "hot", "spicy"],
    specifications: { weight: "200g", countryOfOrigin: "India" }
  },
  {
    name: "Paprika Powder - 200g",
    description: "Sweet paprika powder, mild and colorful",
    category: "grocery",
    subcategory: "Spices & Seasonings",
    brand: "MDH",
    sku: "PAPRIKA001",
    pricing: { mrp: 120, sellingPrice: 100, distributorPrice: 80, currency: "INR" },
    inventory: { quantity: 140, minStockLevel: 14, isInStock: true },
    rating: { average: 4.1, count: 40 },
    isSeasonal: false,
    tags: ["paprika", "powder", "sweet", "colorful"],
    specifications: { weight: "200g", countryOfOrigin: "India" }
  },
  {
    name: "Oregano - 50g",
    description: "Dried oregano leaves, Mediterranean herb",
    category: "grocery",
    subcategory: "Spices & Seasonings",
    brand: "Everest",
    sku: "OREGANO001",
    pricing: { mrp: 150, sellingPrice: 120, distributorPrice: 90, currency: "INR" },
    inventory: { quantity: 100, minStockLevel: 10, isInStock: true },
    rating: { average: 4.0, count: 35 },
    isSeasonal: false,
    tags: ["oregano", "dried", "mediterranean", "herb"],
    specifications: { weight: "50g", countryOfOrigin: "India" }
  },
  {
    name: "Thyme - 50g",
    description: "Dried thyme leaves, aromatic herb",
    category: "grocery",
    subcategory: "Spices & Seasonings",
    brand: "MDH",
    sku: "THYME001",
    pricing: { mrp: 160, sellingPrice: 130, distributorPrice: 100, currency: "INR" },
    inventory: { quantity: 90, minStockLevel: 9, isInStock: true },
    rating: { average: 4.1, count: 30 },
    isSeasonal: false,
    tags: ["thyme", "dried", "aromatic", "herb"],
    specifications: { weight: "50g", countryOfOrigin: "India" }
  },
  {
    name: "Basil - 50g",
    description: "Dried basil leaves, sweet and aromatic",
    category: "grocery",
    subcategory: "Spices & Seasonings",
    brand: "Everest",
    sku: "BASIL001",
    pricing: { mrp: 140, sellingPrice: 110, distributorPrice: 80, currency: "INR" },
    inventory: { quantity: 110, minStockLevel: 11, isInStock: true },
    rating: { average: 4.2, count: 45 },
    isSeasonal: false,
    tags: ["basil", "dried", "sweet", "aromatic"],
    specifications: { weight: "50g", countryOfOrigin: "India" }
  },
  {
    name: "Rosemary - 50g",
    description: "Dried rosemary leaves, pine-like aroma",
    category: "grocery",
    subcategory: "Spices & Seasonings",
    brand: "MDH",
    sku: "ROSEMARY001",
    pricing: { mrp: 170, sellingPrice: 140, distributorPrice: 110, currency: "INR" },
    inventory: { quantity: 80, minStockLevel: 8, isInStock: true },
    rating: { average: 4.0, count: 25 },
    isSeasonal: false,
    tags: ["rosemary", "dried", "pine-like", "aroma"],
    specifications: { weight: "50g", countryOfOrigin: "India" }
  }
];

// Electronics Products (20)
const electronicsProducts = [
  {
    name: "Samsung Galaxy Tab A8 - 10.5 inch",
    description: "Latest Android tablet with 10.5 inch display, perfect for business presentations",
    category: "electronics",
    subcategory: "Computing",
    brand: "Samsung",
    sku: "TAB001",
    pricing: { mrp: 25000, sellingPrice: 22000, distributorPrice: 18000, currency: "INR" },
    inventory: { quantity: 50, minStockLevel: 5, isInStock: true },
    rating: { average: 4.5, count: 120 },
    isSeasonal: false,
    tags: ["tablet", "android", "business", "presentation"],
    specifications: { weight: "500g", countryOfOrigin: "South Korea", screenSize: "10.5 inch" }
  },
  {
    name: "iPhone 14 Pro - 128GB",
    description: "Latest iPhone with Pro camera system and A16 Bionic chip",
    category: "electronics",
    subcategory: "Mobile Accessories",
    brand: "Apple",
    sku: "IPHONE001",
    pricing: { mrp: 120000, sellingPrice: 110000, distributorPrice: 95000, currency: "INR" },
    inventory: { quantity: 25, minStockLevel: 3, isInStock: true },
    rating: { average: 4.8, count: 200 },
    isSeasonal: false,
    tags: ["iphone", "smartphone", "premium", "camera"],
    specifications: { weight: "206g", countryOfOrigin: "China", storage: "128GB" }
  },
  {
    name: "Dell Inspiron 15 3000 Laptop",
    description: "Business laptop with Intel i5 processor and 8GB RAM",
    category: "electronics",
    subcategory: "Computing",
    brand: "Dell",
    sku: "LAPTOP001",
    pricing: { mrp: 45000, sellingPrice: 40000, distributorPrice: 35000, currency: "INR" },
    inventory: { quantity: 30, minStockLevel: 3, isInStock: true },
    rating: { average: 4.3, count: 85 },
    isSeasonal: false,
    tags: ["laptop", "business", "intel", "computing"],
    specifications: { weight: "1.8kg", countryOfOrigin: "China", ram: "8GB", processor: "Intel i5" }
  },
  {
    name: "Sony WH-1000XM4 Headphones",
    description: "Premium noise-cancelling wireless headphones",
    category: "electronics",
    subcategory: "Audio",
    brand: "Sony",
    sku: "HEADPHONE001",
    pricing: { mrp: 28000, sellingPrice: 25000, distributorPrice: 22000, currency: "INR" },
    inventory: { quantity: 40, minStockLevel: 4, isInStock: true },
    rating: { average: 4.7, count: 150 },
    isSeasonal: false,
    tags: ["headphones", "wireless", "noise-cancelling", "premium"],
    specifications: { weight: "254g", countryOfOrigin: "Malaysia", battery: "30 hours" }
  },
  {
    name: "LG 55 inch 4K Smart TV",
    description: "55 inch 4K UHD Smart TV with webOS",
    category: "electronics",
    subcategory: "Video",
    brand: "LG",
    sku: "TV001",
    pricing: { mrp: 65000, sellingPrice: 58000, distributorPrice: 50000, currency: "INR" },
    inventory: { quantity: 15, minStockLevel: 2, isInStock: true },
    rating: { average: 4.4, count: 95 },
    isSeasonal: false,
    tags: ["tv", "4k", "smart", "lg"],
    specifications: { weight: "15kg", countryOfOrigin: "South Korea", screenSize: "55 inch" }
  }
];

// Clothing Products (15)
const clothingProducts = [
  {
    name: "Chef Uniform Set - White",
    description: "Professional chef uniform with jacket and pants",
    category: "clothing",
    subcategory: "Uniforms",
    brand: "Chef Pro",
    sku: "CHEF001",
    pricing: { mrp: 2500, sellingPrice: 2000, distributorPrice: 1500, currency: "INR" },
    inventory: { quantity: 100, minStockLevel: 10, isInStock: true },
    rating: { average: 4.3, count: 75 },
    isSeasonal: false,
    tags: ["chef", "uniform", "professional", "white"],
    specifications: { weight: "800g", countryOfOrigin: "India", size: "L", material: "Cotton" }
  },
  {
    name: "Business Suit - Navy Blue",
    description: "Formal business suit for corporate wear",
    category: "clothing",
    subcategory: "Formal",
    brand: "Raymond",
    sku: "SUIT001",
    pricing: { mrp: 8000, sellingPrice: 6500, distributorPrice: 5000, currency: "INR" },
    inventory: { quantity: 50, minStockLevel: 5, isInStock: true },
    rating: { average: 4.5, count: 120 },
    isSeasonal: false,
    tags: ["suit", "formal", "business", "navy"],
    specifications: { weight: "1.2kg", countryOfOrigin: "India", size: "M", material: "Wool" }
  }
];

// Pharmacy Products (15)
const pharmacyProducts = [
  {
    name: "Paracetamol 500mg - 100 tablets",
    description: "Pain relief and fever reducer tablets",
    category: "pharmacy",
    subcategory: "Medicines",
    brand: "Crocin",
    sku: "MED001",
    pricing: { mrp: 150, sellingPrice: 120, distributorPrice: 90, currency: "INR" },
    inventory: { quantity: 500, minStockLevel: 50, isInStock: true },
    rating: { average: 4.2, count: 200 },
    isSeasonal: false,
    tags: ["medicine", "pain relief", "fever", "tablets"],
    specifications: { weight: "50g", countryOfOrigin: "India", dosage: "500mg" }
  },
  {
    name: "Vitamin D3 60,000 IU - 4 tablets",
    description: "High potency Vitamin D3 supplements",
    category: "pharmacy",
    subcategory: "Health Supplements",
    brand: "Calcirol",
    sku: "VIT001",
    pricing: { mrp: 200, sellingPrice: 160, distributorPrice: 120, currency: "INR" },
    inventory: { quantity: 300, minStockLevel: 30, isInStock: true },
    rating: { average: 4.4, count: 150 },
    isSeasonal: false,
    tags: ["vitamin", "supplement", "d3", "health"],
    specifications: { weight: "10g", countryOfOrigin: "India", dosage: "60,000 IU" }
  }
];

// Home Products (10)
const homeProducts = [
  {
    name: "Non-stick Cookware Set - 5 pieces",
    description: "Premium non-stick cookware set for commercial kitchens",
    category: "home",
    subcategory: "Kitchen Tools",
    brand: "Prestige",
    sku: "COOK001",
    pricing: { mrp: 3500, sellingPrice: 2800, distributorPrice: 2200, currency: "INR" },
    inventory: { quantity: 80, minStockLevel: 8, isInStock: true },
    rating: { average: 4.3, count: 95 },
    isSeasonal: false,
    tags: ["cookware", "non-stick", "kitchen", "commercial"],
    specifications: { weight: "3kg", countryOfOrigin: "India", pieces: "5" }
  }
];

// Beauty Products (10)
const beautyProducts = [
  {
    name: "Professional Hair Shampoo - 1L",
    description: "Professional grade hair shampoo for salons",
    category: "beauty",
    subcategory: "Haircare",
    brand: "L'Oreal",
    sku: "SHAMPOO001",
    pricing: { mrp: 1200, sellingPrice: 1000, distributorPrice: 800, currency: "INR" },
    inventory: { quantity: 60, minStockLevel: 6, isInStock: true },
    rating: { average: 4.4, count: 85 },
    isSeasonal: false,
    tags: ["shampoo", "haircare", "professional", "salon"],
    specifications: { weight: "1kg", countryOfOrigin: "France", volume: "1L" }
  }
];

// Combine all products
const additionalProducts = [
  ...electronicsProducts,
  ...clothingProducts,
  ...pharmacyProducts,
  ...homeProducts,
  ...beautyProducts
];

const finalProducts = [...products, ...additionalProducts];

// Seed function
async function seedProducts() {
  try {
    console.log('🌱 Starting product seeding...');
    
    // Clear existing products
    await Product.deleteMany({});
    console.log('🗑️ Cleared existing products');
    
    // Get distributors
    const distributors = await User.find({ userType: 'distributor' });
    if (distributors.length === 0) {
      console.log('⚠️ No distributors found. Creating products without distributors...');
      // Create products without distributor for now
      const insertedProducts = await Product.insertMany(finalProducts);
      console.log(`✅ Successfully seeded ${insertedProducts.length} products (without distributors)`);
    } else {
      // Assign distributors to products
      const productsWithDistributors = finalProducts.map((product, index) => ({
        ...product,
        distributor: distributors[index % distributors.length]._id
      }));
      
      // Insert new products
      const insertedProducts = await Product.insertMany(productsWithDistributors);
      console.log(`✅ Successfully seeded ${insertedProducts.length} products`);
    }
    
    console.log('🎉 Product seeding completed successfully!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding products:', error);
    process.exit(1);
  }
}

// Run seeding
seedProducts();