import React from 'react';
import styled from 'styled-components';
import { FiZap, FiServer } from 'react-icons/fi';

const SwitcherContainer = styled.div`
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 12px;
  padding: 1rem;
  margin-bottom: 2rem;
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: 1rem;
`;

const ProtocolInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
  flex: 1;
  min-width: 200px;
`;

const ProtocolIcon = styled.div`
  background: ${props => props.protocol === 'REST' ? '#10B981' : '#3B82F6'};
  color: white;
  padding: 0.75rem;
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.2rem;
`;

const ProtocolDetails = styled.div`
  color: white;
`;

const ProtocolName = styled.h3`
  margin: 0;
  font-size: 1.1rem;
  font-weight: 600;
`;

const ProtocolDescription = styled.p`
  margin: 0;
  font-size: 0.875rem;
  opacity: 0.8;
`;

const SwitchButton = styled.button`
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border: 2px solid rgba(255, 255, 255, 0.3);
  color: white;
  padding: 0.75rem 1.5rem;
  border-radius: 25px;
  cursor: pointer;
  font-weight: 600;
  font-size: 0.875rem;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  position: relative;
  overflow: hidden;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 25px rgba(0, 0, 0, 0.2);
    border-color: rgba(255, 255, 255, 0.5);
  }

  &:active {
    transform: translateY(0);
  }

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: -100%;
    width: 100%;
    height: 100%;
    background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent);
    transition: left 0.5s;
  }

  &:hover::before {
    left: 100%;
  }
`;

const ComparisonHint = styled.div`
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 8px;
  padding: 1rem;
  margin-top: 1rem;
  color: rgba(255, 255, 255, 0.8);
  font-size: 0.875rem;
  text-align: center;

  @media (max-width: 768px) {
    margin-top: 0;
    width: 100%;
  }
`;

const ProtocolSwitcher = ({ currentProtocol, onToggle }) => {
  const protocolInfo = {
    REST: {
      icon: FiServer,
      name: 'REST API',
      description: 'HTTP/JSON based web services',
      nextProtocol: 'gRPC'
    },
    gRPC: {
      icon: FiZap,
      name: 'gRPC',
      description: 'High-performance RPC framework',
      nextProtocol: 'REST'
    }
  };

  const current = protocolInfo[currentProtocol];
  const CurrentIcon = current.icon;

  return (
    <>
      <SwitcherContainer>
        <ProtocolInfo>
          <ProtocolIcon protocol={currentProtocol}>
            <CurrentIcon />
          </ProtocolIcon>

          <ProtocolDetails>
            <ProtocolName>Current Protocol: {current.name}</ProtocolName>
            <ProtocolDescription>{current.description}</ProtocolDescription>
          </ProtocolDetails>
        </ProtocolInfo>

        <SwitchButton onClick={onToggle}>
          Switch to {current.nextProtocol}
          {current.nextProtocol === 'gRPC' ? <FiZap /> : <FiServer />}
        </SwitchButton>
      </SwitcherContainer>

      <ComparisonHint>
        💡 Switch between REST and gRPC protocols to compare performance metrics in real-time
      </ComparisonHint>
    </>
  );
};

export default ProtocolSwitcher;