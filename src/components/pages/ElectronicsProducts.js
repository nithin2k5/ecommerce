import { useState, useEffect } from 'react';
import { FaRupeeSign, FaShoppingCart } from 'react-icons/fa';
import '../../styles/Products.css';

function ElectronicsProducts() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  
  const [filters, setFilters] = useState({
    'Price Range': {
      type: 'range',
      min: 0,
      max: 200000,
      step: 1000,
      value: 200000
    },
    'Brand': {
      type: 'checkbox',
      values: [
        { label: 'Apple', value: 'apple', checked: false },
        { label: 'Samsung', value: 'samsung', checked: false },
        { label: 'Sony', value: 'sony', checked: false },
        { label: 'Dell', value: 'dell', checked: false }
      ]
    },
    'Category': {
      type: 'checkbox',
      values: [
        { label: 'Laptops', value: 'laptops', checked: false },
        { label: 'Tablets', value: 'tablets', checked: false },
        { label: 'Headphones', value: 'headphones', checked: false },
        { label: 'Accessories', value: 'accessories', checked: false }
      ]
    }
  });

  const handleFilterChange = (section, value) => {
    setFilters(prev => {
      const newFilters = { ...prev };
      if (newFilters[section].type === 'range') {
        newFilters[section].value = value;
      } else {
        const valueIndex = newFilters[section].values.findIndex(v => v.value === value);
        newFilters[section].values[valueIndex].checked = !newFilters[section].values[valueIndex].checked;
      }
      return newFilters;
    });
    // Add logic to filter products based on selected filters
  };

  useEffect(() => {
    // Example data - replace with your API call
    const mockProducts = [
      {
        id: 1,
        name: "MacBook Pro M2",
        price: 199900,
        image: "https://example.com/macbook.jpg",
        description: "13-inch, 8GB RAM, 512GB SSD"
      },
      {
        id: 2,
        name: "Sony WH-1000XM4",
        price: 24990,
        image: "https://example.com/headphones.jpg",
        description: "Wireless Noise Cancelling Headphones"
      },
      {
        id: 3,
        name: "iPad Air",
        price: 54900,
        image: "https://example.com/ipad.jpg",
        description: "10.9-inch, M1 chip, 64GB"
      }
    ];

    setProducts(mockProducts);
    setLoading(false);
  }, []);

  const formatPrice = (price) => {
    return price.toLocaleString('en-IN');
  };

  if (loading) {
    return <div className="loading">Loading...</div>;
  }

  return (
    <div className="products-container">
      <h1 className="products-title">Electronics</h1>
      <div className="products-grid">
        {products.map((product) => (
          <div key={product.id} className="product-card">
            <div className="product-image">
              <img src={product.image} alt={product.name} />
            </div>
            <div className="product-details">
              <h3 className="product-name">{product.name}</h3>
              <p className="product-description">{product.description}</p>
              <div className="product-price">
                <FaRupeeSign className="rupee-icon" />
                {formatPrice(product.price)}
              </div>
              <button className="add-to-cart-btn">
                <FaShoppingCart className="cart-icon" />
                Add to Cart
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default ElectronicsProducts; 