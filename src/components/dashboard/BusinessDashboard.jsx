import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import './BusinessDashboard.css';
import ProductManagement from './ProductManagement';
import authService from '../../services/auth.service';
import adminService from '../../services/admin.service';
import { FaChartLine, FaBox, FaUsers, FaDollarSign, FaPlus, FaUserCog, FaEdit, FaCheck, FaTimes, FaShieldAlt, FaLock } from 'react-icons/fa';

const BusinessDashboard = () => {
  const navigate = useNavigate();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [isSuperAdmin, setIsSuperAdmin] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  
  // Mock data for dashboard
  const [stats, setStats] = useState({
    totalAdmins: 5,
    totalProducts: 128,
    totalOrders: 213,
    totalRevenue: 15499.99
  });

  // Admins state
  const [admins, setAdmins] = useState([]);
  const [loadingAdmins, setLoadingAdmins] = useState(false);

  // Mock data for recent activities
  const [activities, setActivities] = useState([
    {
      id: 1,
      type: 'order',
      text: 'New order received (#ORD-2023)',
      time: '10 minutes ago'
    },
    {
      id: 2,
      type: 'product',
      text: 'iPhone 14 Pro Max was added to inventory',
      time: '2 hours ago'
    },
    {
      id: 3,
      type: 'admin',
      text: 'New admin user registered: marketingadmin',
      time: '1 day ago'
    },
    {
      id: 4,
      type: 'order',
      text: 'Order #ORD-2020 was completed and shipped',
      time: '2 days ago'
    }
  ]);

  // Add Product Form State
  const [productData, setProductData] = useState({
    name: '',
    price: '',
    description: '',
    image: '',
    category: '',
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
  const [showSuperAdminLogin, setShowSuperAdminLogin] = useState(false);
  const [superAdminCredentials, setSuperAdminCredentials] = useState({
    username: '',
    password: ''
  });

  // Check authentication status
  useEffect(() => {
    const checkAuth = async () => {
      try {
        // Use auth service to verify business role
        const isAuth = authService.isAuthenticated();
        const isBusiness = authService.isBusiness() || authService.hasRole('BUSINESS_ADMIN');
        
        if (isAuth && isBusiness) {
          setIsAuthenticated(true);
          const user = authService.getCurrentUser();
          setCurrentUser(user);
          
          // Check if user is a super admin
          const hasSuperAdminRole = user?.roles?.includes('SUPER_ADMIN');
          setIsSuperAdmin(hasSuperAdminRole);
          
          // Track admin login 
          if (user && (user.roles.includes('ROLE_ADMIN') || user.roles.includes('BUSINESS_ADMIN'))) {
            adminService.trackLogin(user.username);
          }
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

  // Load admin data when super admin tab is activated or when super admin status changes
  useEffect(() => {
    const loadAdminData = async () => {
      if (activeTab === 'admins' && isSuperAdmin) {
        setLoadingAdmins(true);
        try {
          const response = await adminService.getAllAdmins();
          setAdmins(response.data);
        } catch (error) {
          console.error('Error loading admin data:', error);
        } finally {
          setLoadingAdmins(false);
        }
      }
    };
    
    loadAdminData();
  }, [activeTab, isSuperAdmin]);

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

  // Handle super admin login input changes
  const handleSuperAdminInputChange = (e) => {
    const { name, value } = e.target;
    setSuperAdminCredentials(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Handle super admin login
  const handleSuperAdminLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      // Call admin service to validate super admin credentials
      const response = await adminService.superAdminLogin(
        currentUser?.username,
        superAdminCredentials.username,
        superAdminCredentials.password
      );
      
      setIsSuperAdmin(true);
      
      // Add the SUPER_ADMIN role to the current user
      if (currentUser) {
        const updatedUser = {
          ...currentUser,
          roles: [...(currentUser.roles || []), 'SUPER_ADMIN']
        };
        setCurrentUser(updatedUser);
        
        // Update in local storage
        localStorage.setItem('user', JSON.stringify(updatedUser));
      }
      
      // Add activity
      setActivities(prev => [
        {
          id: new Date().getTime(),
          type: 'admin',
          text: `Super Admin access granted to ${currentUser?.username || 'current user'}`,
          time: 'Just now'
        },
        ...prev
      ]);
      
      setShowSuperAdminLogin(false);
      alert(response.data.message || 'Super Admin access granted!');
    } catch (error) {
      alert(error.response?.data?.message || 'Invalid Super Admin credentials!');
    } finally {
      setIsLoading(false);
      setSuperAdminCredentials({ username: '', password: '' });
    }
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
    
    // Add to activities
    setActivities(prev => [
      {
        id: new Date().getTime(),
        type: 'product',
        text: `${productData.name} was added to inventory`,
        time: 'Just now'
      },
      ...prev
    ]);
    
    // Reset form after successful submission
    setProductData({
      name: '',
      price: '',
      description: '',
      image: '',
      category: '',
      stock: ''
    });
    
    // Show success message
    alert('Product added successfully!');
  };

  // Get the business ID from the current user
  const getBusinessId = () => {
    if (currentUser && currentUser.id) {
      return currentUser.id;
    } else if (currentUser && currentUser.businessId) {
      return currentUser.businessId;
    }
    return null;
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
            {isSuperAdmin && <span className="super-admin-badge"><FaShieldAlt /> Super Admin</span>}
          </div>
          {!isSuperAdmin && (
            <button 
              className="super-admin-btn" 
              onClick={() => setShowSuperAdminLogin(!showSuperAdminLogin)}
            >
              <FaLock /> Super Admin
            </button>
          )}
          <button 
            className="logout-btn" 
            onClick={handleLogout}
          >
            <FaUserCog /> Logout
          </button>
        </div>
      </div>
      
      {/* Super Admin Login Form */}
      {showSuperAdminLogin && (
        <div className="super-admin-login">
          <h3><FaShieldAlt /> Super Admin Access</h3>
          <p className="super-admin-info-text">
            Enter the credentials of an existing Super Admin to gain Super Admin privileges.
            <br />
            <strong>For testing:</strong> Username: superadmin, Password: password123
          </p>
          <form onSubmit={handleSuperAdminLogin}>
            <div className="form-group">
              <label htmlFor="superUsername">Super Admin Username</label>
              <input
                type="text"
                id="superUsername"
                name="username"
                value={superAdminCredentials.username}
                onChange={handleSuperAdminInputChange}
                placeholder="Super Admin Username"
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="superPassword">Super Admin Password</label>
              <input
                type="password"
                id="superPassword"
                name="password"
                value={superAdminCredentials.password}
                onChange={handleSuperAdminInputChange}
                placeholder="Super Admin Password"
                required
              />
            </div>
            <div className="form-actions">
              <button 
                type="submit" 
                className="super-admin-submit"
                disabled={isLoading}
              >
                {isLoading ? 'Verifying...' : <><FaLock /> Login</>}
              </button>
              <button 
                type="button" 
                className="super-admin-cancel"
                onClick={() => setShowSuperAdminLogin(false)}
                disabled={isLoading}
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}
      
      {/* Dashboard Navigation */}
      <div className="dashboard-tabs">
        <button 
          className={`tab-button ${activeTab === 'overview' ? 'active' : ''}`}
          onClick={() => setActiveTab('overview')}
        >
          <FaChartLine /> Overview
        </button>
        <button 
          className={`tab-button ${activeTab === 'add-product' ? 'active' : ''}`}
          onClick={() => setActiveTab('add-product')}
        >
          <FaPlus /> Add Product
        </button>
        <button 
          className={`tab-button ${activeTab === 'products' ? 'active' : ''}`}
          onClick={() => setActiveTab('products')}
        >
          <FaBox /> Product Management
        </button>
        {isSuperAdmin && (
          <button 
            className={`tab-button ${activeTab === 'admins' ? 'active' : ''}`}
            onClick={() => setActiveTab('admins')}
          >
            <FaUsers /> Admin Management
          </button>
        )}
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
              <p className="stat-number">₹{stats.totalRevenue.toFixed(2)}</p>
            </div>
          </div>

          {/* Recent Activity */}
          <div className="recent-activity-section">
            <div className="section-header">
              <h2>Recent Activity</h2>
            </div>
            
            <div className="activity-list">
              {activities.map(activity => (
                <div key={activity.id} className="activity-item">
                  <div className={`activity-icon ${activity.type}-icon`}>
                    {activity.type === 'order' && <FaDollarSign />}
                    {activity.type === 'product' && <FaBox />}
                    {activity.type === 'admin' && <FaUsers />}
                  </div>
                  <div className="activity-content">
                    <p className="activity-text">{activity.text}</p>
                    <p className="activity-time">{activity.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </>
      )}

      {/* Add Product Tab */}
      {activeTab === 'add-product' && (
        <div className="add-product-section">
          <h2>Add New Product</h2>
          
          <form className="product-form" onSubmit={handleProductSubmit}>
            <div className="form-group">
              <label htmlFor="name">Product Name</label>
              <input
                type="text"
                id="name"
                name="name"
                value={productData.name}
                onChange={handleProductInputChange}
                placeholder="Enter product name"
                required
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="price">Price (₹)</label>
              <input
                type="number"
                id="price"
                name="price"
                value={productData.price}
                onChange={handleProductInputChange}
                placeholder="Enter price"
                min="0"
                step="0.01"
                required
              />
            </div>
            
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
                  <option key={cat.value} value={cat.value}>
                    {cat.label}
                  </option>
                ))}
              </select>
            </div>
            
            <div className="form-group">
              <label htmlFor="stock">Stock Quantity</label>
              <input
                type="number"
                id="stock"
                name="stock"
                value={productData.stock}
                onChange={handleProductInputChange}
                placeholder="Enter available stock"
                min="0"
                required
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="image">Image URL</label>
              <input
                type="url"
                id="image"
                name="image"
                value={productData.image}
                onChange={handleProductInputChange}
                placeholder="Enter image URL"
                required
              />
            </div>
            
            <div className="form-group" style={{ gridColumn: '1 / -1' }}>
              <label htmlFor="description">Description</label>
              <textarea
                id="description"
                name="description"
                value={productData.description}
                onChange={handleProductInputChange}
                placeholder="Enter product description"
                rows="4"
                required
              ></textarea>
            </div>
            
            <button type="submit" className="submit-btn">
              <FaPlus /> Add Product
            </button>
          </form>
        </div>
      )}

      {/* Products Management Tab */}
      {activeTab === 'products' && (
        <ProductManagement businessId={currentUser?.id || currentUser?.businessId} />
      )}

      {/* Admin Management Tab - Only accessible to Super Admins */}
      {activeTab === 'admins' && isSuperAdmin && (
        <div className="admin-management-section">
          <h2>Admin Management</h2>
          
          {/* Super Admin badge and info */}
          <div className="super-admin-info">
            <FaShieldAlt className="shield-icon" />
            <p>You have Super Admin privileges to manage all admin accounts.</p>
          </div>
          
          {/* Add Admin Button */}
          <button className="add-admin-btn">
            <FaPlus /> Add New Admin
          </button>
          
          {loadingAdmins ? (
            <div className="loading-indicator">Loading admin data...</div>
          ) : (
            <div className="admin-table">
              <div className="admin-table-header">
                <div className="header-cell">Username</div>
                <div className="header-cell">Full Name</div>
                <div className="header-cell">Email</div>
                <div className="header-cell">Department</div>
                <div className="header-cell">Role</div>
                <div className="header-cell">Status</div>
                <div className="header-cell">Actions</div>
              </div>
              
              {admins.map(admin => (
                <div key={admin.id} className="admin-row">
                  <div className="cell">{admin.user.username}</div>
                  <div className="cell">{admin.user.fullName}</div>
                  <div className="cell">{admin.user.email}</div>
                  <div className="cell">{admin.department}</div>
                  <div className="cell">
                    {admin.superAdmin ? (
                      <span className="super-admin-role">
                        <FaShieldAlt /> Super Admin
                      </span>
                    ) : (
                      admin.user.roles.join(', ').replace('ROLE_', '')
                    )}
                  </div>
                  <div className="cell">
                    <span className={`status-badge ${admin.user.enabled ? 'active' : 'inactive'}`}>
                      {admin.user.enabled ? 'Active' : 'Inactive'}
                    </span>
                  </div>
                  <div className="cell actions">
                    <button className="edit-btn"><FaEdit /></button>
                    <button className={`status-btn ${admin.user.enabled ? 'deactivate' : 'activate'}`}>
                      {admin.user.enabled ? <FaTimes /> : <FaCheck />}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
      
      {/* Message for non-Super Admins trying to access admin tab */}
      {activeTab === 'admins' && !isSuperAdmin && (
        <div className="restricted-access">
          <FaLock className="lock-icon" />
          <h2>Restricted Access</h2>
          <p>Only Super Admins can manage administrator accounts.</p>
          <button 
            className="super-admin-access-btn"
            onClick={() => setShowSuperAdminLogin(true)}
          >
            <FaShieldAlt /> Request Super Admin Access
          </button>
        </div>
      )}
    </div>
  );
};

export default BusinessDashboard; 