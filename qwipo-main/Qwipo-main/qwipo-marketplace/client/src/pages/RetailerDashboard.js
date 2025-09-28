import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { BarChart3, Package, TrendingUp, ShoppingCart, AlertTriangle, MapPin, Users, DollarSign, Eye, Star } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useSocket } from '../contexts/SocketContext';
import { productsAPI, recommendationsAPI } from '../services/api';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title as ChartTitle,
  Tooltip,
  Legend,
  ArcElement,
  PointElement,
  LineElement,
} from 'chart.js';
import { Bar, Doughnut, Line } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  ChartTitle,
  Tooltip,
  Legend,
  ArcElement,
  PointElement,
  LineElement
);

const Container = styled.div`
  max-width: 1280px;
  margin: 0 auto;
  padding: 2rem 1rem;
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
`;

const Title = styled.h1`
  font-size: 1.75rem;
  font-weight: 700;
  color: #1f2937;
`;

const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
  gap: 1rem;
  margin-bottom: 2rem;
`;

const Card = styled.div`
  background: #fff;
  border: 1px solid #e5e7eb;
  border-radius: 12px;
  padding: 1rem;
  box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1);
`;

const ChartCard = styled.div`
  background: #fff;
  border: 1px solid #e5e7eb;
  border-radius: 12px;
  padding: 1.5rem;
  box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1);
  margin-bottom: 1.5rem;
`;

const StatRow = styled.div`
  display: flex;
  align-items: center;
  gap: .75rem;
`;

const StatValue = styled.div`
  font-size: 1.5rem;
  font-weight: 700;
  color: #111827;
`;

const StatLabel = styled.div`
  font-size: .875rem;
  color: #6b7280;
`;

const StatIcon = styled.div`
  width: 2.5rem;
  height: 2.5rem;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  background: ${props => props.color || '#3b82f6'};
`;

const ChartTitleStyled = styled.h3`
  font-size: 1.125rem;
  font-weight: 600;
  color: #1f2937;
  margin-bottom: 1rem;
`;

const ChartGrid = styled.div`
  display: grid;
  grid-template-columns: 2fr 1fr;
  gap: 1.5rem;
  margin-bottom: 1.5rem;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const LocationGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1.5rem;
  margin-bottom: 1.5rem;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const LocationCard = styled.div`
  background: #fff;
  border: 1px solid #e5e7eb;
  border-radius: 12px;
  padding: 1rem;
  box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1);
`;

const LocationTitle = styled.h4`
  font-size: 1rem;
  font-weight: 600;
  color: #1f2937;
  margin-bottom: 0.5rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const LocationStats = styled.div`
  display: flex;
  justify-content: space-between;
  margin-bottom: 0.5rem;
`;

const LocationStat = styled.div`
  font-size: 0.875rem;
  color: #6b7280;
`;

const LocationValue = styled.div`
  font-size: 0.875rem;
  font-weight: 600;
  color: #1f2937;
`;

const ProductList = styled.div`
  max-height: 200px;
  overflow-y: auto;
`;

const ProductItem = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.5rem 0;
  border-bottom: 1px solid #f3f4f6;
  
  &:last-child {
    border-bottom: none;
  }
`;

const ProductName = styled.div`
  font-size: 0.875rem;
  color: #1f2937;
  font-weight: 500;
`;

const ProductSales = styled.div`
  font-size: 0.875rem;
  color: #059669;
  font-weight: 600;
`;

const LoadingSpinner = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 200px;
  color: #6b7280;
`;

export default function RetailerDashboard() {
  const { user } = useAuth();
  const { socket } = useSocket();
  const [stats, setStats] = useState({
    totalProducts: 0,
    totalOrders: 0,
    totalRevenue: 0,
    lowStockItems: 0,
    activeUsers: 0,
    conversionRate: 0
  });
  const [chartData, setChartData] = useState({
    salesOverTime: null,
    categoryDistribution: null,
    topProducts: null,
    locationData: null,
    locationTrends: null,
    categorySales: null,
    productByCategory: null
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
    
    if (socket) {
      socket.on('dashboardUpdate', (data) => {
        setStats(prev => ({ ...prev, ...data }));
      });
    }

    return () => {
      if (socket) {
        socket.off('dashboardUpdate');
      }
    };
  }, [socket]);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      
      // Fetch products
      const productsResp = await productsAPI.getAll();
      const products = productsResp?.data?.data?.products || [];
      
      // Fetch recommendations
      const [remindersResp, bundlesResp, seasonalResp] = await Promise.all([
        recommendationsAPI.getReminders().catch(() => ({ data: { data: { reminders: [] } } })),
        recommendationsAPI.getBundles().catch(() => ({ data: { data: { bundles: [] } } })),
        recommendationsAPI.getSeasonal().catch(() => ({ data: { data: { products: [] } } }))
      ]);

      const reminders = remindersResp?.data?.data?.reminders || [];
      const bundles = bundlesResp?.data?.data?.bundles || [];
      const seasonal = seasonalResp?.data?.data?.products || [];

      // Calculate stats
      const totalProducts = products.length;
      const lowStockItems = products.filter(p => p.inventory.quantity <= p.inventory.minStockLevel).length;
      const totalRevenue = products.reduce((sum, p) => sum + (p.pricing.sellingPrice * p.inventory.quantity), 0);
      
      // Generate mock data for demonstration
      const mockStats = {
        totalProducts,
        totalOrders: Math.floor(Math.random() * 1000) + 500,
        totalRevenue: Math.floor(totalRevenue * 0.1), // 10% of inventory value
        lowStockItems,
        activeUsers: Math.floor(Math.random() * 100) + 50,
        conversionRate: Math.floor(Math.random() * 20) + 5
      };

      setStats(mockStats);

      // Generate chart data
      generateChartData(products);

    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const generateChartData = (products) => {
    // Sales over time (last 7 days)
    const salesOverTime = {
      labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
      datasets: [{
        label: 'Sales (₹)',
        data: [12000, 19000, 15000, 25000, 22000, 30000, 28000],
        borderColor: 'rgb(59, 130, 246)',
        backgroundColor: 'rgba(59, 130, 246, 0.1)',
        tension: 0.4
      }]
    };

    // Category distribution
    const categoryCount = products.reduce((acc, product) => {
      acc[product.category] = (acc[product.category] || 0) + 1;
      return acc;
    }, {});

    const categoryDistribution = {
      labels: Object.keys(categoryCount),
      datasets: [{
        data: Object.values(categoryCount),
        backgroundColor: [
          '#3b82f6',
          '#10b981',
          '#f59e0b',
          '#ef4444',
          '#8b5cf6',
          '#06b6d4',
          '#84cc16',
          '#f97316'
        ]
      }]
    };

    // Top products by sales
    const topProducts = products
      .sort((a, b) => (b.rating.average * b.rating.count) - (a.rating.average * a.rating.count))
      .slice(0, 5);

    const topProductsData = {
      labels: topProducts.map(p => p.name.substring(0, 20) + '...'),
      datasets: [{
        label: 'Sales Volume',
        data: topProducts.map(p => Math.floor(Math.random() * 100) + 10),
        backgroundColor: 'rgba(59, 130, 246, 0.8)'
      }]
    };

    // Location-based data (mock)
    const locationData = {
      'Mumbai': { sales: 45000, orders: 120, topProducts: ['Rice', 'Oil', 'Spices'] },
      'Delhi': { sales: 38000, orders: 95, topProducts: ['Flour', 'Tea', 'Sugar'] },
      'Bangalore': { sales: 32000, orders: 80, topProducts: ['Milk', 'Bread', 'Coffee'] },
      'Chennai': { sales: 28000, orders: 70, topProducts: ['Dal', 'Salt', 'Chili'] }
    };

    // Location sales trends (curly line graph)
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'];
    const palette = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444'];
    const cities = Object.keys(locationData);
    const locationTrends = {
      labels: months,
      datasets: cities.map((city, idx) => ({
        label: city,
        data: months.map((_, i) => Math.floor(locationData[city].orders * (0.6 + Math.random() * 0.8) * (i + 1) / months.length)),
        borderColor: palette[idx % palette.length],
        backgroundColor: 'transparent',
        tension: 0.45,
        pointRadius: 3
      }))
    };

    // Location Sales Trends by Products (stacked bar: products across locations)
    const topProductsGlobal = products.slice(0, 4); // pick 4 products for legend
    const paletteBars = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444'];
    const locationProductTrends = {
      labels: cities,
      datasets: topProductsGlobal.map((p, idx) => ({
        label: p.name.substring(0, 16) + (p.name.length > 16 ? '…' : ''),
        data: cities.map(city => Math.floor((locationData[city].orders || 50) * (0.2 + Math.random() * 0.6))),
        backgroundColor: paletteBars[idx % paletteBars.length],
        stack: 'sales'
      }))
    };

    // Product-wise by category (top 5 overall, colored by category)
    const top5 = products.slice(0, 5);
    const colorByCat = (cat) => ({
      grocery: '#84cc16',
      beverages: '#f97316',
      electronics: '#8b5cf6',
      clothing: '#10b981',
      pharmacy: '#f43f5e',
    }[cat] || '#3b82f6');
    const productByCategory = {
      labels: top5.map(p => p.name.substring(0, 18) + (p.name.length > 18 ? '…' : '')),
      datasets: [{
        label: 'Units Sold',
        data: top5.map(() => Math.floor(Math.random() * 120) + 20),
        backgroundColor: top5.map(p => colorByCat(p.category))
      }]
    };

    setChartData({
      salesOverTime,
      categoryDistribution,
      topProducts: topProductsData,
      locationData,
      locationTrends,
      locationProductTrends,
      productByCategory
    });
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
    },
    scales: {
      y: {
        beginAtZero: true,
      },
    },
  };

  if (loading) {
    return (
      <Container>
        <LoadingSpinner>Loading dashboard...</LoadingSpinner>
      </Container>
    );
  }

  return (
    <Container>
      <Header>
        <Title>Retailer Dashboard</Title>
        <div style={{ color: '#6b7280', fontSize: '0.875rem' }}>
          Welcome back, {user?.firstName}!
        </div>
      </Header>

      {/* Stats Grid */}
      <Grid>
        <Card>
          <StatRow>
            <StatIcon color="#3b82f6">
              <Package size={20} />
            </StatIcon>
            <div>
              <StatValue>{stats.totalProducts}</StatValue>
              <StatLabel>Total Products</StatLabel>
            </div>
          </StatRow>
        </Card>

        <Card>
          <StatRow>
            <StatIcon color="#10b981">
              <ShoppingCart size={20} />
            </StatIcon>
            <div>
              <StatValue>{stats.totalOrders}</StatValue>
              <StatLabel>Total Orders</StatLabel>
            </div>
          </StatRow>
        </Card>

        <Card>
          <StatRow>
            <StatIcon color="#f59e0b">
              <DollarSign size={20} />
            </StatIcon>
            <div>
              <StatValue>₹{stats.totalRevenue.toLocaleString()}</StatValue>
              <StatLabel>Total Revenue</StatLabel>
          </div>
          </StatRow>
        </Card>

        <Card>
          <StatRow>
            <StatIcon color="#ef4444">
              <AlertTriangle size={20} />
            </StatIcon>
            <div>
              <StatValue>{stats.lowStockItems}</StatValue>
              <StatLabel>Low Stock Items</StatLabel>
            </div>
          </StatRow>
        </Card>

        <Card>
          <StatRow>
            <StatIcon color="#8b5cf6">
              <Users size={20} />
            </StatIcon>
            <div>
              <StatValue>{stats.activeUsers}</StatValue>
              <StatLabel>Active Users</StatLabel>
          </div>
          </StatRow>
        </Card>

        <Card>
          <StatRow>
            <StatIcon color="#06b6d4">
              <TrendingUp size={20} />
            </StatIcon>
            <div>
              <StatValue>{stats.conversionRate}%</StatValue>
              <StatLabel>Conversion Rate</StatLabel>
            </div>
          </StatRow>
        </Card>
      </Grid>

      {/* Charts Section */}
      <ChartGrid>
        <ChartCard>
          <ChartTitleStyled>Sales Over Time</ChartTitleStyled>
          {chartData.salesOverTime && (
            <Line data={chartData.salesOverTime} options={chartOptions} />
          )}
        </ChartCard>

        <ChartCard>
          <ChartTitleStyled>Category Distribution</ChartTitleStyled>
          {chartData.categoryDistribution && (
            <Doughnut data={chartData.categoryDistribution} options={chartOptions} />
          )}
        </ChartCard>
      </ChartGrid>

      {/* Additional Analytics */}
      <ChartGrid>
        <ChartCard>
          <ChartTitleStyled>Location Sales Trends</ChartTitleStyled>
          {chartData.locationTrends && (
            <Line data={chartData.locationTrends} options={{ ...chartOptions, plugins: { ...chartOptions.plugins }, elements: { line: { tension: 0.45 } } }} />
          )}
        </ChartCard>

        <ChartCard>
          <ChartTitleStyled>Location Sales Trends by Products</ChartTitleStyled>
          {chartData.locationProductTrends && (
            <Bar 
              data={chartData.locationProductTrends} 
              options={{
                ...chartOptions,
                scales: {
                  x: { stacked: true },
                  y: { beginAtZero: true, stacked: true }
                }
              }}
            />
          )}
        </ChartCard>
      </ChartGrid>

      <ChartCard>
        <ChartTitleStyled>Product-wise Sales by Category</ChartTitleStyled>
        {chartData.productByCategory && (
          <Bar data={chartData.productByCategory} options={{ ...chartOptions, indexAxis: 'y' }} />
        )}
      </ChartCard>

      {/* Top Products Chart */}
      <ChartCard>
        <ChartTitleStyled>Top Products by Sales</ChartTitleStyled>
        {chartData.topProducts && (
          <Bar data={chartData.topProducts} options={chartOptions} />
        )}
      </ChartCard>

      {/* Location-based Analytics */}
      <ChartTitleStyled style={{ marginBottom: '1rem' }}>Location-based Product Analytics</ChartTitleStyled>
      <LocationGrid>
        {chartData.locationData && Object.entries(chartData.locationData).map(([location, data]) => (
          <LocationCard key={location}>
            <LocationTitle>
              <MapPin size={16} />
              {location}
            </LocationTitle>
            <LocationStats>
              <LocationStat>Sales:</LocationStat>
              <LocationValue>₹{data.sales.toLocaleString()}</LocationValue>
            </LocationStats>
            <LocationStats>
              <LocationStat>Orders:</LocationStat>
              <LocationValue>{data.orders}</LocationValue>
            </LocationStats>
            <LocationStats>
              <LocationStat>Top Products:</LocationStat>
            </LocationStats>
            <ProductList>
              {data.topProducts.map((product, index) => (
                <ProductItem key={index}>
                  <ProductName>{product}</ProductName>
                  <ProductSales>{Math.floor(Math.random() * 50) + 10} sales</ProductSales>
                </ProductItem>
              ))}
            </ProductList>
          </LocationCard>
        ))}
      </LocationGrid>
    </Container>
  );
}