import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { FaShoppingCart, FaSearch, FaUser, FaBox, FaSignOutAlt, FaCaretDown } from 'react-icons/fa';
import '../../styles/Header.css';

const Header = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  
  // Add null checks for Redux state
  const cart = useSelector((state) => state.cart) || { items: [] };
  const auth = useSelector((state) => state.auth) || { isAuthenticated: false, user: null };
  
  // Safe destructuring after null checks
  const { items = [] } = cart;
  const { isAuthenticated = false, user = null } = auth;
  
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [userAuthenticated, setUserAuthenticated] = useState(false);
  const [localUser, setLocalUser] = useState(null);
  const cartItemsCount = items.reduce((total, item) => total + item.quantity, 0);
  
  // Check authentication status on component mount and when auth changes
  useEffect(() => {
    // Check if user is authenticated from Redux or localStorage
    const token = localStorage.getItem('token');
    const storedUser = localStorage.getItem('user');
    
    try {
      // Parse the user from localStorage if it exists
      const parsedUser = storedUser ? JSON.parse(storedUser) : null;
      
      // Update local user state
      setLocalUser(parsedUser || user);
      
      // Set authentication status
      const isAuth = isAuthenticated || !!token;
      setUserAuthenticated(isAuth);
      
      console.log('Header Auth Status:', { 
        reduxAuth: isAuthenticated, 
        reduxUser: user,
        localStorageToken: !!token,
        localStorageUser: parsedUser,
        effectiveUser: parsedUser || user,
        isAuthenticated: isAuth
      });
      
      // If we have a token but no Redux user, sync Redux with localStorage
      if (token && !isAuthenticated && parsedUser) {
        dispatch({
          type: 'LOGIN_SUCCESS',
          payload: {
            username: parsedUser.username,
            roles: parsedUser.roles,
            token: token
          }
        });
        console.log('Synchronized Redux state with localStorage');
      }
    } catch (error) {
      console.error('Error processing authentication state:', error);
    }
  }, [isAuthenticated, user, dispatch]);
  
  const toggleDropdown = () => {
    setDropdownOpen(!dropdownOpen);
  };
  
  const handleLogout = () => {
    // Clear all auth tokens and user data
    localStorage.removeItem('token');
    localStorage.removeItem('businessToken');
    localStorage.removeItem('user');
    
    // Dispatch logout action to Redux
    dispatch({ type: 'LOGOUT' });
    
    // Update local state
    setUserAuthenticated(false);
    setLocalUser(null);
    
    // Redirect to home
    navigate('/');
    
    // Close dropdown
    setDropdownOpen(false);
  };

  // Get the effective user (either from Redux or localStorage)
  const effectiveUser = user || localUser;

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
          
          <Link to="/cart" className="cart-link">
            <FaShoppingCart />
            <span>Cart ({cartItemsCount})</span>
          </Link>
          
          {userAuthenticated && effectiveUser ? (
            <div className="user-menu">
              <div className="user-menu-trigger" onClick={toggleDropdown}>
                <FaUser className="user-icon" />
                <span className="username">{effectiveUser.username}</span>
                <FaCaretDown />
              </div>
              
              {dropdownOpen && (
                <div className="user-dropdown">
                  <Link to="/profile" className="dropdown-item" onClick={() => setDropdownOpen(false)}>
                    My Profile
                  </Link>
                  <div className="dropdown-divider"></div>
                  <button onClick={handleLogout} className="dropdown-item logout-btn">
                    <FaSignOutAlt className="logout-icon" />
                    <span>Logout</span>
                  </button>
                </div>
              )}
            </div>
          ) : (
            <>
              <Link to="/business-login" className="nav-link">
                <FaUser />
                <span>Business Login</span>
              </Link>

              <Link to="/login" className="nav-link">
                <FaUser />
                <span>Login</span>
              </Link>
            </>
          )}
        </nav>
      </div>
    </header>
  );
};

export default Header; 