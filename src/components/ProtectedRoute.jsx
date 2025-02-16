import { Navigate } from 'react-router-dom';

function ProtectedRoute({ children }) {
  // Get authentication status from your auth context or local storage
  const isAuthenticated = localStorage.getItem('isAuthenticated') === 'true';
  const userType = localStorage.getItem('userType');

  if (!isAuthenticated) {
    // Redirect to login if not authenticated
    return <Navigate to="/login" replace />;
  }

  if (userType !== 'business') {
    // Redirect to home if not a business user
    return <Navigate to="/" replace />;
  }

  return children;
}

export default ProtectedRoute; 