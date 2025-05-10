import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './BusinessDashboard.css';
import ProductManagement from './ProductManagement';
import authService from '../../services/auth.service';

const BusinessDashboard = () => {
  const navigate = useNavigate();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  
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

  // Add Product Form State
  const [productData, setProductData] = useState({
    name: '',
    price: '',
    description: '',
    image: '',
    category: '',
    brand: '',
    stock: ''
  });

  const categories = [
    { value: 'electronics', label: 'Electronics' },
    { value: 'mobiles', label: 'Mobile Phones' },
    { value: 'fashion', label: 'Fashion' },
    { value: 'provisions', label: 'Provisions' },
    { value: 'appliances', label: 'Appliances' }
  ];

  const [activeTab, setActiveTab] = useState('overview');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Check authentication status
  useEffect(() => {
    const checkAuth = async () => {
      try {
        // Use auth service to verify business role
        const isAuth = authService.isAuthenticated();
        const isBusiness = authService.isBusiness() || authService.hasRole('BUSINESS_ADMIN');
        
        if (isAuth && isBusiness) {
          setIsAuthenticated(true);
          setCurrentUser(authService.getCurrentUser());
        } else {
          // If no valid token or not a business user, redirect to login
          navigate('/business-login');
        }
        setLoading(false);
      } catch (err) {
        setError('Failed to authenticate. Please try logging in again.');
        setLoading(false);
      }
    };
    
    checkAuth();
  }, [navigate]);

  // Handle logout
  const handleLogout = () => {
    authService.logout();
    navigate('/business-login');
  };

  // Handle product form input changes
  const handleProductInputChange = (e) => {
    const { name, value } = e.target;
    setProductData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Handle product form submission
  const handleProductSubmit = async (e) => {
    e.preventDefault();
    // TODO: Add API call to save product
    console.log('Product Data:', productData);
    
    // Add to stats for display purposes
    setStats(prev => ({
      ...prev,
      totalProducts: prev.totalProducts + 1
    }));
    
    // Reset form after successful submission
    setProductData({
      name: '',
      price: '',
      description: '',
      image: '',
      category: '',
      brand: '',
      stock: ''
    });
    
    // Show success message
    alert('Product added successfully!');
  };

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
      <div className="dashboard-header">
        <h1>Business Admin Dashboard</h1>
        
        {/* User info and logout */}
        <div className="user-controls">
          <div className="user-info">
            <span>Welcome, {currentUser?.username || 'Business Admin'}</span>
          </div>
          <button 
            className="logout-btn" 
            onClick={handleLogout}
          >
            Logout
          </button>
        </div>
      </div>
      
      {/* Dashboard Navigation */}
      <div className="dashboard-tabs">
        <button 
          className={`tab-button ${activeTab === 'overview' ? 'active' : ''}`}
          onClick={() => setActiveTab('overview')}
        >
          Overview
        </button>
        <button 
          className={`tab-button ${activeTab === 'add-product' ? 'active' : ''}`}
          onClick={() => setActiveTab('add-product')}
        >
          Add Product
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
            </div>
          </div>
        </>
      )}

      {/* Add Product Tab */}
      {activeTab === 'add-product' && (
        <div className="add-product-section">
          <h2>Add New Product</h2>
          <form className="product-form" onSubmit={handleProductSubmit}>
            {/* Product Name */}
            <div className="form-group">
              <label htmlFor="name">Product Name</label>
              <input
                type="text"
                id="name"
                name="name"
                value={productData.name}
                onChange={handleProductInputChange}
                required
              />
            </div>

            {/* Price */}
            <div className="form-group">
              <label htmlFor="price">Price ($)</label>
              <input
                type="number"
                id="price"
                name="price"
                value={productData.price}
                onChange={handleProductInputChange}
                required
                min="0"
                step="0.01"
              />
            </div>

            {/* Description */}
            <div className="form-group">
              <label htmlFor="description">Description</label>
              <textarea
                id="description"
                name="description"
                value={productData.description}
                onChange={handleProductInputChange}
                required
                rows="4"
              ></textarea>
            </div>

            {/* Image URL */}
            <div className="form-group">
              <label htmlFor="image">Image URL</label>
              <input
                type="text"
                id="image"
                name="image"
                value={productData.image}
                onChange={handleProductInputChange}
                required
              />
            </div>

            {/* Category */}
            <div className="form-group">
              <label htmlFor="category">Category</label>
              <select
                id="category"
                name="category"
                value={productData.category}
                onChange={handleProductInputChange}
                required
              >
                <option value="">Select a category</option>
                {categories.map(cat => (
                  <option key={cat.value} value={cat.value}>{cat.label}</option>
                ))}
              </select>
            </div>

            {/* Brand */}
            <div className="form-group">
              <label htmlFor="brand">Brand</label>
              <input
                type="text"
                id="brand"
                name="brand"
                value={productData.brand}
                onChange={handleProductInputChange}
                required
              />
            </div>

            {/* Stock */}
            <div className="form-group">
              <label htmlFor="stock">Stock</label>
              <input
                type="number"
                id="stock"
                name="stock"
                value={productData.stock}
                onChange={handleProductInputChange}
                required
                min="0"
              />
            </div>

            <button type="submit" className="add-product-btn">Add Product</button>
          </form>
        </div>
      )}

      {/* Products Tab */}
      {activeTab === 'products' && (
        <ProductManagement />
      )}

      {/* Admins Tab */}
      {activeTab === 'admins' && (
        <div className="admin-management-section">
          <h2>Admin Management</h2>
          
          <div className="admin-table">
            <div className="admin-table-header">
              <div className="header-cell">Username</div>
              <div className="header-cell">Full Name</div>
              <div className="header-cell">Email</div>
              <div className="header-cell">Role</div>
              <div className="header-cell">Status</div>
              <div className="header-cell">Actions</div>
            </div>
            
            {admins.map(admin => (
              <div key={admin.id} className="admin-row">
                <div className="cell">{admin.username}</div>
                <div className="cell">{admin.fullName}</div>
                <div className="cell">{admin.email}</div>
                <div className="cell">{admin.roles.join(', ')}</div>
                <div className="cell">
                  <span className={`status-badge ${admin.active ? 'active' : 'inactive'}`}>
                    {admin.active ? 'Active' : 'Inactive'}
                  </span>
                </div>
                <div className="cell actions">
                  <button className="edit-btn">Edit</button>
                  <button className={`status-btn ${admin.active ? 'deactivate' : 'activate'}`}>
                    {admin.active ? 'Deactivate' : 'Activate'}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default BusinessDashboard; 