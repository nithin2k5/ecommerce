import axios from 'axios';
import authHeader from './auth-header';

const API_URL = 'http://localhost:8080/api/admin/';

// For mock data mode
const useMockData = process.env.REACT_APP_USE_MOCK_DATA === 'true' || true;

// Mock data for testing
const mockAdmins = [
  {
    id: 1,
    user: {
      id: 1,
      username: 'superadmin',
      email: 'superadmin@pazar.com',
      fullName: 'Super Admin',
      roles: ['ROLE_ADMIN', 'SUPER_ADMIN']
    },
    department: 'Administration',
    position: 'Chief Administrator',
    accessLevel: 100,
    lastLogin: '2023-05-01T12:00:00',
    createdAt: '2023-01-01T00:00:00',
    superAdmin: true
  },
  {
    id: 2,
    user: {
      id: 2,
      username: 'businessadmin',
      email: 'businessadmin@pazar.com',
      fullName: 'Business Admin',
      roles: ['ROLE_ADMIN', 'BUSINESS_ADMIN']
    },
    department: 'Business Operations',
    position: 'Business Admin Manager',
    accessLevel: 80,
    lastLogin: '2023-05-02T09:30:00',
    createdAt: '2023-01-02T00:00:00',
    superAdmin: false
  },
  {
    id: 3,
    user: {
      id: 3,
      username: 'fashionadmin',
      email: 'fashion@pazar.com',
      fullName: 'Fashion Admin',
      roles: ['ROLE_ADMIN']
    },
    department: 'Fashion',
    position: 'Fashion Category Manager',
    accessLevel: 60,
    lastLogin: '2023-05-03T10:15:00',
    createdAt: '2023-01-03T00:00:00',
    superAdmin: false
  },
  {
    id: 4,
    user: {
      id: 4,
      username: 'electronics',
      email: 'electronics@pazar.com',
      fullName: 'Electronics Admin',
      roles: ['ROLE_ADMIN']
    },
    department: 'Electronics',
    position: 'Electronics Category Manager',
    accessLevel: 60,
    lastLogin: '2023-05-03T11:45:00',
    createdAt: '2023-01-04T00:00:00',
    superAdmin: false
  },
  {
    id: 5,
    user: {
      id: 5,
      username: 'marketing',
      email: 'marketing@pazar.com',
      fullName: 'Marketing Team',
      roles: ['ROLE_ADMIN']
    },
    department: 'Marketing',
    position: 'Marketing Manager',
    accessLevel: 50,
    lastLogin: '2023-05-04T08:20:00',
    createdAt: '2023-01-05T00:00:00',
    superAdmin: false
  }
];

class AdminService {
  constructor() {
    this.mockMode = useMockData;
  }
  
  /**
   * Get all admin accounts (requires super admin privileges)
   */
  async getAllAdmins() {
    // Use mock data if in mock mode
    if (this.mockMode) {
      return Promise.resolve({ data: mockAdmins });
    }
    
    try {
      return await axios.get(API_URL + 'all', { headers: authHeader() });
    } catch (error) {
      console.error('Error fetching admins:', error);
      throw error;
    }
  }
  
  /**
   * Check if user has super admin privileges
   */
  async checkSuperAdmin(username) {
    // Use mock data if in mock mode
    if (this.mockMode) {
      const admin = mockAdmins.find(a => a.user.username === username);
      return Promise.resolve({ data: admin ? admin.superAdmin : false });
    }
    
    try {
      return await axios.get(API_URL + 'check-super-admin', {
        params: { username },
        headers: authHeader()
      });
    } catch (error) {
      console.error('Error checking super admin status:', error);
      return { data: false };
    }
  }
  
  /**
   * Request super admin privileges
   */
  async superAdminLogin(username, superAdminUsername, superAdminPassword) {
    // Use mock verification if in mock mode
    if (this.mockMode) {
      if (superAdminUsername === 'superadmin' && superAdminPassword === 'password123') {
        return Promise.resolve({
          data: { message: "Super Admin privileges granted successfully!" }
        });
      } else {
        return Promise.reject({
          response: { data: { message: "Invalid Super Admin credentials!" } }
        });
      }
    }
    
    try {
      return await axios.post(
        API_URL + 'super-admin-login',
        {
          username,
          superAdminUsername,
          superAdminPassword
        },
        { headers: authHeader() }
      );
    } catch (error) {
      console.error('Error with super admin login:', error);
      throw error;
    }
  }
  
  /**
   * Track admin login
   */
  async trackLogin(username) {
    // Skip in mock mode
    if (this.mockMode) {
      return Promise.resolve({ data: { message: "Login tracked successfully" } });
    }
    
    try {
      return await axios.post(
        API_URL + 'login-tracking',
        null,
        { 
          params: { username },
          headers: authHeader() 
        }
      );
    } catch (error) {
      console.error('Error tracking login:', error);
      // Non-critical error, so we just log it
      return { data: { message: "Login tracking failed" } };
    }
  }
}

export default new AdminService(); 