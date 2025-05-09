import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { FaShoppingCart, FaSearch, FaUser, FaBox } from 'react-icons/fa';
import '../../styles/Header.css';

const Header = () => {
  const navigate = useNavigate();
  const { items } = useSelector((state) => state.cart);
  const cartItemsCount = items.reduce((total, item) => total + item.quantity, 0);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isBusinessAdmin, setIsBusinessAdmin] = useState(false);
  const [userName, setUserName] = useState('');
  
  // Check auth status whenever the component renders
  useEffect(() => {
    const checkAuthStatus = () => {
      const token = localStorage.getItem('token');
      const businessToken = localStorage.getItem('businessToken');
      const user = localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user')) : null;
      
      setIsLoggedIn(token !== null || businessToken !== null);
      setIsBusinessAdmin(user?.roles?.includes('BUSINESS_ADMIN') || false);
      setUserName(user?.name || '');
    };
    
    checkAuthStatus();
    
    // Add event listener for storage changes
    window.addEventListener('storage', checkAuthStatus);
    
    return () => {
      window.removeEventListener('storage', checkAuthStatus);
    };
  }, []);
  
  const handleLogout = () => {
    // Clear all auth tokens and user data
    localStorage.removeItem('token');
    localStorage.removeItem('businessToken');
    localStorage.removeItem('user');
    
    // Update state
    setIsLoggedIn(false);
    setIsBusinessAdmin(false);
    setUserName('');
    
    // Redirect to home
    navigate('/');
  };

  return (
    <header className="header">
      <div className="header-content">
        <Link to="/" className="logo">
          <span className="logo-text">
            <span className="logo-first-letter">P</span>azar
          </span>
        </Link>

        <div className="search-bar">
          <FaSearch className="search-icon" />
          <input
            type="text"
            placeholder="Search for products..."
            className="search-input"
          />
          <button className="search-button">Search</button>
        </div>

        <nav className="nav-links">
          <Link to="/orders" className="nav-link">
            <FaBox />
            <span>Orders</span>
          </Link>
          
          <Link to="/business-login" className="nav-link">
            <FaUser />
            <span>Business Login</span>
          </Link>

          <Link to="/login" className="nav-link">
            <FaUser />
            <span>Login</span>
          </Link>
          
          <Link to="/cart" className="cart-link">
            <FaShoppingCart />
            <span>Cart ({cartItemsCount})</span>
          </Link>
        </nav>
      </div>
    </header>
  );
};

export default Header; 