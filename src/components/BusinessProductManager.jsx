import React, { useState, useEffect } from 'react';
import { businessProductApi } from '../services/business-product.service';
import { categoryApi } from '../services/product.service';
import { useNavigate } from 'react-router-dom';

const initialProductState = {
  title: '',
  description: '',
  price: 0,
  discountPercentage: 0,
  stock: 0,
  categoryId: '',
  imageUrls: [''],
  hidden: false
};

function BusinessProductManager() {
  const [products, setProducts] = useState([]);
  const [product, setProduct] = useState(initialProductState);
  const [editMode, setEditMode] = useState(false);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState('');
  const [businessInfo, setBusinessInfo] = useState({ brandName: '' });
  
  const navigate = useNavigate();

  // Load products and categories on component mount
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const [productsData, categoriesData] = await Promise.all([
          businessProductApi.getMyProducts(),
          categoryApi.getAllCategories()
        ]);
        
        setProducts(productsData);
        setCategories(categoriesData);
        
        // If we have products, extract business info from the first one
        if (productsData.length > 0 && productsData[0].business) {
          setBusinessInfo({
            brandName: productsData[0].business.brandName || productsData[0].business.businessName
          });
        }
        
        setError(null);
      } catch (err) {
        console.error('Error fetching data:', err);
        setError(err.message || 'Failed to load data');
        
        // If unauthorized, redirect to login
        if (err.status === 401) {
          navigate('/login');
        }
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, [navigate]);

  // Handle input changes for product form
  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    
    // Handle different input types
    if (type === 'checkbox') {
      setProduct({ ...product, [name]: checked });
    } else if (name === 'price' || name === 'discountPercentage' || name === 'stock') {
      // Convert to number for numeric fields
      setProduct({ ...product, [name]: value === '' ? '' : Number(value) });
    } else {
      setProduct({ ...product, [name]: value });
    }
  };
  
  // Handle image URL changes
  const handleImageUrlChange = (index, value) => {
    const updatedUrls = [...product.imageUrls];
    updatedUrls[index] = value;
    setProduct({ ...product, imageUrls: updatedUrls });
  };
  
  // Add a new image URL field
  const addImageUrlField = () => {
    setProduct({ ...product, imageUrls: [...product.imageUrls, ''] });
  };
  
  // Remove an image URL field
  const removeImageUrlField = (index) => {
    const updatedUrls = product.imageUrls.filter((_, i) => i !== index);
    setProduct({ ...product, imageUrls: updatedUrls.length ? updatedUrls : [''] });
  };

  // Submit product form
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Filter out empty image URLs
    const filteredImageUrls = product.imageUrls.filter(url => url.trim() !== '');
    const productData = {
      ...product,
      imageUrls: filteredImageUrls.length ? filteredImageUrls : []
    };
    
    setLoading(true);
    setError(null);
    
    try {
      let result;
      
      if (editMode) {
        // Update existing product
        result = await businessProductApi.updateProduct(product.id, productData);
        setSuccessMessage('Product updated successfully');
      } else {
        // Create new product
        result = await businessProductApi.createProduct(productData);
        setSuccessMessage('Product created successfully');
      }
      
      // Update business info from response if available
      if (result.brandName) {
        setBusinessInfo({ brandName: result.brandName });
      }
      
      // Refresh product list
      const updatedProducts = await businessProductApi.getMyProducts();
      setProducts(updatedProducts);
      
      // Reset form
      setProduct(initialProductState);
      setEditMode(false);
      
      // Hide success message after 3 seconds
      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (err) {
      console.error('Error saving product:', err);
      setError(err.message || 'Failed to save product');
    } finally {
      setLoading(false);
    }
  };

  // Edit an existing product
  const handleEdit = (prod) => {
    setProduct({
      ...prod,
      categoryId: prod.category ? prod.category.id : '',
      // Ensure we have at least one empty image URL field
      imageUrls: prod.imageUrls.length ? [...prod.imageUrls] : ['']
    });
    setEditMode(true);
    // Scroll to form
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Delete a product
  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this product?')) {
      return;
    }
    
    setLoading(true);
    try {
      await businessProductApi.deleteProduct(id);
      
      // Remove product from state
      setProducts(products.filter(p => p.id !== id));
      setSuccessMessage('Product deleted successfully');
      
      // If the deleted product was being edited, reset the form
      if (editMode && product.id === id) {
        setProduct(initialProductState);
        setEditMode(false);
      }
      
      // Hide success message after 3 seconds
      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (err) {
      console.error('Error deleting product:', err);
      setError(err.message || 'Failed to delete product');
    } finally {
      setLoading(false);
    }
  };

  // Cancel editing
  const handleCancel = () => {
    setProduct(initialProductState);
    setEditMode(false);
    setError(null);
  };

  return (
    <div className="container mx-auto p-4">
      <div className="mb-8">
        <h1 className="text-2xl font-bold mb-2">Product Management</h1>
        {businessInfo.brandName && (
          <p className="text-gray-600">
            Managing products for brand: <strong>{businessInfo.brandName}</strong>
          </p>
        )}
      </div>
      
      {/* Error and Success Messages */}
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}
      
      {successMessage && (
        <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">
          {successMessage}
        </div>
      )}
      
      {/* Product Form */}
      <div className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-8">
        <h2 className="text-xl font-bold mb-4">
          {editMode ? 'Edit Product' : 'Add New Product'}
        </h2>
        
        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Title */}
            <div className="mb-4">
              <label className="block text-gray-700 mb-2" htmlFor="title">
                Title*
              </label>
              <input
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                id="title"
                name="title"
                type="text"
                value={product.title}
                onChange={handleInputChange}
                required
              />
            </div>
            
            {/* Price */}
            <div className="mb-4">
              <label className="block text-gray-700 mb-2" htmlFor="price">
                Price*
              </label>
              <input
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                id="price"
                name="price"
                type="number"
                min="0"
                step="0.01"
                value={product.price}
                onChange={handleInputChange}
                required
              />
            </div>
            
            {/* Stock */}
            <div className="mb-4">
              <label className="block text-gray-700 mb-2" htmlFor="stock">
                Stock
              </label>
              <input
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                id="stock"
                name="stock"
                type="number"
                min="0"
                value={product.stock}
                onChange={handleInputChange}
              />
            </div>
            
            {/* Discount Percentage */}
            <div className="mb-4">
              <label className="block text-gray-700 mb-2" htmlFor="discountPercentage">
                Discount Percentage
              </label>
              <input
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                id="discountPercentage"
                name="discountPercentage"
                type="number"
                min="0"
                max="100"
                value={product.discountPercentage}
                onChange={handleInputChange}
              />
            </div>
            
            {/* Category */}
            <div className="mb-4">
              <label className="block text-gray-700 mb-2" htmlFor="categoryId">
                Category
              </label>
              <select
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                id="categoryId"
                name="categoryId"
                value={product.categoryId}
                onChange={handleInputChange}
              >
                <option value="">Select Category</option>
                {categories.map(category => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
              </select>
            </div>
            
            {/* Hidden */}
            <div className="mb-4 flex items-center">
              <input
                className="mr-2"
                id="hidden"
                name="hidden"
                type="checkbox"
                checked={product.hidden}
                onChange={handleInputChange}
              />
              <label className="text-gray-700" htmlFor="hidden">
                Hidden (not visible to customers)
              </label>
            </div>
          </div>
          
          {/* Description */}
          <div className="mb-4">
            <label className="block text-gray-700 mb-2" htmlFor="description">
              Description
            </label>
            <textarea
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              id="description"
              name="description"
              rows="4"
              value={product.description || ''}
              onChange={handleInputChange}
            ></textarea>
          </div>
          
          {/* Image URLs */}
          <div className="mb-4">
            <label className="block text-gray-700 mb-2">
              Image URLs
            </label>
            {product.imageUrls.map((url, index) => (
              <div key={index} className="flex mb-2">
                <input
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  type="url"
                  value={url}
                  onChange={(e) => handleImageUrlChange(index, e.target.value)}
                  placeholder="https://example.com/image.jpg"
                />
                <button
                  type="button"
                  className="ml-2 bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
                  onClick={() => removeImageUrlField(index)}
                >
                  ×
                </button>
              </div>
            ))}
            <button
              type="button"
              className="mt-2 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
              onClick={addImageUrlField}
            >
              Add Image URL
            </button>
          </div>
          
          {/* Form Actions */}
          <div className="flex items-center justify-between mt-4">
            <button
              type="submit"
              className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
              disabled={loading}
            >
              {loading ? 'Saving...' : editMode ? 'Update Product' : 'Create Product'}
            </button>
            
            {editMode && (
              <button
                type="button"
                className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline ml-2"
                onClick={handleCancel}
              >
                Cancel
              </button>
            )}
          </div>
        </form>
      </div>
      
      {/* Products List */}
      <div className="bg-white shadow-md rounded px-8 pt-6 pb-8">
        <h2 className="text-xl font-bold mb-4">Your Products</h2>
        
        {loading && products.length === 0 ? (
          <p className="text-gray-600">Loading products...</p>
        ) : products.length === 0 ? (
          <p className="text-gray-600">No products yet. Add your first product above.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full bg-white">
              <thead>
                <tr>
                  <th className="py-2 px-4 border-b border-gray-200 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Product
                  </th>
                  <th className="py-2 px-4 border-b border-gray-200 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Price
                  </th>
                  <th className="py-2 px-4 border-b border-gray-200 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Stock
                  </th>
                  <th className="py-2 px-4 border-b border-gray-200 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Category
                  </th>
                  <th className="py-2 px-4 border-b border-gray-200 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="py-2 px-4 border-b border-gray-200 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {products.map((prod) => (
                  <tr key={prod.id}>
                    <td className="py-2 px-4 border-b border-gray-200">
                      <div className="flex items-center">
                        {prod.imageUrls && prod.imageUrls.length > 0 ? (
                          <img
                            className="h-10 w-10 object-cover rounded mr-4"
                            src={prod.imageUrls[0]}
                            alt={prod.title}
                            onError={(e) => {
                              e.target.onerror = null;
                              e.target.src = 'https://via.placeholder.com/40?text=No+Image';
                            }}
                          />
                        ) : (
                          <div className="h-10 w-10 bg-gray-200 rounded mr-4 flex items-center justify-center text-gray-500">
                            No img
                          </div>
                        )}
                        <div>
                          <div className="font-medium text-gray-900">{prod.title}</div>
                          {prod.description && (
                            <div className="text-gray-500 truncate max-w-xs">
                              {prod.description.substring(0, 50)}
                              {prod.description.length > 50 ? '...' : ''}
                            </div>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="py-2 px-4 border-b border-gray-200">
                      <div>
                        ${prod.finalPrice.toFixed(2)}
                      </div>
                      {prod.discountPercentage > 0 && (
                        <div className="text-gray-500 line-through text-xs">
                          ${prod.price.toFixed(2)}
                        </div>
                      )}
                    </td>
                    <td className="py-2 px-4 border-b border-gray-200">
                      {prod.stock}
                    </td>
                    <td className="py-2 px-4 border-b border-gray-200">
                      {prod.category ? prod.category.name : '-'}
                    </td>
                    <td className="py-2 px-4 border-b border-gray-200">
                      {prod.hidden ? (
                        <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-red-100 text-red-800">
                          Hidden
                        </span>
                      ) : (
                        <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                          Visible
                        </span>
                      )}
                    </td>
                    <td className="py-2 px-4 border-b border-gray-200">
                      <button
                        onClick={() => handleEdit(prod)}
                        className="text-blue-600 hover:text-blue-900 mr-2"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(prod.id)}
                        className="text-red-600 hover:text-red-900"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

export default BusinessProductManager; 