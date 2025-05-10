/**
 * Product Service for making API calls related to products
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

// API endpoints for products
const productApi = {
  // Get all products
  getAllProducts: () => {
    return authenticatedRequest('/api/products');
  },
  
  // Get a single product by ID
  getProductById: (id) => {
    return authenticatedRequest(`/api/products/${id}`);
  },
  
  // Create a new product
  createProduct: (product, businessId, categoryId) => {
    let endpoint = `/api/products?businessId=${businessId}`;
    if (categoryId) {
      endpoint += `&categoryId=${categoryId}`;
    }
    
    return authenticatedRequest(endpoint, {
      method: 'POST',
      body: JSON.stringify(product)
    });
  },
  
  // Update an existing product
  updateProduct: (id, product) => {
    return authenticatedRequest(`/api/products/${id}`, {
      method: 'PUT',
      body: JSON.stringify(product)
    });
  },
  
  // Update product discount
  updateProductDiscount: (id, discountPercentage) => {
    return authenticatedRequest(`/api/products/${id}/discount`, {
      method: 'PATCH',
      body: JSON.stringify({ discountPercentage })
    });
  },
  
  // Delete a product
  deleteProduct: (id) => {
    return authenticatedRequest(`/api/products/${id}`, {
      method: 'DELETE'
    });
  },
  
  // Toggle product visibility (hide/show)
  toggleProductVisibility: (id, hidden) => {
    return authenticatedRequest(`/api/products/${id}/visibility`, {
      method: 'PATCH',
      body: JSON.stringify({ hidden })
    });
  },
  
  // Get products by business
  getProductsByBusiness: (businessId) => {
    return authenticatedRequest(`/api/products/business/${businessId}`);
  },
  
  // Get visible products by business
  getVisibleProductsByBusiness: (businessId) => {
    return authenticatedRequest(`/api/products/business/${businessId}/visible`);
  },
  
  // Get products by category
  getProductsByCategory: (categoryId) => {
    return authenticatedRequest(`/api/products/category/${categoryId}`);
  },
  
  // Get visible products by category
  getVisibleProductsByCategory: (categoryId) => {
    return authenticatedRequest(`/api/products/category/${categoryId}/visible`);
  },
  
  // Search products
  searchProducts: (keyword) => {
    return authenticatedRequest(`/api/products/search?keyword=${encodeURIComponent(keyword)}`);
  },
  
  // Get low stock products
  getLowStockProducts: (businessId, threshold = 5) => {
    return authenticatedRequest(`/api/products/business/${businessId}/low-stock?threshold=${threshold}`);
  }
};

// API endpoints for categories
const categoryApi = {
  // Get all categories
  getAllCategories: () => {
    return authenticatedRequest('/api/categories');
  },
  
  // Get a single category by ID
  getCategoryById: (id) => {
    return authenticatedRequest(`/api/categories/${id}`);
  },
  
  // Create a new category
  createCategory: (category) => {
    return authenticatedRequest('/api/categories', {
      method: 'POST',
      body: JSON.stringify(category)
    });
  },
  
  // Update an existing category
  updateCategory: (id, category) => {
    return authenticatedRequest(`/api/categories/${id}`, {
      method: 'PUT',
      body: JSON.stringify(category)
    });
  },
  
  // Delete a category
  deleteCategory: (id) => {
    return authenticatedRequest(`/api/categories/${id}`, {
      method: 'DELETE'
    });
  },
  
  // Search categories
  searchCategories: (keyword) => {
    return authenticatedRequest(`/api/categories/search?keyword=${encodeURIComponent(keyword)}`);
  }
};

export { productApi, categoryApi }; 