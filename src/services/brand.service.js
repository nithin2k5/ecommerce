/**
 * Brand Service for making API calls related to brands
 */
import { authApi } from './api';

const API_URL = 'http://localhost:8080';

/**
 * Makes an authenticated API request
 */
const authenticatedRequest = async (endpoint, options = {}) => {
  try {
    const token = localStorage.getItem('token');
    
    // Set default headers
    const headers = {
      'Content-Type': 'application/json',
      ...(token && { 'Authorization': `Bearer ${token}` }),
      ...options.headers
    };
    
    const url = `${API_URL}${endpoint}`;
    console.log(`Making ${options.method || 'GET'} request to: ${url}`);
    
    // Make the request
    const response = await fetch(url, {
      ...options,
      headers
    });
    
    console.log(`Response status: ${response.status}`);
    
    // Handle error responses
    if (!response.ok) {
      // Try to get error details from response
      let errorDetails;
      try {
        errorDetails = await response.json();
      } catch (e) {
        errorDetails = { message: 'Unknown error occurred' };
      }
      
      const error = new Error(errorDetails.message || `Error: ${response.status}`);
      error.status = response.status;
      error.details = errorDetails;
      throw error;
    }
    
    // For 204 No Content
    if (response.status === 204) {
      return null;
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

// Brand API service for managing product brands
export const brandApi = {
  /**
   * Get all brands
   * @returns {Promise<Array>} List of all brands
   */
  getAllBrands: async () => {
    try {
      return await authenticatedRequest('/api/brands');
    } catch (error) {
      console.error('Error fetching brands:', error);
      throw error;
    }
  },

  /**
   * Get a specific brand by ID
   * @param {string} id - The brand ID
   * @returns {Promise<Object>} Brand data
   */
  getBrandById: async (id) => {
    try {
      return await authenticatedRequest(`/api/brands/${id}`);
    } catch (error) {
      console.error(`Error fetching brand ${id}:`, error);
      throw error;
    }
  },

  /**
   * Get all brands associated with a business
   * @param {string} businessId - The business ID
   * @returns {Promise<Array>} List of business brands
   */
  getBrandsByBusiness: async (businessId) => {
    try {
      return await authenticatedRequest(`/api/brands/business/${businessId}`);
    } catch (error) {
      console.error(`Error fetching brands for business ${businessId}:`, error);
      throw error;
    }
  },

  /**
   * Create a new brand
   * @param {Object} brandData - The brand data to create
   * @param {string} businessId - The business ID for the brand
   * @returns {Promise<Object>} The created brand
   */
  createBrand: async (brandData, businessId) => {
    try {
      return await authenticatedRequest(`/api/brands/business/${businessId}`, {
        method: 'POST',
        body: JSON.stringify(brandData)
      });
    } catch (error) {
      console.error('Error creating brand:', error);
      throw error;
    }
  },

  /**
   * Update an existing brand
   * @param {string} id - The brand ID to update
   * @param {Object} brandData - The updated brand data
   * @returns {Promise<Object>} The updated brand
   */
  updateBrand: async (id, brandData) => {
    try {
      return await authenticatedRequest(`/api/brands/${id}`, {
        method: 'PUT',
        body: JSON.stringify(brandData)
      });
    } catch (error) {
      console.error(`Error updating brand ${id}:`, error);
      throw error;
    }
  },

  /**
   * Delete a brand
   * @param {string} id - The brand ID to delete
   */
  deleteBrand: async (id) => {
    try {
      await authenticatedRequest(`/api/brands/${id}`, {
        method: 'DELETE'
      });
    } catch (error) {
      console.error(`Error deleting brand ${id}:`, error);
      throw error;
    }
  }
}; 