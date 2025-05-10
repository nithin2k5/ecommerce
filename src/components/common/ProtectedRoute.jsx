import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import AuthService from '../../services/auth.service';

const ProtectedRoute = ({ requiredRoles = [] }) => {
  const isAuthenticated = AuthService.isAuthenticated();
  
  // If not authenticated, redirect to login
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  
  // If roles are specified, check if user has the required role
  if (requiredRoles.length > 0) {
    const hasRequiredRole = requiredRoles.some(role => AuthService.hasRole(role));
    
    // If user doesn't have the required role, redirect to home or unauthorized page
    if (!hasRequiredRole) {
      return <Navigate to="/unauthorized" replace />;
    }
  }
  
  // If authenticated and has required role (or no specific role required)
  return <Outlet />;
};

export default ProtectedRoute; 