import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import './LoginForm.css';

const LoginForm = ({ isBusinessLogin = false }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    // Simple hardcoded authentication for demo purposes
    if (isBusinessLogin && username === 'admin' && password === 'admin') {
      // Create mock user data
      const userData = {
        username: 'admin',
        token: 'sample-token-12345',
        roles: ['BUSINESS_ADMIN']
      };

      // Store auth data in localStorage
      localStorage.setItem('token', userData.token);
      localStorage.setItem('user', JSON.stringify({
        username: userData.username,
        roles: userData.roles
      }));

      // Dispatch login success
      dispatch({
        type: 'LOGIN_SUCCESS',
        payload: userData
      });

      // Navigate to dashboard
      navigate('/business/dashboard');
      return;
    }

    try {
      // This is the regular API call implementation
      const response = await fetch('http://localhost:8080/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Login failed');
      }

      // Check if user has business access
      if (isBusinessLogin && 
          !(data.roles.includes('BUSINESS_ADMIN') || data.roles.includes('ADMIN'))) {
        setError('You do not have business account access');
        setLoading(false);
        return;
      }

      // Store auth data
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify({
        username: data.username,
        roles: data.roles
      }));

      // Dispatch login success
      dispatch({
        type: 'LOGIN_SUCCESS',
        payload: data
      });

      // Navigate based on role
      if (data.roles.includes('BUSINESS_ADMIN')) {
        navigate('/business/dashboard');
      } else if (data.roles.includes('ADMIN')) {
        navigate('/admin/dashboard');
      } else {
        navigate('/');
      }

    } catch (error) {
      setError(error.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <h2>{isBusinessLogin ? 'Business Login' : 'Customer Login'}</h2>
        {error && <div className="error-message">{error}</div>}
        
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="username">Username</label>
            <input
              type="text"
              id="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          
          <button type="submit" className="login-button" disabled={loading}>
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </form>
        
        {!isBusinessLogin && (
          <div className="login-footer">
            <p>Don't have an account? <a href="/register">Register</a></p>
          </div>
        )}
        
        {isBusinessLogin && (
          <div className="login-footer">
            <p>For business inquiries, please contact our support team.</p>
          </div>
        )}
      </div>
      
      {isBusinessLogin ? (
        <div className="login-sample-credentials">
          <h3>Sample Business Credentials</h3>
          <p><strong>Business Admin:</strong> businessadmin / admin123</p>
          <p><strong>Admin:</strong> admin / admin123</p>
          <p><strong>Fashion Admin:</strong> fashionadmin / admin123</p>
          <p><strong>Electronics Admin:</strong> electronicsadmin / admin123</p>
        </div>
      ) : (
        <div className="login-sample-credentials">
          <h3>Sample Customer Credentials</h3>
          <p><strong>Regular User:</strong> user / user123</p>
          <p><strong>John Doe:</strong> john / password</p>
          <p><strong>Jane Smith:</strong> jane / password</p>
          <p><strong>Robert Johnson:</strong> robert / password</p>
        </div>
      )}
    </div>
  );
};

export default LoginForm; 