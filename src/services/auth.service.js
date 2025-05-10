import axios from 'axios';

const API_URL = 'http://localhost:8080/api/auth/';

// Configure axios with a timeout
const axiosInstance = axios.create({
  baseURL: API_URL,
  timeout: 8000, // Increase timeout to 8 seconds
  withCredentials: true, // Include credentials for CORS
  headers: {
    'Content-Type': 'application/json'
  }
});

// For use during development or when server is unavailable
const MOCK_USER = {
  id: 1,
  username: "testuser",
  email: "test@example.com",
  fullName: "Test User",
  roles: ["ROLE_USER"],
  accessToken: "mock-jwt-token-for-development-only"
};

// Flag to enable mock mode when server is unavailable
let useMockData = false;

class AuthService {
  // Test connection to the server
  async testConnection() {
    try {
      const response = await axiosInstance.get('status', { timeout: 5000 });
      console.log('Server connection successful', response);
      useMockData = false;
      return true;
    } catch (error) {
      console.error('Server connection failed:', error.message);
      // Auto-enable mock mode in development
      useMockData = process.env.NODE_ENV === 'development';
      return false;
    }
  }

  // Enable mock mode manually (for development)
  enableMockMode() {
    useMockData = true;
    console.log('Mock mode enabled for auth service');
    return true;
  }

  login(username, password) {
    // Use mock data if server is unavailable and in development mode
    if (useMockData && process.env.NODE_ENV === 'development') {
      console.log('Using mock login data');
      localStorage.setItem('token', MOCK_USER.accessToken);
      localStorage.setItem('user', JSON.stringify(MOCK_USER));
      return Promise.resolve(MOCK_USER);
    }

    return axiosInstance
      .post('signin', {
        username,
        password
      })
      .then(response => {
        if (response.data.accessToken) {
          localStorage.setItem('token', response.data.accessToken);
          localStorage.setItem('user', JSON.stringify(response.data));
        }
        return response.data;
      })
      .catch(error => {
        console.error('Login error:', error);
        // Handle timeout or network errors
        if (error.code === 'ECONNABORTED' || !error.response) {
          if (process.env.NODE_ENV === 'development') {
            // Auto fallback to mock mode in development
            this.enableMockMode();
            return this.login(username, password);
          } else {
            throw new Error('Unable to connect to authentication server. Please try again later.');
          }
        }
        throw error;
      });
  }

  logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  }

  register(username, email, password, fullName, addressInfo = null) {
    // Use mock data if server is unavailable and in development mode
    if (useMockData && process.env.NODE_ENV === 'development') {
      console.log('Using mock registration');
      return Promise.resolve({ 
        success: true, 
        message: "User registered successfully"
      });
    }

    const userData = {
      username,
      email,
      password,
      fullName
    };

    // Add address information if provided
    if (addressInfo) {
      // Check if we have any non-empty address info
      const hasAddressData = Object.values(addressInfo).some(value => value && value.trim() !== '');
      
      if (hasAddressData) {
        console.log('Including customer details in registration');
        // Add each non-empty field to userData
        Object.keys(addressInfo).forEach(key => {
          if (addressInfo[key] && addressInfo[key].trim() !== '') {
            userData[key] = addressInfo[key];
          }
        });
      }
    }

    console.log('Sending registration data:', JSON.stringify(userData));

    return axiosInstance
      .post('signup', userData)
      .then(response => {
        console.log('Registration response:', response);
        return response.data;
      })
      .catch(error => {
        console.error('Register error details:', error);
        
        // Handle timeout or network errors
        if (error.code === 'ECONNABORTED' || !error.response) {
          if (process.env.NODE_ENV === 'development') {
            // Auto fallback to mock mode in development
            this.enableMockMode();
            return this.register(username, email, password, fullName, addressInfo);
          } else {
            throw new Error('Unable to connect to authentication server. Please try again later.');
          }
        }
        throw error;
      });
  }

  registerBusiness(username, email, password, fullName, businessName, registrationCode) {
    // Use mock data if server is unavailable and in development mode
    if (useMockData && process.env.NODE_ENV === 'development') {
      console.log('Using mock business registration');
      return Promise.resolve({ 
        success: true, 
        message: "Business registered successfully"
      });
    }

    return axiosInstance
      .post('business/signup', {
        username,
        email,
        password,
        fullName,
        businessName,
        registrationCode
      })
      .then(response => {
        console.log('Business registration response:', response);
        return response.data;
      })
      .catch(error => {
        console.error('Business register error:', error);
        // Handle timeout or network errors
        if (error.code === 'ECONNABORTED' || !error.response) {
          if (process.env.NODE_ENV === 'development') {
            // Auto fallback to mock mode in development
            this.enableMockMode();
            return this.registerBusiness(username, email, password, fullName, businessName, registrationCode);
          } else {
            throw new Error('Unable to connect to authentication server. Please try again later.');
          }
        }
        throw error;
      });
  }

  getCurrentUser() {
    const userStr = localStorage.getItem('user');
    if (!userStr) return null;
    
    try {
      return JSON.parse(userStr);
    } catch (error) {
      console.error('Error parsing user data:', error);
      this.logout(); // Clear invalid data
      return null;
    }
  }

  getToken() {
    return localStorage.getItem('token');
  }

  isAuthenticated() {
    const token = this.getToken();
    return !!token;
  }

  hasRole(role) {
    const user = this.getCurrentUser();
    if (!user || !user.roles) {
      return false;
    }
    return user.roles.includes(role);
  }

  isAdmin() {
    return this.hasRole('ROLE_ADMIN');
  }

  isBusiness() {
    return this.hasRole('ROLE_BUSINESS');
  }

  isUser() {
    return this.hasRole('ROLE_USER');
  }

  // Add an authorization header to requests
  authHeader() {
    const token = this.getToken();
    if (token) {
      return { Authorization: 'Bearer ' + token };
    } else {
      return {};
    }
  }
}

export default new AuthService(); 