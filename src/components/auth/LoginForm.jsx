import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './LoginForm.css';
import authService from '../../services/auth.service';

const LoginForm = ({ isBusinessLogin = false }) => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    username: '',
    password: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      // Use auth service instead of direct axios call
      const userData = await authService.login(formData.username, formData.password);
      
      // Redirect based on user role and login type
      if (userData.roles.includes('ROLE_ADMIN')) {
        navigate('/admin/dashboard');
      } else if (isBusinessLogin && (userData.roles.includes('ROLE_BUSINESS') || userData.roles.includes('BUSINESS_ADMIN'))) {
        // For business login, check for either ROLE_BUSINESS or BUSINESS_ADMIN
        navigate('/business/dashboard');
      } else if (isBusinessLogin) {
        // If trying business login but no business role
        setError('Your account does not have business access privileges');
        setLoading(false);
      } else {
        // Regular user login
        navigate('/');
      }
    } catch (err) {
      setLoading(false);
      
      // Handle server connection issues
      if (!err.response) {
        setError('Unable to connect to the authentication server. Please try again later.');
        return;
      }
      
      // Handle other errors
      if (err.response && err.response.data) {
        setError(err.response.data.message || 'Invalid credentials');
      } else {
        setError('Login failed. Please try again.');
      }
    }
  };

  return (
    <div className="login-container">
      <div className="login-form-wrapper">
        <h2>{isBusinessLogin ? 'Business Admin Login' : 'Customer Login'}</h2>
        
        {error && <div className="login-error">{error}</div>}
        
        <form className="login-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="username">Username</label>
            <input
              type="text"
              id="username"
              name="username"
              value={formData.username}
              onChange={handleInputChange}
              required
              placeholder="Enter your username"
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleInputChange}
              required
              placeholder="Enter your password"
            />
          </div>
          
          <button 
            type="submit" 
            className="login-button"
            disabled={loading}
          >
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </form>
        
        <div className="login-footer">
          {isBusinessLogin ? (
            <>
              <p>Not a business? <a href="/login">Customer Login</a></p>
              <p>Don't have a business account? <a href="/business-register">Register Business</a></p>
            </>
          ) : (
            <>
              <p>Are you a business? <a href="/business-login">Business Login</a></p>
              <p>Don't have an account? <a href="/register">Sign Up</a></p>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default LoginForm; 