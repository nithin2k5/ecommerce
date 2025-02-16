import { useState, useEffect } from 'react';
import { FaRupeeSign, FaShoppingCart } from 'react-icons/fa';
import '../../styles/Products.css';

function MobileProducts() {
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
        { label: 'OnePlus', value: 'oneplus', checked: false },
        { label: 'Google', value: 'google', checked: false }
      ]
    },
    'Rating': {
      type: 'checkbox',
      values: [
        { label: '4★ & above', value: '4', checked: false },
        { label: '3★ & above', value: '3', checked: false },
        { label: '2★ & above', value: '2', checked: false }
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
  };

  useEffect(() => {
    // This is example data - replace with your actual API call
    const mockProducts = [
      {
        id: 1,
        name: "iPhone 14 Pro",
        price: 129900,
        image: "https://example.com/iphone14.jpg",
        description: "A16 Bionic chip, 48MP camera"
      },
      {
        id: 2,
        name: "Samsung Galaxy S23",
        price: 74999,
        image: "https://example.com/s23.jpg",
        description: "Snapdragon 8 Gen 2, 50MP camera"
      },
      {
        id: 3,
        name: "OnePlus 11",
        price: 56999,
        image: "https://example.com/oneplus11.jpg",
        description: "Snapdragon 8 Gen 2, 50MP camera"
      },
      {
        id: 4,
        name: "Google Pixel 8 Pro",
        price: 79999,
        image: "https://example.com/pixel8.jpg",
        description: "Tensor G3, 50MP camera"
      },
      {
        id: 5,
        name: "Google Pixel 8 Pro",
        price: 79999,
        image: "https://example.com/pixel8.jpg",
        description: "Tensor G3, 50MP camera"
      },
      {
        id: 6,
        name: "Google Pixel 8 Pro",
        price: 79999,
        image: "https://example.com/pixel8.jpg",
        description: "Tensor G3, 50MP camera"
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
      <div className="filters-section">
        {Object.entries(filters).map(([section, filter]) => (
          <div key={section} className="filter-group">
            <h3>{section}</h3>
            {filter.type === 'range' ? (
              <div className="range-filter">
                <input
                  type="range"
                  min={filter.min}
                  max={filter.max}
                  step={filter.step}
                  value={filter.value}
                  onChange={(e) => handleFilterChange(section, parseInt(e.target.value))}
                />
                <div className="range-values">
                  <span>₹{filter.min.toLocaleString('en-IN')}</span>
                  <span>₹{filter.value.toLocaleString('en-IN')}</span>
                </div>
              </div>
            ) : (
              <div className="checkbox-filter">
                {filter.values.map((option) => (
                  <label key={option.value} className="checkbox-label">
                    <input
                      type="checkbox"
                      checked={option.checked}
                      onChange={() => handleFilterChange(section, option.value)}
                    />
                    {option.label}
                  </label>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
      
      <div className="products-content">
        <h1 className="products-title">Mobile Phones</h1>
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
    </div>
  );
}

export default MobileProducts; 