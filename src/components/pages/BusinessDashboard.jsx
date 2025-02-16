import { useState } from 'react';
import '../../styles/BusinessDashboard.css';

function BusinessDashboard() {
  const [productData, setProductData] = useState({
    name: '',
    price: '',
    description: '',
    image: '',
    category: '',
    brand: '',
    stock: ''
  });

  const categories = [
    { value: 'electronics', label: 'Electronics' },
    { value: 'mobiles', label: 'Mobile Phones' },
    { value: 'fashion', label: 'Fashion' },
    { value: 'provisions', label: 'Provisions' },
    { value: 'appliances', label: 'Appliances' }
  ];

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setProductData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    // TODO: Add API call to save product
    console.log('Product Data:', productData);
    // Reset form after successful submission
    setProductData({
      name: '',
      price: '',
      description: '',
      image: '',
      category: '',
      brand: '',
      stock: ''
    });
  };

  return (
    <div className="business-dashboard">
      <div className="dashboard-header">
        <h1>Business Dashboard</h1>
        <p>Add new products to your store</p>
      </div>

      <div className="add-product-section">
        <h2>Add New Product</h2>
        <form onSubmit={handleSubmit} className="product-form">
          <div className="form-group">
            <label htmlFor="name">Product Name</label>
            <input
              type="text"
              id="name"
              name="name"
              value={productData.name}
              onChange={handleInputChange}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="price">Price (₹)</label>
            <input
              type="number"
              id="price"
              name="price"
              value={productData.price}
              onChange={handleInputChange}
              min="0"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="description">Description</label>
            <textarea
              id="description"
              name="description"
              value={productData.description}
              onChange={handleInputChange}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="image">Image URL</label>
            <input
              type="url"
              id="image"
              name="image"
              value={productData.image}
              onChange={handleInputChange}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="category">Category</label>
            <select
              id="category"
              name="category"
              value={productData.category}
              onChange={handleInputChange}
              required
            >
              <option value="">Select Category</option>
              {categories.map(category => (
                <option key={category.value} value={category.value}>
                  {category.label}
                </option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="brand">Brand</label>
            <input
              type="text"
              id="brand"
              name="brand"
              value={productData.brand}
              onChange={handleInputChange}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="stock">Stock Quantity</label>
            <input
              type="number"
              id="stock"
              name="stock"
              value={productData.stock}
              onChange={handleInputChange}
              min="0"
              required
            />
          </div>

          <button type="submit" className="submit-btn">
            Add Product
          </button>
        </form>
      </div>
    </div>
  );
}

export default BusinessDashboard; 