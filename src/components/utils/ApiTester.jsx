import React, { useState, useEffect } from 'react';
import { authApi } from '../../services/api';
import './ApiTester.css';

const ApiTester = () => {
  const [status, setStatus] = useState('checking');
  const [response, setResponse] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    testConnection();
  }, []);

  const testConnection = async () => {
    setStatus('checking');
    setError(null);
    setResponse(null);
    
    try {
      const result = await authApi.testConnection();
      setResponse(result);
      setStatus('connected');
    } catch (error) {
      console.error('API connection error:', error);
      setError(error.message || 'Failed to connect to API');
      setStatus('failed');
    }
  };

  return (
    <div className="api-tester">
      <h2>API Connection Tester</h2>
      
      <div className="connection-status">
        {status === 'checking' && <div className="status checking">Checking connection...</div>}
        {status === 'connected' && <div className="status connected">✓ Connected to API</div>}
        {status === 'failed' && <div className="status failed">✗ Connection Failed</div>}
      </div>
      
      {error && (
        <div className="error-box">
          <h3>Error Details</h3>
          <p>{error}</p>
          <div className="troubleshooting">
            <h4>Troubleshooting Steps:</h4>
            <ol>
              <li>Make sure your backend server is running at <code>http://localhost:8080</code></li>
              <li>Check if MongoDB is running at <code>mongodb://localhost:27017</code></li>
              <li>Verify that CORS is properly configured in your Spring Boot application</li>
              <li>Check network tab in browser dev tools for more details</li>
            </ol>
          </div>
        </div>
      )}
      
      {response && (
        <div className="response-box">
          <h3>API Response</h3>
          <pre>{JSON.stringify(response, null, 2)}</pre>
        </div>
      )}
      
      <button onClick={testConnection} className="test-button">
        {status === 'checking' ? 'Testing...' : 'Test Connection Again'}
      </button>
    </div>
  );
};

export default ApiTester; 