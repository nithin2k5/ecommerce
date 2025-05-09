import React, { useState, useEffect } from 'react';
import { FaSearch, FaEdit, FaTrash, FaPlus, FaPercent } from 'react-icons/fa';
import './ProductManagement.css';

const ProductManagement = () => {
  // Mock data for products
  const [products, setProducts] = useState([
    {
      id: 1,
      title: 'iPhone 13 Pro',
      description: 'The latest iPhone with A15 Bionic chip',
      price: 999.99,
      discountPercentage: 5,
      finalPrice: 949.99,
      category: 'Electronics',
      imageUrls: ['https://example.com/iphone13.jpg'],
      stock: 50,
      createdAt: '2023-05-10T10:30:00Z'
    },
    {
      id: 2,
      title: 'Samsung Galaxy S22',
      description: 'Flagship Android smartphone with 8K video',
      price: 899.99,
      discountPercentage: 0,
      finalPrice: 899.99,
      category: 'Electronics',
      imageUrls: ['https://example.com/galaxy.jpg'],
      stock: 30,
      createdAt: '2023-05-12T09:15:00Z'
    },
    {
      id: 3,
      title: 'Sony WH-1000XM4',
      description: 'Wireless noise cancelling headphones',
      price: 349.99,
      discountPercentage: 10,
      finalPrice: 314.99,
      category: 'Electronics',
      imageUrls: ['https://example.com/sony.jpg'],
      stock: 25,
      createdAt: '2023-05-15T14:45:00Z'
    },
    {
      id: 4,
      title: 'MacBook Pro 16"',
      description: 'Apple M1 Pro chip, 16GB RAM, 512GB SSD',
      price: 2499.99,
      discountPercentage: 0,
      finalPrice: 2499.99,
      category: 'Computers',
      imageUrls: ['https://example.com/macbook.jpg'],
      stock: 15,
      createdAt: '2023-05-18T11:20:00Z'
    },
    {
      id: 5,
      title: 'Nike Air Max 270',
      description: 'Men\'s running shoes',
      price: 150.00,
      discountPercentage: 15,
      finalPrice: 127.50,
      category: 'Fashion',
      imageUrls: ['https://example.com/nike.jpg'],
      stock: 45,
      createdAt: '2023-05-20T16:10:00Z'
    }
  ]);

  const [showModal, setShowModal] = useState(false);
  const [modalMode, setModalMode] = useState('add'); // 'add', 'edit', 'discount'
  const [searchId, setSearchId] = useState('');
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    price: '',
    category: '',
    imageUrls: [''],
    stock: ''
  });
  const [discount, setDiscount] = useState('');

  // Handle search by ID
  const handleSearch = () => {
    if (!searchId) return;
    
    const product = products.find(p => p.id === parseInt(searchId));
    if (product) {
      setSelectedProduct(product);
    } else {
      alert('Product not found');
    }
  };

  // Handle opening modal for adding a new product
  const handleAddNew = () => {
    setModalMode('add');
    setFormData({
      title: '',
      description: '',
      price: '',
      category: '',
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
      category: product.category,
      imageUrls: product.imageUrls,
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
  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      setProducts(products.filter(product => product.id !== id));
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
  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (modalMode === 'add') {
      // Add new product
      const newProduct = {
        id: Math.max(...products.map(p => p.id)) + 1,
        title: formData.title,
        description: formData.description,
        price: parseFloat(formData.price),
        discountPercentage: 0,
        finalPrice: parseFloat(formData.price),
        category: formData.category,
        imageUrls: formData.imageUrls.filter(url => url.trim() !== ''),
        stock: parseInt(formData.stock),
        createdAt: new Date().toISOString()
      };
      
      setProducts([...products, newProduct]);
    } else if (modalMode === 'edit') {
      // Update existing product
      setProducts(products.map(product => {
        if (product.id === selectedProduct.id) {
          const updatedProduct = {
            ...product,
            title: formData.title,
            description: formData.description,
            price: parseFloat(formData.price),
            category: formData.category,
            imageUrls: formData.imageUrls.filter(url => url.trim() !== ''),
            stock: parseInt(formData.stock)
          };
          
          // Recalculate final price
          updatedProduct.finalPrice = updatedProduct.price * (1 - updatedProduct.discountPercentage / 100);
          
          return updatedProduct;
        }
        return product;
      }));
    } else if (modalMode === 'discount') {
      // Update product discount
      setProducts(products.map(product => {
        if (product.id === selectedProduct.id) {
          const discountPercentage = parseFloat(discount);
          const finalPrice = product.price * (1 - discountPercentage / 100);
          
          return {
            ...product,
            discountPercentage,
            finalPrice
          };
        }
        return product;
      }));
    }
    
    setShowModal(false);
    setSelectedProduct(null);
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
            <button onClick={handleSearch}><FaSearch /></button>
          </div>
          <button className="add-product-btn" onClick={handleAddNew}>
            <FaPlus /> Add Product
          </button>
        </div>
      </div>

      {/* Product Table */}
      <div className="product-table-container">
        <table className="product-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Image</th>
              <th>Title</th>
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
                <td>{product.category}</td>
                <td>${product.price.toFixed(2)}</td>
                <td>
                  {product.discountPercentage > 0 ? (
                    <span className="discount-badge">{product.discountPercentage}%</span>
                  ) : (
                    '—'
                  )}
                </td>
                <td>${product.finalPrice.toFixed(2)}</td>
                <td>{product.stock}</td>
                <td>
                  <div className="action-buttons">
                    <button 
                      className="edit-btn" 
                      title="Edit Product"
                      onClick={() => handleEdit(product)}
                    >
                      <FaEdit />
                    </button>
                    <button 
                      className="discount-btn" 
                      title="Add Discount"
                      onClick={() => handleDiscount(product)}
                    >
                      <FaPercent />
                    </button>
                    <button 
                      className="delete-btn" 
                      title="Delete Product"
                      onClick={() => handleDelete(product.id)}
                    >
                      <FaTrash />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Selected Product Detail */}
      {selectedProduct && !showModal && (
        <div className="selected-product-detail">
          <h3>Product Details: {selectedProduct.title}</h3>
          <div className="detail-grid">
            <div className="detail-images">
              {selectedProduct.imageUrls.map((url, index) => (
                <img key={index} src={url} alt={`${selectedProduct.title} - ${index}`} />
              ))}
            </div>
            <div className="detail-info">
              <p><strong>ID:</strong> {selectedProduct.id}</p>
              <p><strong>Title:</strong> {selectedProduct.title}</p>
              <p><strong>Description:</strong> {selectedProduct.description}</p>
              <p><strong>Category:</strong> {selectedProduct.category}</p>
              <p><strong>Original Price:</strong> ${selectedProduct.price.toFixed(2)}</p>
              <p><strong>Discount:</strong> {selectedProduct.discountPercentage}%</p>
              <p><strong>Final Price:</strong> ${selectedProduct.finalPrice.toFixed(2)}</p>
              <p><strong>Stock:</strong> {selectedProduct.stock} units</p>
              <p><strong>Created:</strong> {new Date(selectedProduct.createdAt).toLocaleDateString()}</p>
              
              <div className="detail-actions">
                <button onClick={() => handleEdit(selectedProduct)}>Edit</button>
                <button onClick={() => handleDiscount(selectedProduct)}>Update Discount</button>
                <button onClick={() => handleDelete(selectedProduct.id)}>Delete</button>
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
                      <label htmlFor="price">Price ($)</label>
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
                      <label htmlFor="category">Category</label>
                      <input
                        type="text"
                        id="category"
                        name="category"
                        value={formData.category}
                        onChange={handleInputChange}
                        required
                      />
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
                      <p>Original Price: ${selectedProduct.price.toFixed(2)}</p>
                      <p>
                        Final Price: ${(selectedProduct.price * (1 - parseFloat(discount || 0) / 100)).toFixed(2)}
                      </p>
                      <p>Savings: ${(selectedProduct.price * parseFloat(discount || 0) / 100).toFixed(2)}</p>
                    </div>
                  )}
                </div>
              )}
              
              <div className="modal-actions">
                <button type="submit">
                  {modalMode === 'add' ? 'Add Product' : 
                   modalMode === 'edit' ? 'Update Product' : 
                   'Apply Discount'}
                </button>
                <button type="button" onClick={() => setShowModal(false)}>
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