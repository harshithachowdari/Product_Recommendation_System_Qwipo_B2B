import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { BarChart3, Package, TrendingUp, Users, DollarSign, AlertTriangle } from 'lucide-react';
import { useSocket } from '../contexts/SocketContext';
import { productsAPI, recommendationsAPI } from '../services/api';

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
  grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
  gap: 1rem;
`;

const Card = styled.div`
  background: #fff;
  border: 1px solid #e5e7eb;
  border-radius: 12px;
  padding: 1rem;
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
  color: #6b7280;
  font-size: .875rem;
`;

const Chart = styled.div`
  margin-top: .75rem;
  height: 140px;
  display: flex;
  align-items: flex-end;
  gap: 8px;
`;

const Bar = styled.div`
  width: 10%;
  background: linear-gradient(180deg, #34d399, #10b981);
  border-radius: 6px 6px 0 0;
`;

export default function DistributorDashboard() {
  const { on, off } = useSocket();
  const [weeklySales] = useState([12, 18, 15, 22, 26, 21, 17]);
  const [activeRetailers] = useState(86);
  const [liveProductsCount, setLiveProductsCount] = useState(0);
  const [lowStockCount, setLowStockCount] = useState(0);
  const [seasonal, setSeasonal] = useState([]);
  const [topRegions, setTopRegions] = useState([
    { label: 'Hyderabad', value: 48 },
    { label: 'Bengaluru', value: 32 },
    { label: 'Chennai', value: 25 },
    { label: 'Pune', value: 18 },
  ]);

  const fetchInventoryStats = async () => {
    // Simple approximation: count active/in-stock products and low stock from price listing (placeholder)
    const resp = await productsAPI.getProducts({ limit: 200 });
    const items = resp?.data?.data?.products || [];
    setLiveProductsCount(items.length);
    setLowStockCount(items.filter(p => (p.inventory?.quantity ?? 0) <= (p.inventory?.minStockLevel ?? 10)).length);
  };

  const fetchSeasonal = async () => {
    try {
      const resp = await recommendationsAPI.getSeasonal();
      setSeasonal(resp?.data?.data?.products || []);
    } catch (error) {
      console.log('Seasonal products not available:', error.message);
      setSeasonal([]);
    }
  };

  useEffect(() => {
    fetchInventoryStats();
    fetchSeasonal();
  }, []);

  useEffect(() => {
    const handleSeasonal = () => fetchSeasonal();
    const handleInventory = () => fetchInventoryStats();
    on('seasonal_push', handleSeasonal);
    on('inventory_update', handleInventory);
    return () => {
      off('seasonal_push', handleSeasonal);
      off('inventory_update', handleInventory);
    };
  }, [on, off]);

  return (
    <Container>
      <Header>
        <Title>Distributor Dashboard</Title>
      </Header>

      <Grid>
        <Card>
          <StatRow>
            <DollarSign size={24} color="#10b981" />
            <div>
              <StatValue>₹ 12.8L</StatValue>
              <StatLabel>Sales This Month</StatLabel>
            </div>
          </StatRow>
          <Chart>
            {weeklySales.map((v, i) => (
              <Bar key={i} style={{ height: `${v * 6}px` }} />
            ))}
          </Chart>
        </Card>

        <Card>
          <StatRow>
            <Users size={24} color="#3b82f6" />
            <div>
              <StatValue>{activeRetailers}</StatValue>
              <StatLabel>Active Retailers</StatLabel>
            </div>
          </StatRow>
          <div style={{ marginTop: 10, color: '#6b7280', fontSize: 14 }}>
            +12% vs last month
          </div>
        </Card>

        <Card>
          <StatRow>
            <Package size={24} color="#f59e0b" />
            <div>
              <StatValue>{liveProductsCount}</StatValue>
              <StatLabel>Live Products</StatLabel>
            </div>
          </StatRow>
          <div style={{ marginTop: 10, color: '#6b7280', fontSize: 14 }}>
            <AlertTriangle size={14} color="#ef4444" style={{ verticalAlign: 'middle', marginRight: 6 }} />
            {lowStockCount} items low on stock
          </div>
        </Card>

        <Card>
          <StatRow>
            <BarChart3 size={22} color="#111827" />
            <div style={{ fontWeight: 600, color: '#111827' }}>Top Regions</div>
          </StatRow>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginTop: 8 }}>
            {topRegions.map((r) => (
              <div key={r.label}>
                <div style={{ color: '#374151', fontSize: 14 }}>{r.label}</div>
                <div style={{ height: 8, background: '#e5e7eb', borderRadius: 999, overflow: 'hidden' }}>
                  <div style={{ width: `${r.value}%`, height: '100%', background: '#10b981' }} />
                </div>
              </div>
            ))}
          </div>
        </Card>
      </Grid>

      {/* Seasonal Push (live) */}
      <Card style={{ marginTop: '1rem' }}>
        <StatRow style={{ marginBottom: 12 }}>
          <Package size={20} color="#f59e0b" />
          <div style={{ fontWeight: 600, color: '#111827' }}>Seasonal Push</div>
        </StatRow>
        {seasonal.length === 0 ? (
          <div style={{ color: '#6b7280' }}>No seasonal products right now.</div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 12 }}>
            {seasonal.map((p) => (
              <div key={p._id} style={{ border: '1px solid #e5e7eb', borderRadius: 10, padding: 10 }}>
                <div style={{ fontWeight: 600, color: '#111827' }}>{p.name}</div>
                <div style={{ color: '#6b7280', fontSize: 13 }}>{p.brand}</div>
                <div style={{ color: '#10b981', fontWeight: 600 }}>₹ {p.pricing?.sellingPrice}</div>
              </div>
            ))}
          </div>
        )}
      </Card>
    </Container>
  );
}
