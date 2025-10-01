import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { FiActivity, FiZap, FiServer, FiBarChart } from 'react-icons/fi';
import { APIFactory } from '../services/api';

const PageContainer = styled.div`
  max-width: 1200px;
  margin: 0 auto;
`;

const WelcomeCard = styled.div`
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 16px;
  padding: 3rem 2rem;
  margin-bottom: 2rem;
  text-align: center;
`;

const Title = styled.h1`
  color: white;
  font-size: 3rem;
  font-weight: 800;
  margin: 0 0 1rem 0;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;

  @media (max-width: 768px) {
    font-size: 2rem;
  }
`;

const Subtitle = styled.p`
  color: rgba(255, 255, 255, 0.8);
  font-size: 1.2rem;
  margin: 0 0 2rem 0;
  max-width: 600px;
  margin-left: auto;
  margin-right: auto;
`;

const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1.5rem;
  margin-bottom: 2rem;
`;

const StatCard = styled.div`
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 12px;
  padding: 1.5rem;
  display: flex;
  align-items: center;
  gap: 1rem;
`;

const StatIcon = styled.div`
  background: ${props => props.color || '#3B82F6'};
  color: white;
  padding: 1rem;
  border-radius: 10px;
  font-size: 1.5rem;
`;

const StatInfo = styled.div`
  flex: 1;
`;

const StatLabel = styled.div`
  color: rgba(255, 255, 255, 0.8);
  font-size: 0.875rem;
  margin-bottom: 0.25rem;
`;

const StatValue = styled.div`
  color: white;
  font-size: 1.5rem;
  font-weight: 700;
`;

const ProtocolComparison = styled.div`
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 16px;
  padding: 2rem;
`;

const ComparisonTitle = styled.h2`
  color: white;
  font-size: 1.5rem;
  font-weight: 600;
  margin: 0 0 1.5rem 0;
  text-align: center;
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
  border: 2px solid ${props => props.active ? '#10B981' : 'rgba(255, 255, 255, 0.1)'};
  border-radius: 12px;
  padding: 1.5rem;
  text-align: center;
  transition: all 0.3s ease;

  ${props => props.active && `
    box-shadow: 0 8px 25px rgba(16, 185, 129, 0.2);
    transform: translateY(-2px);
  `}
`;

const ProtocolIcon = styled.div`
  background: ${props => props.color};
  color: white;
  padding: 1rem;
  border-radius: 50%;
  font-size: 2rem;
  width: 60px;
  height: 60px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 1rem;
`;

const ProtocolName = styled.h3`
  color: white;
  font-size: 1.25rem;
  font-weight: 600;
  margin: 0 0 0.5rem 0;
`;

const ProtocolDescription = styled.p`
  color: rgba(255, 255, 255, 0.7);
  font-size: 0.875rem;
  margin: 0 0 1rem 0;
`;

const ProtocolMetrics = styled.div`
  display: flex;
  justify-content: space-around;
  padding-top: 1rem;
  border-top: 1px solid rgba(255, 255, 255, 0.1);
`;

const MetricItem = styled.div`
  text-align: center;
`;

const MetricValue = styled.div`
  color: ${props => props.color || '#10B981'};
  font-size: 1.1rem;
  font-weight: 700;
`;

const MetricLabel = styled.div`
  color: rgba(255, 255, 255, 0.6);
  font-size: 0.75rem;
  margin-top: 0.25rem;
`;

const HomePage = ({ protocol, metrics }) => {
  const [serviceStats, setServiceStats] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchServiceStats = async () => {
      try {
        const api = APIFactory.create(protocol);
        const stats = await api.analytics.getServiceHealth();
        setServiceStats(stats);
      } catch (error) {
        console.error('Error fetching service stats:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchServiceStats();
  }, [protocol]);

  const getAverageResponseTime = (protocolType) => {
    const protocolMetrics = metrics[protocolType];
    if (!protocolMetrics || Object.keys(protocolMetrics).length === 0) return 'N/A';

    const times = Object.values(protocolMetrics).map(m => m.duration).filter(Boolean);
    if (times.length === 0) return 'N/A';

    const avg = times.reduce((sum, time) => sum + time, 0) / times.length;
    return `${avg.toFixed(1)}ms`;
  };

  const getTotalRequests = (protocolType) => {
    const protocolMetrics = metrics[protocolType];
    if (!protocolMetrics) return 0;

    return Object.values(protocolMetrics).length;
  };

  return (
    <PageContainer>
      <WelcomeCard>
        <Title>PSPD Lab</Title>
        <Subtitle>
          Compare gRPC and REST API performance in real-time with our URL shortener and QR code generator services
        </Subtitle>
      </WelcomeCard>

      <StatsGrid>
        <StatCard>
          <StatIcon color="#10B981">
            <FiActivity />
          </StatIcon>
          <StatInfo>
            <StatLabel>Current Protocol</StatLabel>
            <StatValue>{protocol}</StatValue>
          </StatInfo>
        </StatCard>

        <StatCard>
          <StatIcon color="#3B82F6">
            <FiServer />
          </StatIcon>
          <StatInfo>
            <StatLabel>Active Services</StatLabel>
            <StatValue>{loading ? '...' : Object.keys(serviceStats).length}</StatValue>
          </StatInfo>
        </StatCard>

        <StatCard>
          <StatIcon color="#F59E0B">
            <FiBarChart />
          </StatIcon>
          <StatInfo>
            <StatLabel>Total Requests</StatLabel>
            <StatValue>{getTotalRequests('REST') + getTotalRequests('gRPC')}</StatValue>
          </StatInfo>
        </StatCard>

        <StatCard>
          <StatIcon color="#EF4444">
            <FiZap />
          </StatIcon>
          <StatInfo>
            <StatLabel>Avg Response Time</StatLabel>
            <StatValue>{getAverageResponseTime(protocol)}</StatValue>
          </StatInfo>
        </StatCard>
      </StatsGrid>

      <ProtocolComparison>
        <ComparisonTitle>Protocol Comparison</ComparisonTitle>

        <ComparisonGrid>
          <ProtocolCard active={protocol === 'REST'}>
            <ProtocolIcon color="#10B981">
              <FiServer />
            </ProtocolIcon>
            <ProtocolName>REST API</ProtocolName>
            <ProtocolDescription>
              HTTP-based web services using JSON for data exchange.
              Widely adopted, human-readable, and easy to debug.
            </ProtocolDescription>
            <ProtocolMetrics>
              <MetricItem>
                <MetricValue color="#10B981">
                  {getAverageResponseTime('REST')}
                </MetricValue>
                <MetricLabel>Avg Response</MetricLabel>
              </MetricItem>
              <MetricItem>
                <MetricValue color="#10B981">
                  {getTotalRequests('REST')}
                </MetricValue>
                <MetricLabel>Requests</MetricLabel>
              </MetricItem>
            </ProtocolMetrics>
          </ProtocolCard>

          <ProtocolCard active={protocol === 'gRPC'}>
            <ProtocolIcon color="#3B82F6">
              <FiZap />
            </ProtocolIcon>
            <ProtocolName>gRPC</ProtocolName>
            <ProtocolDescription>
              High-performance RPC framework with Protocol Buffers.
              Binary serialization, streaming, and strong typing.
            </ProtocolDescription>
            <ProtocolMetrics>
              <MetricItem>
                <MetricValue color="#3B82F6">
                  {getAverageResponseTime('gRPC')}
                </MetricValue>
                <MetricLabel>Avg Response</MetricLabel>
              </MetricItem>
              <MetricItem>
                <MetricValue color="#3B82F6">
                  {getTotalRequests('gRPC')}
                </MetricValue>
                <MetricLabel>Requests</MetricLabel>
              </MetricItem>
            </ProtocolMetrics>
          </ProtocolCard>
        </ComparisonGrid>
      </ProtocolComparison>
    </PageContainer>
  );
};

export default HomePage;