import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import styled from 'styled-components';
import {
  FiHome,
  FiLink,
  FiHash,
  FiBarChart,
  FiTrendingUp,
  FiChevronLeft,
  FiChevronRight
} from 'react-icons/fi';

const SidebarContainer = styled.nav`
  background: rgba(0, 0, 0, 0.2);
  backdrop-filter: blur(10px);
  border-right: 1px solid rgba(255, 255, 255, 0.1);
  width: ${props => props.isOpen ? '250px' : '60px'};
  height: 100vh;
  position: fixed;
  left: 0;
  top: 0;
  z-index: 1001;
  transition: width 0.3s ease;
  overflow: hidden;
  cursor: ${props => props.isOpen ? 'default' : 'pointer'};

  &:hover:not(${props => props.isOpen ? ':hover' : ''}) {
    background: rgba(0, 0, 0, 0.3);
  }

  @media (max-width: 768px) {
    width: ${props => props.isOpen ? '250px' : '0'};
    cursor: default;
  }
`;

const SidebarHeader = styled.div`
  padding: 1.5rem;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  display: flex;
  align-items: center;
  justify-content: space-between;
  min-height: 80px;
`;

const Logo = styled.div`
  color: white;
  font-size: 1.2rem;
  font-weight: 700;
  opacity: ${props => props.isOpen ? 1 : 0};
  transition: opacity 0.3s ease;
  white-space: nowrap;
`;

const ToggleButton = styled.button`
  background: none;
  border: none;
  color: white;
  font-size: 1.1rem;
  cursor: pointer;
  padding: 0.5rem;
  border-radius: 6px;
  transition: background-color 0.2s ease;

  &:hover {
    background: rgba(255, 255, 255, 0.1);
  }
`;

const NavList = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0;
`;

const NavItem = styled.li`
  margin: 0.5rem 0;
`;

const StyledNavLink = styled(NavLink)`
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1rem 1.5rem;
  color: rgba(255, 255, 255, 0.8);
  text-decoration: none;
  transition: all 0.2s ease;
  border-radius: 0 25px 25px 0;
  margin-right: 1rem;
  white-space: nowrap;

  &:hover {
    background: rgba(255, 255, 255, 0.1);
    color: white;
  }

  &.active {
    background: rgba(255, 255, 255, 0.2);
    color: white;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  }

  .icon {
    font-size: 1.1rem;
    min-width: 20px;
  }

  .label {
    opacity: ${props => props.isOpen ? 1 : 0};
    transition: opacity 0.3s ease;
    font-weight: 500;
  }
`;

const NavSection = styled.div`
  padding: 1rem 0;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);

  &:last-child {
    border-bottom: none;
  }
`;

const SectionTitle = styled.h3`
  color: rgba(255, 255, 255, 0.6);
  font-size: 0.75rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  padding: 0 1.5rem 0.5rem;
  margin: 0;
  opacity: ${props => props.isOpen ? 1 : 0};
  transition: opacity 0.3s ease;
`;

const Sidebar = ({ isOpen, onToggle }) => {
  const location = useLocation();

  const navItems = [
    {
      section: 'Main',
      items: [
        { path: '/', icon: FiHome, label: 'Dashboard' },
      ]
    },
    {
      section: 'Services',
      items: [
        { path: '/url-shortener', icon: FiLink, label: 'URL Shortener' },
        { path: '/qr-generator', icon: FiHash, label: 'QR Generator' },
      ]
    },
    {
      section: 'Analysis',
      items: [
        { path: '/analytics', icon: FiBarChart, label: 'Analytics' },
        { path: '/comparison', icon: FiTrendingUp, label: 'Comparison' },
      ]
    }
  ];

  const handleSidebarClick = () => {
    if (!isOpen) {
      onToggle();
    }
  };

  return (
    <SidebarContainer isOpen={isOpen} onClick={handleSidebarClick}>
      <SidebarHeader>
        <Logo isOpen={isOpen}>PSPD Lab</Logo>
        <ToggleButton onClick={(e) => { e.stopPropagation(); onToggle(); }}>
          {isOpen ? <FiChevronLeft /> : <FiChevronRight />}
        </ToggleButton>
      </SidebarHeader>

      <NavList>
        {navItems.map((section) => (
          <NavSection key={section.section}>
            <SectionTitle isOpen={isOpen}>{section.section}</SectionTitle>
            {section.items.map((item) => (
              <NavItem key={item.path}>
                <StyledNavLink
                  to={item.path}
                  className={({ isActive }) => isActive ? 'active' : ''}
                  isOpen={isOpen}
                >
                  <item.icon className="icon" />
                  <span className="label">{item.label}</span>
                </StyledNavLink>
              </NavItem>
            ))}
          </NavSection>
        ))}
      </NavList>
    </SidebarContainer>
  );
};

export default Sidebar;