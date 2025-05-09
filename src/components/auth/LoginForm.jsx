import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './LoginForm.css';

const LoginForm = ({ isBusinessLogin = false }) => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: '',
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
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1000));

      // For demo purposes, any login is successful with these credentials
      if (isBusinessLogin) {
        if (formData.email === 'business@example.com' && formData.password === 'password') {
          // Set business token and user info in localStorage
          localStorage.setItem('businessToken', 'mock-business-jwt-token');
          localStorage.setItem('user', JSON.stringify({
            id: 1,
            name: 'Business Admin',
            email: 'business@example.com',
            roles: ['BUSINESS_ADMIN']
          }));
          
          navigate('/business/dashboard');
        } else {
          setError('Invalid business credentials');
        }
      } else {
        // Regular user login
        localStorage.setItem('token', 'mock-jwt-token');
        localStorage.setItem('user', JSON.stringify({
          id: 2,
          name: 'Regular User',
          email: formData.email,
          roles: ['USER']
        }));
        
        navigate('/');
      }
    } catch (err) {
      setError('Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <div className="login-form-wrapper">
        <h2>{isBusinessLogin ? 'Business Admin Login' : 'Customer Login'}</h2>
        
        {error && <div className="login-error">{error}</div>}
        
        <form className="login-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              required
              placeholder={isBusinessLogin ? 'business@example.com' : 'Enter your email'}
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
              placeholder={isBusinessLogin ? 'password (for demo)' : 'Enter your password'}
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