import React from 'react';
import styled from 'styled-components';
import { FiBarChart, FiTrendingUp, FiClock, FiServer } from 'react-icons/fi';

const PageContainer = styled.div`
  max-width: 1200px;
  margin: 0 auto;
`;

const Card = styled.div`
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 16px;
  padding: 2rem;
  margin-bottom: 2rem;
`;

const Title = styled.h1`
  color: white;
  font-size: 2rem;
  font-weight: 700;
  margin: 0 0 2rem 0;
  display: flex;
  align-items: center;
  gap: 1rem;
`;

const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1.5rem;
  margin-bottom: 2rem;
`;

const StatCard = styled.div`
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 12px;
  padding: 1.5rem;
  text-align: center;
`;

const StatIcon = styled.div`
  background: ${props => props.color};
  color: white;
  padding: 1rem;
  border-radius: 50%;
  font-size: 1.5rem;
  width: 50px;
  height: 50px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 1rem;
`;

const StatValue = styled.div`
  color: white;
  font-size: 2rem;
  font-weight: 700;
  margin-bottom: 0.5rem;
`;

const StatLabel = styled.div`
  color: rgba(255, 255, 255, 0.7);
  font-size: 0.875rem;
`;

const AnalyticsPage = ({ protocol, metrics }) => {
  const getMetricsSummary = (protocolType) => {
    const protocolMetrics = metrics[protocolType];
    if (!protocolMetrics || Object.keys(protocolMetrics).length === 0) {
      return {
        totalRequests: 0,
        averageTime: 0,
        successRate: 100
      };
    }

    const allMetrics = Object.values(protocolMetrics).filter(Boolean);
    const totalRequests = allMetrics.length;
    const averageTime = totalRequests > 0
      ? allMetrics.reduce((sum, m) => sum + (m.duration || 0), 0) / totalRequests
      : 0;
    const successRate = totalRequests > 0
      ? (allMetrics.filter(m => (m.status || 200) >= 200 && (m.status || 200) < 300).length / totalRequests) * 100
      : 100;

    return {
      totalRequests,
      averageTime,
      successRate
    };
  };

  const restStats = getMetricsSummary('REST');
  const grpcStats = getMetricsSummary('gRPC');

  return (
    <PageContainer>
      <Card>
        <Title>
          <FiBarChart />
          Performance Analytics
        </Title>

        <h2 style={{ color: 'white', marginBottom: '1rem' }}>Current Protocol: {protocol}</h2>

        <StatsGrid>
          <StatCard>
            <StatIcon color="#10B981">
              <FiServer />
            </StatIcon>
            <StatValue>{protocol === 'REST' ? restStats.totalRequests : grpcStats.totalRequests}</StatValue>
            <StatLabel>Total Requests</StatLabel>
          </StatCard>

          <StatCard>
            <StatIcon color="#3B82F6">
              <FiClock />
            </StatIcon>
            <StatValue>
              {(protocol === 'REST' ? restStats.averageTime : grpcStats.averageTime).toFixed(1)}ms
            </StatValue>
            <StatLabel>Avg Response Time</StatLabel>
          </StatCard>

          <StatCard>
            <StatIcon color="#F59E0B">
              <FiTrendingUp />
            </StatIcon>
            <StatValue>
              {(protocol === 'REST' ? restStats.successRate : grpcStats.successRate).toFixed(1)}%
            </StatValue>
            <StatLabel>Success Rate</StatLabel>
          </StatCard>
        </StatsGrid>
      </Card>

      <Card>
        <Title>Protocol Comparison</Title>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
          <div>
            <h3 style={{ color: '#10B981', marginBottom: '1rem' }}>REST API</h3>
            <StatsGrid>
              <StatCard>
                <StatValue>{restStats.totalRequests}</StatValue>
                <StatLabel>Requests</StatLabel>
              </StatCard>
              <StatCard>
                <StatValue>{restStats.averageTime.toFixed(1)}ms</StatValue>
                <StatLabel>Avg Time</StatLabel>
              </StatCard>
              <StatCard>
                <StatValue>{restStats.successRate.toFixed(1)}%</StatValue>
                <StatLabel>Success Rate</StatLabel>
              </StatCard>
            </StatsGrid>
          </div>

          <div>
            <h3 style={{ color: '#3B82F6', marginBottom: '1rem' }}>gRPC</h3>
            <StatsGrid>
              <StatCard>
                <StatValue>{grpcStats.totalRequests}</StatValue>
                <StatLabel>Requests</StatLabel>
              </StatCard>
              <StatCard>
                <StatValue>{grpcStats.averageTime.toFixed(1)}ms</StatValue>
                <StatLabel>Avg Time</StatLabel>
              </StatCard>
              <StatCard>
                <StatValue>{grpcStats.successRate.toFixed(1)}%</StatValue>
                <StatLabel>Success Rate</StatLabel>
              </StatCard>
            </StatsGrid>
          </div>
        </div>
      </Card>
    </PageContainer>
  );
};

export default AnalyticsPage;