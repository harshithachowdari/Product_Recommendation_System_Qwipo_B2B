import React, { useState } from 'react';
import { useQuery, useMutation } from 'react-query';
import { Star, TrendingUp, Gift, Sparkles, RefreshCw } from 'lucide-react';
import styled from 'styled-components';
import ProductCard from '../components/ProductCard';
import LoadingSpinner from '../components/LoadingSpinner';
import { recommendationsAPI, productsAPI } from '../services/api';
import { useAuth } from '../contexts/AuthContext';

const RecommendationsContainer = styled.div`
  min-height: calc(100vh - 4rem);
  background: #f8fafc;
`;

const HeroSection = styled.section`
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  padding: 4rem 0;
  text-align: center;
`;

const HeroContent = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 1rem;
`;

const HeroTitle = styled.h1`
  font-size: 3rem;
  font-weight: 700;
  margin-bottom: 1.5rem;
  line-height: 1.2;

  @media (max-width: 768px) {
    font-size: 2rem;
  }
`;

const HeroSubtitle = styled.p`
  font-size: 1.25rem;
  margin-bottom: 2rem;
  opacity: 0.9;
  max-width: 600px;
  margin-left: auto;
  margin-right: auto;

  @media (max-width: 768px) {
    font-size: 1rem;
  }
`;

const ContentSection = styled.section`
  padding: 4rem 0;
`;

const Container = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 1rem;
`;

const SectionHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
  flex-wrap: wrap;
  gap: 1rem;
`;

const SectionTitle = styled.h2`
  font-size: 2rem;
  font-weight: 700;
  color: #1e293b;
  margin: 0;
`;

const RefreshButton = styled.button`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1rem;
  background: #3b82f6;
  color: white;
  border: none;
  border-radius: 0.5rem;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover:not(:disabled) {
    background: #2563eb;
  }

  &:disabled {
    background: #9ca3af;
    cursor: not-allowed;
  }
`;

const TabsContainer = styled.div`
  display: flex;
  gap: 0.5rem;
  margin-bottom: 2rem;
  background: white;
  padding: 0.5rem;
  border-radius: 0.75rem;
  box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1);
`;

const Tab = styled.button`
  flex: 1;
  padding: 0.75rem 1rem;
  border: none;
  background: ${props => props.active ? '#3b82f6' : 'transparent'};
  color: ${props => props.active ? 'white' : '#6b7280'};
  border-radius: 0.5rem;
  cursor: pointer;
  transition: all 0.2s ease;
  font-weight: 500;

  &:hover:not(.active) {
    background: #f1f5f9;
    color: #374151;
  }
`;

const ProductsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 1.5rem;
  margin-bottom: 3rem;
`;

const BundleSection = styled.div`
  background: white;
  border-radius: 1rem;
  padding: 2rem;
  margin-bottom: 2rem;
  box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1);
`;

const BundleHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 1.5rem;
`;

const BundleIcon = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 3rem;
  height: 3rem;
  background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
  color: white;
  border-radius: 0.75rem;
`;

const BundleTitle = styled.h3`
  font-size: 1.5rem;
  font-weight: 700;
  color: #1e293b;
  margin: 0;
`;

const BundleDescription = styled.p`
  color: #64748b;
  margin-bottom: 1.5rem;
`;

const BundleProducts = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1rem;
`;

const BundleProduct = styled.div`
  background: #f8fafc;
  border-radius: 0.5rem;
  padding: 1rem;
  text-align: center;
  transition: all 0.2s ease;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
  }
`;

const BundleProductName = styled.div`
  font-weight: 600;
  margin-bottom: 0.5rem;
  color: #1e293b;
`;

const BundleProductPrice = styled.div`
  font-size: 0.875rem;
  color: #3b82f6;
  font-weight: 500;
`;

const EmptyState = styled.div`
  text-align: center;
  padding: 4rem 2rem;
  background: white;
  border-radius: 1rem;
  box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1);
`;

const EmptyStateIcon = styled.div`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 4rem;
  height: 4rem;
  background: #f1f5f9;
  color: #6b7280;
  border-radius: 1rem;
  margin-bottom: 1rem;
`;

const EmptyStateTitle = styled.h3`
  font-size: 1.25rem;
  font-weight: 600;
  margin-bottom: 0.5rem;
  color: #1e293b;
`;

const EmptyStateText = styled.p`
  color: #6b7280;
  margin-bottom: 1.5rem;
`;

const GenerateButton = styled.button`
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1.5rem;
  background: #3b82f6;
  color: white;
  border: none;
  border-radius: 0.5rem;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover:not(:disabled) {
    background: #2563eb;
  }

  &:disabled {
    background: #9ca3af;
    cursor: not-allowed;
  }
`;

const Recommendations = () => {
  const { user } = useAuth();
  // Default guests to seasonal tab so they see content immediately
  const [activeTab, setActiveTab] = useState(() => (typeof window !== 'undefined' && !localStorage.getItem('token') ? 'seasonal' : 'ai'));
  const [wishlist, setWishlist] = useState(new Set());
  const [fallback, setFallback] = useState({ seasonal: [], trending: [], personalized: [], bundles: [] });

  // Fetch personalized/AI recommendations
  const { 
    data: personalizedData, 
    isLoading: personalizedLoading,
    refetch: refetchPersonalized 
  } = useQuery(
    'personalized-recommendations',
    () => recommendationsAPI.getPersonalized(),
    {
      enabled: !!user && (activeTab === 'personalized' || activeTab === 'ai'),
      staleTime: 5 * 60 * 1000,
    }
  );

  // Fetch seasonal recommendations
  const { 
    data: seasonalData, 
    isLoading: seasonalLoading,
    error: seasonalError
  } = useQuery(
    'seasonal-recommendations',
    () => recommendationsAPI.getSeasonal(),
    {
      enabled: activeTab === 'seasonal' && !!localStorage.getItem('token'),
      staleTime: 10 * 60 * 1000,
      retry: false,
    }
  );

  // Fetch trending recommendations
  const { 
    data: trendingData, 
    isLoading: trendingLoading 
  } = useQuery(
    'trending-recommendations',
    () => recommendationsAPI.getTrending(),
    {
      enabled: activeTab === 'trending' && !!localStorage.getItem('token'),
      staleTime: 5 * 60 * 1000,
    }
  );

  // Fetch bundles
  const { 
    data: bundlesData, 
    isLoading: bundlesLoading,
    error: bundlesError
  } = useQuery(
    'bundles',
    () => recommendationsAPI.getBundles(),
    {
      enabled: activeTab === 'bundles' && !!localStorage.getItem('token'),
      staleTime: 10 * 60 * 1000,
      retry: false,
    }
  );

  // Load public fallbacks for non-auth or failing endpoints
  React.useEffect(() => {
    const loadFallbacks = async () => {
      try {
        const [listRes, featuredRes, seasonalRes] = await Promise.all([
          productsAPI.getProducts({ limit: 50 }).catch(() => ({ data: { data: { products: [] } } })),
          productsAPI.getFeaturedProducts().catch(() => ({ data: { data: { products: [] } } })),
          productsAPI.getSeasonalProducts().catch(() => ({ data: { data: { products: [] } } })),
        ]);
        let pool = listRes?.data?.data?.products || [];
        let featured = featuredRes?.data?.data?.products || [];
        let seasonal = seasonalRes?.data?.data?.products || [];

        if (pool.length === 0 && featured.length === 0 && seasonal.length === 0) {
          const sample = [
            { _id: 'r1', name: 'Premium Basmati Rice - 5kg', description: 'High-quality long grain basmati rice', category: 'grocery', brand: 'India Gate', pricing: { mrp: 2450, sellingPrice: 2200 }, inventory: { quantity: 120, minStockLevel: 12, isInStock: true }, rating: { average: 4.5, count: 234 }, images: ['data:image/jpeg;base64,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'] },
            { _id: 'r2', name: 'Coca Cola 2L Pack of 12', description: 'Refreshing cola soft drink', category: 'beverages', brand: 'Coca Cola', pricing: { mrp: 900, sellingPrice: 840 }, inventory: { quantity: 85, minStockLevel: 8, isInStock: true }, rating: { average: 4.2, count: 156 }, images: ['data:image/jpeg;base64,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'] },
            { _id: 'r3', name: 'Sony WH-1000XM4', description: 'Noise-cancelling headphones', category: 'electronics', brand: 'Sony', pricing: { mrp: 28000, sellingPrice: 25000 }, inventory: { quantity: 40, minStockLevel: 4, isInStock: true }, rating: { average: 4.7, count: 150 }, images: ['data:image/jpeg;base64,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'] },
            { _id: 'r4', name: 'Business Suit - Navy', description: 'Formal business suit', category: 'clothing', brand: 'Raymond', pricing: { mrp: 8000, sellingPrice: 6500 }, inventory: { quantity: 30, minStockLevel: 5, isInStock: true }, rating: { average: 4.5, count: 120 }, images: ['https://westwoodhart.com/cdn/shop/articles/navy-charcoal-foundation-suits-business.png?v=1735728562&width=1456'] },
            { _id: 'r5', name: 'Paracetamol 500mg (100 tablets)', description: 'Pain relief and fever reducer', category: 'pharmacy', brand: 'Crocin', pricing: { mrp: 150, sellingPrice: 120 }, inventory: { quantity: 500, minStockLevel: 50, isInStock: true }, rating: { average: 4.2, count: 200 }, images: ['https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?q=80&w=1200&auto=format&fit=crop'] },
            { _id: 'r6', name: 'Instant Coffee 200g', description: 'Rich and aromatic instant coffee', category: 'beverages', brand: 'Nescafe', pricing: { mrp: 260, sellingPrice: 220 }, inventory: { quantity: 140, minStockLevel: 14, isInStock: true }, rating: { average: 4.4, count: 95 }, images: ['https://images.unsplash.com/photo-1527161153335-c7e1df2d4bfb?q=80&w=1200&auto=format&fit=crop'] },
            { _id: 'r7', name: 'Mineral Water 1L (Pack of 24)', description: 'Pure mineral water', category: 'beverages', brand: 'Bisleri', pricing: { mrp: 360, sellingPrice: 300 }, inventory: { quantity: 300, minStockLevel: 30, isInStock: true }, rating: { average: 4.1, count: 60 }, images: ['https://images.unsplash.com/photo-1526401485004-2fda9f4c8b0e?q=80&w=1200&auto=format&fit=crop'] },
            { _id: 'r8', name: 'Paneer 500g (Fresh)', description: 'Fresh cottage cheese', category: 'grocery', brand: 'Amul', pricing: { mrp: 120, sellingPrice: 100 }, inventory: { quantity: 80, minStockLevel: 8, isInStock: true }, rating: { average: 4.3, count: 60 }, images: ['https://images.unsplash.com/photo-1604908554154-439f3b2a644d?q=80&w=1200&auto=format&fit=crop'] },
            { _id: 'r9', name: 'LG 55" 4K Smart TV', description: 'Stunning 4K UHD TV', category: 'electronics', brand: 'LG', pricing: { mrp: 65000, sellingPrice: 58000 }, inventory: { quantity: 15, minStockLevel: 2, isInStock: true }, rating: { average: 4.4, count: 95 }, images: ['https://images.unsplash.com/photo-1583225232838-6d8a5a2b7b52?q=80&w=1200&auto=format&fit=crop'] },
            { _id: 'r10', name: 'Chef Uniform Set', description: 'Professional chef jacket and pants', category: 'clothing', brand: 'Chef Pro', pricing: { mrp: 2500, sellingPrice: 2000 }, inventory: { quantity: 100, minStockLevel: 10, isInStock: true }, rating: { average: 4.3, count: 75 }, images: ['https://images.unsplash.com/photo-1582456891925-4325b0a39aea?q=80&w=1200&auto=format&fit=crop'] },
            { _id: 'r11', name: 'Ghee - 1kg', description: 'Pure desi ghee', category: 'grocery', brand: 'Amul', pricing: { mrp: 600, sellingPrice: 500 }, inventory: { quantity: 100, minStockLevel: 10, isInStock: true }, rating: { average: 4.7, count: 150 }, images: ['https://images.unsplash.com/photo-1590574639257-0a7b5b8b6f20?q=80&w=1200&auto=format&fit=crop'] },
            { _id: 'r12', name: 'Black Pepper 200g', description: 'Whole pepper corns', category: 'grocery', brand: 'Everest', pricing: { mrp: 200, sellingPrice: 160 }, inventory: { quantity: 150, minStockLevel: 15, isInStock: true }, rating: { average: 4.4, count: 80 }, images: ['https://images.unsplash.com/photo-1604908176997-431c0bbd10b2?q=80&w=1200&auto=format&fit=crop'] },
            { _id: 'r13', name: 'Mustard Oil 1L', description: 'Pure mustard oil', category: 'grocery', brand: 'Fortune', pricing: { mrp: 180, sellingPrice: 150 }, inventory: { quantity: 200, minStockLevel: 20, isInStock: true }, rating: { average: 4.2, count: 75 }, images: ['https://images.unsplash.com/photo-1582719271756-6af9b8efb725?q=80&w=1200&auto=format&fit=crop'] },
            { _id: 'r14', name: 'Green Tea (100 bags)', description: 'Antioxidant rich green tea', category: 'beverages', brand: 'Tetley', pricing: { mrp: 180, sellingPrice: 150 }, inventory: { quantity: 200, minStockLevel: 20, isInStock: true }, rating: { average: 4.3, count: 70 }, images: ['https://images.unsplash.com/photo-1470167290877-7d5d3446de4c?q=80&w=1200&auto=format&fit=crop'] },
            { _id: 'r15', name: 'Bread White (Pack of 12)', description: 'Soft and fresh bread loaves', category: 'grocery', brand: 'Britannia', pricing: { mrp: 180, sellingPrice: 150 }, inventory: { quantity: 100, minStockLevel: 10, isInStock: true }, rating: { average: 4.0, count: 40 }, images: ['https://images.unsplash.com/photo-1542831371-29b0f74f9713?q=80&w=1200&auto=format&fit=crop'] },
            { _id: 'r16', name: 'Samsung Galaxy Tab A8', description: '10.5 inch tablet', category: 'electronics', brand: 'Samsung', pricing: { mrp: 25000, sellingPrice: 22000 }, inventory: { quantity: 25, minStockLevel: 3, isInStock: true }, rating: { average: 4.5, count: 120 }, images: ['https://images.unsplash.com/photo-1517336714731-489689fd1ca8?q=80&w=1200&auto=format&fit=crop'] },
            { _id: 'r17', name: 'Haldiram Namkeen Combo Pack', description: 'Assorted snacks', category: 'grocery', brand: 'Haldiram', pricing: { mrp: 699, sellingPrice: 650 }, inventory: { quantity: 64, minStockLevel: 8, isInStock: true }, rating: { average: 4.3, count: 89 }, images: ['https://images.unsplash.com/photo-1543352634-8730a9b5a501?q=80&w=1200&auto=format&fit=crop'] },
            { _id: 'r18', name: 'Whole Wheat Flour - 10kg', description: 'Fresh flour', category: 'grocery', brand: 'Aashirvaad', pricing: { mrp: 380, sellingPrice: 320 }, inventory: { quantity: 170, minStockLevel: 20, isInStock: true }, rating: { average: 4.4, count: 95 }, images: ['https://images.unsplash.com/photo-1615486364266-4f6bb6bb0434?q=80&w=1200&auto=format&fit=crop'] },
            { _id: 'r19', name: 'Premium Tea Leaves - 1kg', description: 'High-grade Assam tea', category: 'beverages', brand: 'Tata Tea', pricing: { mrp: 650, sellingPrice: 550 }, inventory: { quantity: 150, minStockLevel: 15, isInStock: true }, rating: { average: 4.6, count: 110 }, images: ['https://images.unsplash.com/photo-1517705008128-361805f42e86?q=80&w=1200&auto=format&fit=crop'] },
            { _id: 'r20', name: 'Refined Sunflower Oil - 15L', description: 'Pure sunflower oil', category: 'grocery', brand: 'Fortune', pricing: { mrp: 1600, sellingPrice: 1400 }, inventory: { quantity: 200, minStockLevel: 20, isInStock: true }, rating: { average: 4.3, count: 85 }, images: ['https://images.unsplash.com/photo-1573811616712-314c77b46f38?q=80&w=1200&auto=format&fit=crop'] },
          ];
          // Normalize images to clean external URLs for faster loading
          const idImageMap = {
            r1: 'https://images.unsplash.com/photo-1604908554007-8b4cf935d0d9?w=1200&auto=format&fit=crop',
            r2: 'https://images.unsplash.com/photo-1629198735668-3fe0e9ff63fd?w=1200&auto=format&fit=crop',
            r3: 'https://images.unsplash.com/photo-1518443333755-639c1cd3ed3f?w=1200&auto=format&fit=crop',
            r4: 'https://westwoodhart.com/cdn/shop/articles/navy-charcoal-foundation-suits-business.png?width=1200',
          };
          const categoryImages = {
            grocery: 'https://images.unsplash.com/photo-1560807707-8cc77767d783?w=1200&auto=format&fit=crop',
            beverages: 'https://images.unsplash.com/photo-1509057199576-632a47484ece?w=1200&auto=format&fit=crop',
            electronics: 'https://images.unsplash.com/photo-1518779578993-ec3579fee39f?w=1200&auto=format&fit=crop',
            clothing: 'https://images.unsplash.com/photo-1520975693410-001d8d6b0a72?w=1200&auto=format&fit=crop',
            pharmacy: 'https://images.unsplash.com/photo-1584367369853-8b966cf2234e?w=1200&auto=format&fit=crop',
            general: 'https://images.unsplash.com/photo-1519337265831-281ec6cc8514?w=1200&auto=format&fit=crop',
          };
          sample = sample.map(p => {
            const byId = idImageMap[p._id];
            const cat = (p.category || 'general').toLowerCase();
            const url = byId || categoryImages[cat] || categoryImages.general;
            return { ...p, images: [url] };
          });
          pool = sample;
          featured = sample;
          seasonal = sample;
        }
        // Build simple demo bundles from featured/seasonal
        const makeBundle = (name, items) => ({
          id: name.toLowerCase().replace(/\s+/g, '-'),
          name,
          description: 'Curated bundle for better margins',
          products: items.slice(0, 4)
        });
        const demoBundles = [
          makeBundle('Starter Pack', featured.slice(0, 4)),
          makeBundle('Seasonal Picks', (seasonal.length ? seasonal : featured).slice(4, 8)),
        ];

        const pool20 = (pool.length ? pool : featured).slice(0, 20);

        // Build an "AI" flavored list different from Personalized
        const score = (p) => {
          const r = p?.rating?.average ?? 0;
          const mrp = p?.pricing?.mrp ?? 0;
          const sp = p?.pricing?.sellingPrice ?? 0;
          const discountPct = mrp > sp ? ((mrp - sp) / mrp) * 100 : 0;
          const trend = (p?.analytics?.trend ?? p?.stockTrend ?? 0);
          const trendBonus = trend > 0 ? Math.min(trend, 20) / 10 : 0; // up to +2
          // Favor good rating, decent discount, positive trend, and mid price
          const pricePenalty = sp > 60000 ? 1.5 : sp > 30000 ? 1.0 : 0;
          return r * 2 + (discountPct / 10) + trendBonus - pricePenalty;
        };
        // Diversify by category (max 3 per category) and pick top by score
        const byCatCount = {};
        const aiList = [...pool20]
          .sort((a, b) => score(b) - score(a))
          .filter(p => {
            const c = (p.category || 'general').toLowerCase();
            byCatCount[c] = (byCatCount[c] || 0);
            if (byCatCount[c] >= 3) return false;
            byCatCount[c]++;
            return true;
          })
          .slice(0, 12);

        setFallback({
          ai: aiList,
          seasonal,
          trending: pool20,
          personalized: pool20,
          bundles: demoBundles,
        });
      } catch (e) {
        // ignore; UI will show empty state
      }
    };
    loadFallbacks();
  }, []);

  // Generate new recommendations (mutation)
  const { mutate: generateRecommendations, isLoading: isGenerating } = useMutation(
    () => recommendationsAPI.generateRecommendations(),
    {
      onSuccess: () => {
        refetchPersonalized();
      },
    }
  );

  const handleAddToCart = (productId) => {
    console.log('Add to cart:', productId);
  };

  const handleToggleWishlist = (productId) => {
    setWishlist(prev => {
      const newWishlist = new Set(prev);
      if (newWishlist.has(productId)) {
        newWishlist.delete(productId);
      } else {
        newWishlist.add(productId);
      }
      return newWishlist;
    });
  };

  const handleRefresh = () => {
    if (activeTab === 'personalized') {
      refetchPersonalized();
    }
  };

  const getCurrentData = () => {
    switch (activeTab) {
      case 'ai':
        return { data: personalizedData, loading: personalizedLoading };
      case 'personalized':
        return { data: personalizedData, loading: personalizedLoading };
      case 'seasonal':
        return { data: seasonalData, loading: seasonalLoading };
      case 'trending':
        return { data: trendingData, loading: trendingLoading };
      case 'bundles':
        return { data: bundlesData, loading: bundlesLoading };
      default:
        return { data: null, loading: false };
    }
  };

  const { data: currentData, loading: currentLoading } = getCurrentData();
  const products = currentData?.data?.products?.length
    ? currentData.data.products
    : (activeTab === 'ai' ? (fallback.personalized || fallback.ai || []) : (fallback[activeTab] || []));
  const bundles = currentData?.data?.bundles || [];

  const renderProducts = () => {
    if (currentLoading && products.length === 0) {
      return <LoadingSpinner text="Loading recommendations..." />;
    }

    if (products.length === 0) {
      return (
        <EmptyState>
          <EmptyStateIcon>
            <Sparkles size={24} />
          </EmptyStateIcon>
          <EmptyStateTitle>No recommendations found</EmptyStateTitle>
          <EmptyStateText>
            {activeTab === 'personalized' 
              ? 'We need more information about your preferences to provide personalized recommendations.'
              : 'No products available in this category at the moment.'
            }
          </EmptyStateText>
          {activeTab === 'personalized' && user && (
            <GenerateButton 
              onClick={() => generateRecommendations()}
              disabled={isGenerating}
            >
              {isGenerating ? (
                <>
                  <div className="loading" />
                  Generating...
                </>
              ) : (
                <>
                  <RefreshCw size={16} />
                  Generate Recommendations
                </>
              )}
            </GenerateButton>
          )}
        </EmptyState>
      );
    }

    return (
      <ProductsGrid>
        {products.map((product) => (
          <ProductCard
            key={product._id}
            product={product}
            onAddToCart={handleAddToCart}
            onToggleWishlist={handleToggleWishlist}
            isInWishlist={wishlist.has(product._id)}
          />
        ))}
      </ProductsGrid>
    );
  };

  const renderBundles = () => {
    if (currentLoading) {
      return <LoadingSpinner text="Loading bundles..." />;
    }

    if (bundles.length === 0) {
      return (
        <div>
          {(fallback.bundles || []).map((bundle) => (
            <BundleSection key={bundle.id}>
              <BundleHeader>
                <BundleIcon>
                  <Gift size={20} />
                </BundleIcon>
                <div>
                  <BundleTitle>{bundle.name}</BundleTitle>
                  <BundleDescription>{bundle.description}</BundleDescription>
                </div>
              </BundleHeader>
              <BundleProducts>
                {bundle.products?.map((product, index) => (
                  <BundleProduct key={index}>
                    <BundleProductName>{product.name}</BundleProductName>
                    <BundleProductPrice>
                      ₹{product.pricing?.sellingPrice?.toLocaleString()}
                    </BundleProductPrice>
                  </BundleProduct>
                ))}
              </BundleProducts>
            </BundleSection>
          ))}
        </div>
      );
    }

    return (
      <div>
        {bundles.map((bundle) => (
          <BundleSection key={bundle.id}>
            <BundleHeader>
              <BundleIcon>
                <Gift size={20} />
              </BundleIcon>
              <div>
                <BundleTitle>{bundle.name}</BundleTitle>
                <BundleDescription>{bundle.description}</BundleDescription>
              </div>
            </BundleHeader>
            <BundleProducts>
              {bundle.products?.map((product, index) => (
                <BundleProduct key={index}>
                  <BundleProductName>{product.name}</BundleProductName>
                  <BundleProductPrice>
                    ₹{product.pricing?.sellingPrice?.toLocaleString()}
                  </BundleProductPrice>
                </BundleProduct>
              ))}
            </BundleProducts>
          </BundleSection>
        ))}
      </div>
    );
  };

  return (
    <RecommendationsContainer>
      {/* Hero Section */}
      <HeroSection>
        <HeroContent>
          <HeroTitle>Smart Recommendations</HeroTitle>
          <HeroSubtitle>
            Discover products tailored to your business needs with our AI-powered recommendation engine.
          </HeroSubtitle>
        </HeroContent>
      </HeroSection>

      {/* Content Section */}
      <ContentSection>
        <Container>
          <SectionHeader>
            <SectionTitle>{activeTab === 'ai' ? 'AI Recommendations' : activeTab === 'personalized' ? 'Recommended for You' : activeTab === 'seasonal' ? 'Seasonal Picks' : activeTab === 'trending' ? 'Trending Now' : 'Bundles'}</SectionTitle>
            {(activeTab === 'ai' || activeTab === 'personalized') && (
              <RefreshButton onClick={handleRefresh} disabled={currentLoading}>
                <RefreshCw size={16} />
                Refresh
              </RefreshButton>
            )}
          </SectionHeader>

          <TabsContainer>
            <Tab
              active={activeTab === 'ai'}
              onClick={() => setActiveTab('ai')}
            >
              <Sparkles size={16} /> AI
            </Tab>
            <Tab
              active={activeTab === 'personalized'}
              onClick={() => setActiveTab('personalized')}
            >
              <Star size={16} /> Personalized
            </Tab>
            <Tab
              active={activeTab === 'seasonal'}
              onClick={() => setActiveTab('seasonal')}
            >
              <TrendingUp size={16} style={{ marginRight: '0.5rem' }} />
              Seasonal
            </Tab>
            <Tab
              active={activeTab === 'trending'}
              onClick={() => setActiveTab('trending')}
            >
              <Star size={16} style={{ marginRight: '0.5rem' }} />
              Trending
            </Tab>
            <Tab
              active={activeTab === 'bundles'}
              onClick={() => setActiveTab('bundles')}
            >
              <Gift size={16} style={{ marginRight: '0.5rem' }} />
              Bundles
            </Tab>
          </TabsContainer>

          {activeTab === 'bundles' ? renderBundles() : renderProducts()}
        </Container>
      </ContentSection>
    </RecommendationsContainer>
  );
};

export default Recommendations;
