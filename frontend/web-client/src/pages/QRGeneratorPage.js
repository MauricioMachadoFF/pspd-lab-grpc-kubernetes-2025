import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { toast } from 'react-hot-toast';
import { FiHash, FiDownload, FiCopy, FiSettings, FiLoader } from 'react-icons/fi';
import QRCode from 'react-qr-code';

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
  gap: 1.5rem;
`;

const InputGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

const Label = styled.label`
  color: white;
  font-weight: 500;
  font-size: 0.875rem;
`;

const Input = styled.input`
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

const Textarea = styled.textarea`
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.3);
  border-radius: 12px;
  padding: 1rem;
  color: white;
  font-size: 1rem;
  min-height: 100px;
  resize: vertical;

  &::placeholder {
    color: rgba(255, 255, 255, 0.6);
  }

  &:focus {
    outline: none;
    border-color: #3B82F6;
    box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
  }
`;

const Select = styled.select`
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.3);
  border-radius: 12px;
  padding: 1rem;
  color: white;
  font-size: 1rem;

  &:focus {
    outline: none;
    border-color: #3B82F6;
    box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
  }

  option {
    background: #1f2937;
    color: white;
  }
`;

const OptionsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1rem;
`;

const Button = styled.button`
  background: linear-gradient(135deg, #10B981 0%, #059669 100%);
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
  justify-content: center;
  gap: 0.5rem;
  align-self: flex-start;

  &:hover:not(:disabled) {
    transform: translateY(-2px);
    box-shadow: 0 8px 25px rgba(16, 185, 129, 0.3);
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`;

const ResultCard = styled(Card)`
  display: flex;
  gap: 2rem;
  align-items: flex-start;
  animation: slideIn 0.3s ease;

  @media (max-width: 768px) {
    flex-direction: column;
  }

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

const QRDisplay = styled.div`
  background: white;
  padding: 2rem;
  border-radius: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.1);
`;

const QRInfo = styled.div`
  flex: 1;
  color: white;
`;

const InfoRow = styled.div`
  display: flex;
  justify-content: space-between;
  margin-bottom: 0.75rem;
  font-size: 0.875rem;

  &:last-child {
    margin-bottom: 0;
  }
`;

const InfoLabel = styled.span`
  opacity: 0.8;
`;

const InfoValue = styled.span`
  font-weight: 600;
  color: #10B981;
`;

const ActionButtons = styled.div`
  display: flex;
  gap: 1rem;
  margin-top: 2rem;

  @media (max-width: 768px) {
    flex-direction: column;
  }
`;

const ActionButton = styled.button`
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.3);
  border-radius: 8px;
  color: white;
  padding: 0.75rem 1rem;
  cursor: pointer;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-weight: 500;

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

const MetricLabel = styled.span`
  opacity: 0.8;
`;

const MetricValue = styled.span`
  font-weight: 600;
  color: #10B981;
`;

const QRGeneratorPage = ({ protocol, onMetricsUpdate }) => {
  const [data, setData] = useState('');
  const [format, setFormat] = useState('PNG');
  const [size, setSize] = useState(256);
  const [errorCorrection, setErrorCorrection] = useState('MEDIUM');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [api] = useState(() => APIFactory.create(protocol));

  useEffect(() => {
    // Update API when protocol changes
    const newApi = APIFactory.create(protocol);
    api.qrGenerator = newApi.qrGenerator;
  }, [protocol, api]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!data.trim()) {
      toast.error('Please enter data to encode');
      return;
    }

    setLoading(true);
    setResult(null);

    try {
      const response = await api.qrGenerator.generateQR(
        data.trim(),
        format,
        parseInt(size),
        errorCorrection
      );

      setResult(response);

      // Update metrics
      if (onMetricsUpdate && response.metrics) {
        onMetricsUpdate(response.metrics);
      }

      toast.success('QR code generated successfully!');

    } catch (error) {
      console.error('Error generating QR code:', error);
      toast.error(error.response?.data?.message || 'Failed to generate QR code');

      // Update metrics even for errors
      if (onMetricsUpdate && error.metrics) {
        onMetricsUpdate(error.metrics);
      }
    } finally {
      setLoading(false);
    }
  };

  const downloadQR = () => {
    if (!result?.data?.qrCode) {
      toast.error('No QR code to download');
      return;
    }

    // Create download link
    const link = document.createElement('a');
    link.href = result.data.qrCode;
    link.download = `qr-code-${Date.now()}.${format.toLowerCase()}`;
    link.click();

    toast.success('QR code downloaded!');
  };

  const copyData = () => {
    navigator.clipboard.writeText(data);
    toast.success('Data copied to clipboard!');
  };

  return (
    <PageContainer>
      <Card>
        <Title>
          <FiHash />
          QR Code Generator
        </Title>

        <Form onSubmit={handleSubmit}>
          <InputGroup>
            <Label>Data to Encode</Label>
            <Textarea
              placeholder="Enter text, URL, or any data to encode..."
              value={data}
              onChange={(e) => setData(e.target.value)}
              disabled={loading}
            />
          </InputGroup>

          <OptionsGrid>
            <InputGroup>
              <Label>Format</Label>
              <Select
                value={format}
                onChange={(e) => setFormat(e.target.value)}
                disabled={loading}
              >
                <option value="PNG">PNG</option>
                <option value="SVG">SVG</option>
                <option value="JPEG">JPEG</option>
              </Select>
            </InputGroup>

            <InputGroup>
              <Label>Size (pixels)</Label>
              <Input
                type="number"
                min="128"
                max="1024"
                value={size}
                onChange={(e) => setSize(e.target.value)}
                disabled={loading}
              />
            </InputGroup>

            <InputGroup>
              <Label>Error Correction</Label>
              <Select
                value={errorCorrection}
                onChange={(e) => setErrorCorrection(e.target.value)}
                disabled={loading}
              >
                <option value="LOW">Low (7%)</option>
                <option value="MEDIUM">Medium (15%)</option>
                <option value="QUARTILE">Quartile (25%)</option>
                <option value="HIGH">High (30%)</option>
              </Select>
            </InputGroup>
          </OptionsGrid>

          <Button type="submit" disabled={loading}>
            {loading ? <FiLoader className="animate-spin" /> : <FiHash />}
            {loading ? 'Generating...' : 'Generate QR Code'}
          </Button>
        </Form>
      </Card>

      {result && (
        <ResultCard>
          <QRDisplay>
            <QRCode value={data} size={200} />
          </QRDisplay>

          <QRInfo>
            <InfoRow>
              <InfoLabel>Data:</InfoLabel>
              <InfoValue>{data.substring(0, 50)}{data.length > 50 ? '...' : ''}</InfoValue>
            </InfoRow>
            <InfoRow>
              <InfoLabel>Format:</InfoLabel>
              <InfoValue>{format}</InfoValue>
            </InfoRow>
            <InfoRow>
              <InfoLabel>Size:</InfoLabel>
              <InfoValue>{size}px</InfoValue>
            </InfoRow>
            <InfoRow>
              <InfoLabel>Error Correction:</InfoLabel>
              <InfoValue>{errorCorrection}</InfoValue>
            </InfoRow>
            <InfoRow>
              <InfoLabel>Protocol:</InfoLabel>
              <InfoValue>{protocol}</InfoValue>
            </InfoRow>

            <ActionButtons>
              <ActionButton onClick={downloadQR}>
                <FiDownload />
                Download
              </ActionButton>

              <ActionButton onClick={copyData}>
                <FiCopy />
                Copy Data
              </ActionButton>
            </ActionButtons>

            {result.metrics && (
              <MetricsDisplay>
                <MetricRow>
                  <MetricLabel>Response Time:</MetricLabel>
                  <MetricValue>{result.metrics.duration.toFixed(2)}ms</MetricValue>
                </MetricRow>
                <MetricRow>
                  <MetricLabel>Status:</MetricLabel>
                  <MetricValue>{result.status}</MetricValue>
                </MetricRow>
                <MetricRow>
                  <MetricLabel>Data Size:</MetricLabel>
                  <MetricValue>{JSON.stringify(result.data).length} bytes</MetricValue>
                </MetricRow>
              </MetricsDisplay>
            )}
          </QRInfo>
        </ResultCard>
      )}
    </PageContainer>
  );
};

export default QRGeneratorPage;