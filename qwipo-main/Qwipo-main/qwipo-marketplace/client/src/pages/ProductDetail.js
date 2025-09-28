import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery } from 'react-query';
import { 
  Star, 
  Heart, 
  ShoppingCart, 
  Share2, 
  ArrowLeft, 
  Plus, 
  Minus,
  Truck,
  Shield,
  RotateCcw,
  MessageCircle
} from 'lucide-react';
import styled from 'styled-components';
import ProductCard from '../components/ProductCard';
import LoadingSpinner from '../components/LoadingSpinner';
import { productsAPI, recommendationsAPI } from '../services/api';
import { useAuth } from '../contexts/AuthContext';
import toast from 'react-hot-toast';

const ProductDetailContainer = styled.div`
  min-height: calc(100vh - 4rem);
  background: #f8fafc;
`;

const Breadcrumb = styled.div`
  background: white;
  padding: 1rem 0;
  border-bottom: 1px solid #e2e8f0;
`;

const BreadcrumbContent = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 1rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: #6b7280;
  font-size: 0.875rem;
`;

const BreadcrumbLink = styled.button`
  background: none;
  border: none;
  color: #3b82f6;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 0.25rem;
  transition: color 0.2s ease;

  &:hover {
    color: #2563eb;
  }
`;

const ContentSection = styled.section`
  padding: 2rem 0;
`;

const Container = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 1rem;
`;

const ProductGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 3rem;
  margin-bottom: 4rem;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    gap: 2rem;
  }
`;

const ImageSection = styled.div`
  position: sticky;
  top: 2rem;
`;

const MainImage = styled.div`
  width: 100%;
  height: 400px;
  background: white;
  border-radius: 1rem;
  overflow: hidden;
  margin-bottom: 1rem;
  box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1);
`;

const ProductImage = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
`;

const ThumbnailGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 0.5rem;
`;

const Thumbnail = styled.button`
  width: 100%;
  height: 80px;
  background: white;
  border: 2px solid ${props => props.active ? '#3b82f6' : '#e2e8f0'};
  border-radius: 0.5rem;
  overflow: hidden;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    border-color: #3b82f6;
  }
`;

const ThumbnailImage = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
`;

const ProductInfo = styled.div`
  background: white;
  border-radius: 1rem;
  padding: 2rem;
  box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1);
`;

const Category = styled.span`
  display: inline-block;
  background: #f1f5f9;
  color: #3b82f6;
  padding: 0.25rem 0.75rem;
  border-radius: 1rem;
  font-size: 0.75rem;
  font-weight: 500;
  margin-bottom: 1rem;
  text-transform: uppercase;
`;

const ProductName = styled.h1`
  font-size: 2rem;
  font-weight: 700;
  color: #1e293b;
  margin-bottom: 0.5rem;
  line-height: 1.2;
`;

const Brand = styled.p`
  color: #64748b;
  font-size: 1rem;
  margin-bottom: 1rem;
`;

const Rating = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 1.5rem;
`;

const Stars = styled.div`
  display: flex;
  align-items: center;
  gap: 0.125rem;
`;

const StarIcon = styled(Star)`
  width: 1.25rem;
  height: 1.25rem;
  color: ${props => props.filled ? '#fbbf24' : '#d1d5db'};
  fill: ${props => props.filled ? '#fbbf24' : 'none'};
`;

const RatingText = styled.span`
  color: #6b7280;
  font-size: 0.875rem;
  margin-left: 0.5rem;
`;

const PriceSection = styled.div`
  margin-bottom: 2rem;
`;

const CurrentPrice = styled.div`
  font-size: 2.5rem;
  font-weight: 700;
  color: #1e293b;
  margin-bottom: 0.5rem;
`;

const OriginalPrice = styled.div`
  font-size: 1.25rem;
  color: #9ca3af;
  text-decoration: line-through;
  margin-bottom: 0.5rem;
`;

const Discount = styled.div`
  color: #ef4444;
  font-weight: 600;
  font-size: 1rem;
`;

const QuantitySection = styled.div`
  margin-bottom: 2rem;
`;

const QuantityLabel = styled.label`
  display: block;
  font-weight: 500;
  color: #374151;
  margin-bottom: 0.5rem;
`;

const QuantityControls = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
`;

const QuantityButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 2.5rem;
  height: 2.5rem;
  border: 1px solid #d1d5db;
  background: white;
  border-radius: 0.375rem;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover:not(:disabled) {
    border-color: #3b82f6;
    color: #3b82f6;
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

const QuantityInput = styled.input`
  width: 4rem;
  height: 2.5rem;
  text-align: center;
  border: 1px solid #d1d5db;
  border-radius: 0.375rem;
  font-size: 1rem;
  font-weight: 600;

  &:focus {
    outline: none;
    border-color: #3b82f6;
  }
`;

const ActionButtons = styled.div`
  display: flex;
  gap: 1rem;
  margin-bottom: 2rem;
`;

const AddToCartButton = styled.button`
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  padding: 1rem 2rem;
  background: #3b82f6;
  color: white;
  border: none;
  border-radius: 0.75rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover:not(:disabled) {
    background: #2563eb;
    transform: translateY(-1px);
  }

  &:disabled {
    background: #9ca3af;
    cursor: not-allowed;
  }
`;

const WishlistButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 3rem;
  height: 3rem;
  border: 2px solid #e2e8f0;
  background: white;
  border-radius: 0.75rem;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    border-color: #ef4444;
    color: #ef4444;
  }

  &.active {
    border-color: #ef4444;
    background: #ef4444;
    color: white;
  }
`;

const ShareButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 3rem;
  height: 3rem;
  border: 2px solid #e2e8f0;
  background: white;
  border-radius: 0.75rem;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    border-color: #3b82f6;
    color: #3b82f6;
  }
`;

const FeaturesSection = styled.div`
  margin-bottom: 2rem;
`;

const FeaturesTitle = styled.h3`
  font-size: 1.125rem;
  font-weight: 600;
  color: #1e293b;
  margin-bottom: 1rem;
`;

const FeaturesList = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0;
`;

const FeatureItem = styled.li`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  margin-bottom: 0.75rem;
  color: #64748b;
  font-size: 0.875rem;

  &::before {
    content: '✓';
    color: #10b981;
    font-weight: 600;
  }
`;

const DescriptionSection = styled.div`
  margin-bottom: 2rem;
`;

const DescriptionTitle = styled.h3`
  font-size: 1.125rem;
  font-weight: 600;
  color: #1e293b;
  margin-bottom: 1rem;
`;

const Description = styled.p`
  color: #64748b;
  line-height: 1.6;
`;

const SpecificationsSection = styled.div`
  margin-bottom: 2rem;
`;

const SpecificationsTitle = styled.h3`
  font-size: 1.125rem;
  font-weight: 600;
  color: #1e293b;
  margin-bottom: 1rem;
`;

const SpecificationsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1rem;
`;

const SpecificationItem = styled.div`
  display: flex;
  justify-content: space-between;
  padding: 0.75rem;
  background: #f8fafc;
  border-radius: 0.5rem;
`;

const SpecificationLabel = styled.span`
  color: #64748b;
  font-size: 0.875rem;
`;

const SpecificationValue = styled.span`
  color: #1e293b;
  font-weight: 500;
  font-size: 0.875rem;
`;

const RelatedProductsSection = styled.div`
  background: white;
  border-radius: 1rem;
  padding: 2rem;
  box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1);
`;

const RelatedProductsTitle = styled.h2`
  font-size: 1.5rem;
  font-weight: 700;
  color: #1e293b;
  margin-bottom: 1.5rem;
`;

const RelatedProductsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: 1.5rem;
`;

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [isInWishlist, setIsInWishlist] = useState(false);

  // Fetch product details
  const { data: productData, isLoading: productLoading } = useQuery(
    ['product', id],
    () => productsAPI.getProduct(id),
    {
      enabled: !!id,
    }
  );

  // Fetch similar products
  const { data: similarData, isLoading: similarLoading } = useQuery(
    ['similar-products', id],
    () => recommendationsAPI.getSimilar(id),
    {
      enabled: !!id,
    }
  );

  const product = productData?.data?.product;
  const similarProducts = similarData?.data?.products || [];

  const handleAddToCart = () => {
    if (!user) {
      toast.error('Please login to add items to cart');
      navigate('/login');
      return;
    }
    console.log('Add to cart:', { productId: id, quantity });
    toast.success('Product added to cart!');
  };

  const handleToggleWishlist = () => {
    if (!user) {
      toast.error('Please login to add items to wishlist');
      navigate('/login');
      return;
    }
    setIsInWishlist(!isInWishlist);
    toast.success(isInWishlist ? 'Removed from wishlist' : 'Added to wishlist');
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: product?.name,
          text: product?.description,
          url: window.location.href,
        });
      } catch (error) {
        console.log('Error sharing:', error);
      }
    } else {
      // Fallback to clipboard
      navigator.clipboard.writeText(window.location.href);
      toast.success('Link copied to clipboard!');
    }
  };

  const handleQuantityChange = (change) => {
    const newQuantity = quantity + change;
    if (newQuantity >= 1 && newQuantity <= (product?.inventory?.quantity || 1)) {
      setQuantity(newQuantity);
    }
  };

  const renderStars = (rating) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;

    for (let i = 0; i < 5; i++) {
      if (i < fullStars) {
        stars.push(<StarIcon key={i} filled />);
      } else if (i === fullStars && hasHalfStar) {
        stars.push(<StarIcon key={i} filled={false} />);
      } else {
        stars.push(<StarIcon key={i} filled={false} />);
      }
    }
    return stars;
  };

  if (productLoading) {
    return <LoadingSpinner text="Loading product details..." />;
  }

  if (!product) {
    return (
      <div style={{ textAlign: 'center', padding: '4rem 2rem' }}>
        <h2>Product not found</h2>
        <p>The product you're looking for doesn't exist.</p>
        <button onClick={() => navigate('/')} className="btn btn-primary">
          Go Home
        </button>
      </div>
    );
  }

  const images = product.images || [];
  const primaryImage = images.find(img => img.isPrimary) || images[0];
  const discountPercentage = product.pricing?.mrp > product.pricing?.sellingPrice 
    ? Math.round(((product.pricing.mrp - product.pricing.sellingPrice) / product.pricing.mrp) * 100)
    : 0;

  return (
    <ProductDetailContainer>
      {/* Breadcrumb */}
      <Breadcrumb>
        <BreadcrumbContent>
          <BreadcrumbLink onClick={() => navigate('/')}>
            <ArrowLeft size={16} />
            Back to Home
          </BreadcrumbLink>
          <span>/</span>
          <span>{product.category}</span>
          <span>/</span>
          <span>{product.name}</span>
        </BreadcrumbContent>
      </Breadcrumb>

      {/* Content */}
      <ContentSection>
        <Container>
          <ProductGrid>
            {/* Image Section */}
            <ImageSection>
              <MainImage>
                <ProductImage
                  src={primaryImage?.url || '/placeholder-product.jpg'}
                  alt={product.name}
                  onError={(e) => {
                    e.target.src = '/placeholder-product.jpg';
                  }}
                />
              </MainImage>
              {images.length > 1 && (
                <ThumbnailGrid>
                  {images.slice(0, 4).map((image, index) => (
                    <Thumbnail
                      key={index}
                      active={selectedImage === index}
                      onClick={() => setSelectedImage(index)}
                    >
                      <ThumbnailImage
                        src={image.url}
                        alt={`${product.name} ${index + 1}`}
                      />
                    </Thumbnail>
                  ))}
                </ThumbnailGrid>
              )}
            </ImageSection>

            {/* Product Info */}
            <ProductInfo>
              <Category>{product.category}</Category>
              <ProductName>{product.name}</ProductName>
              <Brand>{product.brand}</Brand>

              <Rating>
                <Stars>
                  {renderStars(product.rating?.average || 0)}
                </Stars>
                <RatingText>
                  {product.rating?.average?.toFixed(1) || '0.0'} ({product.rating?.count || 0} reviews)
                </RatingText>
              </Rating>

              <PriceSection>
                <CurrentPrice>₹{product.pricing?.sellingPrice?.toLocaleString()}</CurrentPrice>
                {product.pricing?.mrp > product.pricing?.sellingPrice && (
                  <>
                    <OriginalPrice>₹{product.pricing?.mrp?.toLocaleString()}</OriginalPrice>
                    <Discount>{discountPercentage}% OFF</Discount>
                  </>
                )}
              </PriceSection>

              <QuantitySection>
                <QuantityLabel>Quantity</QuantityLabel>
                <QuantityControls>
                  <QuantityButton
                    onClick={() => handleQuantityChange(-1)}
                    disabled={quantity <= 1}
                  >
                    <Minus size={16} />
                  </QuantityButton>
                  <QuantityInput
                    type="number"
                    value={quantity}
                    onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                    min="1"
                    max={product.inventory?.quantity || 1}
                  />
                  <QuantityButton
                    onClick={() => handleQuantityChange(1)}
                    disabled={quantity >= (product.inventory?.quantity || 1)}
                  >
                    <Plus size={16} />
                  </QuantityButton>
                </QuantityControls>
              </QuantitySection>

              <ActionButtons>
                <AddToCartButton
                  onClick={handleAddToCart}
                  disabled={!product.inventory?.isInStock}
                >
                  <ShoppingCart size={20} />
                  {product.inventory?.isInStock ? 'Add to Cart' : 'Out of Stock'}
                </AddToCartButton>
                <WishlistButton
                  onClick={handleToggleWishlist}
                  className={isInWishlist ? 'active' : ''}
                >
                  <Heart size={20} fill={isInWishlist ? 'currentColor' : 'none'} />
                </WishlistButton>
                <ShareButton onClick={handleShare}>
                  <Share2 size={20} />
                </ShareButton>
              </ActionButtons>

              <FeaturesSection>
                <FeaturesTitle>Key Features</FeaturesTitle>
                <FeaturesList>
                  <FeatureItem>Free delivery on orders above ₹500</FeatureItem>
                  <FeatureItem>7-day return policy</FeatureItem>
                  <FeatureItem>Secure payment options</FeatureItem>
                  <FeatureItem>24/7 customer support</FeatureItem>
                </FeaturesList>
              </FeaturesSection>

              <DescriptionSection>
                <DescriptionTitle>Description</DescriptionTitle>
                <Description>{product.description}</Description>
              </DescriptionSection>

              {product.specifications && (
                <SpecificationsSection>
                  <SpecificationsTitle>Specifications</SpecificationsTitle>
                  <SpecificationsGrid>
                    {Object.entries(product.specifications).map(([key, value]) => (
                      <SpecificationItem key={key}>
                        <SpecificationLabel>{key}</SpecificationLabel>
                        <SpecificationValue>{value}</SpecificationValue>
                      </SpecificationItem>
                    ))}
                  </SpecificationsGrid>
                </SpecificationsSection>
              )}
            </ProductInfo>
          </ProductGrid>

          {/* Related Products */}
          {similarProducts.length > 0 && (
            <RelatedProductsSection>
              <RelatedProductsTitle>Similar Products</RelatedProductsTitle>
              {similarLoading ? (
                <LoadingSpinner text="Loading similar products..." />
              ) : (
                <RelatedProductsGrid>
                  {similarProducts.slice(0, 4).map((similarProduct) => (
                    <ProductCard
                      key={similarProduct._id}
                      product={similarProduct}
                      onAddToCart={() => console.log('Add to cart:', similarProduct._id)}
                      onToggleWishlist={() => console.log('Toggle wishlist:', similarProduct._id)}
                    />
                  ))}
                </RelatedProductsGrid>
              )}
            </RelatedProductsSection>
          )}
        </Container>
      </ContentSection>
    </ProductDetailContainer>
  );
};

export default ProductDetail;
