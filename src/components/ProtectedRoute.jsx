import React from 'react';
import { Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import authService from '../services/auth.service';

const ProtectedRoute = ({ children, roles = [] }) => {
  // Check if user is authenticated via auth service
  const isAuthenticated = authService.isAuthenticated();
  
  // Get user roles from auth service
  const user = authService.getCurrentUser();
  const userRoles = user?.roles || [];
  
  // Map role aliases to handle different naming conventions
  const roleMap = {
    'BUSINESS_ADMIN': ['BUSINESS_ADMIN', 'ROLE_BUSINESS'],  // Map both role formats
    'ADMIN': ['ADMIN', 'ROLE_ADMIN'],
    'USER': ['USER', 'ROLE_USER']
  };
  
  // Function to check if user has any of the required roles
  const hasRequiredRole = () => {
    if (roles.length === 0) return true;
    
    return roles.some(role => {
      // Check direct role match
      if (userRoles.includes(role)) return true;
      
      // Check mapped role aliases
      const mappedRoles = roleMap[role] || [];
      return mappedRoles.some(mappedRole => userRoles.includes(mappedRole));
    });
  };
  
  // If not authenticated, redirect to login
  if (!isAuthenticated) {
    // Redirect to business login if business role is required
    if (roles.includes('BUSINESS_ADMIN') || roles.includes('ROLE_BUSINESS')) {
      return <Navigate to="/business-login" />;
    }
    return <Navigate to="/login" />;
  }
  
  // If roles are specified and user doesn't have any required role
  if (!hasRequiredRole()) {
    return <Navigate to="/" />;
  }
  
  return children;
};

export default ProtectedRoute; 