import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { 
  Search, 
  User, 
  LogOut, 
  Menu, 
  X,
  ShoppingCart,
  Bell,
  Settings,
  BarChart3,
  Package,
  Users,
  Home
} from 'lucide-react';
import styled from 'styled-components';
import { useCart } from '../contexts/CartContext';

const NavbarContainer = styled.nav`
  background: white;
  border-bottom: 1px solid #e5e7eb;
  position: sticky;
  top: 0;
  z-index: 50;
  box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1);
`;

const NavbarContent = styled.div`
  max-width: 1280px;
  margin: 0 auto;
  padding: 0 1rem;
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 4rem;
`;

const Logo = styled(Link)`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 1.5rem;
  font-weight: 700;
  color: #1f2937;
  text-decoration: none;
  transition: color 0.2s ease;
  
  &:hover {
    color: #3b82f6;
  }
`;

const LogoIcon = styled.div`
  width: 2rem;
  height: 2rem;
  background: #3b82f6;
  border-radius: 0.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-weight: 700;
  font-size: 1.125rem;
`;

const NavLinks = styled.div`
  display: flex;
  align-items: center;
  gap: 2rem;
  
  @media (max-width: 768px) {
    display: none;
  }
`;

const NavLink = styled(Link)`
  color: #6b7280;
  text-decoration: none;
  font-weight: 500;
  transition: color 0.2s ease;
  
  &:hover {
    color: #3b82f6;
  }
`;

const UserSection = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
`;

const CartButton = styled(Link)`
  position: relative;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  border-radius: 10px;
  background: #f9fafb;
  border: 1px solid #e5e7eb;
  color: #374151;
  text-decoration: none;
  &:hover { background: #f3f4f6; }
`;

const CartBadge = styled.span`
  position: absolute;
  top: -6px;
  right: -6px;
  min-width: 18px;
  height: 18px;
  border-radius: 9999px;
  background: #ef4444;
  color: #fff;
  font-size: 11px;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0 4px;
`;

const UserMenu = styled.div`
  position: relative;
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const UserButton = styled.button`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 1rem;
  background: #f9fafb;
  border: 1px solid #e5e7eb;
  border-radius: 0.5rem;
  color: #374151;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
  
  &:hover {
    background: #f3f4f6;
    border-color: #d1d5db;
  }
`;

const UserAvatar = styled.div`
  width: 2rem;
  height: 2rem;
  background: #3b82f6;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-weight: 600;
  font-size: 0.875rem;
`;

const DropdownMenu = styled.div`
  position: absolute;
  top: 100%;
  right: 0;
  margin-top: 0.5rem;
  background: white;
  border: 1px solid #e5e7eb;
  border-radius: 0.5rem;
  box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
  min-width: 12rem;
  z-index: 50;
  display: ${props => props.isOpen ? 'block' : 'none'};
`;

const DropdownItem = styled(Link)`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.75rem 1rem;
  color: #374151;
  text-decoration: none;
  font-size: 0.875rem;
  transition: background-color 0.2s ease;
  
  &:hover {
    background: #f9fafb;
  }
  
  &:first-child {
    border-radius: 0.5rem 0.5rem 0 0;
  }
  
  &:last-child {
    border-radius: 0 0 0.5rem 0.5rem;
  }
`;

const LogoutButton = styled.button`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  width: 100%;
  padding: 0.75rem 1rem;
  background: none;
  border: none;
  color: #dc2626;
  text-decoration: none;
  font-size: 0.875rem;
  cursor: pointer;
  transition: background-color 0.2s ease;
  
  &:hover {
    background: #fef2f2;
  }
`;

const MobileMenuButton = styled.button`
  display: none;
  padding: 0.5rem;
  background: none;
  border: none;
  color: #6b7280;
  cursor: pointer;
  
  @media (max-width: 768px) {
    display: block;
  }
`;

const MobileMenu = styled.div`
  display: none;
  position: absolute;
  top: 100%;
  left: 0;
  right: 0;
  background: white;
  border-bottom: 1px solid #e5e7eb;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
  
  @media (max-width: 768px) {
    display: ${props => props.isOpen ? 'block' : 'none'};
  }
`;

const MobileMenuContent = styled.div`
  padding: 1rem;
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const MobileNavLink = styled(Link)`
  color: #6b7280;
  text-decoration: none;
  font-weight: 500;
  padding: 0.5rem 0;
  border-bottom: 1px solid #f3f4f6;
  
  &:hover {
    color: #3b82f6;
  }
`;

const Navbar = () => {
  const { user, logout } = useAuth();
  const { totalCount } = useCart();
  const navigate = useNavigate();
  const [isUserMenuOpen, setIsUserMenuOpen] = React.useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false);

  const handleLogout = () => {
    logout();
    navigate('/');
    setIsUserMenuOpen(false);
  };

  const toggleUserMenu = () => {
    setIsUserMenuOpen(!isUserMenuOpen);
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <NavbarContainer>
      <NavbarContent>
        <Logo to="/">
          <LogoIcon>Q</LogoIcon>
          Qwipo
        </Logo>

        <NavLinks>
          <NavLink to="/">Home</NavLink>
          <NavLink to="/search">Search</NavLink>
          <NavLink to="/recommendations">Recommendations</NavLink>
          {user?.userType === 'retailer' && (
            <NavLink to="/dashboard/retailer">Dashboard</NavLink>
          )}
          {user?.userType === 'distributor' && (
            <NavLink to="/dashboard/distributor">Dashboard</NavLink>
          )}
          <NavLink to="/about">About</NavLink>
          <NavLink to="/contact">Contact</NavLink>
        </NavLinks>

        <UserSection>
          <CartButton to="/cart" title="Cart">
            <ShoppingCart size={18} />
            {totalCount > 0 && <CartBadge>{totalCount}</CartBadge>}
          </CartButton>
          {user ? (
            <UserMenu>
              <UserButton onClick={toggleUserMenu}>
                <UserAvatar>
                  {user.firstName?.charAt(0) || 'U'}
                </UserAvatar>
                <span>{user.firstName || 'User'}</span>
              </UserButton>
              
              <DropdownMenu isOpen={isUserMenuOpen}>
                <DropdownItem to="/profile">
                  <User size={16} />
                  Profile
                </DropdownItem>
                {user.userType === 'retailer' && (
                  <DropdownItem to="/dashboard/retailer">
                    <BarChart3 size={16} />
                    Dashboard
                  </DropdownItem>
                )}
                {user.userType === 'distributor' && (
                  <DropdownItem to="/dashboard/distributor">
                    <Package size={16} />
                    Dashboard
                  </DropdownItem>
                )}
                <DropdownItem to="/loyalty">
                  <Bell size={16} />
                  Loyalty
                </DropdownItem>
                <LogoutButton onClick={handleLogout}>
                  <LogOut size={16} />
                  Logout
                </LogoutButton>
              </DropdownMenu>
            </UserMenu>
          ) : (
            <div style={{ display: 'flex', gap: '1rem' }}>
              <NavLink to="/login">Login</NavLink>
              <NavLink to="/register">Register</NavLink>
            </div>
          )}

          <MobileMenuButton onClick={toggleMobileMenu}>
            {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </MobileMenuButton>
        </UserSection>
      </NavbarContent>

      <MobileMenu isOpen={isMobileMenuOpen}>
        <MobileMenuContent>
          <MobileNavLink to="/" onClick={() => setIsMobileMenuOpen(false)}>
            <Home size={16} style={{ marginRight: '0.5rem' }} />
            Home
          </MobileNavLink>
          <MobileNavLink to="/search" onClick={() => setIsMobileMenuOpen(false)}>
            <Search size={16} style={{ marginRight: '0.5rem' }} />
            Search
          </MobileNavLink>
          <MobileNavLink to="/recommendations" onClick={() => setIsMobileMenuOpen(false)}>
            <Bell size={16} style={{ marginRight: '0.5rem' }} />
            Recommendations
          </MobileNavLink>
          {user?.userType === 'retailer' && (
            <MobileNavLink to="/dashboard/retailer" onClick={() => setIsMobileMenuOpen(false)}>
              <BarChart3 size={16} style={{ marginRight: '0.5rem' }} />
              Dashboard
            </MobileNavLink>
          )}
          {user?.userType === 'distributor' && (
            <MobileNavLink to="/dashboard/distributor" onClick={() => setIsMobileMenuOpen(false)}>
              <Package size={16} style={{ marginRight: '0.5rem' }} />
              Dashboard
            </MobileNavLink>
          )}
          <MobileNavLink to="/about" onClick={() => setIsMobileMenuOpen(false)}>
            About
          </MobileNavLink>
          <MobileNavLink to="/contact" onClick={() => setIsMobileMenuOpen(false)}>
            Contact
          </MobileNavLink>
          {user && (
            <>
              <MobileNavLink to="/profile" onClick={() => setIsMobileMenuOpen(false)}>
                <User size={16} style={{ marginRight: '0.5rem' }} />
                Profile
              </MobileNavLink>
              <MobileNavLink to="/loyalty" onClick={() => setIsMobileMenuOpen(false)}>
                <Bell size={16} style={{ marginRight: '0.5rem' }} />
                Loyalty
              </MobileNavLink>
              <button
                onClick={() => {
                  handleLogout();
                  setIsMobileMenuOpen(false);
                }}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  width: '100%',
                  padding: '0.5rem 0',
                  background: 'none',
                  border: 'none',
                  color: '#dc2626',
                  cursor: 'pointer',
                  fontSize: '0.875rem'
                }}
              >
                <LogOut size={16} />
                Logout
              </button>
            </>
          )}
        </MobileMenuContent>
      </MobileMenu>
    </NavbarContainer>
  );
};

export default Navbar;
