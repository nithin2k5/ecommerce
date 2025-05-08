import { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';
import { FaRupeeSign, FaShoppingCart, FaEye } from 'react-icons/fa';
import { addToCart } from '../../features/cartSlice';
import '../../styles/Products.css';

function FashionProducts() {
  const dispatch = useDispatch();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  const [filters, setFilters] = useState({
    'Price Range': {
      type: 'range',
      min: 0,
      max: 10000,
      step: 500,
      value: 10000
    },
    'Brand': {
      type: 'checkbox',
      values: [
        { label: 'Levi\'s', value: 'levis', checked: false },
        { label: 'H&M', value: 'hm', checked: false },
        { label: 'Zara', value: 'zara', checked: false },
        { label: 'Nike', value: 'nike', checked: false }
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
        name: "Men's Casual Shirt",
        price: 1499,
        image: "https://images.unsplash.com/photo-1603252109303-2751441dd157?w=500",
        description: "Cotton Regular Fit, Slim Collar",
        brand: "Levi's",
        rating: 4.5,
        reviews: 245,
        stock: 50,
        originalPrice: 1999,
        discount: 25
      },
      {
        id: 2,
        name: "Women's Summer Dress",
        price: 2499,
        image: "https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?w=500",
        description: "Floral Print Maxi, Cotton Blend",
        brand: "H&M",
        rating: 4.6,
        reviews: 189,
        stock: 35,
        originalPrice: 2999,
        discount: 17
      },
      {
        id: 3,
        name: "Nike Running Shoes",
        price: 3999,
        image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=500",
        description: "Lightweight Sports Shoes, Air Cushion",
        brand: "Nike",
        rating: 4.7,
        reviews: 312,
        stock: 40,
        originalPrice: 4999,
        discount: 20
      },
      {
        id: 4,
        name: "Men's Denim Jacket",
        price: 2999,
        image: "https://images.unsplash.com/photo-1591047139829-d91aecb6caea?w=500",
        description: "Classic Fit, Washed Denim",
        brand: "Zara",
        rating: 4.4,
        reviews: 156,
        stock: 25,
        originalPrice: 3999,
        discount: 25
      },
      {
        id: 5,
        name: "Women's Handbag",
        price: 1999,
        image: "https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=500",
        description: "Leather Tote Bag, Multiple Pockets",
        brand: "H&M",
        rating: 4.3,
        reviews: 132,
        stock: 30,
        originalPrice: 2499,
        discount: 20
      },
      {
        id: 6,
        name: "Men's Formal Shoes",
        price: 3499,
        image: "https://images.unsplash.com/photo-1614252235316-8c857d38b5f4?w=500",
        description: "Leather Oxford Shoes, Comfort Fit",
        brand: "Zara",
        rating: 4.5,
        reviews: 198,
        stock: 20,
        originalPrice: 4499,
        discount: 22
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
        <h1 className="products-title">Fashion</h1>
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

export default FashionProducts; 