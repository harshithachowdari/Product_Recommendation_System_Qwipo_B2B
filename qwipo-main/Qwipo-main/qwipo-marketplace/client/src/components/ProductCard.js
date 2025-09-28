import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  Star, 
  ShoppingCart, 
  Heart, 
  Eye, 
  TrendingUp, 
  Award,
  Clock,
  CheckCircle,
  AlertCircle,
  Zap,
  ArrowDownRight
} from 'lucide-react';
import styled from 'styled-components';
import { useCart } from '../contexts/CartContext';

const CardContainer = styled.div`
  background: white;
  border-radius: var(--radius-2xl);
  box-shadow: var(--shadow-sm);
  border: 1px solid var(--gray-200);
  overflow: hidden;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  height: 100%;
  display: flex;
  flex-direction: column;
  position: relative;
  group: hover;

  &:hover {
    box-shadow: var(--shadow-xl);
    transform: translateY(-8px);
    border-color: var(--primary-200);
  }
`;

const ImageContainer = styled.div`
  position: relative;
  width: 100%;
  height: 200px;
  overflow: hidden;
  background: linear-gradient(135deg, var(--gray-50) 0%, var(--primary-50) 100%);
`;

const ProductImage = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  
  ${CardContainer}:hover & {
    transform: scale(1.05);
  }
`;

const ImageOverlay = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(135deg, rgba(59, 130, 246, 0.25) 0%, rgba(147, 51, 234, 0.25) 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  gap: var(--space-4);
  opacity: 0;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  backdrop-filter: blur(4px);
  
  ${CardContainer}:hover & {
    opacity: 1;
  }
`;

const ActionButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  background: rgba(255, 255, 255, 0.2);
  border: 2px solid rgba(255, 255, 255, 0.3);
  border-radius: var(--radius-full);
  color: white;
  cursor: pointer;
  transition: all 0.2s ease;
  backdrop-filter: blur(10px);
  
  &:hover {
    background: rgba(255, 255, 255, 0.3);
    border-color: rgba(255, 255, 255, 0.5);
    transform: scale(1.1);
  }
`;

const BadgeContainer = styled.div`
  position: absolute;
  top: var(--space-3);
  left: var(--space-3);
  display: flex;
  flex-direction: column;
  gap: var(--space-2);
  z-index: 2;
`;

const Badge = styled.div`
  padding: var(--space-1) var(--space-3);
  border-radius: var(--radius-full);
  font-size: 10px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.2);
  
  &.featured {
    background: linear-gradient(135deg, #fbbf24 0%, #f59e0b 100%);
    color: white;
  }
  
  &.trending {
    background: linear-gradient(135deg, #ef4444 0%, #dc2626 100%);
    color: white;
  }
  
  &.new {
    background: linear-gradient(135deg, #10b981 0%, #059669 100%);
    color: white;
  }
  
  &.sale {
    background: linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%);
    color: white;
  }
`;

const TrendBadge = styled.div`
  position: absolute;
  top: 42px; /* under main badges at top-left */
  left: var(--space-3);
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 4px 8px;
  border-radius: 9999px;
  font-size: 11px;
  font-weight: 600;
  background: ${props => props.up ? 'rgba(16, 185, 129, 0.1)' : 'rgba(239, 68, 68, 0.1)'};
  color: ${props => props.up ? '#059669' : '#dc2626'};
  border: 1px solid ${props => props.up ? 'rgba(16, 185, 129, 0.25)' : 'rgba(239, 68, 68, 0.25)'};
  z-index: 2;
`;

const WishlistButton = styled.button`
  position: absolute;
  top: var(--space-3);
  right: var(--space-3);
  width: 40px;
  height: 40px;
  background: rgba(255, 255, 255, 0.9);
  border: none;
  border-radius: var(--radius-full);
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s ease;
  z-index: 2;
  backdrop-filter: blur(10px);
  
  &:hover {
    background: white;
    transform: scale(1.1);
    box-shadow: var(--shadow-md);
  }
  
  &.active {
    color: var(--error-500);
    background: var(--error-50);
  }
`;

const CardContent = styled.div`
  padding: var(--space-4);
  flex: 1;
  display: flex;
  flex-direction: column;
`;

const Category = styled.div`
  font-size: var(--font-size-xs);
  color: var(--primary-600);
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  margin-bottom: var(--space-2);
`;

const ProductTitle = styled.h3`
  font-size: 1rem;
  font-weight: 600;
  color: var(--gray-800);
  margin-bottom: var(--space-2);
  line-height: 1.4;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
`;

const ProductDescription = styled.p`
  font-size: 0.85rem;
  color: var(--gray-600);
  margin-bottom: var(--space-3);
  line-height: 1.5;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  flex: 1;
`;

const RatingContainer = styled.div`
  display: flex;
  align-items: center;
  gap: var(--space-2);
  margin-bottom: var(--space-3);
`;

const Stars = styled.div`
  display: flex;
  gap: 2px;
`;

const StarIcon = styled(Star)`
  width: 16px;
  height: 16px;
  color: ${props => props.filled ? '#fbbf24' : '#e5e7eb'};
  fill: ${props => props.filled ? '#fbbf24' : 'none'};
`;

const RatingText = styled.span`
  font-size: var(--font-size-sm);
  color: var(--gray-600);
  font-weight: 500;
`;

const ReviewCount = styled.span`
  font-size: var(--font-size-xs);
  color: var(--gray-500);
`;

const PriceContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: var(--space-4);
`;

const Price = styled.div`
  display: flex;
  flex-direction: column;
  gap: var(--space-1);
`;

const CurrentPrice = styled.span`
  font-size: 1.05rem;
  font-weight: 700;
  color: var(--gray-800);
`;

const OriginalPrice = styled.span`
  font-size: var(--font-size-sm);
  color: var(--gray-500);
  text-decoration: line-through;
`;

const Discount = styled.span`
  font-size: var(--font-size-sm);
  color: var(--success-600);
  font-weight: 600;
  background: var(--success-50);
  padding: var(--space-1) var(--space-2);
  border-radius: var(--radius-md);
`;

const StockStatus = styled.div`
  display: flex;
  align-items: center;
  gap: var(--space-2);
  margin-bottom: var(--space-4);
  font-size: var(--font-size-sm);
  
  &.in-stock {
    color: var(--success-600);
  }
  
  &.low-stock {
    color: var(--warning-600);
  }
  
  &.out-of-stock {
    color: var(--error-600);
  }
`;

const ActionContainer = styled.div`
  display: flex;
  gap: var(--space-3);
  margin-top: auto;
`;

const AddToCartButton = styled.button`
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: var(--space-2);
  padding: var(--space-2) var(--space-3);
  background: linear-gradient(135deg, var(--primary-500) 0%, var(--primary-600) 100%);
  color: white;
  border: none;
  border-radius: var(--radius-lg);
  font-weight: 600;
  font-size: 0.9rem;
  cursor: pointer;
  transition: all 0.2s ease;
  
  &:hover:not(:disabled) {
    background: linear-gradient(135deg, var(--primary-600) 0%, var(--primary-700) 100%);
    transform: translateY(-1px);
    box-shadow: var(--shadow-md);
  }
  
  &:disabled {
    background: var(--gray-300);
    cursor: not-allowed;
    transform: none;
  }
`;

const QuickViewButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 48px;
  height: 48px;
  background: var(--gray-100);
  color: var(--gray-600);
  border: 1px solid var(--gray-200);
  border-radius: var(--radius-lg);
  cursor: pointer;
  transition: all 0.2s ease;
  
  &:hover {
    background: var(--primary-50);
    color: var(--primary-600);
    border-color: var(--primary-200);
  }
`;

const ProductCard = ({ product }) => {
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [isAddingToCart, setIsAddingToCart] = useState(false);
  const { addItem } = useCart();
  const navigate = useNavigate();

  if (!product) return null;

  const {
    _id,
    name,
    description,
    pricing,
    images,
    category,
    subcategory,
    brand,
    rating,
    inventory,
    isFeatured,
    isSeasonal,
    distributor
  } = product;

  const currentPrice = pricing?.sellingPrice || 0;
  const originalPrice = pricing?.mrp || 0;
  const stock = inventory?.quantity || 0;
  const isInStock = inventory?.isInStock || false;

  const discount = originalPrice && originalPrice > currentPrice 
    ? Math.round(((originalPrice - currentPrice) / originalPrice) * 100)
    : 0;

  const getStockStatus = () => {
    if (!isInStock || stock === 0) return { status: 'out-of-stock', text: 'Out of Stock', icon: AlertCircle };
    if (stock < (inventory?.minStockLevel || 10)) return { status: 'low-stock', text: 'Low Stock', icon: Clock };
    return { status: 'in-stock', text: 'In Stock', icon: CheckCircle };
  };

  const stockInfo = getStockStatus();
  const StockIcon = stockInfo.icon;

  // Stock/price trend calculation (demo-compatible)
  const trend = product?.analytics?.trend ?? product?.stockTrend ?? ((Math.random() * 40) - 20); // -20%..+20%
  const trendUp = trend >= 0;

  // Generate badges based on product properties
  const badges = [];
  if (isFeatured) badges.push({ type: 'featured', text: 'Featured' });
  if (isSeasonal) badges.push({ type: 'trending', text: 'Seasonal' });
  if (discount > 20) badges.push({ type: 'sale', text: 'Sale' });
  if (rating?.average >= 4.5) badges.push({ type: 'new', text: 'Top Rated' });

  const handleAddToCart = async () => {
    setIsAddingToCart(true);
    // Add to local cart context (can be replaced with server call later)
    addItem(product, 1);
    await new Promise(resolve => setTimeout(resolve, 300));
    setIsAddingToCart(false);
    navigate('/cart');
  };

  const handleWishlistToggle = () => {
    setIsWishlisted(!isWishlisted);
    // Handle wishlist logic here
  };

  const renderStars = (rating) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;

    for (let i = 0; i < 5; i++) {
      if (i < fullStars) {
        stars.push(<StarIcon key={i} filled />);
      } else if (i === fullStars && hasHalfStar) {
        stars.push(<StarIcon key={i} filled style={{ opacity: 0.5 }} />);
      } else {
        stars.push(<StarIcon key={i} filled={false} />);
      }
    }
    return stars;
  };

  return (
    <CardContainer className="hover-lift">
      <ImageContainer>
        <ProductImage 
          src={images?.[0] || '/api/placeholder/300/240'} 
          alt={name}
          loading="lazy"
        />
        
        <ImageOverlay>
          <ActionButton title="Quick View">
            <Eye size={20} />
          </ActionButton>
          <ActionButton title="Add to Cart">
            <ShoppingCart size={20} />
          </ActionButton>
        </ImageOverlay>

        <BadgeContainer>
          {badges.map((badge, index) => (
            <Badge key={index} className={badge.type}>
              {badge.text}
            </Badge>
          ))}
          {discount > 0 && (
            <Badge className="sale">
              {discount}% OFF
            </Badge>
          )}
        </BadgeContainer>

        <WishlistButton 
          onClick={handleWishlistToggle}
          className={isWishlisted ? 'active' : ''}
          title={isWishlisted ? 'Remove from Wishlist' : 'Add to Wishlist'}
        >
          <Heart size={18} fill={isWishlisted ? 'currentColor' : 'none'} />
        </WishlistButton>

        {/* Trend badge top-right */}
        <TrendBadge up={trendUp} title={`Stock trend: ${trendUp ? 'Increasing' : 'Decreasing'}`}>
          {trendUp ? <TrendingUp size={14} /> : <ArrowDownRight size={14} />}
          {Math.abs(trend).toFixed(0)}%
        </TrendBadge>
      </ImageContainer>

      <CardContent>
        <Category>{category || 'General'}</Category>
        
        <ProductTitle>{name}</ProductTitle>
        
        <ProductDescription>{description}</ProductDescription>

        <RatingContainer>
          <Stars>
            {renderStars(rating?.average || 0)}
          </Stars>
          <RatingText>{rating?.average?.toFixed(1) || '0.0'}</RatingText>
          <ReviewCount>({rating?.count || 0})</ReviewCount>
        </RatingContainer>

        <PriceContainer>
          <Price>
            <CurrentPrice>₹{currentPrice?.toFixed(2) || '0.00'}</CurrentPrice>
            {originalPrice && originalPrice > currentPrice && (
              <OriginalPrice>₹{originalPrice.toFixed(2)}</OriginalPrice>
            )}
          </Price>
          {discount > 0 && (
            <Discount>Save ₹{(originalPrice - currentPrice).toFixed(2)}</Discount>
          )}
        </PriceContainer>

        <StockStatus className={stockInfo.status}>
          <StockIcon size={16} />
          {stockInfo.text}
        </StockStatus>

        <ActionContainer>
          <AddToCartButton 
            onClick={handleAddToCart}
            disabled={stock === 0 || isAddingToCart}
          >
            {isAddingToCart ? (
              <>
                <div className="loading loading-sm" />
                Adding...
              </>
            ) : (
              <>
                <ShoppingCart size={16} />
                {stock === 0 ? 'Out of Stock' : 'Add to Cart'}
              </>
            )}
          </AddToCartButton>
          
          <QuickViewButton title="Quick View">
            <Eye size={18} />
          </QuickViewButton>
        </ActionContainer>
      </CardContent>
    </CardContainer>
  );
};

export default ProductCard;