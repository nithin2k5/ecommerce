import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import authService from '../../services/auth.service';
import '../../styles/TestConnection.css';

function TestConnection() {
  const [status, setStatus] = useState({ checking: true, connected: false });
  const [mockMode, setMockMode] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const checkConnection = async () => {
      try {
        const isConnected = await authService.testConnection();
        setStatus({ checking: false, connected: isConnected });
      } catch (err) {
        setStatus({ checking: false, connected: false });
      }
    };
    
    checkConnection();
  }, []);

  const enableMockMode = () => {
    authService.enableMockMode();
    setMockMode(true);
  };

  if (status.checking) {
    return (
      <div className="connection-test-container">
        <div className="connection-status-card">
          <h2>Testing Connection</h2>
          <div className="loading-indicator">
            <div className="spinner"></div>
          </div>
          <p>Connecting to authentication server...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="connection-test-container">
      <div className="connection-status-card">
        <h2>Authentication Server Status</h2>
        
        {status.connected ? (
          <div className="status-indicator success">
            <span className="status-dot"></span>
            <span className="status-text">Connected</span>
          </div>
        ) : (
          <div className="status-indicator error">
            <span className="status-dot"></span>
            <span className="status-text">Disconnected</span>
          </div>
        )}
        
        <div className="status-message">
          {status.connected ? (
            <p>Successfully connected to the authentication server. You can now use login and registration functions.</p>
          ) : (
            <div>
              <p>Unable to connect to the authentication server at <code>http://localhost:8080</code>.</p>
              <p>Possible reasons:</p>
              <ul>
                <li>The backend server is not running</li>
                <li>There's a network issue preventing the connection</li>
                <li>CORS is not properly configured on the server</li>
              </ul>
            </div>
          )}
        </div>
        
        <div className="status-actions">
          {!status.connected && process.env.NODE_ENV === 'development' && !mockMode && (
            <button 
              className="mock-mode-button"
              onClick={enableMockMode}
            >
              Enable Mock Mode for Development
            </button>
          )}
          
          {mockMode && (
            <div className="mock-mode-active">
              <p>Mock mode is now active. You can test the app without a real backend.</p>
            </div>
          )}
          
          <button 
            className="retry-button"
            onClick={() => window.location.reload()}
          >
            Retry Connection
          </button>
          
          <button 
            className="continue-button"
            onClick={() => navigate('/')}
          >
            Continue to App
          </button>
        </div>
      </div>
    </div>
  );
}

export default TestConnection; 