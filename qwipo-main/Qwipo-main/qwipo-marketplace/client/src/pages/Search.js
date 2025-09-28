import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useQuery } from 'react-query';
import { Filter, SortAsc, Grid, List, X } from 'lucide-react';
import styled from 'styled-components';
import ProductCard from '../components/ProductCard';
import SearchBar from '../components/SearchBar';
import LoadingSpinner from '../components/LoadingSpinner';
import { productsAPI, searchAPI } from '../services/api';

const SearchContainer = styled.div`
  min-height: calc(100vh - 4rem);
  background: #f8fafc;
`;

const SearchHeader = styled.div`
  background: white;
  padding: 2rem 0;
  border-bottom: 1px solid #e2e8f0;
`;

const SearchContent = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 1rem;
`;

const SearchTop = styled.div`
  display: flex;
  gap: 1rem;
  margin-bottom: 2rem;
  align-items: center;
`;

const SearchSection = styled.div`
  flex: 1;
  max-width: 600px;
`;

const FilterButton = styled.button`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1rem;
  background: white;
  border: 1px solid #d1d5db;
  border-radius: 0.5rem;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    border-color: #3b82f6;
  }
`;

const SortButton = styled.button`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1rem;
  background: white;
  border: 1px solid #d1d5db;
  border-radius: 0.5rem;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    border-color: #3b82f6;
  }
`;

const SearchResults = styled.div`
  display: flex;
  gap: 2rem;
  padding: 2rem 0;
`;

const Sidebar = styled.div`
  width: 250px;
  background: white;
  border-radius: 0.75rem;
  padding: 1.5rem;
  height: fit-content;
  position: sticky;
  top: 2rem;
`;

const SidebarTitle = styled.h3`
  font-size: 1.125rem;
  font-weight: 600;
  margin-bottom: 1rem;
  color: #1e293b;
`;

const FilterGroup = styled.div`
  margin-bottom: 1.5rem;
`;

const FilterLabel = styled.label`
  display: block;
  font-weight: 500;
  margin-bottom: 0.5rem;
  color: #374151;
  font-size: 0.875rem;
`;

const FilterSelect = styled.select`
  width: 100%;
  padding: 0.5rem;
  border: 1px solid #d1d5db;
  border-radius: 0.375rem;
  font-size: 0.875rem;
  background: white;

  &:focus {
    outline: none;
    border-color: #3b82f6;
  }
`;

const FilterInput = styled.input`
  width: 100%;
  padding: 0.5rem;
  border: 1px solid #d1d5db;
  border-radius: 0.375rem;
  font-size: 0.875rem;

  &:focus {
    outline: none;
    border-color: #3b82f6;
  }
`;

const FilterCheckbox = styled.label`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 0.5rem;
  cursor: pointer;
  font-size: 0.875rem;
  color: #374151;

  input[type="checkbox"] {
    margin: 0;
  }
`;

const ClearFiltersButton = styled.button`
  width: 100%;
  padding: 0.5rem;
  background: #f1f5f9;
  border: 1px solid #d1d5db;
  border-radius: 0.375rem;
  cursor: pointer;
  font-size: 0.875rem;
  color: #6b7280;
  transition: all 0.2s ease;

  &:hover {
    background: #e2e8f0;
  }
`;

const MainContent = styled.div`
  flex: 1;
`;

const ResultsHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
  background: white;
  padding: 1rem;
  border-radius: 0.75rem;
`;

const ResultsCount = styled.p`
  color: #6b7280;
  font-size: 0.875rem;
  margin: 0;
`;

const ViewToggle = styled.div`
  display: flex;
  gap: 0.25rem;
`;

const ViewButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 2rem;
  height: 2rem;
  border: 1px solid #d1d5db;
  background: ${props => props.active ? '#3b82f6' : 'white'};
  color: ${props => props.active ? 'white' : '#6b7280'};
  border-radius: 0.375rem;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    border-color: #3b82f6;
  }
`;

const ProductsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
  gap: 1.25rem;
  align-items: stretch;

  @media (min-width: 1280px) {
    grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  }
`;

const ProductsList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const NoResults = styled.div`
  text-align: center;
  padding: 4rem 2rem;
  background: white;
  border-radius: 0.75rem;
`;

const NoResultsTitle = styled.h3`
  font-size: 1.25rem;
  font-weight: 600;
  margin-bottom: 0.5rem;
  color: #1e293b;
`;

const NoResultsText = styled.p`
  color: #6b7280;
  margin-bottom: 1.5rem;
`;

const SearchSuggestions = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  justify-content: center;
`;

const SuggestionTag = styled.button`
  padding: 0.5rem 1rem;
  background: #f1f5f9;
  border: 1px solid #e2e8f0;
  border-radius: 1rem;
  color: #6b7280;
  font-size: 0.875rem;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    background: #e2e8f0;
    color: #374151;
  }
`;

const Pagination = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 0.5rem;
  margin-top: 2rem;
`;

const PaginationButton = styled.button`
  padding: 0.5rem 1rem;
  border: 1px solid #d1d5db;
  background: white;
  color: #374151;
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

  &.active {
    background: #3b82f6;
    color: white;
    border-color: #3b82f6;
  }
`;

const Search = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [filters, setFilters] = useState({
    category: '',
    subcategory: '',
    brand: '',
    minPrice: '',
    maxPrice: '',
    rating: '',
    sortBy: 'relevance',
    page: 1,
    limit: 20
  });
  const [viewMode, setViewMode] = useState('grid');
  const [showFilters, setShowFilters] = useState(false);
  const [wishlist, setWishlist] = useState(new Set());
  const [fallbackProducts, setFallbackProducts] = useState([]);
  const [chipFilters, setChipFilters] = useState({ brands: new Set(), categories: new Set() });

  const query = searchParams.get('q') || '';

  // Fetch search results
  const { data: searchData, isLoading, error } = useQuery(
    ['search', query, filters],
    () => {
      if (query) {
        return productsAPI.searchProducts({
          q: query,
          page: filters.page,
          limit: filters.limit,
          sortBy: filters.sortBy
        });
      } else {
        return productsAPI.getProducts({
          page: filters.page,
          limit: filters.limit,
          sortBy: filters.sortBy,
          category: filters.category,
          brand: filters.brand,
          minPrice: filters.minPrice,
          maxPrice: filters.maxPrice
        });
      }
    },
    {
      enabled: true,
      staleTime: 5 * 60 * 1000,
    }
  );

  // When API returns no products, fetch fallback demo data
  useEffect(() => {
    const loadFallback = async () => {
      try {
        const [featured, seasonal] = await Promise.all([
          productsAPI.getFeaturedProducts().catch(() => ({ data: { data: { products: [] } } })),
          productsAPI.getSeasonalProducts().catch(() => ({ data: { data: { products: [] } } })),
        ]);
        let list = [
          ...(featured?.data?.data?.products || []),
          ...(seasonal?.data?.data?.products || []),
        ];

        // If still empty, use rich local sample (20 items) to avoid blank UI
        if (list.length === 0) {
          list = [
            { _id: 's1', name: 'Premium Basmati Rice - 5kg', description: 'High-quality long grain basmati rice', category: 'grocery', subcategory: 'Rice & Grains', brand: 'India Gate', pricing: { mrp: 2450, sellingPrice: 2200 }, inventory: { quantity: 120, minStockLevel: 12, isInStock: true }, rating: { average: 4.5, count: 234 }, images: ['https://images.unsplash.com/photo-1604908554007-8b4cf935d0d9?q=80&w=1200&auto=format&fit=crop'] },
            { _id: 's2', name: 'Coca Cola 2L Pack of 12', description: 'Refreshing cola soft drink for retail and HoReCa', category: 'beverages', subcategory: 'Soft Drinks', brand: 'Coca Cola', pricing: { mrp: 900, sellingPrice: 840 }, inventory: { quantity: 85, minStockLevel: 8, isInStock: true }, rating: { average: 4.2, count: 156 }, images: ['https://images.unsplash.com/photo-1629198735668-3fe0e9ff63fd?q=80&w=1200&auto=format&fit=crop'] },
            { _id: 's3', name: 'Haldiram Namkeen Combo Pack', description: 'Assorted traditional snacks combo', category: 'grocery', subcategory: 'Snacks', brand: 'Haldiram', pricing: { mrp: 699, sellingPrice: 650 }, inventory: { quantity: 64, minStockLevel: 8, isInStock: true }, rating: { average: 4.3, count: 89 }, images: ['https://images.unsplash.com/photo-1543352634-8730a9b5a501?q=80&w=1200&auto=format&fit=crop'] },
            { _id: 's4', name: 'Refined Sunflower Oil - 15L', description: 'Pure refined sunflower oil', category: 'grocery', subcategory: 'Cooking Oil', brand: 'Fortune', pricing: { mrp: 1600, sellingPrice: 1400 }, inventory: { quantity: 200, minStockLevel: 20, isInStock: true }, rating: { average: 4.3, count: 85 }, images: ['https://images.unsplash.com/photo-1573811616712-314c77b46f38?q=80&w=1200&auto=format&fit=crop'] },
            { _id: 's5', name: 'Premium Tea Leaves - 1kg', description: 'High-grade Assam tea leaves', category: 'beverages', subcategory: 'Tea', brand: 'Tata Tea', pricing: { mrp: 650, sellingPrice: 550 }, inventory: { quantity: 150, minStockLevel: 15, isInStock: true }, rating: { average: 4.6, count: 110 }, images: ['https://images.unsplash.com/photo-1517705008128-361805f42e86?q=80&w=1200&auto=format&fit=crop'] },
            { _id: 's6', name: 'Whole Wheat Flour - 10kg', description: 'Freshly milled whole wheat flour', category: 'grocery', subcategory: 'Flour & Baking', brand: 'Aashirvaad', pricing: { mrp: 380, sellingPrice: 320 }, inventory: { quantity: 170, minStockLevel: 20, isInStock: true }, rating: { average: 4.4, count: 95 }, images: ['https://images.unsplash.com/photo-1615486364266-4f6bb6bb0434?q=80&w=1200&auto=format&fit=crop'] },
            { _id: 's7', name: 'Instant Coffee 200g', description: 'Rich and aromatic instant coffee', category: 'beverages', subcategory: 'Coffee', brand: 'Nescafe', pricing: { mrp: 260, sellingPrice: 220 }, inventory: { quantity: 140, minStockLevel: 14, isInStock: true }, rating: { average: 4.4, count: 95 }, images: ['https://images.unsplash.com/photo-1527161153335-c7e1df2d4bfb?q=80&w=1200&auto=format&fit=crop'] },
            { _id: 's8', name: 'Mineral Water 1L (Pack of 24)', description: 'Pure mineral water for restaurants', category: 'beverages', subcategory: 'Water', brand: 'Bisleri', pricing: { mrp: 360, sellingPrice: 300 }, inventory: { quantity: 300, minStockLevel: 30, isInStock: true }, rating: { average: 4.1, count: 60 }, images: ['https://images.unsplash.com/photo-1526401485004-2fda9f4c8b0e?q=80&w=1200&auto=format&fit=crop'] },
            { _id: 's9', name: 'Paneer 500g (Fresh)', description: 'Fresh cottage cheese', category: 'grocery', subcategory: 'Dairy', brand: 'Amul', pricing: { mrp: 120, sellingPrice: 100 }, inventory: { quantity: 80, minStockLevel: 8, isInStock: true }, rating: { average: 4.3, count: 60 }, images: ['https://images.unsplash.com/photo-1604908554154-439f3b2a644d?q=80&w=1200&auto=format&fit=crop'] },
            { _id: 's10', name: 'Samsung Galaxy Tab A8', description: '10.5 inch business tablet', category: 'electronics', subcategory: 'Tablets', brand: 'Samsung', pricing: { mrp: 25000, sellingPrice: 22000 }, inventory: { quantity: 25, minStockLevel: 3, isInStock: true }, rating: { average: 4.5, count: 120 }, images: ['https://images.unsplash.com/photo-1517336714731-489689fd1ca8?q=80&w=1200&auto=format&fit=crop'] },
            { _id: 's11', name: 'Sony WH-1000XM4', description: 'Premium noise-cancelling headphones', category: 'electronics', subcategory: 'Audio', brand: 'Sony', pricing: { mrp: 28000, sellingPrice: 25000 }, inventory: { quantity: 40, minStockLevel: 4, isInStock: true }, rating: { average: 4.7, count: 150 }, images: ['https://images.unsplash.com/photo-1518443333755-639c1cd3ed3f?q=80&w=1200&auto=format&fit=crop'] },
            { _id: 's12', name: 'LG 55" 4K Smart TV', description: 'Stunning 4K UHD TV for signage', category: 'electronics', subcategory: 'TV', brand: 'LG', pricing: { mrp: 65000, sellingPrice: 58000 }, inventory: { quantity: 15, minStockLevel: 2, isInStock: true }, rating: { average: 4.4, count: 95 }, images: ['https://images.unsplash.com/photo-1583225232838-6d8a5a2b7b52?q=80&w=1200&auto=format&fit=crop'] },
            { _id: 's13', name: 'Chef Uniform Set', description: 'Professional chef jacket and pants', category: 'clothing', subcategory: 'Uniforms', brand: 'Chef Pro', pricing: { mrp: 2500, sellingPrice: 2000 }, inventory: { quantity: 100, minStockLevel: 10, isInStock: true }, rating: { average: 4.3, count: 75 }, images: ['https://images.unsplash.com/photo-1582456891925-4325b0a39aea?q=80&w=1200&auto=format&fit=crop'] },
            { _id: 's14', name: 'Business Suit - Navy', description: 'Formal business suit', category: 'clothing', subcategory: 'Formal', brand: 'Raymond', pricing: { mrp: 8000, sellingPrice: 6500 }, inventory: { quantity: 30, minStockLevel: 5, isInStock: true }, rating: { average: 4.5, count: 120 }, images: ['https://images.unsplash.com/photo-1516826957135-700dedea698c?q=80&w=1200&auto=format&fit=crop'] },
            { _id: 's15', name: 'Paracetamol 500mg (100 tablets)', description: 'Pain relief and fever reducer', category: 'pharmacy', subcategory: 'Medicines', brand: 'Crocin', pricing: { mrp: 150, sellingPrice: 120 }, inventory: { quantity: 500, minStockLevel: 50, isInStock: true }, rating: { average: 4.2, count: 200 }, images: ['https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?q=80&w=1200&auto=format&fit=crop'] },
            { _id: 's16', name: 'Ghee - 1kg', description: 'Pure desi ghee', category: 'grocery', subcategory: 'Dairy', brand: 'Amul', pricing: { mrp: 600, sellingPrice: 500 }, inventory: { quantity: 100, minStockLevel: 10, isInStock: true }, rating: { average: 4.7, count: 150 }, images: ['https://images.unsplash.com/photo-1590574639257-0a7b5b8b6f20?q=80&w=1200&auto=format&fit=crop'] },
            { _id: 's17', name: 'Black Pepper 200g', description: 'Whole pepper corns', category: 'grocery', subcategory: 'Spices', brand: 'Everest', pricing: { mrp: 200, sellingPrice: 160 }, inventory: { quantity: 150, minStockLevel: 15, isInStock: true }, rating: { average: 4.4, count: 80 }, images: ['https://images.unsplash.com/photo-1604908176997-431c0bbd10b2?q=80&w=1200&auto=format&fit=crop'] },
            { _id: 's18', name: 'Mustard Oil 1L', description: 'Pure mustard oil', category: 'grocery', subcategory: 'Cooking Oil', brand: 'Fortune', pricing: { mrp: 180, sellingPrice: 150 }, inventory: { quantity: 200, minStockLevel: 20, isInStock: true }, rating: { average: 4.2, count: 75 }, images: ['https://images.unsplash.com/photo-1582719271756-6af9b8efb725?q=80&w=1200&auto=format&fit=crop'] },
            { _id: 's19', name: 'Green Tea (100 bags)', description: 'Antioxidant rich green tea', category: 'beverages', subcategory: 'Tea', brand: 'Tetley', pricing: { mrp: 180, sellingPrice: 150 }, inventory: { quantity: 200, minStockLevel: 20, isInStock: true }, rating: { average: 4.3, count: 70 }, images: ['https://images.unsplash.com/photo-1470167290877-7d5d3446de4c?q=80&w=1200&auto=format&fit=crop'] },
            { _id: 's20', name: 'Bread White (Pack of 12)', description: 'Soft and fresh bread loaves', category: 'grocery', subcategory: 'Bakery', brand: 'Britannia', pricing: { mrp: 180, sellingPrice: 150 }, inventory: { quantity: 100, minStockLevel: 10, isInStock: true }, rating: { average: 4.0, count: 40 }, images: ['https://images.unsplash.com/photo-1542831371-29b0f74f9713?q=80&w=1200&auto=format&fit=crop'] },
          ];
        }

        // Ensure at least 10 items for each requested category
        const targets = {
          electronics: 10,
          grocery: 10,
          clothing: 10,
          pharmacy: 10,
          general: 10,
        };

        const byCat = list.reduce((acc, p) => {
          const c = (p.category || 'general').toLowerCase();
          acc[c] = acc[c] || [];
          acc[c].push(p);
          return acc;
        }, {});

        const padded = [...list];
        Object.entries(targets).forEach(([cat, minCount]) => {
          const arr = byCat[cat] || [];
          if (arr.length === 0) return; // skip if no seed to clone
          let i = 0;
          while (arr.length + (padded.filter(p => (p.category||'').toLowerCase()===cat).length - arr.length) < minCount) {
            const base = arr[i % arr.length];
            padded.push({
              ...base,
              _id: `${base._id || 'p'}_${cat}_${i}`,
              name: `${base.name} ${i+2}`,
              images: base.images,
              analytics: { ...(base.analytics||{}), trend: (Math.random()*40)-20 },
            });
            i++;
          }
        });

        setFallbackProducts(padded);
      } catch (e) {
        // ignore
      }
    };

    const products = searchData?.data?.products || [];
    if (!isLoading && !error && products.length === 0) {
      loadFallback();
    }
  }, [isLoading, error, searchData]);

  // Fetch filter options
  const { data: filterData } = useQuery(
    'search-filters',
    () => searchAPI.getFilters({ category: filters.category }),
    {
      staleTime: 10 * 60 * 1000,
    }
  );

  useEffect(() => {
    if (query) {
      setFilters(prev => ({ ...prev, page: 1 }));
    }
  }, [query]);

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({
      ...prev,
      [key]: value,
      page: 1
    }));
  };

  const handleSearch = (searchQuery) => {
    setSearchParams({ q: searchQuery });
  };

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

  const clearFilters = () => {
    setFilters({
      category: '',
      subcategory: '',
      brand: '',
      minPrice: '',
      maxPrice: '',
      rating: '',
      sortBy: 'relevance',
      page: 1,
      limit: 20
    });
  };

  const products = searchData?.data?.products || [];
  const pagination = searchData?.data?.pagination || {};
  const filterOptions = filterData?.data || {};

  // Group fallback products by brand
  const filteredFallback = fallbackProducts.filter(p => {
    const bOk = chipFilters.brands.size === 0 || chipFilters.brands.has(p.brand || '');
    const cOk = chipFilters.categories.size === 0 || chipFilters.categories.has(p.category || '');
    return bOk && cOk;
  });
  const brandGroups = filteredFallback.reduce((acc, p) => {
    const key = p.brand || 'Other Brands';
    acc[key] = acc[key] || [];
    acc[key].push(p);
    return acc;
  }, {});

  const allBrands = Array.from(new Set(fallbackProducts.map(p => p.brand).filter(Boolean)));
  const allCategories = Array.from(new Set(fallbackProducts.map(p => p.category).filter(Boolean)));

  const toggleChip = (type, value) => {
    setChipFilters(prev => {
      const next = new Set(prev[type]);
      if (next.has(value)) next.delete(value); else next.add(value);
      return { ...prev, [type]: next };
    });
  };

  // Results count should reflect fallback when API returns 0
  const resultsCount = (products.length > 0)
    ? (pagination.total || products.length)
    : filteredFallback.length;

  const renderProduct = (product) => (
    <ProductCard
      key={product._id}
      product={product}
      onAddToCart={handleAddToCart}
      onToggleWishlist={handleToggleWishlist}
      isInWishlist={wishlist.has(product._id)}
    />
  );

  return (
    <SearchContainer>
      <SearchHeader>
        <SearchContent>
          <SearchTop>
            <SearchSection>
              <SearchBar
                placeholder="Search products..."
                onSearch={handleSearch}
                defaultValue={query}
              />
            </SearchSection>
            <FilterButton onClick={() => setShowFilters(!showFilters)}>
              <Filter size={16} />
              Filters
            </FilterButton>
            <SortButton>
              <SortAsc size={16} />
              Sort
            </SortButton>
          </SearchTop>
        </SearchContent>
      </SearchHeader>

      <SearchContent>
        <SearchResults>
          {showFilters && (
            <Sidebar>
              <SidebarTitle>Filters</SidebarTitle>
              
              <FilterGroup>
                <FilterLabel>Category</FilterLabel>
                <FilterSelect
                  value={filters.category}
                  onChange={(e) => handleFilterChange('category', e.target.value)}
                >
                  <option value="">All Categories</option>
                  {filterOptions.categories?.map(cat => (
                    <option key={cat._id} value={cat._id}>
                      {cat._id} ({cat.count})
                    </option>
                  ))}
                </FilterSelect>
              </FilterGroup>

              <FilterGroup>
                <FilterLabel>Brand</FilterLabel>
                <FilterSelect
                  value={filters.brand}
                  onChange={(e) => handleFilterChange('brand', e.target.value)}
                >
                  <option value="">All Brands</option>
                  {filterOptions.brands?.map(brand => (
                    <option key={brand._id} value={brand._id}>
                      {brand._id} ({brand.count})
                    </option>
                  ))}
                </FilterSelect>
              </FilterGroup>

              <FilterGroup>
                <FilterLabel>Price Range</FilterLabel>
                <div style={{ display: 'flex', gap: '0.5rem' }}>
                  <FilterInput
                    type="number"
                    placeholder="Min"
                    value={filters.minPrice}
                    onChange={(e) => handleFilterChange('minPrice', e.target.value)}
                  />
                  <FilterInput
                    type="number"
                    placeholder="Max"
                    value={filters.maxPrice}
                    onChange={(e) => handleFilterChange('maxPrice', e.target.value)}
                  />
                </div>
              </FilterGroup>

              <FilterGroup>
                <FilterLabel>Rating</FilterLabel>
                <FilterSelect
                  value={filters.rating}
                  onChange={(e) => handleFilterChange('rating', e.target.value)}
                >
                  <option value="">All Ratings</option>
                  <option value="4">4+ Stars</option>
                  <option value="3">3+ Stars</option>
                  <option value="2">2+ Stars</option>
                  <option value="1">1+ Stars</option>
                </FilterSelect>
              </FilterGroup>

              <FilterGroup>
                <FilterLabel>Sort By</FilterLabel>
                <FilterSelect
                  value={filters.sortBy}
                  onChange={(e) => handleFilterChange('sortBy', e.target.value)}
                >
                  <option value="relevance">Relevance</option>
                  <option value="price_asc">Price: Low to High</option>
                  <option value="price_desc">Price: High to Low</option>
                  <option value="rating">Rating</option>
                  <option value="newest">Newest</option>
                  <option value="name">Name</option>
                </FilterSelect>
              </FilterGroup>

              <ClearFiltersButton onClick={clearFilters}>
                Clear All Filters
              </ClearFiltersButton>
            </Sidebar>
          )}

          <MainContent>
            <ResultsHeader>
              <ResultsCount>
                {isLoading ? 'Searching...' : `${resultsCount} products found`}
                {query && ` for "${query}"`}
              </ResultsCount>
              <ViewToggle>
                <ViewButton
                  active={viewMode === 'grid'}
                  onClick={() => setViewMode('grid')}
                >
                  <Grid size={16} />
                </ViewButton>
                <ViewButton
                  active={viewMode === 'list'}
                  onClick={() => setViewMode('list')}
                >
                  <List size={16} />
                </ViewButton>
              </ViewToggle>
            </ResultsHeader>

            {isLoading ? (
              <LoadingSpinner text="Searching products..." />
            ) : error ? (
              <NoResults>
                <NoResultsTitle>Search Error</NoResultsTitle>
                <NoResultsText>Something went wrong while searching. Please try again.</NoResultsText>
              </NoResults>
            ) : products.length === 0 ? (
              <>
                <NoResults>
                  <NoResultsTitle>Sample products</NoResultsTitle>
                  <NoResultsText>
                    {query ? `No products for "${query}". Showing ${resultsCount} sample products grouped by brand.` : `Showing ${resultsCount} sample products grouped by brand.`}
                  </NoResultsText>
                </NoResults>

                {/* Filter chips */}
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', margin: '8px 0 16px 0' }}>
                  {allCategories.map(cat => (
                    <button key={cat} onClick={() => toggleChip('categories', cat)}
                      style={{ padding: '6px 10px', borderRadius: 20, border: '1px solid #d1d5db', background: chipFilters.categories.has(cat) ? '#3b82f6' : 'white', color: chipFilters.categories.has(cat) ? 'white' : '#374151', fontSize: 12 }}>
                      {cat}
                    </button>
                  ))}
                  {allBrands.map(brand => (
                    <button key={brand} onClick={() => toggleChip('brands', brand)}
                      style={{ padding: '6px 10px', borderRadius: 20, border: '1px solid #d1d5db', background: chipFilters.brands.has(brand) ? '#10b981' : 'white', color: chipFilters.brands.has(brand) ? 'white' : '#374151', fontSize: 12 }}>
                      {brand}
                    </button>
                  ))}
                  {(chipFilters.brands.size > 0 || chipFilters.categories.size > 0) && (
                    <button onClick={() => setChipFilters({ brands: new Set(), categories: new Set() })}
                      style={{ marginLeft: 8, padding: '6px 10px', borderRadius: 20, border: '1px solid #d1d5db', background: '#f3f4f6', fontSize: 12 }}>
                      Clear
                    </button>
                  )}
                </div>

                <ProductsGrid>
                  {[...filteredFallback]
                    .sort((a, b) => (a.name || '').localeCompare(b.name || ''))
                    .map(renderProduct)}
                </ProductsGrid>
              </>
            ) : (
              <>
                {viewMode === 'grid' ? (
                  <ProductsGrid>
                    {products.map(renderProduct)}
                  </ProductsGrid>
                ) : (
                  <ProductsList>
                    {products.map(renderProduct)}
                  </ProductsList>
                )}

                {pagination.pages > 1 && (
                  <Pagination>
                    <PaginationButton
                      disabled={pagination.current === 1}
                      onClick={() => handleFilterChange('page', pagination.current - 1)}
                    >
                      Previous
                    </PaginationButton>
                    
                    {Array.from({ length: Math.min(5, pagination.pages) }, (_, i) => {
                      const page = i + 1;
                      return (
                        <PaginationButton
                          key={page}
                          className={pagination.current === page ? 'active' : ''}
                          onClick={() => handleFilterChange('page', page)}
                        >
                          {page}
                        </PaginationButton>
                      );
                    })}
                    
                    <PaginationButton
                      disabled={pagination.current === pagination.pages}
                      onClick={() => handleFilterChange('page', pagination.current + 1)}
                    >
                      Next
                    </PaginationButton>
                  </Pagination>
                )}
              </>
            )}
          </MainContent>
        </SearchResults>
      </SearchContent>
    </SearchContainer>
  );
};

export default Search;
