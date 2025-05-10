import React from 'react';
import { Link } from 'react-router-dom';
import './Unauthorized.css';

const Unauthorized = () => {
  return (
    <div className="unauthorized-container">
      <div className="unauthorized-content">
        <h1>Access Denied</h1>
        <div className="unauthorized-icon">
          <i className="fas fa-lock"></i>
        </div>
        <h2>You don't have permission to access this page</h2>
        <p>Please contact your administrator if you believe this is an error.</p>
        <div className="unauthorized-actions">
          <Link to="/" className="btn btn-primary">Go to Homepage</Link>
        </div>
      </div>
    </div>
  );
};

export default Unauthorized; 