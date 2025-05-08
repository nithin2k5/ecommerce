import { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';
import { FaRupeeSign, FaShoppingCart, FaEye } from 'react-icons/fa';
import { addToCart } from '../../features/cartSlice';
import '../../styles/Products.css';

function ProvisionsProducts() {
  const dispatch = useDispatch();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  const [filters, setFilters] = useState({
    'Price Range': {
      type: 'range',
      min: 0,
      max: 5000,
      step: 100,
      value: 5000
    },
    'Brand': {
      type: 'checkbox',
      values: [
        { label: 'Fortune', value: 'fortune', checked: false },
        { label: 'Tata', value: 'tata', checked: false },
        { label: 'Aashirvaad', value: 'aashirvaad', checked: false },
        { label: 'India Gate', value: 'indiagate', checked: false }
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

  useEffect(() => {
    const mockProducts = [
      {
        id: 1,
        name: "Organic Basmati Rice",
        price: 899,
        image: "https://images.unsplash.com/photo-1586201375761-83865001e31c?w=500",
        description: "5kg Premium Basmati, Aged",
        brand: "India Gate",
        rating: 4.6,
        reviews: 245,
        stock: 100,
        originalPrice: 999,
        discount: 10
      },
      {
        id: 2,
        name: "Refined Sunflower Oil",
        price: 199,
        image: "https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?w=500",
        description: "1L Refined Sunflower Oil, Rich in Vitamin E",
        brand: "Fortune",
        rating: 4.5,
        reviews: 189,
        stock: 150,
        originalPrice: 249,
        discount: 20
      },
      {
        id: 3,
        name: "Assorted Dal Pack",
        price: 599,
        image: "https://images.unsplash.com/photo-1607305387299-a3d9611cd469?w=500",
        description: "Assorted Dal Pack 2kg, Premium Quality",
        brand: "Tata",
        rating: 4.7,
        reviews: 312,
        stock: 80,
        originalPrice: 699,
        discount: 14
      },
      {
        id: 4,
        name: "Whole Wheat Flour",
        price: 299,
        image: "https://images.unsplash.com/photo-1608198093002-ad4e505484ba?w=500",
        description: "5kg Whole Wheat Flour, Stone Ground",
        brand: "Aashirvaad",
        rating: 4.4,
        reviews: 156,
        stock: 120,
        originalPrice: 349,
        discount: 14
      },
      {
        id: 5,
        name: "Organic Honey",
        price: 399,
        image: "https://images.unsplash.com/photo-1587049352846-4a222e784d38?w=500",
        description: "500g Pure Organic Honey, Unprocessed",
        brand: "Dabur",
        rating: 4.8,
        reviews: 198,
        stock: 60,
        originalPrice: 499,
        discount: 20
      },
      {
        id: 6,
        name: "Green Tea Bags",
        price: 249,
        image: "https://images.unsplash.com/photo-1627435601361-ec25f5b1d0e5?w=500",
        description: "100 Green Tea Bags, Natural Antioxidants",
        brand: "Tata",
        rating: 4.5,
        reviews: 132,
        stock: 200,
        originalPrice: 299,
        discount: 17
      }
    ];

    setProducts(mockProducts);
    setLoading(false);
  }, []);

  const formatPrice = (price) => {
    return price.toLocaleString('en-IN');
  };

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
        <h1 className="products-title">Provisions</h1>
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

export default ProvisionsProducts; 