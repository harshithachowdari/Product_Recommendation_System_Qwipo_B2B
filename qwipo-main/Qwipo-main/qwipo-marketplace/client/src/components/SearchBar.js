import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, X, Clock, TrendingUp } from 'lucide-react';
import { searchAPI } from '../services/api';
import styled from 'styled-components';

const SearchContainer = styled.div`
  position: relative;
  width: 100%;
  max-width: 600px;
`;

const SearchInputContainer = styled.div`
  position: relative;
  display: flex;
  align-items: center;
`;

const SearchInput = styled.input`
  width: 100%;
  padding: 0.75rem 1rem 0.75rem 2.5rem;
  border: 2px solid #e2e8f0;
  border-radius: 0.75rem;
  font-size: 1rem;
  transition: all 0.2s ease;
  background: white;

  &:focus {
    outline: none;
    border-color: #3b82f6;
    box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
  }

  &::placeholder {
    color: #9ca3af;
  }
`;

const SearchIcon = styled(Search)`
  position: absolute;
  left: 0.75rem;
  color: #9ca3af;
  width: 1.25rem;
  height: 1.25rem;
  z-index: 10;
`;

const ClearButton = styled.button`
  position: absolute;
  right: 0.75rem;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 1.5rem;
  height: 1.5rem;
  border: none;
  background: #f1f5f9;
  border-radius: 50%;
  color: #6b7280;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    background: #e2e8f0;
    color: #374151;
  }
`;

const SuggestionsDropdown = styled.div`
  position: absolute;
  top: 100%;
  left: 0;
  right: 0;
  background: white;
  border: 1px solid #e2e8f0;
  border-radius: 0.75rem;
  box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
  z-index: 50;
  max-height: 400px;
  overflow-y: auto;
  margin-top: 0.25rem;
`;

const SuggestionSection = styled.div`
  padding: 0.5rem 0;
`;

const SectionTitle = styled.div`
  padding: 0.5rem 1rem;
  font-size: 0.75rem;
  font-weight: 600;
  color: #6b7280;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  border-bottom: 1px solid #f1f5f9;
  margin-bottom: 0.25rem;
`;

const SuggestionItem = styled.button`
  width: 100%;
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.75rem 1rem;
  border: none;
  background: none;
  text-align: left;
  cursor: pointer;
  transition: background-color 0.2s ease;

  &:hover {
    background: #f8fafc;
  }

  &:focus {
    outline: none;
    background: #f1f5f9;
  }
`;

const SuggestionIcon = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 2rem;
  height: 2rem;
  border-radius: 0.375rem;
  background: #f1f5f9;
  color: #6b7280;
`;

const SuggestionContent = styled.div`
  flex: 1;
  min-width: 0;
`;

const SuggestionName = styled.div`
  font-weight: 500;
  color: #1e293b;
  margin-bottom: 0.25rem;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

const SuggestionMeta = styled.div`
  font-size: 0.75rem;
  color: #6b7280;
  text-transform: capitalize;
`;

const TrendingSection = styled.div`
  padding: 0.5rem 0;
  border-top: 1px solid #f1f5f9;
`;

const TrendingItem = styled.button`
  width: 100%;
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.75rem 1rem;
  border: none;
  background: none;
  text-align: left;
  cursor: pointer;
  transition: background-color 0.2s ease;

  &:hover {
    background: #f8fafc;
  }
`;

const TrendingIcon = styled(TrendingUp)`
  width: 1rem;
  height: 1rem;
  color: #3b82f6;
`;

const TrendingText = styled.span`
  color: #374151;
  font-weight: 500;
`;

const NoResults = styled.div`
  padding: 2rem 1rem;
  text-align: center;
  color: #6b7280;
`;

const LoadingSpinner = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 1rem;
  color: #6b7280;
`;

const SearchBar = ({ 
  placeholder = "Search products...", 
  onSearch, 
  showTrending = true,
  className 
}) => {
  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [trending, setTrending] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  
  const navigate = useNavigate();
  const inputRef = useRef(null);
  const suggestionsRef = useRef(null);
  const debounceRef = useRef(null);

  useEffect(() => {
    if (showTrending) {
      loadTrending();
    }
  }, [showTrending]);

  useEffect(() => {
    if (query.trim().length >= 2) {
      debounceRef.current = setTimeout(() => {
        loadSuggestions(query);
      }, 300);
    } else {
      setSuggestions([]);
      setShowSuggestions(false);
    }

    return () => {
      if (debounceRef.current) {
        clearTimeout(debounceRef.current);
      }
    };
  }, [query]);

  const loadSuggestions = async (searchQuery) => {
    try {
      setIsLoading(true);
      const response = await searchAPI.getSuggestions({ q: searchQuery });
      if (response.data.success) {
        setSuggestions(response.data.data.suggestions);
        setShowSuggestions(true);
      }
    } catch (error) {
      console.error('Error loading suggestions:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const loadTrending = async () => {
    try {
      const response = await searchAPI.getTrending();
      if (response.data.success) {
        setTrending(response.data.data.trendingTerms);
      }
    } catch (error) {
      console.error('Error loading trending:', error);
    }
  };

  const handleInputChange = (e) => {
    setQuery(e.target.value);
    setSelectedIndex(-1);
  };

  const handleKeyDown = (e) => {
    if (!showSuggestions) return;

    const totalItems = suggestions.length + (trending.length > 0 ? trending.length + 1 : 0);

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setSelectedIndex(prev => 
          prev < totalItems - 1 ? prev + 1 : prev
        );
        break;
      case 'ArrowUp':
        e.preventDefault();
        setSelectedIndex(prev => prev > 0 ? prev - 1 : -1);
        break;
      case 'Enter':
        e.preventDefault();
        if (selectedIndex >= 0) {
          handleSuggestionClick(getSuggestionByIndex(selectedIndex));
        } else {
          handleSearch();
        }
        break;
      case 'Escape':
        setShowSuggestions(false);
        setSelectedIndex(-1);
        inputRef.current?.blur();
        break;
    }
  };

  const getSuggestionByIndex = (index) => {
    if (index < suggestions.length) {
      return suggestions[index];
    } else if (trending.length > 0) {
      return { name: trending[index - suggestions.length], type: 'trending' };
    }
    return null;
  };

  const handleSuggestionClick = (suggestion) => {
    if (suggestion) {
      setQuery(suggestion.name);
      setShowSuggestions(false);
      navigate(`/search?q=${encodeURIComponent(suggestion.name)}`);
      onSearch?.(suggestion.name);
    }
  };

  const handleSearch = () => {
    if (query.trim()) {
      setShowSuggestions(false);
      navigate(`/search?q=${encodeURIComponent(query.trim())}`);
      onSearch?.(query.trim());
    }
  };

  const handleClear = () => {
    setQuery('');
    setSuggestions([]);
    setShowSuggestions(false);
    setSelectedIndex(-1);
    inputRef.current?.focus();
  };

  const handleInputFocus = () => {
    if (suggestions.length > 0 || trending.length > 0) {
      setShowSuggestions(true);
    }
  };

  const handleInputBlur = () => {
    // Delay hiding suggestions to allow clicking on them
    setTimeout(() => {
      setShowSuggestions(false);
      setSelectedIndex(-1);
    }, 200);
  };

  const renderSuggestions = () => {
    if (isLoading) {
      return (
        <LoadingSpinner>
          <div className="loading" />
          <span style={{ marginLeft: '0.5rem' }}>Loading suggestions...</span>
        </LoadingSpinner>
      );
    }

    if (suggestions.length === 0 && trending.length === 0) {
      return (
        <NoResults>
          <p>No suggestions found</p>
        </NoResults>
      );
    }

    return (
      <>
        {suggestions.length > 0 && (
          <SuggestionSection>
            <SectionTitle>Suggestions</SectionTitle>
            {suggestions.map((suggestion, index) => (
              <SuggestionItem
                key={`${suggestion.name}-${index}`}
                onClick={() => handleSuggestionClick(suggestion)}
                style={{
                  background: selectedIndex === index ? '#f1f5f9' : 'transparent'
                }}
              >
                <SuggestionIcon>
                  <Search size={16} />
                </SuggestionIcon>
                <SuggestionContent>
                  <SuggestionName>{suggestion.name}</SuggestionName>
                  <SuggestionMeta>{suggestion.type}</SuggestionMeta>
                </SuggestionContent>
              </SuggestionItem>
            ))}
          </SuggestionSection>
        )}

        {trending.length > 0 && (
          <TrendingSection>
            <SectionTitle>Trending</SectionTitle>
            {trending.map((term, index) => (
              <TrendingItem
                key={term}
                onClick={() => handleSuggestionClick({ name: term, type: 'trending' })}
                style={{
                  background: selectedIndex === suggestions.length + index ? '#f1f5f9' : 'transparent'
                }}
              >
                <TrendingIcon size={16} />
                <TrendingText>{term}</TrendingText>
              </TrendingItem>
            ))}
          </TrendingSection>
        )}
      </>
    );
  };

  return (
    <SearchContainer className={className}>
      <SearchInputContainer>
        <SearchIcon />
        <SearchInput
          ref={inputRef}
          type="text"
          placeholder={placeholder}
          value={query}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          onFocus={handleInputFocus}
          onBlur={handleInputBlur}
        />
        {query && (
          <ClearButton onClick={handleClear}>
            <X size={14} />
          </ClearButton>
        )}
      </SearchInputContainer>

      {showSuggestions && (suggestions.length > 0 || trending.length > 0) && (
        <SuggestionsDropdown ref={suggestionsRef}>
          {renderSuggestions()}
        </SuggestionsDropdown>
      )}
    </SearchContainer>
  );
};

export default SearchBar;
