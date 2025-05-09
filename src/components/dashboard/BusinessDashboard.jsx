import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './BusinessDashboard.css';
import ProductManagement from './ProductManagement';

const BusinessDashboard = () => {
  const navigate = useNavigate();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  
  // Mock data for dashboard
  const [stats, setStats] = useState({
    totalAdmins: 5,
    totalProducts: 128,
    totalOrders: 213,
    totalRevenue: 15499.99
  });

  // Mock data for admins
  const [admins, setAdmins] = useState([
    {
      id: 1,
      username: 'admin',
      fullName: 'Admin User',
      email: 'admin@example.com',
      roles: ['BUSINESS_ADMIN'],
      active: true
    },
    {
      id: 2,
      username: 'fashionadmin',
      fullName: 'Fashion Admin',
      email: 'fashion@example.com',
      roles: ['ADMIN'],
      active: true
    },
    {
      id: 3,
      username: 'electronicsadmin',
      fullName: 'Electronics Admin',
      email: 'electronics@example.com',
      roles: ['ADMIN'],
      active: true
    },
    {
      id: 4,
      username: 'marketingadmin',
      fullName: 'Marketing Admin',
      email: 'marketing@example.com',
      roles: ['ADMIN'],
      active: false
    },
    {
      id: 5,
      username: 'customeradmin',
      fullName: 'Customer Service Admin',
      email: 'support@example.com',
      roles: ['ADMIN'],
      active: true
    }
  ]);

  const [activeTab, setActiveTab] = useState('overview');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Check authentication status
  useEffect(() => {
    // In a real app, this would check for a valid token or session
    const checkAuth = async () => {
      try {
        // Simulate API call to verify authentication
        setTimeout(() => {
          // For demo purposes, check if there's a business token in localStorage
          const businessToken = localStorage.getItem('businessToken');
          
          if (businessToken) {
            setIsAuthenticated(true);
          } else {
            // If no valid token, redirect to login
            navigate('/business-login');
          }
          setLoading(false);
        }, 1000);
      } catch (err) {
        setError('Failed to authenticate. Please try logging in again.');
        setLoading(false);
      }
    };
    
    checkAuth();
  }, [navigate]);

  // Render loading state
  if (loading) return <div className="dashboard-loading">Loading...</div>;
  
  // Render error state (if any)
  if (error) return <div className="dashboard-error">{error}</div>;
  
  // Redirect if not authenticated
  if (!isAuthenticated) {
    return (
      <div className="auth-error">
        <h2>Authentication Required</h2>
        <p>You need to be logged in to access the business dashboard.</p>
        <button 
          className="login-redirect-btn" 
          onClick={() => navigate('/business-login')}
        >
          Go to Login
        </button>
      </div>
    );
  }

  return (
    <div className="business-dashboard">
      <h1>Business Admin Dashboard</h1>
      
      {/* Dashboard Navigation */}
      <div className="dashboard-tabs">
        <button 
          className={`tab-button ${activeTab === 'overview' ? 'active' : ''}`}
          onClick={() => setActiveTab('overview')}
        >
          Overview
        </button>
        <button 
          className={`tab-button ${activeTab === 'products' ? 'active' : ''}`}
          onClick={() => setActiveTab('products')}
        >
          Product Management
        </button>
        <button 
          className={`tab-button ${activeTab === 'admins' ? 'active' : ''}`}
          onClick={() => setActiveTab('admins')}
        >
          Admin Management
        </button>
      </div>

      {/* Overview Tab */}
      {activeTab === 'overview' && (
        <>
          {/* Stats Overview */}
          <div className="stats-grid">
            <div className="stat-card">
              <h3>Total Admins</h3>
              <p className="stat-number">{stats.totalAdmins}</p>
            </div>
            <div className="stat-card">
              <h3>Total Products</h3>
              <p className="stat-number">{stats.totalProducts}</p>
            </div>
            <div className="stat-card">
              <h3>Total Orders</h3>
              <p className="stat-number">{stats.totalOrders}</p>
            </div>
            <div className="stat-card">
              <h3>Total Revenue</h3>
              <p className="stat-number">${stats.totalRevenue.toFixed(2)}</p>
            </div>
          </div>

          {/* Recent Activity */}
          <div className="recent-activity-section">
            <h2>Recent Activity</h2>
            <div className="activity-list">
              <div className="activity-item">
                <div className="activity-icon order-icon">📦</div>
                <div className="activity-content">
                  <p className="activity-text">New order #1234 placed</p>
                  <p className="activity-time">10 minutes ago</p>
                </div>
              </div>
              <div className="activity-item">
                <div className="activity-icon product-icon">🛍️</div>
                <div className="activity-content">
                  <p className="activity-text">Product "iPhone 13 Pro" updated</p>
                  <p className="activity-time">1 hour ago</p>
                </div>
              </div>
              <div className="activity-item">
                <div className="activity-icon admin-icon">👤</div>
                <div className="activity-content">
                  <p className="activity-text">New admin "Marketing Admin" added</p>
                  <p className="activity-time">3 hours ago</p>
                </div>
              </div>
              <div className="activity-item">
                <div className="activity-icon order-icon">📦</div>
                <div className="activity-content">
                  <p className="activity-text">Order #1189 status changed to "Shipped"</p>
                  <p className="activity-time">5 hours ago</p>
                </div>
              </div>
            </div>
          </div>
        </>
      )}

      {/* Products Tab */}
      {activeTab === 'products' && (
        <ProductManagement />
      )}

      {/* Admin Management Tab */}
      {activeTab === 'admins' && (
        <div className="admins-section">
          <div className="section-header">
            <h2>Manage Administrators</h2>
            <button className="add-admin-btn">+ Add Admin</button>
          </div>

          <div className="admins-table-container">
            <table className="admins-table">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Username</th>
                  <th>Email</th>
                  <th>Role</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {admins.map(admin => (
                  <tr key={admin.id}>
                    <td>{admin.fullName}</td>
                    <td>{admin.username}</td>
                    <td>{admin.email}</td>
                    <td>{admin.roles.join(', ')}</td>
                    <td>
                      <span className={`status-badge ${admin.active ? 'active' : 'inactive'}`}>
                        {admin.active ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td>
                      <div className="action-buttons">
                        <button className="edit-btn">Edit</button>
                        <button className="delete-btn">Delete</button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default BusinessDashboard; 