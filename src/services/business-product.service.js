/**
 * Business Product Service for making API calls related to authenticated business product operations
 */
import { authApi } from './api';
import authService from './auth.service';

const API_URL = 'http://localhost:8080';

// Mock data for testing and fallback
const MOCK_PRODUCTS = [
  {
    id: 1,
    title: "Sample Product 1",
    description: "This is a sample product description",
    price: 999.99,
    stock: 50,
    discountPercentage: 10,
    finalPrice: 899.99,
    imageUrls: ["https://via.placeholder.com/150"],
    hidden: false,
    currency: "INR",
    business: {
      id: 1,
      businessName: "Sample Business",
      brandName: "Sample Brand"
    },
    category: {
      id: 1,
      name: "Electronics"
    }
  },
  {
    id: 2,
    title: "Sample Product 2",
    description: "Another sample product",
    price: 499.99,
    stock: 25,
    discountPercentage: 0,
    finalPrice: 499.99,
    imageUrls: ["https://via.placeholder.com/150"],
    hidden: false,
    currency: "INR",
    business: {
      id: 1,
      businessName: "Sample Business",
      brandName: "Sample Brand"
    },
    category: {
      id: 2,
      name: "Fashion"
    }
  }
];

/**
 * Makes an authenticated API request
 */
const authenticatedRequest = async (endpoint, options = {}) => {
  try {
    const token = authService.getToken();
    
    if (!token) {
      console.error('No authentication token found in localStorage');
      throw new Error('Authentication required. Please log in again.');
    }
    
    // Log token for debugging (only first few characters)
    console.log(`Using token: ${token.substring(0, 15)}...`);
    
    // Set default headers
    const headers = {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
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
      
      // Special handling for auth errors
      if (response.status === 401 || response.status === 403) {
        console.error('Authentication error:', errorDetails);
        
        // Don't clear token, just report the error
        const error = new Error(errorDetails.error || errorDetails.message || 'Authentication failed. Please try again.');
        error.status = response.status;
        error.details = errorDetails;
        throw error;
      }
      
      const error = new Error(errorDetails.error || errorDetails.message || `Error: ${response.status}`);
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

/**
 * Makes an authenticated API request with fallback to mock data
 */
const safeAuthenticatedRequest = async (endpoint, options = {}, mockData = null) => {
  try {
    return await authenticatedRequest(endpoint, options);
  } catch (error) {
    console.error(`Error in API request to ${endpoint}:`, error);
    
    // If we have mock data, use it as fallback
    if (mockData && process.env.NODE_ENV === 'development') {
      console.log('Using mock data as fallback');
      return mockData;
    }
    
    // Otherwise rethrow the error
    throw error;
  }
};

// API endpoints for business products
const businessProductApi = {
  /**
   * Get all products for the authenticated business
   * @returns {Promise<Array>} List of products owned by the authenticated business
   */
  getMyProducts: () => {
    return safeAuthenticatedRequest('/api/business/products', {}, MOCK_PRODUCTS);
  },
  
  /**
   * Get a single product by ID if owned by the authenticated business
   * @param {number} id - Product ID
   * @returns {Promise<Object>} Product details
   */
  getMyProductById: (id) => {
    const mockProduct = MOCK_PRODUCTS.find(p => p.id === id) || MOCK_PRODUCTS[0];
    return safeAuthenticatedRequest(`/api/business/products/${id}`, {}, mockProduct);
  },
  
  /**
   * Create a new product for the authenticated business
   * @param {Object} productData - Product data
   * @param {string} productData.title - Title of the product
   * @param {string} productData.description - Description of the product
   * @param {number} productData.price - Price of the product
   * @param {number} productData.stock - Stock quantity
   * @param {number} productData.discountPercentage - Discount percentage
   * @param {boolean} productData.hidden - Whether the product is hidden
   * @param {number} productData.categoryId - Category ID
   * @param {string} productData.categoryName - Category name (used if categoryId not available)
   * @param {Array<string>} productData.imageUrls - List of image URLs
   * @returns {Promise<Object>} Created product
   */
  createProduct: (productData) => {
    console.log('Creating product with data:', {
      ...productData,
      imageUrls: productData.imageUrls ? `${productData.imageUrls.length} image(s)` : 'none'
    });
    
    // Create a mock response with the product data for fallback
    const mockResponse = {
      product: {
        id: Math.floor(Math.random() * 1000) + 100,
        ...productData,
        currency: productData.currency || "INR",
        business: {
          id: 1,
          businessName: "Your Business",
          brandName: "Your Brand"
        },
        category: productData.categoryId ? { id: productData.categoryId, name: "Category" } : null,
        createdAt: new Date().toISOString()
      },
      message: "Product created successfully"
    };
    
    // If we have categoryName but no categoryId, handle that
    if (productData.categoryName && !productData.categoryId) {
      console.log(`Using category name: ${productData.categoryName} instead of ID`);
      
      // For backend API that requires an ID, we might need to retrieve it first or handle on server
      // Let's make a query parameter for the backend to handle
      const endpoint = `/api/business/products?categoryName=${encodeURIComponent(productData.categoryName)}`;
      
      // Remove categoryName from request body to avoid confusion
      const { categoryName, ...dataWithoutCategoryName } = productData;
      
      return safeAuthenticatedRequest(endpoint, {
        method: 'POST',
        body: JSON.stringify(dataWithoutCategoryName)
      }, mockResponse);
    }
    
    // Add currency field if not present
    if (!productData.currency) {
      productData.currency = "INR";
    }
    
    // Ensure all required fields are present
    const sanitizedData = {
      ...productData,
      stock: productData.stock || 0,
      discountPercentage: productData.discountPercentage || 0,
      hidden: typeof productData.hidden === 'boolean' ? productData.hidden : false,
      // Calculate finalPrice on client side as a fallback
      finalPrice: productData.price * (1 - (productData.discountPercentage || 0) / 100)
    };
    
    console.log('Sending final product data to API:', sanitizedData);
    
    return safeAuthenticatedRequest('/api/business/products', {
      method: 'POST',
      body: JSON.stringify(sanitizedData)
    }, mockResponse);
  },
  
  /**
   * Update an existing product owned by the authenticated business
   * @param {number} id - Product ID
   * @param {Object} productData - Product data to update
   * @returns {Promise<Object>} Updated product
   */
  updateProduct: (id, productData) => {
    console.log(`Updating product ID ${id} with data:`, {
      ...productData,
      imageUrls: productData.imageUrls ? `${productData.imageUrls.length} image(s)` : 'none'
    });
    
    // Create a mock response with the updated product data
    const mockResponse = {
      product: {
        id: id,
        ...productData,
        business: {
          id: 1,
          businessName: "Your Business",
          brandName: "Your Brand"
        },
        category: productData.categoryId ? { id: productData.categoryId, name: "Category" } : null,
        updatedAt: new Date().toISOString()
      },
      message: "Product updated successfully"
    };
    
    // If we have categoryName but no categoryId, handle that
    if (productData.categoryName && !productData.categoryId) {
      console.log(`Using category name: ${productData.categoryName} instead of ID`);
      
      // For backend API that requires an ID, we might need to retrieve it first or handle on server
      // Let's make a query parameter for the backend to handle
      const endpoint = `/api/business/products/${id}?categoryName=${encodeURIComponent(productData.categoryName)}`;
      
      // Remove categoryName from request body to avoid confusion
      const { categoryName, ...dataWithoutCategoryName } = productData;
      
      return safeAuthenticatedRequest(endpoint, {
        method: 'PUT',
        body: JSON.stringify(dataWithoutCategoryName)
      }, mockResponse);
    }
    
    return safeAuthenticatedRequest(`/api/business/products/${id}`, {
      method: 'PUT',
      body: JSON.stringify(productData)
    }, mockResponse);
  },
  
  /**
   * Delete a product owned by the authenticated business
   * @param {number} id - Product ID
   * @returns {Promise<Object>} Success message
   */
  deleteProduct: (id) => {
    return safeAuthenticatedRequest(`/api/business/products/${id}`, {
      method: 'DELETE'
    }, { message: "Product deleted successfully" });
  }
};

export { businessProductApi }; 