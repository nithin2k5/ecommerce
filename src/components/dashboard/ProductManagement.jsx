import React, { useState, useEffect } from 'react';
import { FaSearch, FaEdit, FaTrash, FaPlus, FaPercent, FaEye, FaEyeSlash } from 'react-icons/fa';
import './ProductManagement.css';
import { productApi, categoryApi } from '../../services/product.service';
import { toast } from 'react-toastify';

const ProductManagement = ({ businessId }) => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  
  const [showModal, setShowModal] = useState(false);
  const [modalMode, setModalMode] = useState('add'); // 'add', 'edit', 'discount'
  const [searchId, setSearchId] = useState('');
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    price: '',
    categoryId: '',
    imageUrls: [''],
    stock: ''
  });
  const [discount, setDiscount] = useState('');

  // Fetch products when component mounts
  useEffect(() => {
    fetchProducts();
    fetchCategories();
  }, [businessId]);

  // Fetch products from the API
  const fetchProducts = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await productApi.getProductsByBusiness(businessId);
      setProducts(response);
    } catch (err) {
      console.error('Error fetching products:', err);
      setError('Failed to load products. Please try again later.');
      toast.error('Failed to load products');
    } finally {
      setIsLoading(false);
    }
  };

  // Fetch categories from the API
  const fetchCategories = async () => {
    try {
      const response = await categoryApi.getAllCategories();
      setCategories(response);
    } catch (err) {
      console.error('Error fetching categories:', err);
      toast.error('Failed to load categories');
    }
  };

  // Handle search by ID
  const handleSearch = async () => {
    if (!searchId) return;
    
    setIsLoading(true);
    try {
      const product = await productApi.getProductById(searchId);
      setSelectedProduct(product);
    } catch (err) {
      console.error('Error searching for product:', err);
      toast.error('Product not found');
    } finally {
      setIsLoading(false);
    }
  };

  // Handle opening modal for adding a new product
  const handleAddNew = () => {
    setModalMode('add');
    setFormData({
      title: '',
      description: '',
      price: '',
      categoryId: '',
      imageUrls: [''],
      stock: ''
    });
    setShowModal(true);
  };

  // Handle opening modal for editing a product
  const handleEdit = (product) => {
    setModalMode('edit');
    setSelectedProduct(product);
    setFormData({
      title: product.title,
      description: product.description,
      price: product.price,
      categoryId: product.category ? product.category.id : '',
      imageUrls: product.imageUrls && product.imageUrls.length > 0 ? product.imageUrls : [''],
      stock: product.stock
    });
    setShowModal(true);
  };

  // Handle opening modal for adding discount
  const handleDiscount = (product) => {
    setModalMode('discount');
    setSelectedProduct(product);
    setDiscount(product.discountPercentage || '');
    setShowModal(true);
  };

  // Handle deleting a product
  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      setIsLoading(true);
      try {
        await productApi.deleteProduct(id);
        setProducts(products.filter(product => product.id !== id));
        toast.success('Product deleted successfully');
        if (selectedProduct && selectedProduct.id === id) {
          setSelectedProduct(null);
        }
      } catch (err) {
        console.error('Error deleting product:', err);
        toast.error('Failed to delete product');
      } finally {
        setIsLoading(false);
      }
    }
  };

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  // Handle image URL changes
  const handleImageUrlChange = (index, value) => {
    const updatedUrls = [...formData.imageUrls];
    updatedUrls[index] = value;
    setFormData({
      ...formData,
      imageUrls: updatedUrls
    });
  };

  // Add another image URL field
  const addImageUrlField = () => {
    setFormData({
      ...formData,
      imageUrls: [...formData.imageUrls, '']
    });
  };

  // Handle discount input change
  const handleDiscountChange = (e) => {
    setDiscount(e.target.value);
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    setIsLoading(true);
    try {
      if (modalMode === 'add') {
        // Add new product
        const productData = {
          title: formData.title,
          description: formData.description,
          price: parseFloat(formData.price),
          stock: parseInt(formData.stock),
          imageUrls: formData.imageUrls.filter(url => url.trim() !== '')
        };
        
        const newProduct = await productApi.createProduct(
          productData, 
          businessId, 
          formData.categoryId || null
        );
        
        setProducts([...products, newProduct]);
        toast.success('Product added successfully');
      } else if (modalMode === 'edit') {
        // Update existing product
        const productData = {
          title: formData.title,
          description: formData.description,
          price: parseFloat(formData.price),
          stock: parseInt(formData.stock),
          imageUrls: formData.imageUrls.filter(url => url.trim() !== ''),
          category: formData.categoryId ? { id: formData.categoryId } : null
        };
        
        const updatedProduct = await productApi.updateProduct(selectedProduct.id, productData);
        
        setProducts(products.map(product => 
          product.id === selectedProduct.id ? updatedProduct : product
        ));
        
        if (selectedProduct) {
          setSelectedProduct(updatedProduct);
        }
        
        toast.success('Product updated successfully');
      } else if (modalMode === 'discount') {
        // Update product discount
        const discountValue = parseFloat(discount);
        const updatedProduct = await productApi.updateProductDiscount(selectedProduct.id, discountValue);
        
        setProducts(products.map(product => 
          product.id === selectedProduct.id ? updatedProduct : product
        ));
        
        if (selectedProduct) {
          setSelectedProduct(updatedProduct);
        }
        
        toast.success('Discount applied successfully');
      }
      
      setShowModal(false);
    } catch (err) {
      console.error('Error saving product:', err);
      toast.error(err.message || 'Failed to save product');
    } finally {
      setIsLoading(false);
    }
  };

  // Handle toggling product visibility
  const handleToggleVisibility = async (product) => {
    setIsLoading(true);
    try {
      const newHiddenStatus = !product.hidden;
      const updatedProduct = await productApi.toggleProductVisibility(product.id, newHiddenStatus);
      
      setProducts(products.map(p => 
        p.id === product.id ? updatedProduct : p
      ));
      
      if (selectedProduct && selectedProduct.id === product.id) {
        setSelectedProduct(updatedProduct);
      }
      
      toast.success(`Product ${newHiddenStatus ? 'hidden' : 'visible'} successfully`);
    } catch (err) {
      console.error('Error toggling product visibility:', err);
      toast.error('Failed to update product visibility');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="product-management">
      <div className="section-header">
        <h2>Product Management</h2>
        <div className="product-actions">
          <div className="search-box">
            <input
              type="text"
              placeholder="Search by ID"
              value={searchId}
              onChange={(e) => setSearchId(e.target.value)}
            />
            <button onClick={handleSearch} disabled={isLoading}><FaSearch /></button>
          </div>
          <button className="add-product-btn" onClick={handleAddNew} disabled={isLoading}>
            <FaPlus /> Add Product
          </button>
        </div>
      </div>

      {error && <div className="error-message">{error}</div>}

      {/* Product Table */}
      <div className="product-table-container">
        {isLoading ? (
          <div className="loading">Loading products...</div>
        ) : products.length === 0 ? (
          <div className="no-products">No products found. Add a new product to get started.</div>
        ) : (
          <table className="product-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Image</th>
                <th>Title</th>
                <th>Brand</th>
                <th>Category</th>
                <th>Price</th>
                <th>Discount</th>
                <th>Final Price</th>
                <th>Stock</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {products.map(product => (
                <tr key={product.id}>
                  <td>{product.id}</td>
                  <td>
                    {product.imageUrls && product.imageUrls.length > 0 ? (
                      <div className="product-thumbnail">
                        <img src={product.imageUrls[0]} alt={product.title} />
                      </div>
                    ) : (
                      <div className="product-thumbnail no-image">No Image</div>
                    )}
                  </td>
                  <td>{product.title}</td>
                  <td>{product.brandName || '—'}</td>
                  <td>{product.category ? product.category.name : '—'}</td>
                  <td>₹{product.price.toFixed(2)}</td>
                  <td>
                    {product.discountPercentage > 0 ? (
                      <span className="discount-badge">{product.discountPercentage}%</span>
                    ) : (
                      '—'
                    )}
                  </td>
                  <td>₹{product.finalPrice.toFixed(2)}</td>
                  <td>{product.stock}</td>
                  <td>
                    <div className="action-buttons">
                      <button 
                        className="edit-btn" 
                        title="Edit Product"
                        onClick={() => handleEdit(product)}
                        disabled={isLoading}
                      >
                        <FaEdit />
                      </button>
                      <button 
                        className="discount-btn" 
                        title="Add Discount"
                        onClick={() => handleDiscount(product)}
                        disabled={isLoading}
                      >
                        <FaPercent />
                      </button>
                      <button 
                        className="delete-btn" 
                        title="Delete Product"
                        onClick={() => handleDelete(product.id)}
                        disabled={isLoading}
                      >
                        <FaTrash />
                      </button>
                      <button 
                        className="visibility-btn"
                        onClick={() => handleToggleVisibility(product)}
                        title={product.hidden ? "Show product" : "Hide product"}
                      >
                        {product.hidden ? <FaEye /> : <FaEyeSlash />}
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Selected Product Detail */}
      {selectedProduct && !showModal && (
        <div className="selected-product-detail">
          <h3>Product Details: {selectedProduct.title}</h3>
          <div className="detail-grid">
            <div className="detail-images">
              {selectedProduct.imageUrls && selectedProduct.imageUrls.length > 0 ? (
                selectedProduct.imageUrls.map((url, index) => (
                  <img key={index} src={url} alt={`${selectedProduct.title} - ${index}`} />
                ))
              ) : (
                <div className="no-image">No Images</div>
              )}
            </div>
            <div className="detail-info">
              <p><strong>ID:</strong> {selectedProduct.id}</p>
              <p><strong>Title:</strong> {selectedProduct.title}</p>
              <p><strong>Description:</strong> {selectedProduct.description}</p>
              <p><strong>Brand:</strong> {selectedProduct.brandName || 'Not available'}</p>
              <p><strong>Category:</strong> {selectedProduct.category ? selectedProduct.category.name : 'None'}</p>
              <p><strong>Original Price:</strong> ₹{selectedProduct.price.toFixed(2)}</p>
              <p><strong>Discount:</strong> {selectedProduct.discountPercentage}%</p>
              <p><strong>Final Price:</strong> ₹{selectedProduct.finalPrice.toFixed(2)}</p>
              <p><strong>Stock:</strong> {selectedProduct.stock} units</p>
              <p><strong>Created:</strong> {new Date(selectedProduct.createdAt).toLocaleDateString()}</p>
              {selectedProduct.updatedAt && (
                <p><strong>Last Updated:</strong> {new Date(selectedProduct.updatedAt).toLocaleDateString()}</p>
              )}
              
              <div className="detail-actions">
                <button onClick={() => handleEdit(selectedProduct)} disabled={isLoading}>Edit</button>
                <button onClick={() => handleDiscount(selectedProduct)} disabled={isLoading}>Update Discount</button>
                <button onClick={() => handleDelete(selectedProduct.id)} disabled={isLoading}>Delete</button>
                <button onClick={() => setSelectedProduct(null)}>Close</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Product Modal (Add/Edit/Discount) */}
      {showModal && (
        <div className="modal-overlay">
          <div className="product-modal">
            <h3>
              {modalMode === 'add' ? 'Add New Product' : 
               modalMode === 'edit' ? 'Edit Product' : 
               'Add Discount'}
            </h3>
            
            <form onSubmit={handleSubmit}>
              {/* Product Form Fields (Add/Edit) */}
              {(modalMode === 'add' || modalMode === 'edit') && (
                <>
                  <div className="form-group">
                    <label htmlFor="title">Product Title</label>
                    <input
                      type="text"
                      id="title"
                      name="title"
                      value={formData.title}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  
                  <div className="form-group">
                    <label htmlFor="description">Description</label>
                    <textarea
                      id="description"
                      name="description"
                      value={formData.description}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  
                  <div className="form-row">
                    <div className="form-group">
                      <label htmlFor="price">Price (₹)</label>
                      <input
                        type="number"
                        id="price"
                        name="price"
                        min="0"
                        step="0.01"
                        value={formData.price}
                        onChange={handleInputChange}
                        required
                      />
                    </div>
                    
                    <div className="form-group">
                      <label htmlFor="categoryId">Category</label>
                      <select
                        id="categoryId"
                        name="categoryId"
                        value={formData.categoryId}
                        onChange={handleInputChange}
                      >
                        <option value="">No Category</option>
                        {categories.map(category => (
                          <option key={category.id} value={category.id}>
                            {category.name}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                  
                  <div className="form-group">
                    <label htmlFor="stock">Stock Quantity</label>
                    <input
                      type="number"
                      id="stock"
                      name="stock"
                      min="0"
                      value={formData.stock}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  
                  <div className="form-group">
                    <label>Product Images</label>
                    {formData.imageUrls.map((url, index) => (
                      <div key={index} className="image-url-input">
                        <input
                          type="url"
                          placeholder="Image URL"
                          value={url}
                          onChange={(e) => handleImageUrlChange(index, e.target.value)}
                        />
                      </div>
                    ))}
                    <button 
                      type="button" 
                      className="add-image-btn"
                      onClick={addImageUrlField}
                    >
                      + Add Another Image
                    </button>
                  </div>
                </>
              )}
              
              {/* Discount Form Fields */}
              {modalMode === 'discount' && (
                <div className="form-group">
                  <label htmlFor="discount">Discount Percentage (%)</label>
                  <input
                    type="number"
                    id="discount"
                    min="0"
                    max="100"
                    step="0.1"
                    value={discount}
                    onChange={handleDiscountChange}
                    required
                  />
                  {selectedProduct && (
                    <div className="discount-preview">
                      <p>Original Price: ₹{selectedProduct.price.toFixed(2)}</p>
                      <p>
                        Final Price: ₹{(selectedProduct.price * (1 - parseFloat(discount || 0) / 100)).toFixed(2)}
                      </p>
                      <p>Savings: ₹{(selectedProduct.price * parseFloat(discount || 0) / 100).toFixed(2)}</p>
                    </div>
                  )}
                </div>
              )}
              
              <div className="modal-actions">
                <button type="submit" disabled={isLoading}>
                  {isLoading ? 'Processing...' : 
                   modalMode === 'add' ? 'Add Product' : 
                   modalMode === 'edit' ? 'Update Product' : 
                   'Apply Discount'}
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

export default ProductManagement;