import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { toast } from 'react-hot-toast';
import { FiLink, FiCopy, FiExternalLink, FiBarChart, FiTrash2, FiLoader } from 'react-icons/fi';
import copy from 'copy-to-clipboard';

import { APIFactory } from '../services/api';

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

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const InputGroup = styled.div`
  display: flex;
  gap: 1rem;
  align-items: flex-end;

  @media (max-width: 768px) {
    flex-direction: column;
    align-items: stretch;
  }
`;

const Input = styled.input`
  flex: 1;
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.3);
  border-radius: 12px;
  padding: 1rem;
  color: white;
  font-size: 1rem;

  &::placeholder {
    color: rgba(255, 255, 255, 0.6);
  }

  &:focus {
    outline: none;
    border-color: #3B82F6;
    box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
  }
`;

const Button = styled.button`
  background: linear-gradient(135deg, #3B82F6 0%, #1D4ED8 100%);
  border: none;
  border-radius: 12px;
  color: white;
  padding: 1rem 2rem;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  min-width: 120px;
  justify-content: center;

  &:hover:not(:disabled) {
    transform: translateY(-2px);
    box-shadow: 0 8px 25px rgba(59, 130, 246, 0.3);
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`;

const ResultCard = styled(Card)`
  margin-top: 1rem;
  animation: slideIn 0.3s ease;

  @keyframes slideIn {
    from {
      opacity: 0;
      transform: translateY(20px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
`;

const ResultRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
  margin-bottom: 1rem;

  @media (max-width: 768px) {
    flex-direction: column;
    align-items: flex-start;
  }
`;

const URLDisplay = styled.div`
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 8px;
  padding: 1rem;
  flex: 1;
  word-break: break-all;
  color: white;
  font-family: monospace;
`;

const ActionButton = styled.button`
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.3);
  border-radius: 8px;
  color: white;
  padding: 0.75rem;
  cursor: pointer;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  gap: 0.5rem;

  &:hover {
    background: rgba(255, 255, 255, 0.2);
  }
`;

const MetricsDisplay = styled.div`
  background: rgba(0, 0, 0, 0.2);
  border-radius: 8px;
  padding: 1rem;
  margin-top: 1rem;
`;

const MetricRow = styled.div`
  display: flex;
  justify-content: space-between;
  color: white;
  margin-bottom: 0.5rem;
  font-size: 0.875rem;

  &:last-child {
    margin-bottom: 0;
  }
`;

const Label = styled.span`
  opacity: 0.8;
`;

const Value = styled.span`
  font-weight: 600;
  color: #10B981;
`;

const HistorySection = styled.div`
  margin-top: 2rem;
`;

const HistoryTitle = styled.h2`
  color: white;
  font-size: 1.5rem;
  font-weight: 600;
  margin-bottom: 1rem;
`;

const HistoryItem = styled.div`
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 8px;
  padding: 1rem;
  margin-bottom: 1rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 1rem;

  @media (max-width: 768px) {
    flex-direction: column;
    align-items: flex-start;
  }
`;

const HistoryInfo = styled.div`
  flex: 1;
  color: white;
`;

const OriginalURL = styled.div`
  font-size: 0.875rem;
  opacity: 0.8;
  margin-bottom: 0.5rem;
`;

const ShortURL = styled.div`
  font-family: monospace;
  font-weight: 600;
`;

const HistoryActions = styled.div`
  display: flex;
  gap: 0.5rem;
`;

const URLShortenerPage = ({ protocol, onMetricsUpdate }) => {
  const [url, setUrl] = useState('');
  const [customCode, setCustomCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [history, setHistory] = useState([]);
  const [api] = useState(() => APIFactory.create(protocol));

  useEffect(() => {
    // Update API when protocol changes
    const newApi = APIFactory.create(protocol);
    api.urlShortener = newApi.urlShortener;
  }, [protocol, api]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!url.trim()) {
      toast.error('Please enter a URL');
      return;
    }

    setLoading(true);
    setResult(null);

    try {
      const response = await api.urlShortener.shortenURL(url.trim(), customCode.trim() || null);

      setResult(response);
      setHistory(prev => [response, ...prev].slice(0, 10)); // Keep last 10

      // Update metrics
      if (onMetricsUpdate && response.metrics) {
        onMetricsUpdate(response.metrics);
      }

      toast.success('URL shortened successfully!');

      // Clear form
      setUrl('');
      setCustomCode('');

    } catch (error) {
      console.error('Error shortening URL:', error);
      toast.error(error.response?.data?.message || 'Failed to shorten URL');

      // Update metrics even for errors
      if (onMetricsUpdate && error.metrics) {
        onMetricsUpdate(error.metrics);
      }
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = (text) => {
    copy(text);
    toast.success('Copied to clipboard!');
  };

  const openURL = (url) => {
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  const deleteFromHistory = (index) => {
    setHistory(prev => prev.filter((_, i) => i !== index));
    toast.success('Removed from history');
  };

  return (
    <PageContainer>
      <Card>
        <Title>
          <FiLink />
          URL Shortener
        </Title>

        <Form onSubmit={handleSubmit}>
          <InputGroup>
            <Input
              type="url"
              placeholder="Enter your long URL here..."
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              disabled={loading}
            />

            <Input
              type="text"
              placeholder="Custom code (optional)"
              value={customCode}
              onChange={(e) => setCustomCode(e.target.value)}
              disabled={loading}
              style={{ maxWidth: '200px' }}
            />

            <Button type="submit" disabled={loading}>
              {loading ? <FiLoader className="animate-spin" /> : <FiLink />}
              {loading ? 'Shortening...' : 'Shorten'}
            </Button>
          </InputGroup>
        </Form>

        {result && (
          <ResultCard>
            <ResultRow>
              <URLDisplay>
                {result.data.shortUrl}
              </URLDisplay>

              <div style={{ display: 'flex', gap: '0.5rem' }}>
                <ActionButton onClick={() => copyToClipboard(result.data.shortUrl)}>
                  <FiCopy />
                  Copy
                </ActionButton>

                <ActionButton onClick={() => openURL(`http://localhost:8083/api/v1/url/${result.data.shortCode}`)}>
                  <FiExternalLink />
                  Open
                </ActionButton>
              </div>
            </ResultRow>

            {result.metrics && (
              <MetricsDisplay>
                <MetricRow>
                  <Label>Response Time:</Label>
                  <Value>{result.metrics.duration.toFixed(2)}ms</Value>
                </MetricRow>
                <MetricRow>
                  <Label>Protocol:</Label>
                  <Value>{protocol}</Value>
                </MetricRow>
                <MetricRow>
                  <Label>Status:</Label>
                  <Value>{result.status}</Value>
                </MetricRow>
                <MetricRow>
                  <Label>Short Code:</Label>
                  <Value>{result.data.shortCode}</Value>
                </MetricRow>
              </MetricsDisplay>
            )}
          </ResultCard>
        )}
      </Card>

      {history.length > 0 && (
        <Card>
          <HistorySection>
            <HistoryTitle>Recent URLs</HistoryTitle>

            {history.map((item, index) => (
              <HistoryItem key={index}>
                <HistoryInfo>
                  <OriginalURL>
                    Original: {item.data.originalUrl}
                  </OriginalURL>
                  <ShortURL>
                    Short: {item.data.shortUrl}
                  </ShortURL>
                </HistoryInfo>

                <HistoryActions>
                  <ActionButton onClick={() => copyToClipboard(item.data.shortUrl)}>
                    <FiCopy />
                  </ActionButton>

                  <ActionButton onClick={() => openURL(`http://localhost:8083/api/v1/url/${item.data.shortCode}`)}>
                    <FiExternalLink />
                  </ActionButton>

                  <ActionButton onClick={() => deleteFromHistory(index)}>
                    <FiTrash2 />
                  </ActionButton>
                </HistoryActions>
              </HistoryItem>
            ))}
          </HistorySection>
        </Card>
      )}
    </PageContainer>
  );
};

export default URLShortenerPage;