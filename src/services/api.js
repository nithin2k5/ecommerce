/**
 * API Service for making HTTP requests
 */
const API_URL = 'http://localhost:8080';

/**
 * Handles API errors and transforms them into a standard format
 */
const handleApiError = async (response) => {
  // Try to get error details from response
  let errorDetails;
  try {
    errorDetails = await response.json();
  } catch (e) {
    errorDetails = { message: 'Unknown error occurred' };
  }
  
  // Create a standardized error object
  const error = new Error(errorDetails.message || `Error: ${response.status}`);
  error.status = response.status;
  error.details = errorDetails;
  throw error;
};

/**
 * Makes an API request with proper error handling
 */
const apiRequest = async (endpoint, options = {}) => {
  try {
    const url = `${API_URL}${endpoint}`;
    console.log(`Making ${options.method || 'GET'} request to: ${url}`);
    
    // Set default headers
    const headers = {
      'Content-Type': 'application/json',
      ...options.headers
    };
    
    // Make the request
    const response = await fetch(url, {
      ...options,
      headers
    });
    
    console.log(`Response status: ${response.status}`);
    
    // Handle error responses
    if (!response.ok) {
      return handleApiError(response);
    }
    
    // Parse JSON response
    const data = await response.json();
    return data;
  } catch (error) {
    // Handle network errors or JSON parsing errors
    if (!error.status) {
      console.error('Network or parsing error:', error);
      error.message = 'Unable to connect to the server. Please check your internet connection.';
    }
    throw error;
  }
};

// API endpoints for auth/registration
const authApi = {
  registerUser: (userData) => {
    return apiRequest('/api/register/user', {
      method: 'POST',
      body: JSON.stringify(userData)
    });
  },
  
  registerBusiness: (businessData) => {
    return apiRequest('/api/register/business', {
      method: 'POST',
      body: JSON.stringify(businessData)
    });
  },
  
  login: (credentials) => {
    return apiRequest('/api/auth/login', {
      method: 'POST',
      body: JSON.stringify(credentials)
    });
  },
  
  testConnection: () => {
    return apiRequest('/api/test/status');
  }
};

export { authApi }; 