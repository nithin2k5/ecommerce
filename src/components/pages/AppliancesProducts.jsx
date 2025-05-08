import { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';
import { FaRupeeSign, FaShoppingCart, FaEye } from 'react-icons/fa';
import { addToCart } from '../../features/cartSlice';
import '../../styles/Products.css';

function AppliancesProducts() {
  const dispatch = useDispatch();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  const [filters, setFilters] = useState({
    'Price Range': {
      type: 'range',
      min: 0,
      max: 100000,
      step: 1000,
      value: 100000
    },
    'Brand': {
      type: 'checkbox',
      values: [
        { label: 'LG', value: 'lg', checked: false },
        { label: 'Samsung', value: 'samsung', checked: false },
        { label: 'Whirlpool', value: 'whirlpool', checked: false },
        { label: 'Havells', value: 'havells', checked: false }
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
    // Add logic to filter products based on selected filters
  };

  useEffect(() => {
    const mockProducts = [
      {
        id: 1,
        name: "LG 8kg Washing Machine",
        price: 35990,
        image: "https://images.unsplash.com/photo-1626806787461-102c1bfaaea1?w=500",
        description: "Fully Automatic Front Load, AI Direct Drive",
        brand: "LG",
        rating: 4.7,
        reviews: 189,
        stock: 15,
        originalPrice: 39990,
        discount: 10
      },
      {
        id: 2,
        name: "Samsung 253L Refrigerator",
        price: 24990,
        image: "https://images.unsplash.com/photo-1571175443880-49e1d25b2bc5?w=500",
        description: "Double Door Frost Free, Digital Inverter",
        brand: "Samsung",
        rating: 4.6,
        reviews: 156,
        stock: 20,
        originalPrice: 27990,
        discount: 11
      },
      {
        id: 3,
        name: "Havells Air Conditioner",
        price: 32990,
        image: "https://images.unsplash.com/photo-1581093458791-9f3c3900df4b?w=500",
        description: "1.5 Ton Split AC, 5 Star, Inverter",
        brand: "Havells",
        rating: 4.5,
        reviews: 132,
        stock: 12,
        originalPrice: 36990,
        discount: 11
      },
      {
        id: 4,
        name: "Whirlpool Microwave",
        price: 12990,
        image: "https://images.unsplash.com/photo-1571175443880-49e1d25b2bc5?w=500",
        description: "25L Convection, 10 Power Levels",
        brand: "Whirlpool",
        rating: 4.4,
        reviews: 98,
        stock: 25,
        originalPrice: 14990,
        discount: 13
      },
      {
        id: 5,
        name: "Philips Air Purifier",
        price: 15990,
        image: "https://images.unsplash.com/photo-1581093458791-9f3c3900df4b?w=500",
        description: "HEPA Filter, Smart Air Quality Monitor",
        brand: "Philips",
        rating: 4.3,
        reviews: 87,
        stock: 18,
        originalPrice: 17990,
        discount: 11
      },
      {
        id: 6,
        name: "Bosch Dishwasher",
        price: 44990,
        image: "https://images.unsplash.com/photo-1626806787461-102c1bfaaea1?w=500",
        description: "12 Place Settings, 6 Wash Programs",
        brand: "Bosch",
        rating: 4.6,
        reviews: 145,
        stock: 10,
        originalPrice: 49990,
        discount: 10
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
        <h1 className="products-title">Appliances</h1>
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

export default AppliancesProducts; 