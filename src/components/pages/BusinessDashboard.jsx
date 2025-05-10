/**
 * DEPRECATED: This file is no longer in use. 
 * The enhanced business dashboard is now located at: 
 * src/components/dashboard/BusinessDashboard.jsx
 */

import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

function BusinessDashboard() {
  const navigate = useNavigate();

  useEffect(() => {
    // Redirect to the new business dashboard
    navigate('/business/dashboard');
  }, [navigate]);

  return (
    <div>
      <p>Redirecting to enhanced business dashboard...</p>
    </div>
  );
}

export default BusinessDashboard; 