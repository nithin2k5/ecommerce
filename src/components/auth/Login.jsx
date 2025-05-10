import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { FaUser, FaLock, FaSignInAlt, FaExclamationTriangle, FaShoppingBag } from 'react-icons/fa';
import '../../styles/Auth.css';
import './BusinessRegister.css'; // Import the BusinessRegister styles
import authService from '../../services/auth.service';

function Login() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  
  const [formData, setFormData] = useState({
    username: '',
    password: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [serverStatus, setServerStatus] = useState({ checking: true, connected: false });

  // Check server connection on component mount
  useEffect(() => {
    const checkServerConnection = async () => {
      try {
        const isConnected = await authService.testConnection();
        setServerStatus({ checking: false, connected: isConnected });
      } catch (err) {
        setServerStatus({ checking: false, connected: false });
      }
    };
    
    checkServerConnection();
  }, []);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
    
    // Clear error when user starts typing
    if (error) {
      setError('');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    // Verify server connection before trying to login
    if (!serverStatus.connected) {
      try {
        const isConnected = await authService.testConnection();
        setServerStatus({ checking: false, connected: isConnected });
        if (!isConnected) {
          setError('Unable to connect to the server. Please try again later.');
          setLoading(false);
          return;
        }
      } catch (err) {
        setError('Server connection failed. Please try again later.');
        setLoading(false);
        return;
      }
    }

    try {
      console.log('Attempting login with:', formData.username);
      const userData = await authService.login(formData.username, formData.password);
      console.log('Login successful:', userData);
      
      // Show success alert
      alert(`Welcome back, ${userData.username}! You have successfully logged in.`);
      
      // Store the user in localStorage for persistence
      if (userData.accessToken) {
        localStorage.setItem('token', userData.accessToken);
        localStorage.setItem('user', JSON.stringify({
          username: userData.username,
          roles: userData.roles,
          id: userData.id
        }));
      }
      
      // Dispatch login success action to Redux store
      dispatch({
        type: 'LOGIN_SUCCESS',
        payload: {
          username: userData.username,
          roles: userData.roles,
          token: userData.accessToken
        }
      });
      
      // Log the current state of user data for debugging
      console.log('User data stored:', {
        localStorage: JSON.parse(localStorage.getItem('user')),
        reduxAction: {
          username: userData.username,
          roles: userData.roles
        }
      });
      
      if (userData.roles && userData.roles.includes('ROLE_USER')) {
        // Redirect to home page or shopping cart if it was being filled before login
        const returnPath = sessionStorage.getItem('returnPath') || '/';
        navigate(returnPath);
        sessionStorage.removeItem('returnPath');
      } else if (userData.roles && userData.roles.includes('ROLE_ADMIN')) {
        navigate('/admin/dashboard');
      } else {
        navigate('/');
      }
    } catch (err) {
      console.error('Login error:', err);
      setLoading(false);
      
      // Handle server connection issues
      if (!err.response) {
        setError('Unable to connect to the authentication server. Please try again later.');
        return;
      }
      
      // Dispatch login fail action to Redux store
      dispatch({
        type: 'LOGIN_FAIL',
        payload: err.response?.data?.message || 'Login failed'
      });
      
      // Handle other errors
      if (err.response && err.response.data) {
        setError(err.response.data.message || 'Invalid credentials');
      } else {
        setError('Login failed. Please try again.');
      }
    }
  };

  // Show server warning if not connected
  const ServerWarningBanner = () => {
    if (serverStatus.connected || serverStatus.checking) return null;
    
    // Check if we're in development mode
    const isDevelopment = process.env.NODE_ENV === 'development';
    
    return (
      <div className="server-warning-banner">
        <FaExclamationTriangle className="warning-icon" />
        <p>
          <strong>Warning:</strong> Unable to connect to the authentication server. 
          {isDevelopment ? (
            <> Using mock data mode for development. Login will be simulated.</>
          ) : (
            <> You can still try to log in, but it may not work.</>
          )}
        </p>
        <div className="server-warning-actions">
          <button 
            onClick={() => window.location.reload()}
            className="retry-connection-btn"
          >
            Retry Connection
          </button>
          
          {isDevelopment && (
            <button 
              onClick={() => {
                authService.enableMockMode();
                setServerStatus({ checking: false, connected: true });
              }}
              className="enable-mock-btn"
            >
              Enable Mock Mode
            </button>
          )}
        </div>
      </div>
    );
  };

  // If API connection check has been done but failed
  if (serverStatus.checked && !serverStatus.connected && !process.env.NODE_ENV === 'development') {
    return (
      <div className="connection-error">
        <h2>Connection Error</h2>
        <p>
          Unable to connect to the server. Please make sure:
        </p>
        <ol>
          <li>The backend server is running at http://localhost:8080</li>
          <li>There are no network issues preventing the connection</li>
          <li>CORS is properly configured on the server</li>
        </ol>
        <button onClick={() => window.location.reload()}>
          Retry Connection
        </button>
      </div>
    );
  }

  return (
    <div className="business-register-container">
      {/* API status indicator */}
      {serverStatus.connected && (
        <div className="api-status connected">
          ✓ API Connected
        </div>
      )}
      
      <div className="business-register-card">
        <h2>Customer Login</h2>
        
        {error && <div className="form-error">{error}</div>}
        
        <form onSubmit={handleSubmit}>
          <div className="form-step">
            <h3>Account Access</h3>
            <p className="step-description">
              Please enter your credentials to access your shopping account
            </p>
            
            <div className="form-group">
              <label htmlFor="username">Username*</label>
              <input
                type="text"
                id="username"
                name="username"
                value={formData.username}
                onChange={handleChange}
                placeholder="Enter your username"
                required
                autoFocus
              />
            </div>

            <div className="form-group">
              <label htmlFor="password">Password*</label>
              <input
                type="password"
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Enter your password"
                required
              />
            </div>
            
            <div className="form-nav">
              <button 
                type="submit" 
                className="submit-btn" 
                disabled={loading}
              >
                {loading ? 'Logging in...' : 'Login to Shop'}
              </button>
            </div>
          </div>
        </form>
        
        <div className="business-register-footer">
          <p>Don't have an account? <Link to="/register">Register here</Link></p>
          <p>Are you a business? <Link to="/business-login">Business Login</Link></p>
        </div>
      </div>
      
      {/* Shopping Benefits Info */}
      <div className="registration-info-card">
        <h3>Shopping Benefits</h3>
        <ul>
          <li>Fast checkout with saved shipping details</li>
          <li>Order tracking and history</li>
          <li>Exclusive deals and discounts</li>
          <li>Wishlist and favorites</li>
        </ul>
        <p>Login to enjoy a personalized shopping experience!</p>
      </div>
    </div>
  );
}

export default Login; 