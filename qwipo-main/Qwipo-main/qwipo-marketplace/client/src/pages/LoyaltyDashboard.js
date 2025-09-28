import React, { useState } from 'react';
import { useQuery } from 'react-query';
import { Star, Gift, TrendingUp, Award, Crown, Zap, Target, History } from 'lucide-react';
import styled from 'styled-components';
import LoadingSpinner from '../components/LoadingSpinner';
import { loyaltyAPI } from '../services/api';
import { useAuth } from '../contexts/AuthContext';

const DashboardContainer = styled.div`
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

const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1.5rem;
  margin-bottom: 3rem;
`;

const StatCard = styled.div`
  background: white;
  border-radius: 1rem;
  padding: 2rem;
  box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1);
  text-align: center;
  transition: all 0.2s ease;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
  }
`;

const StatIcon = styled.div`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 4rem;
  height: 4rem;
  background: ${props => {
    switch (props.type) {
      case 'points': return 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)';
      case 'tier': return 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)';
      case 'earned': return 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)';
      case 'redeemed': return 'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)';
      default: return '#3b82f6';
    }
  }};
  color: white;
  border-radius: 1rem;
  margin-bottom: 1rem;
`;

const StatValue = styled.h3`
  font-size: 2.5rem;
  font-weight: 700;
  color: #1e293b;
  margin-bottom: 0.5rem;
`;

const StatLabel = styled.p`
  color: #64748b;
  font-size: 0.875rem;
  margin: 0;
`;

const TierCard = styled.div`
  background: white;
  border-radius: 1rem;
  padding: 2rem;
  box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1);
  margin-bottom: 2rem;
`;

const TierHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 1.5rem;
`;

const TierIcon = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 4rem;
  height: 4rem;
  background: ${props => {
    switch (props.tier) {
      case 'bronze': return 'linear-gradient(135deg, #cd7f32 0%, #b8860b 100%)';
      case 'silver': return 'linear-gradient(135deg, #c0c0c0 0%, #a8a8a8 100%)';
      case 'gold': return 'linear-gradient(135deg, #ffd700 0%, #ffb347 100%)';
      case 'platinum': return 'linear-gradient(135deg, #e5e4e2 0%, #c0c0c0 100%)';
      default: return '#6b7280';
    }
  }};
  color: white;
  border-radius: 1rem;
`;

const TierInfo = styled.div`
  flex: 1;
`;

const TierName = styled.h3`
  font-size: 1.5rem;
  font-weight: 700;
  color: #1e293b;
  margin: 0 0 0.5rem 0;
`;

const TierDescription = styled.p`
  color: #64748b;
  margin: 0;
`;

const TierProgress = styled.div`
  margin-bottom: 1.5rem;
`;

const ProgressLabel = styled.div`
  display: flex;
  justify-content: space-between;
  margin-bottom: 0.5rem;
`;

const ProgressBar = styled.div`
  width: 100%;
  height: 0.5rem;
  background: #e2e8f0;
  border-radius: 0.25rem;
  overflow: hidden;
`;

const ProgressFill = styled.div`
  height: 100%;
  background: linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%);
  width: ${props => props.percentage}%;
  transition: width 0.3s ease;
`;

const TierBenefits = styled.div`
  h4 {
    font-size: 1rem;
    font-weight: 600;
    color: #1e293b;
    margin-bottom: 0.75rem;
  }
`;

const BenefitList = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0;
`;

const BenefitItem = styled.li`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 0.5rem;
  color: #64748b;
  font-size: 0.875rem;

  &::before {
    content: '✓';
    color: #10b981;
    font-weight: 600;
  }
`;

const RewardsSection = styled.div`
  background: white;
  border-radius: 1rem;
  padding: 2rem;
  box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1);
  margin-bottom: 2rem;
`;

const SectionTitle = styled.h3`
  font-size: 1.5rem;
  font-weight: 700;
  color: #1e293b;
  margin-bottom: 1.5rem;
`;

const RewardsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1rem;
`;

const RewardCard = styled.div`
  border: 1px solid #e2e8f0;
  border-radius: 0.75rem;
  padding: 1.5rem;
  transition: all 0.2s ease;
  position: relative;

  &:hover {
    border-color: #3b82f6;
    transform: translateY(-2px);
    box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
  }

  &.unavailable {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

const RewardHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 1rem;
`;

const RewardIcon = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 2.5rem;
  height: 2.5rem;
  background: #3b82f6;
  color: white;
  border-radius: 0.5rem;
`;

const RewardName = styled.h4`
  font-size: 1rem;
  font-weight: 600;
  color: #1e293b;
  margin: 0;
`;

const RewardDescription = styled.p`
  color: #64748b;
  font-size: 0.875rem;
  margin-bottom: 1rem;
`;

const RewardPoints = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const PointsRequired = styled.span`
  color: #3b82f6;
  font-weight: 600;
  font-size: 0.875rem;
`;

const RedeemButton = styled.button`
  padding: 0.5rem 1rem;
  background: #3b82f6;
  color: white;
  border: none;
  border-radius: 0.375rem;
  font-size: 0.875rem;
  font-weight: 500;
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

const TransactionsSection = styled.div`
  background: white;
  border-radius: 1rem;
  padding: 2rem;
  box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1);
`;

const TransactionsList = styled.div`
  max-height: 400px;
  overflow-y: auto;
`;

const TransactionItem = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem 0;
  border-bottom: 1px solid #f1f5f9;

  &:last-child {
    border-bottom: none;
  }
`;

const TransactionInfo = styled.div`
  flex: 1;
`;

const TransactionReason = styled.div`
  font-weight: 500;
  color: #1e293b;
  margin-bottom: 0.25rem;
`;

const TransactionDate = styled.div`
  font-size: 0.875rem;
  color: #64748b;
`;

const TransactionPoints = styled.div`
  font-weight: 600;
  color: ${props => props.type === 'earned' ? '#10b981' : '#ef4444'};
`;

const EmptyState = styled.div`
  text-align: center;
  padding: 2rem;
  color: #64748b;
`;

const LoyaltyDashboard = () => {
  const { user } = useAuth();
  const [selectedReward, setSelectedReward] = useState(null);

  // Fetch loyalty dashboard data
  const { data: dashboardData, isLoading: dashboardLoading } = useQuery(
    'loyalty-dashboard',
    () => loyaltyAPI.getDashboard(),
    {
      staleTime: 5 * 60 * 1000,
    }
  );

  // Fetch rewards
  const { data: rewardsData, isLoading: rewardsLoading } = useQuery(
    'loyalty-rewards',
    () => loyaltyAPI.getRewards(),
    {
      staleTime: 10 * 60 * 1000,
    }
  );

  // Fetch transactions
  const { data: transactionsData, isLoading: transactionsLoading } = useQuery(
    'loyalty-transactions',
    () => loyaltyAPI.getTransactions({ limit: 10 }),
    {
      staleTime: 2 * 60 * 1000,
    }
  );

  const handleRedeemReward = (rewardId) => {
    console.log('Redeem reward:', rewardId);
    // TODO: Implement reward redemption
  };

  if (dashboardLoading) {
    return <LoadingSpinner text="Loading loyalty dashboard..." />;
  }

  const dashboard = dashboardData?.data || {};
  const rewards = rewardsData?.data?.rewards || [];
  const transactions = transactionsData?.data?.transactions || [];
  const currentTier = dashboard.currentTier || {};

  return (
    <DashboardContainer>
      {/* Hero Section */}
      <HeroSection>
        <HeroContent>
          <HeroTitle>Loyalty Dashboard</HeroTitle>
          <HeroSubtitle>
            Track your points, unlock rewards, and discover exclusive benefits.
          </HeroSubtitle>
        </HeroContent>
      </HeroSection>

      {/* Content Section */}
      <ContentSection>
        <Container>
          {/* Stats Grid */}
          <StatsGrid>
            <StatCard>
              <StatIcon type="points">
                <Star size={24} />
              </StatIcon>
              <StatValue>{dashboard.loyaltyPoints || 0}</StatValue>
              <StatLabel>Loyalty Points</StatLabel>
            </StatCard>

            <StatCard>
              <StatIcon type="tier">
                <Crown size={24} />
              </StatIcon>
              <StatValue>{dashboard.loyaltyTier || 'Bronze'}</StatValue>
              <StatLabel>Current Tier</StatLabel>
            </StatCard>

            <StatCard>
              <StatIcon type="earned">
                <TrendingUp size={24} />
              </StatIcon>
              <StatValue>{dashboard.stats?.totalEarned || 0}</StatValue>
              <StatLabel>Total Earned</StatLabel>
            </StatCard>

            <StatCard>
              <StatIcon type="redeemed">
                <Gift size={24} />
              </StatIcon>
              <StatValue>{dashboard.stats?.totalRedeemed || 0}</StatValue>
              <StatLabel>Total Redeemed</StatLabel>
            </StatCard>
          </StatsGrid>

          {/* Tier Card */}
          <TierCard>
            <TierHeader>
              <TierIcon tier={dashboard.loyaltyTier}>
                <Crown size={24} />
              </TierIcon>
              <TierInfo>
                <TierName>{currentTier.name} Member</TierName>
                <TierDescription>
                  {currentTier.nextTier 
                    ? `${currentTier.pointsNeeded} points to reach ${currentTier.nextTier}`
                    : 'You\'ve reached the highest tier!'
                  }
                </TierDescription>
              </TierInfo>
            </TierHeader>

            {currentTier.nextTier && (
              <TierProgress>
                <ProgressLabel>
                  <span>Progress to {currentTier.nextTier}</span>
                  <span>{currentTier.pointsNeeded} points needed</span>
                </ProgressLabel>
                <ProgressBar>
                  <ProgressFill 
                    percentage={Math.min(100, ((currentTier.minPoints || 0) / (currentTier.minPoints + currentTier.pointsNeeded)) * 100)}
                  />
                </ProgressBar>
              </TierProgress>
            )}

            <TierBenefits>
              <h4>Your Benefits</h4>
              <BenefitList>
                {currentTier.benefits?.map((benefit, index) => (
                  <BenefitItem key={index}>{benefit}</BenefitItem>
                ))}
              </BenefitList>
            </TierBenefits>
          </TierCard>

          {/* Rewards Section */}
          <RewardsSection>
            <SectionTitle>Available Rewards</SectionTitle>
            {rewardsLoading ? (
              <LoadingSpinner text="Loading rewards..." />
            ) : (
              <RewardsGrid>
                {rewards.map((reward) => (
                  <RewardCard 
                    key={reward.id}
                    className={!reward.available ? 'unavailable' : ''}
                  >
                    <RewardHeader>
                      <RewardIcon>
                        <Gift size={16} />
                      </RewardIcon>
                      <RewardName>{reward.name}</RewardName>
                    </RewardHeader>
                    <RewardDescription>{reward.description}</RewardDescription>
                    <RewardPoints>
                      <PointsRequired>{reward.pointsRequired} points</PointsRequired>
                      <RedeemButton
                        onClick={() => handleRedeemReward(reward.id)}
                        disabled={!reward.available}
                      >
                        {reward.available ? 'Redeem' : 'Not Available'}
                      </RedeemButton>
                    </RewardPoints>
                  </RewardCard>
                ))}
              </RewardsGrid>
            )}
          </RewardsSection>

          {/* Transactions Section */}
          <TransactionsSection>
            <SectionTitle>Recent Transactions</SectionTitle>
            {transactionsLoading ? (
              <LoadingSpinner text="Loading transactions..." />
            ) : transactions.length === 0 ? (
              <EmptyState>
                <p>No transactions yet. Start earning points by making purchases!</p>
              </EmptyState>
            ) : (
              <TransactionsList>
                {transactions.map((transaction, index) => (
                  <TransactionItem key={index}>
                    <TransactionInfo>
                      <TransactionReason>{transaction.reason}</TransactionReason>
                      <TransactionDate>
                        {new Date(transaction.createdAt).toLocaleDateString()}
                      </TransactionDate>
                    </TransactionInfo>
                    <TransactionPoints type={transaction.type}>
                      {transaction.type === 'earned' ? '+' : '-'}{Math.abs(transaction.points)}
                    </TransactionPoints>
                  </TransactionItem>
                ))}
              </TransactionsList>
            )}
          </TransactionsSection>
        </Container>
      </ContentSection>
    </DashboardContainer>
  );
};

export default LoyaltyDashboard;
