import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

// Create axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Auth API
export const authAPI = {
  login: (data) => api.post('/auth/login', data),
  register: (data) => api.post('/auth/register', data),
  logout: () => api.post('/auth/logout'),
  getMe: () => api.get('/auth/me'),
  forgotPassword: (data) => api.post('/auth/forgot-password', data),
  resetPassword: (data) => api.post('/auth/reset-password', data),
  verifyEmail: (data) => api.post('/auth/verify-email', data),
  refreshToken: (data) => api.post('/auth/refresh-token', data),
};

// Users API
export const usersAPI = {
  getProfile: () => api.get('/users/profile'),
  updateProfile: (data) => api.put('/users/profile', data),
  updatePreferences: (data) => api.put('/users/preferences', data),
  getLoyalty: () => api.get('/users/loyalty'),
  getUsers: (params) => api.get('/users', { params }),
  updateUserStatus: (id, data) => api.put(`/users/${id}/status`, data),
};

// Products API
export const productsAPI = {
  getProducts: (params) => api.get('/products', { params }),
  // Convenience to fetch a lot of products (used by dashboards)
  getAll: (params = {}) => api.get('/products', { params: { page: 1, limit: 1000, ...params } }),
  getProduct: (id) => api.get(`/products/${id}`),
  searchProducts: (params) => api.get('/products/search', { params }),
  getSeasonalProducts: () => api.get('/products/seasonal'),
  getFeaturedProducts: () => api.get('/products/featured'),
  getByLocation: (params) => api.get('/products/by-location', { params }),
  createProduct: (data) => api.post('/products', data),
  updateProduct: (id, data) => api.put(`/products/${id}`, data),
  deleteProduct: (id) => api.delete(`/products/${id}`),
  addReview: (id, data) => api.post(`/products/${id}/review`, data),
};

// Recommendations API
export const recommendationsAPI = {
  // Matches server route: GET /api/recommendations (auth required)
  getPersonalized: (params) => api.get('/recommendations', { params }),
  getSeasonal: () => api.get('/recommendations/seasonal'),
  getTrending: (params) => api.get('/recommendations/trending', { params }),
  getBundles: () => api.get('/recommendations/bundles'),
  getSimilar: (productId) => api.get(`/recommendations/similar/${productId}`),
  // The following endpoints may not be implemented on server; guard usage in UI
  generateRecommendations: () => api.post('/recommendations/generate'),
  getReminders: () => api.get('/recommendations/reminders'),
};

// Loyalty API
export const loyaltyAPI = {
  getDashboard: () => api.get('/loyalty/dashboard'),
  getTransactions: (params) => api.get('/loyalty/transactions', { params }),
  earnPoints: (data) => api.post('/loyalty/earn', data),
  redeemPoints: (data) => api.post('/loyalty/redeem', data),
  getRewards: () => api.get('/loyalty/rewards'),
  getLeaderboard: (params) => api.get('/loyalty/leaderboard', { params }),
};

// Search API
export const searchAPI = {
  getSuggestions: (params) => api.get('/search/suggestions', { params }),
  getFilters: (params) => api.get('/search/filters', { params }),
  advancedSearch: (data) => api.post('/search/advanced', data),
  getTrending: () => api.get('/search/trending'),
  trackAnalytics: (data) => api.post('/search/analytics', data),
};

export default api;
