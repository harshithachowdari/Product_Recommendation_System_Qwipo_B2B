import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useQuery } from 'react-query';
import { 
  ArrowRight, 
  Star, 
  TrendingUp, 
  Gift, 
  Shield, 
  Zap, 
  ShoppingBag, 
  Users, 
  Award,
  Clock,
  CheckCircle,
  Sparkles,
  Target,
  BarChart3
} from 'lucide-react';
import styled from 'styled-components';
import ProductCard from '../components/ProductCard';
import SearchBar from '../components/SearchBar';
import LoadingSpinner from '../components/LoadingSpinner';
import { productsAPI, recommendationsAPI } from '../services/api';

const HomeContainer = styled.div`
  min-height: calc(100vh - 4rem);
  background: #f9fafb;
`;

const HeroSection = styled.section`
  position: relative;
  background: #1f2937;
  color: white;
  padding: var(--space-20) 0;
`;

const HeroContent = styled.div`
  position: relative;
  max-width: 1280px;
  margin: 0 auto;
  padding: 0 var(--space-4);
  text-align: center;
  z-index: 1;
`;

const HeroTitle = styled.h1`
  font-size: var(--font-size-5xl);
  font-weight: 800;
  margin-bottom: var(--space-6);
  line-height: 1.1;
  color: white;
  
  @media (max-width: 768px) {
    font-size: var(--font-size-4xl);
  }
  
  @media (max-width: 640px) {
    font-size: var(--font-size-3xl);
  }
`;

const HeroSubtitle = styled.p`
  font-size: var(--font-size-xl);
  margin-bottom: var(--space-8);
  opacity: 0.9;
  max-width: 600px;
  margin-left: auto;
  margin-right: auto;
  font-weight: 400;
  
  @media (max-width: 768px) {
    font-size: var(--font-size-lg);
  }
`;

const HeroActions = styled.div`
  display: flex;
  gap: var(--space-4);
  justify-content: center;
  flex-wrap: wrap;
  margin-bottom: var(--space-12);
`;

const HeroButton = styled(Link)`
  display: inline-flex;
  align-items: center;
  gap: var(--space-2);
  padding: var(--space-4) var(--space-8);
  background: white;
  color: var(--primary-600);
  border-radius: var(--radius-xl);
  font-weight: 600;
  font-size: var(--font-size-lg);
  text-decoration: none;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  box-shadow: var(--shadow-lg);
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: var(--shadow-xl);
    background: var(--primary-50);
  }
`;

const HeroButtonSecondary = styled(Link)`
  display: inline-flex;
  align-items: center;
  gap: var(--space-2);
  padding: var(--space-4) var(--space-8);
  background: transparent;
  color: white;
  border: 2px solid rgba(255, 255, 255, 0.3);
  border-radius: var(--radius-xl);
  font-weight: 600;
  font-size: var(--font-size-lg);
  text-decoration: none;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  
  &:hover {
    background: rgba(255, 255, 255, 0.1);
    border-color: rgba(255, 255, 255, 0.5);
    transform: translateY(-2px);
  }
`;

const StatsSection = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: var(--space-8);
  margin-top: var(--space-12);
`;

const StatItem = styled.div`
  text-align: center;
  padding: var(--space-6);
  background: rgba(255, 255, 255, 0.1);
  border-radius: var(--radius-xl);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.2);
`;

const StatNumber = styled.div`
  font-size: var(--font-size-3xl);
  font-weight: 800;
  margin-bottom: var(--space-2);
  color: white;
`;

const StatLabel = styled.div`
  font-size: var(--font-size-sm);
  opacity: 0.8;
  text-transform: uppercase;
  letter-spacing: 0.05em;
`;

const FeaturesSection = styled.section`
  padding: var(--space-20) 0;
  background: linear-gradient(135deg, var(--primary-700) 0%, var(--secondary-600) 50%, var(--accent-500) 100%);
  position: relative;
  color: #fff;
  
  &::before {
    content: '';
    position: absolute;
    inset: 0;
    background: radial-gradient(ellipse at top left, rgba(255,255,255,0.15), transparent 40%),
                radial-gradient(ellipse at bottom right, rgba(255,255,255,0.12), transparent 45%);
    pointer-events: none;
  }
`;

const FeaturesContainer = styled.div`
  max-width: 1280px;
  margin: 0 auto;
  padding: 0 var(--space-4);
`;

const SectionTitle = styled.h2`
  font-size: var(--font-size-4xl);
  font-weight: 800;
  text-align: center;
  margin-bottom: var(--space-4);
  background: linear-gradient(135deg, #ffffff 0%, #e2e8f0 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
`;

const SectionSubtitle = styled.p`
  font-size: var(--font-size-lg);
  text-align: center;
  margin-bottom: var(--space-16);
  color: rgba(255, 255, 255, 0.9);
  max-width: 700px;
  margin-left: auto;
  margin-right: auto;
`;

const FeaturesGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: var(--space-8);
  margin-bottom: var(--space-16);
`;

const FeatureCard = styled.div`
  padding: var(--space-8);
  background: rgba(255, 255, 255, 0.12);
  border-radius: var(--radius-2xl);
  box-shadow: 0 10px 30px rgba(0,0,0,0.15);
  border: 1px solid rgba(255, 255, 255, 0.25);
  backdrop-filter: blur(14px);
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  text-align: center;
  color: #fff;
  
  &:hover {
    transform: translateY(-6px) scale(1.01);
    box-shadow: 0 20px 40px rgba(0,0,0,0.25);
    border-color: rgba(255, 255, 255, 0.4);
  }
`;

const FeatureIcon = styled.div`
  width: 80px;
  height: 80px;
  margin: 0 auto var(--space-6);
  background: linear-gradient(135deg, var(--primary-500) 0%, var(--primary-600) 100%);
  border-radius: var(--radius-2xl);
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: var(--font-size-2xl);
`;

const FeatureTitle = styled.h3`
  font-size: var(--font-size-xl);
  font-weight: 700;
  margin-bottom: var(--space-4);
  color: #fff;
`;

const FeatureDescription = styled.p`
  color: rgba(255, 255, 255, 0.9);
  line-height: 1.7;
`;

const ProductsSection = styled.section`
  padding: var(--space-20) 0;
  background: var(--gray-50);
`;

const ProductsContainer = styled.div`
  max-width: 1280px;
  margin: 0 auto;
  padding: 0 var(--space-4);
`;

const ProductsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: var(--space-6);
  margin-top: var(--space-12);
`;

const SectionHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: var(--space-8);
  flex-wrap: wrap;
  gap: var(--space-4);
`;

const ViewAllButton = styled(Link)`
  display: inline-flex;
  align-items: center;
  gap: var(--space-2);
  padding: var(--space-3) var(--space-6);
  background: var(--primary-500);
  color: white;
  border-radius: var(--radius-lg);
  text-decoration: none;
  font-weight: 500;
  transition: all 0.2s ease;
  
  &:hover {
    background: var(--primary-600);
    transform: translateY(-1px);
  }
`;

const CTA = styled.section`
  padding: var(--space-20) 0;
  background: linear-gradient(135deg, var(--primary-600) 0%, var(--primary-800) 100%);
  color: white;
  text-align: center;
`;

const CTAContent = styled.div`
  max-width: 800px;
  margin: 0 auto;
  padding: 0 var(--space-4);
`;

const CTATitle = styled.h2`
  font-size: var(--font-size-4xl);
  font-weight: 700;
  margin-bottom: var(--space-6);
`;

const CTADescription = styled.p`
  opacity: 0.9;
`;

const Home = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [nearbyProducts, setNearbyProducts] = useState([]);
  const [locating, setLocating] = useState(false);

  // Fetch products
  const { data: productsData, isLoading: productsLoading } = useQuery(
    ['products', { category: selectedCategory, search: searchQuery }],
    () => productsAPI.getProducts({ 
      category: selectedCategory !== 'all' ? selectedCategory : undefined,
      search: searchQuery || undefined,
      limit: 8
    }),
    {
      staleTime: 5 * 60 * 1000, // 5 minutes
    }
  );

  // Fetch recommendations
  const { data: recommendationsData, isLoading: recommendationsLoading } = useQuery(
    'recommendations',
    () => recommendationsAPI.getPersonalized({ limit: 6 }),
    {
      staleTime: 10 * 60 * 1000, // 10 minutes
    }
  );

  const products = productsData?.data?.products || [];
  const recommendations = recommendationsData?.data?.recommendations || [];

  const detectNearby = () => {
    if (!navigator.geolocation) return;
    setLocating(true);
    navigator.geolocation.getCurrentPosition(async (pos) => {
      try {
        const { latitude, longitude } = pos.coords;
        const resp = await productsAPI.getByLocation({ lat: latitude, lng: longitude, limit: 8 });
        const items = resp?.data?.data?.products || [];
        setNearbyProducts(items);
      } catch (e) {
        console.error('Nearby fetch error', e);
      } finally {
        setLocating(false);
      }
    }, () => setLocating(false), { enableHighAccuracy: true, timeout: 8000 });
  };

  const features = [
    {
      icon: <Zap size={32} />,
      title: 'AI-Powered Search',
      description: 'Find exactly what you need with our intelligent search that understands context and intent.'
    },
    {
      icon: <Gift size={32} />,
      title: 'Personalized Bundles',
      description: 'Get curated product bundles tailored to your business needs and preferences.'
    },
    {
      icon: <TrendingUp size={32} />,
      title: 'Smart Recommendations',
      description: 'Discover trending products and seasonal recommendations powered by machine learning.'
    },
    {
      icon: <Shield size={32} />,
      title: 'Secure Transactions',
      description: 'Bank-level security for all your transactions with encrypted payment processing.'
    },
    {
      icon: <Award size={32} />,
      title: 'Loyalty Rewards',
      description: 'Earn points on every purchase and unlock exclusive benefits as you grow your business.'
    },
    {
      icon: <BarChart3 size={32} />,
      title: 'Analytics Dashboard',
      description: 'Track your performance with detailed insights and analytics for better decision making.'
    }
  ];

  const stats = [
    { number: '10,000+', label: 'Active Retailers' },
    { number: '50,000+', label: 'Products Available' },
    { number: '99.9%', label: 'Uptime Guarantee' },
    { number: '24/7', label: 'Customer Support' }
  ];

  return (
    <HomeContainer>
      {/* Hero Section */}
      <HeroSection>
        <HeroContent>
          <HeroTitle>
            Transform Your Business with 
            <span style={{ color: '#fbbf24' }}> Smart Commerce</span>
          </HeroTitle>
          <HeroSubtitle>
            The ultimate B2B marketplace powered by AI. Discover products, 
            get personalized recommendations, and grow your business with confidence.
          </HeroSubtitle>
          <HeroActions>
            <HeroButton to="/search">
              <ShoppingBag size={20} />
              Start Shopping
              <ArrowRight size={20} />
            </HeroButton>
            <HeroButtonSecondary to="/about">
              <Users size={20} />
              Learn More
            </HeroButtonSecondary>
          </HeroActions>
          <StatsSection>
            {stats.map((stat, index) => (
              <StatItem key={index}>
                <StatNumber>{stat.number}</StatNumber>
                <StatLabel>{stat.label}</StatLabel>
              </StatItem>
            ))}
          </StatsSection>
        </HeroContent>
      </HeroSection>

      {/* Features Section */}
      <FeaturesSection>
        <FeaturesContainer>
          <SectionTitle>Why Choose Qwipo?</SectionTitle>
          <SectionSubtitle>
            We combine cutting-edge technology with deep industry expertise 
            to deliver the best B2B marketplace experience.
          </SectionSubtitle>
          <FeaturesGrid>
            {features.map((feature, index) => (
              <FeatureCard key={index} className="fade-in">
                <FeatureIcon>{feature.icon}</FeatureIcon>
                <FeatureTitle>{feature.title}</FeatureTitle>
                <FeatureDescription>{feature.description}</FeatureDescription>
              </FeatureCard>
            ))}
          </FeaturesGrid>
        </FeaturesContainer>
      </FeaturesSection>

      {/* Products Section */}
      <ProductsSection>
        <ProductsContainer>
          <SectionHeader>
            <div>
              <SectionTitle>Featured Products</SectionTitle>
              <SectionSubtitle>Handpicked products for your business success</SectionSubtitle>
            </div>
            <ViewAllButton to="/products">
              View All Products
              <ArrowRight size={16} />
            </ViewAllButton>
          </SectionHeader>
          {/* Search removed on home as requested */}
          {productsLoading ? (
            <div className="flex justify-center py-12">
              <LoadingSpinner size="lg" />
            </div>
          ) : (
            <ProductsGrid>
              {products.map((product, index) => (
                <div key={product._id} className="fade-in" style={{ animationDelay: `${index * 0.1}s` }}>
                  <ProductCard product={product} />
                </div>
              ))}
            </ProductsGrid>
          )}
        </ProductsContainer>
      </ProductsSection>

      {/* Recommendations Section */}
      {recommendations.length > 0 && (
        <section className="py-20 bg-white">
          <div className="container">
            <SectionHeader>
              <div>
                <SectionTitle>Recommended for You</SectionTitle>
                <SectionSubtitle>AI-powered suggestions based on your preferences</SectionSubtitle>
              </div>
            </SectionHeader>
            <ProductsGrid>
              {recommendations.map((rec, index) => (
                <div key={rec.productId} className="fade-in" style={{ animationDelay: `${index * 0.1}s` }}>
                  <ProductCard product={rec.product} />
                </div>
              ))}
            </ProductsGrid>
          </div>
        </section>
      )}

      {/* Near You Section */}
      <ProductsSection>
        <ProductsContainer>
          <SectionHeader>
            <div>
              <SectionTitle>Products Near You</SectionTitle>
              <SectionSubtitle>Discover items available from distributors around your location</SectionSubtitle>
            </div>
            <button
              onClick={detectNearby}
              disabled={locating}
              style={{ padding: '8px 16px', borderRadius: 8, border: 'none', background: 'var(--primary-600)', color: 'white', cursor: 'pointer' }}
            >
              {locating ? 'Detecting…' : 'Find Near Me'}
            </button>
          </SectionHeader>

          {nearbyProducts.length > 0 && (
            <ProductsGrid>
              {nearbyProducts.map((product, index) => (
                <div key={product._id} className="fade-in" style={{ animationDelay: `${index * 0.1}s` }}>
                  <ProductCard product={product} />
                </div>
              ))}
            </ProductsGrid>
          )}
        </ProductsContainer>
      </ProductsSection>

      {/* CTA Section */}
      <CTA>
        <CTAContent>
          <CTATitle>Ready to Transform Your Business?</CTATitle>
          <CTADescription>
            Join thousands of successful retailers who trust Qwipo for their B2B needs. 
            Start your journey today and experience the future of commerce.
          </CTADescription>
          <HeroActions>
            <HeroButton to="/register" style={{ background: 'white', color: 'var(--primary-600)' }}>
              <Sparkles size={20} />
              Get Started Free
              <ArrowRight size={20} />
            </HeroButton>
            <HeroButtonSecondary to="/contact">
              <Target size={20} />
              Contact Sales
            </HeroButtonSecondary>
          </HeroActions>
        </CTAContent>
      </CTA>
    </HomeContainer>
  );
};

export default Home;