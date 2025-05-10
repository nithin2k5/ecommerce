import React, { useState, useEffect } from 'react';
import { FaSearch, FaUserEdit, FaUserSlash, FaUserPlus, FaCheck, FaLock, FaLockOpen } from 'react-icons/fa';
import './UserManagement.css';
import { toast } from 'react-toastify';
import authService from '../../services/auth.service';

const UserManagement = ({ businessId }) => {
  const [users, setUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [modalMode, setModalMode] = useState('add'); // 'add', 'edit'
  const [selectedUser, setSelectedUser] = useState(null);
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    fullName: '',
    role: 'USER',
    enabled: true,
    password: ''
  });
  
  // Roles available in the system
  const availableRoles = [
    { value: 'USER', label: 'Customer' },
    { value: 'BUSINESS_STAFF', label: 'Staff Member' },
    { value: 'BUSINESS_MANAGER', label: 'Manager' },
    { value: 'BUSINESS_ADMIN', label: 'Business Admin' }
  ];

  // Fetch users when component mounts
  useEffect(() => {
    fetchUsers();
  }, [businessId]);

  // Fetch business users
  const fetchUsers = async () => {
    setIsLoading(true);
    setError(null);
    try {
      // Normally would call API, using mock data for now
      const mockUsers = [
        {
          id: 1,
          username: 'customer1',
          email: 'customer1@example.com',
          fullName: 'Regular Customer',
          role: 'USER',
          enabled: true,
          lastLogin: '2023-05-15T12:30:00',
          orders: 12,
          totalSpent: 5499.99
        },
        {
          id: 2,
          username: 'manager1',
          email: 'manager@business.com',
          fullName: 'Business Manager',
          role: 'BUSINESS_MANAGER',
          enabled: true,
          lastLogin: '2023-05-16T09:20:00',
          managedOrders: 45,
          department: 'Operations'
        },
        {
          id: 3,
          username: 'staff1',
          email: 'staff1@business.com',
          fullName: 'Sales Staff',
          role: 'BUSINESS_STAFF',
          enabled: true,
          lastLogin: '2023-05-16T10:15:00',
          department: 'Sales',
          processedOrders: 23
        },
        {
          id: 4,
          username: 'disableduser',
          email: 'disabled@example.com',
          fullName: 'Disabled Account',
          role: 'USER',
          enabled: false,
          lastLogin: '2023-04-20T14:30:00',
          orders: 3,
          totalSpent: 899.50
        },
        {
          id: 5,
          username: 'premiumcustomer',
          email: 'premium@example.com',
          fullName: 'Premium Customer',
          role: 'USER',
          enabled: true,
          lastLogin: '2023-05-16T11:45:00',
          orders: 35,
          totalSpent: 12599.99,
          membershipTier: 'Premium'
        }
      ];
      
      setUsers(mockUsers);
      // In production would use: 
      // const response = await userService.getUsersByBusiness(businessId);
      // setUsers(response);
    } catch (err) {
      console.error('Error fetching users:', err);
      setError('Failed to load users. Please try again later.');
      toast.error('Failed to load users');
    } finally {
      setIsLoading(false);
    }
  };

  // Handle search
  const handleSearch = () => {
    if (!searchQuery.trim()) {
      fetchUsers();
      return;
    }
    
    const filtered = users.filter(user => 
      user.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.fullName.toLowerCase().includes(searchQuery.toLowerCase())
    );
    
    setUsers(filtered);
  };

  // Handle opening modal for adding a new user
  const handleAddNew = () => {
    setModalMode('add');
    setFormData({
      username: '',
      email: '',
      fullName: '',
      role: 'USER',
      enabled: true,
      password: ''
    });
    setShowModal(true);
  };

  // Handle opening modal for editing a user
  const handleEdit = (user) => {
    setModalMode('edit');
    setSelectedUser(user);
    setFormData({
      username: user.username,
      email: user.email,
      fullName: user.fullName,
      role: user.role,
      enabled: user.enabled,
      password: '' // Don't fill password for security
    });
    setShowModal(true);
  };

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  // Handle checkbox changes
  const handleCheckboxChange = (e) => {
    const { name, checked } = e.target;
    setFormData({
      ...formData,
      [name]: checked
    });
  };

  // Handle toggling user status (enable/disable)
  const handleToggleStatus = async (user) => {
    if (window.confirm(`Are you sure you want to ${user.enabled ? 'disable' : 'enable'} this user account?`)) {
      setIsLoading(true);
      try {
        // In production would call API
        // await userService.toggleUserStatus(user.id, !user.enabled);
        
        // Update local state for demo
        setUsers(users.map(u => 
          u.id === user.id ? { ...u, enabled: !u.enabled } : u
        ));
        
        toast.success(`User ${user.enabled ? 'disabled' : 'enabled'} successfully`);
      } catch (err) {
        console.error('Error toggling user status:', err);
        toast.error('Failed to update user status');
      } finally {
        setIsLoading(false);
      }
    }
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    setIsLoading(true);
    try {
      if (modalMode === 'add') {
        // Add new user
        // In production, would call API:
        // const newUser = await userService.createUser(formData, businessId);
        
        // Simulate for demo
        const newUser = {
          id: users.length + 1,
          ...formData,
          lastLogin: null,
          orders: 0,
          totalSpent: 0
        };
        
        setUsers([...users, newUser]);
        toast.success('User added successfully');
      } else if (modalMode === 'edit') {
        // Update existing user
        // In production would call API:
        // const updatedUser = await userService.updateUser(selectedUser.id, formData);
        
        // Update local state for demo
        const updatedUser = {
          ...selectedUser,
          username: formData.username,
          email: formData.email,
          fullName: formData.fullName,
          role: formData.role,
          enabled: formData.enabled
        };
        
        setUsers(users.map(user => 
          user.id === selectedUser.id ? updatedUser : user
        ));
        
        toast.success('User updated successfully');
      }
      
      setShowModal(false);
    } catch (err) {
      console.error('Error saving user:', err);
      toast.error(err.message || 'Failed to save user');
    } finally {
      setIsLoading(false);
    }
  };

  // Get role label from value
  const getRoleLabel = (roleValue) => {
    const role = availableRoles.find(r => r.value === roleValue);
    return role ? role.label : roleValue;
  };

  return (
    <div className="user-management">
      <div className="section-header">
        <h2>User Management</h2>
        <div className="user-actions">
          <div className="search-box">
            <input
              type="text"
              placeholder="Search by name, email, username"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
            />
            <button onClick={handleSearch} disabled={isLoading}><FaSearch /></button>
          </div>
          <button className="add-user-btn" onClick={handleAddNew} disabled={isLoading}>
            <FaUserPlus /> Add User
          </button>
        </div>
      </div>

      {error && <div className="error-message">{error}</div>}

      {/* User Table */}
      <div className="user-table-container">
        {isLoading ? (
          <div className="loading">Loading users...</div>
        ) : users.length === 0 ? (
          <div className="no-users">No users found.</div>
        ) : (
          <table className="user-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Username</th>
                <th>Full Name</th>
                <th>Email</th>
                <th>Role</th>
                <th>Status</th>
                <th>Last Login</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map(user => (
                <tr key={user.id} className={!user.enabled ? 'disabled-user' : ''}>
                  <td>{user.id}</td>
                  <td>{user.username}</td>
                  <td>{user.fullName}</td>
                  <td>{user.email}</td>
                  <td>
                    <span className={`role-badge role-${user.role.toLowerCase()}`}>
                      {getRoleLabel(user.role)}
                    </span>
                  </td>
                  <td>
                    <span className={`status-badge ${user.enabled ? 'active' : 'inactive'}`}>
                      {user.enabled ? 'Active' : 'Inactive'}
                    </span>
                  </td>
                  <td>{user.lastLogin ? new Date(user.lastLogin).toLocaleString() : 'Never'}</td>
                  <td>
                    <div className="action-buttons">
                      <button 
                        className="edit-btn" 
                        title="Edit User"
                        onClick={() => handleEdit(user)}
                        disabled={isLoading}
                      >
                        <FaUserEdit />
                      </button>
                      <button 
                        className={`status-btn ${user.enabled ? 'disable' : 'enable'}`}
                        title={user.enabled ? 'Disable User' : 'Enable User'}
                        onClick={() => handleToggleStatus(user)}
                        disabled={isLoading}
                      >
                        {user.enabled ? <FaUserSlash /> : <FaCheck />}
                      </button>
                      <button 
                        className="reset-btn"
                        title="Reset Password"
                        disabled={isLoading}
                      >
                        {user.enabled ? <FaLockOpen /> : <FaLock />}
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* User Modal (Add/Edit) */}
      {showModal && (
        <div className="modal-overlay">
          <div className="user-modal">
            <h3>{modalMode === 'add' ? 'Add New User' : 'Edit User'}</h3>
            
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label htmlFor="username">Username</label>
                <input
                  type="text"
                  id="username"
                  name="username"
                  value={formData.username}
                  onChange={handleInputChange}
                  required
                />
              </div>
              
              <div className="form-group">
                <label htmlFor="email">Email</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  required
                />
              </div>
              
              <div className="form-group">
                <label htmlFor="fullName">Full Name</label>
                <input
                  type="text"
                  id="fullName"
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleInputChange}
                  required
                />
              </div>
              
              <div className="form-group">
                <label htmlFor="role">Role</label>
                <select
                  id="role"
                  name="role"
                  value={formData.role}
                  onChange={handleInputChange}
                  required
                >
                  {availableRoles.map(role => (
                    <option key={role.value} value={role.value}>
                      {role.label}
                    </option>
                  ))}
                </select>
              </div>
              
              {modalMode === 'add' && (
                <div className="form-group">
                  <label htmlFor="password">Password</label>
                  <input
                    type="password"
                    id="password"
                    name="password"
                    value={formData.password}
                    onChange={handleInputChange}
                    required={modalMode === 'add'}
                    minLength="6"
                  />
                  {modalMode === 'add' && (
                    <div className="password-hint">Must be at least 6 characters long</div>
                  )}
                </div>
              )}
              
              <div className="form-group checkbox-group">
                <label>
                  <input
                    type="checkbox"
                    name="enabled"
                    checked={formData.enabled}
                    onChange={handleCheckboxChange}
                  />
                  Account Active
                </label>
              </div>
              
              <div className="modal-actions">
                <button type="submit" disabled={isLoading}>
                  {isLoading ? 'Processing...' : modalMode === 'add' ? 'Add User' : 'Update User'}
                </button>
                <button type="button" onClick={() => setShowModal(false)} disabled={isLoading}>
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

export default UserManagement; 