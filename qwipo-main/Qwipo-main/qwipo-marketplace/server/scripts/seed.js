/*
 Seed script to insert sample distributors and products.
 Usage:
   1) Ensure MongoDB URI is set in server/config.env as MONGODB_URI
   2) Run: node server/scripts/seed.js
*/

require('dotenv').config({ path: require('path').join(__dirname, '..', 'config.env') });
const mongoose = require('mongoose');
const User = require('../models/User');
const Product = require('../models/Product');

async function connect() {
  await mongoose.connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
  console.log('Connected to MongoDB');
}

function point(lng, lat) {
  return { type: 'Point', coordinates: [lng, lat] };
}

async function createDistributors() {
  const samples = [
    {
      firstName: 'Ravi', lastName: 'Kumar', email: 'ravi@dist.example.com', password: 'Password@123', userType: 'distributor',
      phone: '+91 9876543210', businessName: 'Ravi Foods Distributors', businessType: 'grocery',
      address: { city: 'Hyderabad', state: 'Telangana', zipCode: '500081', country: 'India', location: point(78.382, 17.448) }
    },
    {
      firstName: 'Priya', lastName: 'Sharma', email: 'priya@dist.example.com', password: 'Password@123', userType: 'distributor',
      phone: '+91 9876501234', businessName: 'Sharma Traders', businessType: 'electronics',
      address: { city: 'Bengaluru', state: 'Karnataka', zipCode: '560001', country: 'India', location: point(77.5946, 12.9716) }
    },
    {
      firstName: 'Arun', lastName: 'Menon', email: 'arun@dist.example.com', password: 'Password@123', userType: 'distributor',
      phone: '+91 9812345678', businessName: 'Menon Pharma Supplies', businessType: 'pharmacy',
      address: { city: 'Chennai', state: 'Tamil Nadu', zipCode: '600001', country: 'India', location: point(80.2707, 13.0827) }
    }
  ];

  const existing = await User.find({ email: { $in: samples.map(s => s.email) } }).select('email');
  const existingSet = new Set(existing.map(u => u.email));
  const toCreate = samples.filter(s => !existingSet.has(s.email));

  if (!toCreate.length) {
    console.log('Distributors already exist, skipping.');
    return await User.find({ email: { $in: samples.map(s => s.email) } });
  }

  const created = await User.insertMany(toCreate);
  console.log(`Created ${created.length} distributors.`);
  return created;
}

function sampleProducts(distUser) {
  const base = [
    // Grocery - Staples
    {
      name: 'Aashirvaad Atta 10kg',
      description: 'High quality whole wheat flour for soft rotis and chapatis. Made from premium quality wheat grains.',
      category: 'grocery', subcategory: 'staples', brand: 'Aashirvaad', sku: `ATTA10-${distUser._id.toString().slice(-5)}`,
      images: [{ url: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?w=400&h=400&fit=crop', alt: 'Aashirvaad Atta', isPrimary: true }],
      pricing: { mrp: 520, sellingPrice: 480, distributorPrice: 430, currency: 'INR' },
      inventory: { quantity: 120, isInStock: true },
      specifications: { weight: '10kg', countryOfOrigin: 'India' },
      tags: ['atta', 'flour', 'wheat', 'staples'],
      isFeatured: true,
    },
    {
      name: 'Fortune Sunflower Oil 1L',
      description: 'Pure and healthy sunflower oil for cooking. Rich in vitamin E and low in saturated fat.',
      category: 'grocery', subcategory: 'staples', brand: 'Fortune', sku: `FORT1L-${distUser._id.toString().slice(-5)}`,
      images: [{ url: 'https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?w=400&h=400&fit=crop', alt: 'Sunflower Oil', isPrimary: true }],
      pricing: { mrp: 180, sellingPrice: 165, distributorPrice: 145, currency: 'INR' },
      inventory: { quantity: 200, isInStock: true },
      specifications: { weight: '1L', countryOfOrigin: 'India' },
      tags: ['oil', 'cooking', 'sunflower'],
      isFeatured: false,
    },
    {
      name: 'Tata Salt 1kg',
      description: 'Iodized table salt for daily cooking needs. Essential for maintaining proper iodine levels.',
      category: 'grocery', subcategory: 'staples', brand: 'Tata', sku: `TATA1KG-${distUser._id.toString().slice(-5)}`,
      images: [{ url: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?w=400&h=400&fit=crop', alt: 'Tata Salt', isPrimary: true }],
      pricing: { mrp: 25, sellingPrice: 22, distributorPrice: 18, currency: 'INR' },
      inventory: { quantity: 500, isInStock: true },
      specifications: { weight: '1kg', countryOfOrigin: 'India' },
      tags: ['salt', 'iodized', 'cooking'],
      isFeatured: false,
    },
    {
      name: 'Basmati Rice 5kg',
      description: 'Premium quality basmati rice with long grains and aromatic fragrance.',
      category: 'grocery', subcategory: 'staples', brand: 'Kohinoor', sku: `KOH5KG-${distUser._id.toString().slice(-5)}`,
      images: [{ url: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?w=400&h=400&fit=crop', alt: 'Basmati Rice', isPrimary: true }],
      pricing: { mrp: 450, sellingPrice: 420, distributorPrice: 380, currency: 'INR' },
      inventory: { quantity: 80, isInStock: true },
      specifications: { weight: '5kg', countryOfOrigin: 'India' },
      tags: ['rice', 'basmati', 'grain'],
      isFeatured: true,
    },

    // Grocery - Dairy
    {
      name: 'Amul Butter 500g',
      description: 'Creamy and delicious table butter made from fresh cream.',
      category: 'grocery', subcategory: 'dairy', brand: 'Amul', sku: `AMUL500-${distUser._id.toString().slice(-5)}`,
      images: [{ url: 'https://images.unsplash.com/photo-1589985270826-4b7bb135bc9d?w=400&h=400&fit=crop', alt: 'Amul Butter', isPrimary: true }],
      pricing: { mrp: 285, sellingPrice: 270, distributorPrice: 250, currency: 'INR' },
      inventory: { quantity: 200, isInStock: true },
      specifications: { weight: '500g', countryOfOrigin: 'India' },
      tags: ['butter', 'dairy', 'amul'],
      isFeatured: false,
    },
    {
      name: 'Mother Dairy Milk 1L',
      description: 'Fresh and pure cow milk with essential nutrients and vitamins.',
      category: 'grocery', subcategory: 'dairy', brand: 'Mother Dairy', sku: `MD1L-${distUser._id.toString().slice(-5)}`,
      images: [{ url: 'https://images.unsplash.com/photo-1550583724-b2692b85b150?w=400&h=400&fit=crop', alt: 'Milk', isPrimary: true }],
      pricing: { mrp: 60, sellingPrice: 58, distributorPrice: 52, currency: 'INR' },
      inventory: { quantity: 300, isInStock: true },
      specifications: { weight: '1L', countryOfOrigin: 'India' },
      tags: ['milk', 'dairy', 'fresh'],
      isFeatured: false,
    },
    {
      name: 'Amul Cheese Slices 200g',
      description: 'Processed cheese slices perfect for sandwiches and burgers.',
      category: 'grocery', subcategory: 'dairy', brand: 'Amul', sku: `AMULCS200-${distUser._id.toString().slice(-5)}`,
      images: [{ url: 'https://images.unsplash.com/photo-1486297678162-eb2a19b0a32d?w=400&h=400&fit=crop', alt: 'Cheese Slices', isPrimary: true }],
      pricing: { mrp: 120, sellingPrice: 110, distributorPrice: 95, currency: 'INR' },
      inventory: { quantity: 150, isInStock: true },
      specifications: { weight: '200g', countryOfOrigin: 'India' },
      tags: ['cheese', 'slices', 'dairy'],
      isFeatured: false,
    },

    // Grocery - Snacks
    {
      name: 'Lays Classic Salted 70g',
      description: 'Crispy and delicious potato chips with classic salted flavor.',
      category: 'grocery', subcategory: 'snacks', brand: 'Lays', sku: `LAYS70-${distUser._id.toString().slice(-5)}`,
      images: [{ url: 'https://images.unsplash.com/photo-1566478989037-eec170784d0b?w=400&h=400&fit=crop', alt: 'Lays Chips', isPrimary: true }],
      pricing: { mrp: 20, sellingPrice: 18, distributorPrice: 15, currency: 'INR' },
      inventory: { quantity: 400, isInStock: true },
      specifications: { weight: '70g', countryOfOrigin: 'India' },
      tags: ['chips', 'snacks', 'lays'],
      isFeatured: false,
    },
    {
      name: 'Parle-G Biscuits 200g',
      description: 'Classic glucose biscuits loved by all ages. Perfect for tea time.',
      category: 'grocery', subcategory: 'snacks', brand: 'Parle', sku: `PARLE200-${distUser._id.toString().slice(-5)}`,
      images: [{ url: 'https://images.unsplash.com/photo-1558961363-fa8fdf82db35?w=400&h=400&fit=crop', alt: 'Parle-G', isPrimary: true }],
      pricing: { mrp: 15, sellingPrice: 14, distributorPrice: 12, currency: 'INR' },
      inventory: { quantity: 500, isInStock: true },
      specifications: { weight: '200g', countryOfOrigin: 'India' },
      tags: ['biscuits', 'glucose', 'snacks'],
      isFeatured: false,
    },

    // Electronics - Mobile Accessories
    {
      name: 'Mi 20000mAh Power Bank',
      description: 'Fast-charging dual USB output power bank with LED indicator.',
      category: 'electronics', subcategory: 'accessories', brand: 'Xiaomi', sku: `MI20000-${distUser._id.toString().slice(-5)}`,
      images: [{ url: 'https://images.unsplash.com/photo-1609592807909-3ec25d1a4a0a?w=400&h=400&fit=crop', alt: 'Power Bank', isPrimary: true }],
      pricing: { mrp: 1999, sellingPrice: 1699, distributorPrice: 1499, currency: 'INR' },
      inventory: { quantity: 80, isInStock: true },
      specifications: { weight: '350g', countryOfOrigin: 'India' },
      tags: ['powerbank', 'electronics', 'charging'],
      isFeatured: true,
    },
    {
      name: 'Samsung Galaxy Buds Pro',
      description: 'Wireless earbuds with active noise cancellation and premium sound quality.',
      category: 'electronics', subcategory: 'accessories', brand: 'Samsung', sku: `SGBUDS-${distUser._id.toString().slice(-5)}`,
      images: [{ url: 'https://images.unsplash.com/photo-1606220945770-b5b6c2c55bf1?w=400&h=400&fit=crop', alt: 'Galaxy Buds', isPrimary: true }],
      pricing: { mrp: 19990, sellingPrice: 17990, distributorPrice: 15990, currency: 'INR' },
      inventory: { quantity: 25, isInStock: true },
      specifications: { weight: '60g', countryOfOrigin: 'South Korea' },
      tags: ['earbuds', 'wireless', 'samsung'],
      isFeatured: true,
    },
    {
      name: 'iPhone 15 Pro Case',
      description: 'Premium silicone case with MagSafe compatibility for iPhone 15 Pro.',
      category: 'electronics', subcategory: 'accessories', brand: 'Apple', sku: `IP15CASE-${distUser._id.toString().slice(-5)}`,
      images: [{ url: 'https://images.unsplash.com/photo-1601972602288-1e55b0b8b69b?w=400&h=400&fit=crop', alt: 'iPhone Case', isPrimary: true }],
      pricing: { mrp: 4900, sellingPrice: 4500, distributorPrice: 4000, currency: 'INR' },
      inventory: { quantity: 50, isInStock: true },
      specifications: { weight: '30g', countryOfOrigin: 'China' },
      tags: ['case', 'iphone', 'protection'],
      isFeatured: false,
    },

    // Electronics - Home Appliances
    {
      name: 'Philips Air Fryer 4.2L',
      description: 'Healthy cooking with minimal oil. Digital display and multiple cooking modes.',
      category: 'electronics', subcategory: 'appliances', brand: 'Philips', sku: `PHILAF4-${distUser._id.toString().slice(-5)}`,
      images: [{ url: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=400&h=400&fit=crop', alt: 'Air Fryer', isPrimary: true }],
      pricing: { mrp: 12999, sellingPrice: 11999, distributorPrice: 10999, currency: 'INR' },
      inventory: { quantity: 15, isInStock: true },
      specifications: { weight: '4.2kg', countryOfOrigin: 'India' },
      tags: ['airfryer', 'cooking', 'healthy'],
      isFeatured: true,
    },
    {
      name: 'Samsung 32" Smart TV',
      description: 'HD Smart TV with built-in apps and voice control features.',
      category: 'electronics', subcategory: 'appliances', brand: 'Samsung', sku: `SAMS32-${distUser._id.toString().slice(-5)}`,
      images: [{ url: 'https://images.unsplash.com/photo-1593359677879-a4bb92f829d1?w=400&h=400&fit=crop', alt: 'Smart TV', isPrimary: true }],
      pricing: { mrp: 24999, sellingPrice: 22999, distributorPrice: 20999, currency: 'INR' },
      inventory: { quantity: 8, isInStock: true },
      specifications: { weight: '5.2kg', countryOfOrigin: 'India' },
      tags: ['tv', 'smart', 'samsung'],
      isFeatured: true,
    },

    // Clothing - Men's Wear
    {
      name: 'Van Heusen Cotton Shirt',
      description: 'Premium cotton formal shirt with wrinkle-free finish. Perfect for office wear.',
      category: 'clothing', subcategory: 'mens', brand: 'Van Heusen', sku: `VHCS-${distUser._id.toString().slice(-5)}`,
      images: [{ url: 'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=400&h=400&fit=crop', alt: 'Cotton Shirt', isPrimary: true }],
      pricing: { mrp: 2999, sellingPrice: 2499, distributorPrice: 1999, currency: 'INR' },
      inventory: { quantity: 100, isInStock: true },
      specifications: { weight: '200g', color: 'White', material: 'Cotton', countryOfOrigin: 'India' },
      tags: ['shirt', 'formal', 'cotton'],
      isFeatured: false,
    },
    {
      name: 'Levi\'s 501 Jeans',
      description: 'Classic straight fit jeans with authentic denim. Timeless style and comfort.',
      category: 'clothing', subcategory: 'mens', brand: 'Levi\'s', sku: `LEVI501-${distUser._id.toString().slice(-5)}`,
      images: [{ url: 'https://images.unsplash.com/photo-1542272604-787c3835535d?w=400&h=400&fit=crop', alt: 'Jeans', isPrimary: true }],
      pricing: { mrp: 4999, sellingPrice: 3999, distributorPrice: 3499, currency: 'INR' },
      inventory: { quantity: 75, isInStock: true },
      specifications: { weight: '600g', color: 'Blue', material: 'Denim', countryOfOrigin: 'India' },
      tags: ['jeans', 'denim', 'levis'],
      isFeatured: true,
    },

    // Clothing - Women's Wear
    {
      name: 'Zara Summer Dress',
      description: 'Elegant floral print summer dress with comfortable fit and breathable fabric.',
      category: 'clothing', subcategory: 'womens', brand: 'Zara', sku: `ZARASD-${distUser._id.toString().slice(-5)}`,
      images: [{ url: 'https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?w=400&h=400&fit=crop', alt: 'Summer Dress', isPrimary: true }],
      pricing: { mrp: 3999, sellingPrice: 3299, distributorPrice: 2799, currency: 'INR' },
      inventory: { quantity: 60, isInStock: true },
      specifications: { weight: '300g', color: 'Floral', material: 'Cotton', countryOfOrigin: 'India' },
      tags: ['dress', 'summer', 'floral'],
      isFeatured: true,
    },
    {
      name: 'H&M T-Shirt',
      description: 'Comfortable cotton t-shirt with modern fit and soft fabric.',
      category: 'clothing', subcategory: 'womens', brand: 'H&M', sku: `HMTEE-${distUser._id.toString().slice(-5)}`,
      images: [{ url: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400&h=400&fit=crop', alt: 'T-Shirt', isPrimary: true }],
      pricing: { mrp: 999, sellingPrice: 799, distributorPrice: 599, currency: 'INR' },
      inventory: { quantity: 150, isInStock: true },
      specifications: { weight: '150g', color: 'White', material: 'Cotton', countryOfOrigin: 'India' },
      tags: ['tshirt', 'cotton', 'casual'],
      isFeatured: false,
    },

    // Pharmacy - Medicines
    {
      name: 'Crocin Advance 650mg',
      description: 'Fast-acting pain relief tablet for headache, fever, and body pain.',
      category: 'pharmacy', subcategory: 'medicines', brand: 'GSK', sku: `CRO650-${distUser._id.toString().slice(-5)}`,
      images: [{ url: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=400&h=400&fit=crop', alt: 'Crocin', isPrimary: true }],
      pricing: { mrp: 45, sellingPrice: 42, distributorPrice: 38, currency: 'INR' },
      inventory: { quantity: 300, isInStock: true },
      specifications: { weight: '10g', countryOfOrigin: 'India' },
      tags: ['medicine', 'pain', 'fever'],
      isFeatured: false,
    },
    {
      name: 'Dettol Handwash 900ml',
      description: 'Antibacterial handwash for daily hygiene and germ protection.',
      category: 'pharmacy', subcategory: 'hygiene', brand: 'Dettol', sku: `DETHW900-${distUser._id.toString().slice(-5)}`,
      images: [{ url: 'https://images.unsplash.com/photo-1584464491033-06628f3a6b7b?w=400&h=400&fit=crop', alt: 'Handwash', isPrimary: true }],
      pricing: { mrp: 199, sellingPrice: 169, distributorPrice: 150, currency: 'INR' },
      inventory: { quantity: 150, isInStock: true },
      specifications: { weight: '900ml', countryOfOrigin: 'India' },
      tags: ['handwash', 'hygiene', 'antibacterial'],
      isFeatured: false,
    },
    {
      name: 'Himalaya Face Wash',
      description: 'Gentle face wash with natural ingredients for all skin types.',
      category: 'pharmacy', subcategory: 'skincare', brand: 'Himalaya', sku: `HIMFW-${distUser._id.toString().slice(-5)}`,
      images: [{ url: 'https://images.unsplash.com/photo-1556228720-195a67e0784d?w=400&h=400&fit=crop', alt: 'Face Wash', isPrimary: true }],
      pricing: { mrp: 120, sellingPrice: 110, distributorPrice: 95, currency: 'INR' },
      inventory: { quantity: 200, isInStock: true },
      specifications: { weight: '100ml', countryOfOrigin: 'India' },
      tags: ['facewash', 'skincare', 'natural'],
      isFeatured: false,
    },

    // Home - Kitchen
    {
      name: 'Prestige Pressure Cooker 3L',
      description: 'Stainless steel pressure cooker with safety features and easy handling.',
      category: 'home', subcategory: 'kitchen', brand: 'Prestige', sku: `PRES3L-${distUser._id.toString().slice(-5)}`,
      images: [{ url: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=400&h=400&fit=crop', alt: 'Pressure Cooker', isPrimary: true }],
      pricing: { mrp: 2499, sellingPrice: 2199, distributorPrice: 1899, currency: 'INR' },
      inventory: { quantity: 40, isInStock: true },
      specifications: { weight: '2.5kg', material: 'Stainless Steel', countryOfOrigin: 'India' },
      tags: ['cooker', 'kitchen', 'stainless'],
      isFeatured: false,
    },
    {
      name: 'Borosil Glass Dinner Set',
      description: 'Complete dinner set with 6 plates, bowls, and glasses. Microwave safe.',
      category: 'home', subcategory: 'kitchen', brand: 'Borosil', sku: `BORO6-${distUser._id.toString().slice(-5)}`,
      images: [{ url: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=400&h=400&fit=crop', alt: 'Dinner Set', isPrimary: true }],
      pricing: { mrp: 1999, sellingPrice: 1799, distributorPrice: 1599, currency: 'INR' },
      inventory: { quantity: 25, isInStock: true },
      specifications: { weight: '3kg', material: 'Glass', countryOfOrigin: 'India' },
      tags: ['dinner', 'glass', 'microwave'],
      isFeatured: true,
    },

    // Beauty - Skincare
    {
      name: 'Lakme Face Cream',
      description: 'Moisturizing face cream with SPF protection for daily use.',
      category: 'beauty', subcategory: 'skincare', brand: 'Lakme', sku: `LAKFC-${distUser._id.toString().slice(-5)}`,
      images: [{ url: 'https://images.unsplash.com/photo-1556228720-195a67e0784d?w=400&h=400&fit=crop', alt: 'Face Cream', isPrimary: true }],
      pricing: { mrp: 299, sellingPrice: 249, distributorPrice: 199, currency: 'INR' },
      inventory: { quantity: 120, isInStock: true },
      specifications: { weight: '50g', countryOfOrigin: 'India' },
      tags: ['cream', 'skincare', 'spf'],
      isFeatured: false,
    },
    {
      name: 'Maybelline Lipstick',
      description: 'Long-lasting matte lipstick with vibrant colors and smooth application.',
      category: 'beauty', subcategory: 'makeup', brand: 'Maybelline', sku: `MAYLIP-${distUser._id.toString().slice(-5)}`,
      images: [{ url: 'https://images.unsplash.com/photo-1586495777744-4413f21062fa?w=400&h=400&fit=crop', alt: 'Lipstick', isPrimary: true }],
      pricing: { mrp: 599, sellingPrice: 499, distributorPrice: 399, currency: 'INR' },
      inventory: { quantity: 80, isInStock: true },
      specifications: { weight: '3.5g', countryOfOrigin: 'India' },
      tags: ['lipstick', 'makeup', 'matte'],
      isFeatured: false,
    },

    // Sports - Fitness
    {
      name: 'Nike Air Max 270',
      description: 'Comfortable running shoes with responsive cushioning and breathable upper.',
      category: 'sports', subcategory: 'footwear', brand: 'Nike', sku: `NIKE270-${distUser._id.toString().slice(-5)}`,
      images: [{ url: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400&h=400&fit=crop', alt: 'Nike Shoes', isPrimary: true }],
      pricing: { mrp: 12999, sellingPrice: 10999, distributorPrice: 8999, currency: 'INR' },
      inventory: { quantity: 30, isInStock: true },
      specifications: { weight: '300g', color: 'White/Black', countryOfOrigin: 'Vietnam' },
      tags: ['shoes', 'running', 'nike'],
      isFeatured: true,
    },
    {
      name: 'Adidas Yoga Mat',
      description: 'Non-slip yoga mat with excellent grip and cushioning for comfortable practice.',
      category: 'sports', subcategory: 'fitness', brand: 'Adidas', sku: `ADIMAT-${distUser._id.toString().slice(-5)}`,
      images: [{ url: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=400&h=400&fit=crop', alt: 'Yoga Mat', isPrimary: true }],
      pricing: { mrp: 2999, sellingPrice: 2499, distributorPrice: 1999, currency: 'INR' },
      inventory: { quantity: 50, isInStock: true },
      specifications: { weight: '1.2kg', material: 'PVC', countryOfOrigin: 'India' },
      tags: ['yoga', 'mat', 'fitness'],
      isFeatured: false,
    },

    // Books - Fiction
    {
      name: 'The Alchemist by Paulo Coelho',
      description: 'Inspirational novel about following your dreams and finding your personal legend.',
      category: 'books', subcategory: 'fiction', brand: 'HarperCollins', sku: `ALCHEM-${distUser._id.toString().slice(-5)}`,
      images: [{ url: 'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=400&h=400&fit=crop', alt: 'The Alchemist', isPrimary: true }],
      pricing: { mrp: 399, sellingPrice: 349, distributorPrice: 299, currency: 'INR' },
      inventory: { quantity: 100, isInStock: true },
      specifications: { weight: '200g', pages: '208', countryOfOrigin: 'India' },
      tags: ['book', 'fiction', 'inspirational'],
      isFeatured: true,
    },
    {
      name: 'Atomic Habits by James Clear',
      description: 'Self-help book about building good habits and breaking bad ones.',
      category: 'books', subcategory: 'self-help', brand: 'Random House', sku: `ATOMIC-${distUser._id.toString().slice(-5)}`,
      images: [{ url: 'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=400&h=400&fit=crop', alt: 'Atomic Habits', isPrimary: true }],
      pricing: { mrp: 599, sellingPrice: 499, distributorPrice: 399, currency: 'INR' },
      inventory: { quantity: 75, isInStock: true },
      specifications: { weight: '300g', pages: '320', countryOfOrigin: 'India' },
      tags: ['book', 'selfhelp', 'habits'],
      isFeatured: true,
    },

    // Toys - Educational
    {
      name: 'LEGO Classic Creative Box',
      description: 'Creative building set with colorful bricks to spark imagination and creativity.',
      category: 'toys', subcategory: 'educational', brand: 'LEGO', sku: `LEGOCB-${distUser._id.toString().slice(-5)}`,
      images: [{ url: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=400&fit=crop', alt: 'LEGO Set', isPrimary: true }],
      pricing: { mrp: 2999, sellingPrice: 2499, distributorPrice: 1999, currency: 'INR' },
      inventory: { quantity: 40, isInStock: true },
      specifications: { weight: '1.5kg', age: '4+', countryOfOrigin: 'Denmark' },
      tags: ['lego', 'building', 'creative'],
      isFeatured: true,
    },
    {
      name: 'Barbie Dreamhouse',
      description: 'Three-story dollhouse with furniture and accessories for imaginative play.',
      category: 'toys', subcategory: 'dolls', brand: 'Mattel', sku: `BARBIE-${distUser._id.toString().slice(-5)}`,
      images: [{ url: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=400&fit=crop', alt: 'Barbie House', isPrimary: true }],
      pricing: { mrp: 8999, sellingPrice: 7999, distributorPrice: 6999, currency: 'INR' },
      inventory: { quantity: 15, isInStock: true },
      specifications: { weight: '3kg', age: '3+', countryOfOrigin: 'China' },
      tags: ['barbie', 'dollhouse', 'dolls'],
      isFeatured: false,
    },

    // Automotive - Accessories
    {
      name: 'Car Phone Holder',
      description: 'Magnetic car phone holder with adjustable mount for dashboard or windshield.',
      category: 'automotive', subcategory: 'accessories', brand: 'Generic', sku: `CARPH-${distUser._id.toString().slice(-5)}`,
      images: [{ url: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=400&fit=crop', alt: 'Phone Holder', isPrimary: true }],
      pricing: { mrp: 899, sellingPrice: 699, distributorPrice: 499, currency: 'INR' },
      inventory: { quantity: 60, isInStock: true },
      specifications: { weight: '150g', material: 'Plastic', countryOfOrigin: 'China' },
      tags: ['phone', 'holder', 'car'],
      isFeatured: false,
    },
    {
      name: 'Car Air Freshener',
      description: 'Long-lasting car air freshener with pleasant fragrance for 30 days.',
      category: 'automotive', subcategory: 'accessories', brand: 'Ambi Pur', sku: `AMBIP-${distUser._id.toString().slice(-5)}`,
      images: [{ url: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=400&fit=crop', alt: 'Air Freshener', isPrimary: true }],
      pricing: { mrp: 199, sellingPrice: 169, distributorPrice: 139, currency: 'INR' },
      inventory: { quantity: 200, isInStock: true },
      specifications: { weight: '50g', countryOfOrigin: 'India' },
      tags: ['freshener', 'car', 'fragrance'],
      isFeatured: false,
    }
  ];
  return base.map(p => ({ ...p, distributor: distUser._id }));
}

async function createProducts(distributors) {
  let createdCount = 0;
  for (const d of distributors) {
    const prods = sampleProducts(d);
    // Avoid duplicate SKUs if script re-run
    const skus = prods.map(p => p.sku);
    const existing = await Product.find({ sku: { $in: skus } }).select('sku');
    const existingSet = new Set(existing.map(e => e.sku));
    const toCreate = prods.filter(p => !existingSet.has(p.sku));
    if (toCreate.length) {
      const created = await Product.insertMany(toCreate);
      createdCount += created.length;
    }
  }
  console.log(`Created ${createdCount} products.`);
}

(async () => {
  try {
    await connect();
    const distributors = await createDistributors();
    await createProducts(distributors);
  } catch (err) {
    console.error(err);
  } finally {
    await mongoose.connection.close();
    console.log('Disconnected.');
  }
})();
