import React, { useState } from 'react';
import { Routes, Route } from 'react-router-dom';
import styled from 'styled-components';

// Components
import Header from './components/Header';
import Sidebar from './components/Sidebar';
import ProtocolSwitcher from './components/ProtocolSwitcher';

// Pages
import HomePage from './pages/HomePage';
import URLShortenerPage from './pages/URLShortenerPage';
import QRGeneratorPage from './pages/QRGeneratorPage';
import AnalyticsPage from './pages/AnalyticsPage';
import ComparisonPage from './pages/ComparisonPage';

// Styles
const AppContainer = styled.div`
  display: flex;
  min-height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
`;

const MainContent = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
`;

const ContentArea = styled.main`
  flex: 1;
  padding: 1rem 2rem 2rem 2rem; /* Reduced top padding to prevent overlap with header */
  margin-left: ${props => props.sidebarOpen ? '250px' : '60px'};
  transition: margin-left 0.3s ease;
  overflow-y: auto;

  @media (max-width: 768px) {
    margin-left: 0;
    padding: 1rem;
  }
`;

const App = () => {
  const [protocol, setProtocol] = useState('REST'); // 'REST' or 'gRPC'
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [performanceMetrics, setPerformanceMetrics] = useState({
    REST: {},
    gRPC: {}
  });

  const toggleProtocol = () => {
    setProtocol(prev => prev === 'REST' ? 'gRPC' : 'REST');
  };

  const updateMetrics = (metrics) => {
    const requestId = `${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    setPerformanceMetrics(prev => ({
      ...prev,
      [protocol]: {
        ...prev[protocol],
        [requestId]: metrics
      }
    }));
  };

  return (
    <AppContainer>
      <Sidebar isOpen={sidebarOpen} onToggle={() => setSidebarOpen(!sidebarOpen)} />

      <MainContent>
        <Header
          protocol={protocol}
          onToggleSidebar={() => setSidebarOpen(!sidebarOpen)}
        />

        <ContentArea sidebarOpen={sidebarOpen}>
          <ProtocolSwitcher
            currentProtocol={protocol}
            onToggle={toggleProtocol}
          />

          <Routes>
            <Route path="/" element={
              <HomePage
                protocol={protocol}
                metrics={performanceMetrics}
              />
            } />

            <Route path="/url-shortener" element={
              <URLShortenerPage
                protocol={protocol}
                onMetricsUpdate={updateMetrics}
              />
            } />

            <Route path="/qr-generator" element={
              <QRGeneratorPage
                protocol={protocol}
                onMetricsUpdate={updateMetrics}
              />
            } />

            <Route path="/analytics" element={
              <AnalyticsPage
                protocol={protocol}
                metrics={performanceMetrics}
              />
            } />

            <Route path="/comparison" element={
              <ComparisonPage
                metrics={performanceMetrics}
              />
            } />
          </Routes>
        </ContentArea>
      </MainContent>
    </AppContainer>
  );
};

export default App;