import React from 'react';
import { Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';

const ProtectedRoute = ({ children, roles = [] }) => {
  // Get auth state from Redux
  const auth = useSelector(state => state.auth);
  
  // Check if user is logged in
  const isAuthenticated = localStorage.getItem('token') !== null;
  
  // Get user roles from localStorage if not in Redux
  const userRoles = auth?.user?.roles || 
    (localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user')).roles : []);
  
  // If not authenticated, redirect to login
  if (!isAuthenticated) {
    return <Navigate to="/business-login" />;
  }
  
  // If roles are specified and user doesn't have any required role
  if (roles.length > 0 && !roles.some(role => userRoles.includes(role))) {
    return <Navigate to="/" />;
  }
  
  return children;
};

export default ProtectedRoute; 