import React from 'react';
import styled from 'styled-components';
import { FiTrendingUp, FiZap, FiServer } from 'react-icons/fi';

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

const ComparisonGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 2rem;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const ProtocolCard = styled.div`
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 12px;
  padding: 2rem;
`;

const ProtocolHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 1.5rem;
`;

const ProtocolIcon = styled.div`
  background: ${props => props.color};
  color: white;
  padding: 1rem;
  border-radius: 10px;
  font-size: 1.5rem;
`;

const ProtocolName = styled.h2`
  color: white;
  font-size: 1.5rem;
  font-weight: 600;
  margin: 0;
`;

const MetricsList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const MetricRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.75rem 0;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);

  &:last-child {
    border-bottom: none;
  }
`;

const MetricLabel = styled.span`
  color: rgba(255, 255, 255, 0.8);
  font-size: 0.875rem;
`;

const MetricValue = styled.span`
  color: ${props => props.color || '#10B981'};
  font-weight: 600;
  font-size: 1rem;
`;

const Winner = styled.div`
  background: linear-gradient(135deg, #10B981 0%, #059669 100%);
  color: white;
  padding: 0.5rem 1rem;
  border-radius: 20px;
  font-size: 0.75rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.05em;
`;

const ComparisonPage = ({ metrics }) => {
  const getMetricsSummary = (protocolType) => {
    const protocolMetrics = metrics[protocolType];
    if (!protocolMetrics || Object.keys(protocolMetrics).length === 0) {
      return {
        totalRequests: 0,
        averageTime: 0,
        successRate: 100,
        minTime: 0,
        maxTime: 0,
        throughput: 0
      };
    }

    const allMetrics = Object.values(protocolMetrics).filter(Boolean);
    const totalRequests = allMetrics.length;
    const times = allMetrics.map(m => m.duration || 0);
    const averageTime = totalRequests > 0 ? times.reduce((sum, time) => sum + time, 0) / totalRequests : 0;
    const minTime = totalRequests > 0 ? Math.min(...times) : 0;
    const maxTime = totalRequests > 0 ? Math.max(...times) : 0;
    const successRate = totalRequests > 0
      ? (allMetrics.filter(m => (m.status || 200) >= 200 && (m.status || 200) < 300).length / totalRequests) * 100
      : 100;
    const throughput = totalRequests > 0 ? (1000 / averageTime).toFixed(2) : 0;

    return {
      totalRequests,
      averageTime,
      successRate,
      minTime,
      maxTime,
      throughput: parseFloat(throughput)
    };
  };

  const restStats = getMetricsSummary('REST');
  const grpcStats = getMetricsSummary('gRPC');

  const getBetterValue = (restValue, grpcValue, lowerIsBetter = false) => {
    if (lowerIsBetter) {
      return restValue < grpcValue ? 'REST' : grpcValue < restValue ? 'gRPC' : 'tie';
    } else {
      return restValue > grpcValue ? 'REST' : grpcValue > restValue ? 'gRPC' : 'tie';
    }
  };

  const avgTimeWinner = getBetterValue(restStats.averageTime, grpcStats.averageTime, true);
  const throughputWinner = getBetterValue(restStats.throughput, grpcStats.throughput);
  const successRateWinner = getBetterValue(restStats.successRate, grpcStats.successRate);

  return (
    <PageContainer>
      <Card>
        <Title>
          <FiTrendingUp />
          Protocol Performance Comparison
        </Title>

        <ComparisonGrid>
          <ProtocolCard>
            <ProtocolHeader>
              <ProtocolIcon color="#10B981">
                <FiServer />
              </ProtocolIcon>
              <ProtocolName>REST API</ProtocolName>
            </ProtocolHeader>

            <MetricsList>
              <MetricRow>
                <MetricLabel>Total Requests</MetricLabel>
                <MetricValue color="#10B981">{restStats.totalRequests}</MetricValue>
              </MetricRow>

              <MetricRow>
                <MetricLabel>Average Response Time</MetricLabel>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                  <MetricValue color="#10B981">{restStats.averageTime.toFixed(1)}ms</MetricValue>
                  {avgTimeWinner === 'REST' && <Winner>Winner</Winner>}
                </div>
              </MetricRow>

              <MetricRow>
                <MetricLabel>Min Response Time</MetricLabel>
                <MetricValue color="#10B981">{restStats.minTime.toFixed(1)}ms</MetricValue>
              </MetricRow>

              <MetricRow>
                <MetricLabel>Max Response Time</MetricLabel>
                <MetricValue color="#10B981">{restStats.maxTime.toFixed(1)}ms</MetricValue>
              </MetricRow>

              <MetricRow>
                <MetricLabel>Throughput</MetricLabel>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                  <MetricValue color="#10B981">{restStats.throughput} req/s</MetricValue>
                  {throughputWinner === 'REST' && <Winner>Winner</Winner>}
                </div>
              </MetricRow>

              <MetricRow>
                <MetricLabel>Success Rate</MetricLabel>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                  <MetricValue color="#10B981">{restStats.successRate.toFixed(1)}%</MetricValue>
                  {successRateWinner === 'REST' && <Winner>Winner</Winner>}
                </div>
              </MetricRow>
            </MetricsList>
          </ProtocolCard>

          <ProtocolCard>
            <ProtocolHeader>
              <ProtocolIcon color="#3B82F6">
                <FiZap />
              </ProtocolIcon>
              <ProtocolName>gRPC</ProtocolName>
            </ProtocolHeader>

            <MetricsList>
              <MetricRow>
                <MetricLabel>Total Requests</MetricLabel>
                <MetricValue color="#3B82F6">{grpcStats.totalRequests}</MetricValue>
              </MetricRow>

              <MetricRow>
                <MetricLabel>Average Response Time</MetricLabel>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                  <MetricValue color="#3B82F6">{grpcStats.averageTime.toFixed(1)}ms</MetricValue>
                  {avgTimeWinner === 'gRPC' && <Winner>Winner</Winner>}
                </div>
              </MetricRow>

              <MetricRow>
                <MetricLabel>Min Response Time</MetricLabel>
                <MetricValue color="#3B82F6">{grpcStats.minTime.toFixed(1)}ms</MetricValue>
              </MetricRow>

              <MetricRow>
                <MetricLabel>Max Response Time</MetricLabel>
                <MetricValue color="#3B82F6">{grpcStats.maxTime.toFixed(1)}ms</MetricValue>
              </MetricRow>

              <MetricRow>
                <MetricLabel>Throughput</MetricLabel>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                  <MetricValue color="#3B82F6">{grpcStats.throughput} req/s</MetricValue>
                  {throughputWinner === 'gRPC' && <Winner>Winner</Winner>}
                </div>
              </MetricRow>

              <MetricRow>
                <MetricLabel>Success Rate</MetricLabel>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                  <MetricValue color="#3B82F6">{grpcStats.successRate.toFixed(1)}%</MetricValue>
                  {successRateWinner === 'gRPC' && <Winner>Winner</Winner>}
                </div>
              </MetricRow>
            </MetricsList>
          </ProtocolCard>
        </ComparisonGrid>
      </Card>

      <Card>
        <div style={{ textAlign: 'center', color: 'white' }}>
          <h3>Performance Summary</h3>
          <p style={{ opacity: 0.8, marginTop: '1rem' }}>
            Use both protocols to generate performance data and see real-time comparisons.
            Switch between REST and gRPC to measure response times, throughput, and reliability.
          </p>
        </div>
      </Card>
    </PageContainer>
  );
};

export default ComparisonPage;