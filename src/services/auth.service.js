import axios from 'axios';

const API_URL = 'http://localhost:8080/api/auth/';

// Configure axios with a timeout
const axiosInstance = axios.create({
  baseURL: API_URL,
  timeout: 5000, // 5 second timeout
  withCredentials: true, // Include credentials for CORS
  headers: {
    'Content-Type': 'application/json'
  }
});

class AuthService {
  login(username, password) {
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
        // Handle timeout or network errors
        if (error.code === 'ECONNABORTED' || !error.response) {
          throw new Error('Unable to connect to authentication server. Please try again later.');
        }
        throw error;
      });
  }

  logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  }

  register(username, email, password, fullName) {
    return axiosInstance
      .post('signup', {
        username,
        email,
        password,
        fullName
      })
      .catch(error => {
        // Handle timeout or network errors
        if (error.code === 'ECONNABORTED' || !error.response) {
          throw new Error('Unable to connect to authentication server. Please try again later.');
        }
        throw error;
      });
  }

  registerBusiness(username, email, password, fullName, businessName, registrationCode) {
    return axiosInstance
      .post('business/signup', {
        username,
        email,
        password,
        fullName,
        businessName,
        registrationCode
      })
      .catch(error => {
        // Handle timeout or network errors
        if (error.code === 'ECONNABORTED' || !error.response) {
          throw new Error('Unable to connect to authentication server. Please try again later.');
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
  
  // Test connection to the server
  async testConnection() {
    try {
      await axiosInstance.get('status', { timeout: 3000 });
      return true;
    } catch (error) {
      return false;
    }
  }
}

export default new AuthService(); 