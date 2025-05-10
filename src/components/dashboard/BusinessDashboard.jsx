import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import './BusinessDashboard.css';
import ProductManagement from './ProductManagement';
import UserManagement from './UserManagement';
import BusinessStatistics from './BusinessStatistics';
import authService from '../../services/auth.service';
import adminService from '../../services/admin.service';
import { 
  FaChartLine, 
  FaBox, 
  FaUsers, 
  FaDollarSign, 
  FaPlus, 
  FaUserCog, 
  FaEdit, 
  FaCheck, 
  FaTimes, 
  FaShieldAlt, 
  FaLock, 
  FaTachometerAlt, 
  FaShoppingCart, 
  FaTags, 
  FaSignOutAlt, 
  FaBell, 
  FaListAlt, 
  FaChartBar, 
  FaCog,
  FaBars,
  FaKey
} from 'react-icons/fa';
import { toast } from 'react-toastify';

const BusinessDashboard = () => {
  const navigate = useNavigate();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [isSuperAdmin, setIsSuperAdmin] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [unreadNotifications, setUnreadNotifications] = useState(0);
  const [showNotifications, setShowNotifications] = useState(false);
  
  // Mock data for dashboard
  const [stats, setStats] = useState({
    totalAdmins: 5,
    totalProducts: 128,
    totalOrders: 213,
    totalRevenue: 15499.99,
    lowStockItems: 8,
    ordersToday: 12,
    monthlyGrowth: 14.5,
    topSellingCategory: 'Electronics'
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

  // Mock data for order statistics
  const [orderStats, setOrderStats] = useState({
    pending: 15,
    processing: 8,
    shipped: 12,
    delivered: 178
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

          // Simulate loading notifications
          setTimeout(() => {
            setNotifications([
              { id: 1, text: 'New order #ORD-2025 received', time: '3 minutes ago', read: false },
              { id: 2, text: 'Low stock alert: iPhone 14 Pro (5 remaining)', time: '1 hour ago', read: false },
              { id: 3, text: 'Order #ORD-2023 was delivered', time: '2 hours ago', read: true },
              { id: 4, text: 'New review received (4.5 stars)', time: '1 day ago', read: true }
            ]);
            setUnreadNotifications(2);
          }, 1000);
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

  // Redirect non-super admin users from restricted tabs
  useEffect(() => {
    // If user is not a super admin and tries to access restricted tabs
    if (!isSuperAdmin && ['users', 'admins', 'settings'].includes(activeTab)) {
      setActiveTab('overview');
    }
  }, [isSuperAdmin, activeTab]);

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

  const handleLogout = () => {
    authService.logout();
    navigate('/business-login');
  };

  const handleProductInputChange = (e) => {
    const { name, value } = e.target;
    setProductData({
      ...productData,
      [name]: value
    });
  };

  const handleSuperAdminInputChange = (e) => {
    const { name, value } = e.target;
    setSuperAdminCredentials({
      ...superAdminCredentials,
      [name]: value
    });
  };

  const handleSuperAdminLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      const response = await adminService.superAdminLogin(
        currentUser.username,
        superAdminCredentials.username,
        superAdminCredentials.password
      );
      
      if (response.data) {
        setIsSuperAdmin(true);
        
        // If the user object doesn't have roles array, initialize it
        if (!currentUser.roles) {
          currentUser.roles = [];
        }
        
        // Add SUPER_ADMIN role if not already there
        if (!currentUser.roles.includes('SUPER_ADMIN')) {
          const updatedUser = {
            ...currentUser,
            roles: [...currentUser.roles, 'SUPER_ADMIN']
          };
          setCurrentUser(updatedUser);
          
          // Update in local storage
          localStorage.setItem('user', JSON.stringify(updatedUser));
        }
        
        setShowSuperAdminLogin(false);
        
        // Set active tab to overview to help user see the new available tabs
        setActiveTab('overview');
        
        toast.success(response.data.message || 'Super Admin access granted! You now have access to all features.');
        
        // Add a slight delay to show the additional tabs notification
        setTimeout(() => {
          toast.info('New tabs unlocked: Users, Admins and Settings are now available in the navigation bar.');
        }, 1500);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Invalid Super Admin credentials!');
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
    toast.success('Product added successfully!');
  };

  // Get the business ID from the current user
  const getBusinessId = () => {
    return currentUser?.businessId || '1';  // Default to 1 for mockup
  };
  
  // Mark all notifications as read
  const markAllNotificationsAsRead = () => {
    setNotifications(notifications.map(notif => ({ ...notif, read: true })));
    setUnreadNotifications(0);
  };

  // If loading or authentication error
  if (loading) {
    return (
      <div className="dashboard-loading">
        <p>Loading dashboard...</p>
      </div>
    );
  }
  
  if (error) {
    return (
      <div className="auth-error">
        <h2>Authentication Error</h2>
        <p>{error}</p>
        <button className="login-redirect-btn" onClick={() => navigate('/business-login')}>
          Go to Login
        </button>
      </div>
    );
  }

  return (
    <div className="business-dashboard simplified">
      {/* Main Content */}
      <div className="dashboard-content full-width">
        {/* Top Navigation Bar */}
        <div className="dashboard-topbar">
          <div className="topbar-title">
            <h1><FaTachometerAlt /> Business Dashboard</h1>
          </div>
          
          <div className="topbar-actions">
            {/* Navigation Tabs */}
            <div className="topbar-tabs">
              <button 
                className={`tab-button ${activeTab === 'overview' ? 'active' : ''}`}
                onClick={() => setActiveTab('overview')}
              >
                <FaChartLine /> Overview
              </button>
              <button 
                className={`tab-button ${activeTab === 'products' ? 'active' : ''}`}
                onClick={() => setActiveTab('products')}
              >
                <FaBox /> Products
              </button>
              {isSuperAdmin && (
                <>
                  <button 
                    className={`tab-button ${activeTab === 'users' ? 'active' : ''}`}
                    onClick={() => setActiveTab('users')}
                  >
                    <FaUsers /> Users
                  </button>
                  <button 
                    className={`tab-button ${activeTab === 'admins' ? 'active' : ''}`}
                    onClick={() => setActiveTab('admins')}
                  >
                    <FaUserCog /> Admins
                  </button>
                  <button 
                    className={`tab-button ${activeTab === 'settings' ? 'active' : ''}`}
                    onClick={() => setActiveTab('settings')}
                  >
                    <FaCog /> Settings
                  </button>
                </>
              )}
            </div>

            {/* Notification Center */}
            <div className="notification-center">
              <button 
                className="notification-btn" 
                onClick={() => setShowNotifications(!showNotifications)}
                title="Notifications"
              >
                <FaBell />
                {unreadNotifications > 0 && (
                  <span className="notification-badge">{unreadNotifications}</span>
                )}
              </button>
              
              {showNotifications && (
                <div className="notification-dropdown">
                  <div className="notification-header">
                    <h3>Notifications</h3>
                    <button onClick={markAllNotificationsAsRead}>Mark all as read</button>
                  </div>
                  <div className="notification-list">
                    {notifications.length === 0 ? (
                      <div className="no-notifications">
                        <p>No notifications yet</p>
                      </div>
                    ) : (
                      notifications.map(notification => (
                        <div 
                          key={notification.id} 
                          className={`notification-item ${!notification.read ? 'unread' : ''}`}
                        >
                          <div className="notification-content">
                            <p>{notification.text}</p>
                            <span className="notification-time">{notification.time}</span>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              )}
            </div>

            {isSuperAdmin && (
              <div className="super-admin-badge">
                <FaShieldAlt /> Super Admin
              </div>
            )}
            
            {!isSuperAdmin && (
              <button 
                className="super-admin-access-btn" 
                onClick={() => setShowSuperAdminLogin(true)}
              >
                <FaShieldAlt /> Super Admin Access
              </button>
            )}
            
            <div className="user-info">
              <span className="username">{currentUser?.username || 'User'}</span>
            </div>
            
            <button className="logout-btn-small" onClick={handleLogout}>
              <FaSignOutAlt />
            </button>
          </div>
        </div>

        {/* Dashboard Content */}
        <div className="dashboard-main">
          {/* Overview Tab */}
          {activeTab === 'overview' && (
            <div className="dashboard-overview">
              <BusinessStatistics businessId={getBusinessId()} />
            </div>
          )}

          {/* Products Tab */}
          {activeTab === 'products' && (
            <div className="product-management-tab">
              <ProductManagement businessId={getBusinessId()} />
            </div>
          )}
          
          {/* Users Tab - Only for Super Admins */}
          {activeTab === 'users' && isSuperAdmin && (
            <div className="user-management-tab">
              <UserManagement businessId={getBusinessId()} />
            </div>
          )}

          {/* Admins Tab - Only for Super Admins */}
          {activeTab === 'admins' && isSuperAdmin && (
            <div className="admin-management-section">
              <div className="section-header">
                <h2>Admin Management</h2>
                <button className="add-admin-btn">
                  <FaUserCog /> Add New Admin
                </button>
              </div>
              
              <div className="admins-table-container">
                {loadingAdmins ? (
                  <div className="loading-indicator">Loading admin data...</div>
                ) : admins.length > 0 ? (
                  <table className="admins-table">
                    <thead>
                      <tr>
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
                          <td>{admin.username}</td>
                          <td>{admin.email}</td>
                          <td>{admin.role}</td>
                          <td>
                            <span className={`status-badge ${admin.active ? 'active' : 'inactive'}`}>
                              {admin.active ? 'Active' : 'Inactive'}
                            </span>
                          </td>
                          <td>
                            <div className="action-buttons">
                              <button className="edit-btn" title="Edit Admin">
                                <FaEdit />
                              </button>
                              {admin.active ? (
                                <button className="status-btn deactivate" title="Deactivate">
                                  <FaTimes />
                                </button>
                              ) : (
                                <button className="status-btn activate" title="Activate">
                                  <FaCheck />
                                </button>
                              )}
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                ) : (
                  <div className="no-data">No admins found</div>
                )}
              </div>
            </div>
          )}

          {/* Show restricted access message for non-super admins trying to access restricted tabs */}
          {(['users', 'admins', 'settings'].includes(activeTab) && !isSuperAdmin) && (
            <div className="restricted-access">
              <div className="lock-icon">
                <FaLock />
              </div>
              <h2>Super Admin Access Required</h2>
              <p>You need Super Admin privileges to access this section.</p>
              <button 
                className="super-admin-access-btn"
                onClick={() => setShowSuperAdminLogin(true)}
              >
                <FaShieldAlt /> Get Super Admin Access
              </button>
            </div>
          )}
          
          {/* Settings Tab - Only for Super Admins */}
          {activeTab === 'settings' && isSuperAdmin && (
            <div className="settings-tab">
              <div className="section-header">
                <h2>Account Settings</h2>
              </div>
              
              <div className="settings-grid">
                <div className="settings-card">
                  <h3>Profile Information</h3>
                  <p>Update your business details and profile information</p>
                  <button className="settings-action-btn">Manage Profile</button>
                </div>
                
                <div className="settings-card">
                  <h3>Security Settings</h3>
                  <p>Change password and security preferences</p>
                  <button className="settings-action-btn">Security Settings</button>
                </div>
                
                <div className="settings-card">
                  <h3>Admin Privileges</h3>
                  <p>Manage admin access and permissions</p>
                  <button className="settings-action-btn">Admin Settings</button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
      
      {/* Super Admin Login Modal */}
      {showSuperAdminLogin && (
        <div className="modal-overlay">
          <div className="super-admin-login">
            <h3>Super Admin Access</h3>
            
            <div className="super-admin-info">
              <FaShieldAlt className="shield-icon" />
              <p>Enter your Super Admin credentials to unlock full dashboard functionality including Users, Admin Management, and Settings.</p>
            </div>
            
            <form onSubmit={handleSuperAdminLogin}>
              <div className="form-group">
                <label>Super Admin Username</label>
                <input
                  type="text"
                  name="username"
                  value={superAdminCredentials.username}
                  onChange={handleSuperAdminInputChange}
                  required
                  placeholder="Enter super admin username"
                />
              </div>
              
              <div className="form-group">
                <label>Super Admin Password</label>
                <input
                  type="password"
                  name="password"
                  value={superAdminCredentials.password}
                  onChange={handleSuperAdminInputChange}
                  required
                  placeholder="Enter super admin password"
                />
              </div>
              
              <div className="super-admin-note">
                <p>Default credentials for testing: <strong>superadmin</strong> / <strong>password123</strong></p>
              </div>
              
              <div className="form-actions">
                <button 
                  type="submit" 
                  className="super-admin-submit"
                  disabled={isLoading}
                >
                  {isLoading ? 'Verifying...' : 'Access Super Admin Dashboard'}
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
        </div>
      )}
    </div>
  );
};

export default BusinessDashboard; 