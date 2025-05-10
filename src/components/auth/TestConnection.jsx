import React, { useState, useEffect } from 'react';
import axios from 'axios';

const TestConnection = () => {
  const [status, setStatus] = useState({ loading: true, connected: false, message: '' });

  useEffect(() => {
    const checkConnection = async () => {
      try {
        const response = await axios.get('http://localhost:8080/api/auth/status', {
          withCredentials: true,
          timeout: 5000
        });
        
        setStatus({
          loading: false,
          connected: true,
          message: response.data.message || 'Connected successfully!'
        });
      } catch (error) {
        console.error('Connection test failed:', error);
        
        let errorMessage = 'Unable to connect to the server.';
        if (error.response) {
          errorMessage = `Server responded with status ${error.response.status}: ${error.response.data?.message || 'Unknown error'}`;
        } else if (error.request) {
          errorMessage = 'No response received from server. Check if server is running.';
        } else {
          errorMessage = `Error setting up request: ${error.message}`;
        }
        
        setStatus({
          loading: false,
          connected: false,
          message: errorMessage
        });
      }
    };
    
    checkConnection();
  }, []);

  return (
    <div style={{ padding: '20px', maxWidth: '600px', margin: '0 auto', textAlign: 'center' }}>
      <h2>Backend Connection Test</h2>
      
      {status.loading ? (
        <div style={{ margin: '20px', padding: '20px', backgroundColor: '#f0f0f0', borderRadius: '4px' }}>
          Testing connection to backend...
        </div>
      ) : status.connected ? (
        <div style={{ margin: '20px', padding: '20px', backgroundColor: '#e8f5e9', color: '#2e7d32', borderRadius: '4px' }}>
          <h3>✅ Connected!</h3>
          <p>{status.message}</p>
        </div>
      ) : (
        <div style={{ margin: '20px', padding: '20px', backgroundColor: '#ffebee', color: '#c62828', borderRadius: '4px' }}>
          <h3>❌ Connection Failed</h3>
          <p>{status.message}</p>
          <div style={{ marginTop: '15px' }}>
            <h4>Troubleshooting:</h4>
            <ol style={{ textAlign: 'left' }}>
              <li>Make sure the Spring Boot server is running on port 8080</li>
              <li>Check if there are any firewall or network issues</li>
              <li>Verify that CORS is properly configured on the server</li>
              <li>Ensure the status endpoint is publicly accessible</li>
            </ol>
            <button 
              onClick={() => window.location.reload()}
              style={{ 
                backgroundColor: '#f44336', 
                color: 'white', 
                border: 'none', 
                padding: '8px 16px', 
                borderRadius: '4px', 
                cursor: 'pointer',
                marginTop: '10px'
              }}
            >
              Retry Connection
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default TestConnection; 