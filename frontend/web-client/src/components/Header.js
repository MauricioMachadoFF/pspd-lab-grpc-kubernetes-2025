import React from 'react';
import styled from 'styled-components';
import { FiMenu, FiActivity } from 'react-icons/fi';

const HeaderContainer = styled.header`
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  border-bottom: 1px solid rgba(255, 255, 255, 0.2);
  padding: 1rem 2rem;
  display: flex;
  align-items: center;
  justify-content: space-between;
  position: sticky;
  top: 0;
  z-index: 1000;
`;

const LeftSection = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
`;

const MenuButton = styled.button`
  background: none;
  border: none;
  color: white;
  font-size: 1.2rem;
  cursor: pointer;
  padding: 0.5rem;
  border-radius: 8px;
  transition: background-color 0.2s ease;

  &:hover {
    background: rgba(255, 255, 255, 0.1);
  }

  @media (min-width: 768px) {
    display: none;
  }
`;

const Title = styled.h1`
  color: white;
  font-size: 1.5rem;
  font-weight: 600;
  margin: 0;

  @media (max-width: 768px) {
    font-size: 1.2rem;
  }
`;

const RightSection = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
`;

const ProtocolBadge = styled.div`
  background: ${props => props.protocol === 'REST' ? '#10B981' : '#3B82F6'};
  color: white;
  padding: 0.5rem 1rem;
  border-radius: 20px;
  font-size: 0.875rem;
  font-weight: 500;
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const StatusIndicator = styled.div`
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: ${props => props.active ? '#10B981' : '#EF4444'};
  animation: ${props => props.active ? 'pulse 2s infinite' : 'none'};

  @keyframes pulse {
    0%, 100% { opacity: 1; }
    50% { opacity: 0.5; }
  }
`;

const Header = ({ protocol, onToggleSidebar }) => {
  return (
    <HeaderContainer>
      <LeftSection>
        <MenuButton onClick={onToggleSidebar}>
          <FiMenu />
        </MenuButton>

        <Title>PSPD Lab - Protocol Comparison</Title>
      </LeftSection>

      <RightSection>
        <ProtocolBadge protocol={protocol}>
          <StatusIndicator active={true} />
          <FiActivity />
          {protocol} API
        </ProtocolBadge>
      </RightSection>
    </HeaderContainer>
  );
};

export default Header;