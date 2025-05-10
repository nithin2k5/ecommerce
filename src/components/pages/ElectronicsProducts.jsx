import { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';
import { FaRupeeSign, FaShoppingCart, FaEye } from 'react-icons/fa';
import { addToCart } from '../../features/cartSlice';
import '../../styles/Products.css';

function ElectronicsProducts() {
  const dispatch = useDispatch();
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
    'Rating': {
      type: 'checkbox',
      values: [
        { label: '4★ & above', value: '4', checked: false },
        { label: '3★ & above', value: '3', checked: false },
        { label: '2★ & above', value: '2', checked: false }
      ]
    }
  });

  // Load products data
  useEffect(() => {
    // Simulate API call with setTimeout
    setTimeout(() => {
      setProducts(getMockProducts());
      setLoading(false);
    }, 500);
  }, []);

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

  const formatPrice = (price) => {
    return price.toLocaleString('en-IN');
  };

  // Function to add product tags
  const getProductTag = (product) => {
    if (product.discount >= 20) {
      return <span className="product-tag tag-sale">SALE {product.discount}% OFF</span>;
    } else if (product.rating >= 4.8) {
      return <span className="product-tag tag-bestseller">BESTSELLER</span>;
    } else if (product.id % 7 === 0) { // Just a way to randomly apply the tag to some products
      return <span className="product-tag tag-new">NEW</span>;
    }
    return null;
  };

  if (loading) {
    return <div className="loading">Loading amazing electronics...</div>;
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
        <h1 className="products-title">Electronics</h1>
        <div className="products-grid">
          {products.map((product) => (
            <div key={product.id} className="product-card">
              {getProductTag(product)}
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
                <div className="product-buttons">
                  <Link to={`/product/${product.id}`} className="view-btn">
                    <FaEye className="view-icon" />
                    View
                  </Link>
                  <button 
                    className="add-to-cart-btn"
                    onClick={() => dispatch(addToCart(product))}
                  >
                  <FaShoppingCart className="cart-icon" />
                  Add to Cart
                </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// Mock data function - simplified for readability
function getMockProducts() {
  return [
    {
      id: 1,
      name: "MacBook Pro M2",
      price: 199900,
      image: "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=500",
      description: "13-inch, 8GB RAM, 512GB SSD, M2 chip",
      brand: "Apple",
      rating: 4.9,
      reviews: 312,
      stock: 12,
      originalPrice: 219900,
      discount: 9
    },
    {
      id: 2,
      name: "Sony WH-1000XM5",
      price: 29990,
      image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500",
      description: "Wireless Noise Cancelling Headphones, 30hr battery",
      brand: "Sony",
      rating: 4.8,
      reviews: 245,
      stock: 25,
      originalPrice: 32990,
      discount: 9
    },
    {
      id: 3,
      name: "iPad Air 5th Gen",
      price: 54900,
      image: "https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=500",
      description: "10.9-inch, M1 chip, 64GB, Wi-Fi",
      brand: "Apple",
      rating: 4.7,
      reviews: 189,
      stock: 18,
      originalPrice: 59900,
      discount: 8
    },
    {
      id: 4,
      name: "Samsung Galaxy Tab S9",
      price: 69990,
      image: "https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=500",
      description: "11-inch, Snapdragon 8 Gen 2, 8GB RAM",
      brand: "Samsung",
      rating: 4.6,
      reviews: 156,
      stock: 15,
      originalPrice: 74990,
      discount: 7
    },
    {
      id: 5,
      name: "Dell XPS 13",
      price: 129990,
      image: "https://images.unsplash.com/photo-1593642632823-8f785ba67e45?w=500",
      description: "13.4-inch, Intel i7, 16GB RAM, 512GB SSD",
      brand: "Dell",
      rating: 4.5,
      reviews: 132,
      stock: 10,
      originalPrice: 139990,
      discount: 7
    },
    {
      id: 6,
      name: "Apple Watch Series 9",
      price: 41900,
      image: "https://images.unsplash.com/photo-1579586337278-3befd40fd17a?w=500",
      description: "GPS, Always-On Display, 41mm",
      brand: "Apple",
      rating: 4.8,
      reviews: 198,
      stock: 30,
      originalPrice: 44900,
      discount: 7
    },
    {
      id: 7,
      name: "MacBook Air M2",
      price: 114900,
      image: "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=500",
      description: "13.6-inch, 8GB RAM, 256GB SSD",
      brand: "Apple",
      rating: 4.8,
      reviews: 245,
      stock: 20,
      originalPrice: 124900,
      discount: 8
    },
    {
      id: 8,
      name: "Bose QuietComfort 45",
      price: 27990,
      image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500",
      description: "Wireless Noise Cancelling Headphones",
      brand: "Bose",
      rating: 4.7,
      reviews: 189,
      stock: 25,
      originalPrice: 29990,
      discount: 7
    },
    {
      id: 9,
      name: "iPad Pro 12.9",
      price: 99900,
      image: "https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=500",
      description: "M2 chip, 128GB, Wi-Fi + Cellular",
      brand: "Apple",
      rating: 4.9,
      reviews: 167,
      stock: 15,
      originalPrice: 109900,
      discount: 9
    },
    {
      id: 10,
      name: "Microsoft Surface Pro 9",
      price: 89990,
      image: "https://images.unsplash.com/photo-1593642632823-8f785ba67e45?w=500",
      description: "Intel i5, 8GB RAM, 256GB SSD",
      brand: "Microsoft",
      rating: 4.6,
      reviews: 145,
      stock: 18,
      originalPrice: 94990,
      discount: 5
    },
    {
      id: 11,
      name: "MacBook Pro 16",
      price: 249900,
      image: "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=500",
      description: "M2 Pro, 16GB RAM, 512GB SSD",
      brand: "Apple",
      rating: 4.9,
      reviews: 198,
      stock: 10,
      originalPrice: 269900,
      discount: 7
    },
    {
      id: 12,
      name: "Samsung Galaxy Book3 Pro",
      price: 129990,
      image: "https://images.unsplash.com/photo-1593642632823-8f785ba67e45?w=500",
      description: "Intel i7, 16GB RAM, 512GB SSD",
      brand: "Samsung",
      rating: 4.7,
      reviews: 156,
      stock: 15,
      originalPrice: 139990,
      discount: 7
    }
  ];
}

export default ElectronicsProducts; 