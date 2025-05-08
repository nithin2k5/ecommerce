import { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';
import { FaRupeeSign, FaShoppingCart, FaEye } from 'react-icons/fa';
import { addToCart } from '../../features/cartSlice';
import '../../styles/Products.css';

function MobileProducts() {
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
    const mockProducts = [
      {
        id: 1,
        name: "iPhone 14 Pro",
        price: 129900,
        image: "https://images.unsplash.com/photo-1678652197831-2d1801b5d5c9?w=500",
        description: "A16 Bionic chip, 48MP camera, Dynamic Island",
        brand: "Apple",
        rating: 4.8,
        reviews: 245,
        stock: 15,
        originalPrice: 139900,
        discount: 7
      },
      {
        id: 2,
        name: "Samsung Galaxy S23 Ultra",
        price: 124999,
        image: "https://images.unsplash.com/photo-1678775702101-9ed9cdb1e0f5?w=500",
        description: "Snapdragon 8 Gen 2, 200MP camera, S Pen",
        brand: "Samsung",
        rating: 4.7,
        reviews: 189,
        stock: 20,
        originalPrice: 134999,
        discount: 7
      },
      {
        id: 3,
        name: "OnePlus 11",
        price: 56999,
        image: "https://images.unsplash.com/photo-1678775702101-9ed9cdb1e0f5?w=500",
        description: "Snapdragon 8 Gen 2, 50MP camera, 100W charging",
        brand: "OnePlus",
        rating: 4.6,
        reviews: 156,
        stock: 25,
        originalPrice: 61999,
        discount: 8
      },
      {
        id: 4,
        name: "Google Pixel 8 Pro",
        price: 79999,
        image: "https://images.unsplash.com/photo-1598327105666-5b89351aff97?w=500",
        description: "Tensor G3, 50MP camera, AI features",
        brand: "Google",
        rating: 4.5,
        reviews: 132,
        stock: 18,
        originalPrice: 84999,
        discount: 6
      },
      {
        id: 5,
        name: "Nothing Phone (2)",
        price: 44999,
        image: "https://images.unsplash.com/photo-1678775702101-9ed9cdb1e0f5?w=500",
        description: "Snapdragon 8+ Gen 1, Glyph Interface",
        brand: "Nothing",
        rating: 4.4,
        reviews: 98,
        stock: 30,
        originalPrice: 49999,
        discount: 10
      },
      {
        id: 6,
        name: "Xiaomi 13 Pro",
        price: 69999,
        image: "https://images.unsplash.com/photo-1598327105666-5b89351aff97?w=500",
        description: "Snapdragon 8 Gen 2, Leica cameras",
        brand: "Xiaomi",
        rating: 4.3,
        reviews: 87,
        stock: 22,
        originalPrice: 74999,
        discount: 7
      },
      {
        id: 7,
        name: "iPhone 13",
        price: 69900,
        image: "https://images.unsplash.com/photo-1632661674596-79bd3e16d1b7?w=500",
        description: "A15 Bionic chip, Dual camera system",
        brand: "Apple",
        rating: 4.7,
        reviews: 198,
        stock: 35,
        originalPrice: 79900,
        discount: 13
      },
      {
        id: 8,
        name: "Samsung Galaxy A54",
        price: 34999,
        image: "https://images.unsplash.com/photo-1610945415295-d9bbf067e59c?w=500",
        description: "Exynos 1380, 50MP camera, 5000mAh battery",
        brand: "Samsung",
        rating: 4.5,
        reviews: 145,
        stock: 40,
        originalPrice: 39999,
        discount: 13
      },
      {
        id: 9,
        name: "OnePlus Nord CE 3",
        price: 24999,
        image: "https://images.unsplash.com/photo-1598327105666-5b89351aff97?w=500",
        description: "Snapdragon 782G, 108MP camera",
        brand: "OnePlus",
        rating: 4.4,
        reviews: 112,
        stock: 45,
        originalPrice: 27999,
        discount: 11
      },
      {
        id: 10,
        name: "Google Pixel 7a",
        price: 43999,
        image: "https://images.unsplash.com/photo-1598327105666-5b89351aff97?w=500",
        description: "Tensor G2, 64MP camera, 90Hz display",
        brand: "Google",
        rating: 4.6,
        reviews: 167,
        stock: 28,
        originalPrice: 47999,
        discount: 8
      },
      {
        id: 11,
        name: "iPhone 14",
        price: 79900,
        image: "https://images.unsplash.com/photo-1678652197831-2d1801b5d5c9?w=500",
        description: "A15 Bionic chip, 12MP camera, 6.1-inch display",
        brand: "Apple",
        rating: 4.7,
        reviews: 178,
        stock: 25,
        originalPrice: 89900,
        discount: 11
      },
      {
        id: 12,
        name: "Samsung Galaxy S23",
        price: 74999,
        image: "https://images.unsplash.com/photo-1678775702101-9ed9cdb1e0f5?w=500",
        description: "Snapdragon 8 Gen 2, 50MP camera",
        brand: "Samsung",
        rating: 4.6,
        reviews: 156,
        stock: 30,
        originalPrice: 79999,
        discount: 6
      },
      {
        id: 13,
        name: "OnePlus 10 Pro",
        price: 49999,
        image: "https://images.unsplash.com/photo-1678775702101-9ed9cdb1e0f5?w=500",
        description: "Snapdragon 8 Gen 1, Hasselblad cameras",
        brand: "OnePlus",
        rating: 4.5,
        reviews: 134,
        stock: 20,
        originalPrice: 54999,
        discount: 9
      },
      {
        id: 14,
        name: "Google Pixel 7",
        price: 59999,
        image: "https://images.unsplash.com/photo-1598327105666-5b89351aff97?w=500",
        description: "Tensor G2, 50MP camera, 90Hz display",
        brand: "Google",
        rating: 4.6,
        reviews: 145,
        stock: 22,
        originalPrice: 64999,
        discount: 8
      },
      {
        id: 15,
        name: "Nothing Phone (1)",
        price: 29999,
        image: "https://images.unsplash.com/photo-1678775702101-9ed9cdb1e0f5?w=500",
        description: "Snapdragon 778G+, Glyph Interface",
        brand: "Nothing",
        rating: 4.4,
        reviews: 98,
        stock: 35,
        originalPrice: 32999,
        discount: 9
      },
      {
        id: 16,
        name: "Xiaomi 12 Pro",
        price: 49999,
        image: "https://images.unsplash.com/photo-1598327105666-5b89351aff97?w=500",
        description: "Snapdragon 8 Gen 1, 50MP cameras",
        brand: "Xiaomi",
        rating: 4.3,
        reviews: 87,
        stock: 25,
        originalPrice: 54999,
        discount: 9
      },
      {
        id: 17,
        name: "iPhone 14 Plus",
        price: 89900,
        image: "https://images.unsplash.com/photo-1678652197831-2d1801b5d5c9?w=500",
        description: "A15 Bionic chip, 6.7-inch display",
        brand: "Apple",
        rating: 4.7,
        reviews: 167,
        stock: 20,
        originalPrice: 99900,
        discount: 10
      },
      {
        id: 18,
        name: "Samsung Galaxy S23+",
        price: 94999,
        image: "https://images.unsplash.com/photo-1678775702101-9ed9cdb1e0f5?w=500",
        description: "Snapdragon 8 Gen 2, 50MP camera",
        brand: "Samsung",
        rating: 4.6,
        reviews: 145,
        stock: 25,
        originalPrice: 99999,
        discount: 5
      },
      {
        id: 19,
        name: "OnePlus Nord N30",
        price: 19999,
        image: "https://images.unsplash.com/photo-1678775702101-9ed9cdb1e0f5?w=500",
        description: "Snapdragon 695, 108MP camera",
        brand: "OnePlus",
        rating: 4.3,
        reviews: 89,
        stock: 40,
        originalPrice: 22999,
        discount: 13
      },
      {
        id: 20,
        name: "Google Pixel 6a",
        price: 34999,
        image: "https://images.unsplash.com/photo-1598327105666-5b89351aff97?w=500",
        description: "Tensor chip, 12MP camera, 60Hz display",
        brand: "Google",
        rating: 4.5,
        reviews: 123,
        stock: 30,
        originalPrice: 39999,
        discount: 13
      },
      {
        id: 21,
        name: "iPhone 13 Pro",
        price: 99900,
        image: "https://images.unsplash.com/photo-1632661674596-79bd3e16d1b7?w=500",
        description: "A15 Bionic chip, Pro camera system",
        brand: "Apple",
        rating: 4.8,
        reviews: 198,
        stock: 15,
        originalPrice: 109900,
        discount: 9
      },
      {
        id: 22,
        name: "Samsung Galaxy A34",
        price: 29999,
        image: "https://images.unsplash.com/photo-1610945415295-d9bbf067e59c?w=500",
        description: "MediaTek Dimensity 1080, 48MP camera",
        brand: "Samsung",
        rating: 4.4,
        reviews: 112,
        stock: 45,
        originalPrice: 32999,
        discount: 9
      },
      {
        id: 23,
        name: "OnePlus Nord 2T",
        price: 27999,
        image: "https://images.unsplash.com/photo-1678775702101-9ed9cdb1e0f5?w=500",
        description: "MediaTek Dimensity 1300, 50MP camera",
        brand: "OnePlus",
        rating: 4.5,
        reviews: 134,
        stock: 35,
        originalPrice: 30999,
        discount: 10
      },
      {
        id: 24,
        name: "Google Pixel 6",
        price: 44999,
        image: "https://images.unsplash.com/photo-1598327105666-5b89351aff97?w=500",
        description: "Tensor chip, 50MP camera, 90Hz display",
        brand: "Google",
        rating: 4.6,
        reviews: 156,
        stock: 25,
        originalPrice: 49999,
        discount: 10
      },
      {
        id: 25,
        name: "Nothing Phone (2) Pro",
        price: 54999,
        image: "https://images.unsplash.com/photo-1678775702101-9ed9cdb1e0f5?w=500",
        description: "Snapdragon 8+ Gen 1, Enhanced Glyph",
        brand: "Nothing",
        rating: 4.5,
        reviews: 123,
        stock: 20,
        originalPrice: 59999,
        discount: 8
      },
      {
        id: 26,
        name: "Xiaomi 13",
        price: 54999,
        image: "https://images.unsplash.com/photo-1598327105666-5b89351aff97?w=500",
        description: "Snapdragon 8 Gen 2, Leica cameras",
        brand: "Xiaomi",
        rating: 4.4,
        reviews: 98,
        stock: 28,
        originalPrice: 59999,
        discount: 8
      },
      {
        id: 27,
        name: "iPhone 13 mini",
        price: 59900,
        image: "https://images.unsplash.com/photo-1632661674596-79bd3e16d1b7?w=500",
        description: "A15 Bionic chip, 5.4-inch display",
        brand: "Apple",
        rating: 4.6,
        reviews: 145,
        stock: 30,
        originalPrice: 69900,
        discount: 14
      },
      {
        id: 28,
        name: "Samsung Galaxy A53",
        price: 27999,
        image: "https://images.unsplash.com/photo-1610945415295-d9bbf067e59c?w=500",
        description: "Exynos 1280, 64MP camera",
        brand: "Samsung",
        rating: 4.4,
        reviews: 112,
        stock: 40,
        originalPrice: 30999,
        discount: 10
      },
      {
        id: 29,
        name: "OnePlus Nord CE 2",
        price: 19999,
        image: "https://images.unsplash.com/photo-1678775702101-9ed9cdb1e0f5?w=500",
        description: "MediaTek Dimensity 900, 64MP camera",
        brand: "OnePlus",
        rating: 4.3,
        reviews: 89,
        stock: 45,
        originalPrice: 22999,
        discount: 13
      },
      {
        id: 30,
        name: "Google Pixel 5a",
        price: 29999,
        image: "https://images.unsplash.com/photo-1598327105666-5b89351aff97?w=500",
        description: "Snapdragon 765G, 12MP camera",
        brand: "Google",
        rating: 4.5,
        reviews: 123,
        stock: 35,
        originalPrice: 34999,
        discount: 14
      },
      {
        id: 31,
        name: "iPhone 12",
        price: 49900,
        image: "https://images.unsplash.com/photo-1632661674596-79bd3e16d1b7?w=500",
        description: "A14 Bionic chip, Dual camera system",
        brand: "Apple",
        rating: 4.6,
        reviews: 167,
        stock: 40,
        originalPrice: 59900,
        discount: 17
      },
      {
        id: 32,
        name: "Samsung Galaxy A73",
        price: 39999,
        image: "https://images.unsplash.com/photo-1610945415295-d9bbf067e59c?w=500",
        description: "Snapdragon 778G, 108MP camera",
        brand: "Samsung",
        rating: 4.5,
        reviews: 134,
        stock: 30,
        originalPrice: 44999,
        discount: 11
      },
      {
        id: 33,
        name: "OnePlus 9RT",
        price: 39999,
        image: "https://images.unsplash.com/photo-1678775702101-9ed9cdb1e0f5?w=500",
        description: "Snapdragon 888, 50MP camera",
        brand: "OnePlus",
        rating: 4.4,
        reviews: 112,
        stock: 25,
        originalPrice: 44999,
        discount: 11
      },
      {
        id: 34,
        name: "Google Pixel 4a",
        price: 24999,
        image: "https://images.unsplash.com/photo-1598327105666-5b89351aff97?w=500",
        description: "Snapdragon 730G, 12MP camera",
        brand: "Google",
        rating: 4.5,
        reviews: 145,
        stock: 35,
        originalPrice: 29999,
        discount: 17
      },
      {
        id: 35,
        name: "Nothing Phone (1) Pro",
        price: 39999,
        image: "https://images.unsplash.com/photo-1678775702101-9ed9cdb1e0f5?w=500",
        description: "Snapdragon 778G+, Enhanced Glyph",
        brand: "Nothing",
        rating: 4.4,
        reviews: 98,
        stock: 30,
        originalPrice: 44999,
        discount: 11
      },
      {
        id: 36,
        name: "Xiaomi 11T Pro",
        price: 39999,
        image: "https://images.unsplash.com/photo-1598327105666-5b89351aff97?w=500",
        description: "Snapdragon 888, 108MP camera",
        brand: "Xiaomi",
        rating: 4.3,
        reviews: 87,
        stock: 28,
        originalPrice: 44999,
        discount: 11
      },
      {
        id: 37,
        name: "iPhone 12 Pro",
        price: 79900,
        image: "https://images.unsplash.com/photo-1632661674596-79bd3e16d1b7?w=500",
        description: "A14 Bionic chip, Pro camera system",
        brand: "Apple",
        rating: 4.7,
        reviews: 178,
        stock: 25,
        originalPrice: 89900,
        discount: 11
      },
      {
        id: 38,
        name: "Samsung Galaxy A52",
        price: 24999,
        image: "https://images.unsplash.com/photo-1610945415295-d9bbf067e59c?w=500",
        description: "Snapdragon 720G, 64MP camera",
        brand: "Samsung",
        rating: 4.4,
        reviews: 112,
        stock: 40,
        originalPrice: 27999,
        discount: 11
      },
      {
        id: 39,
        name: "OnePlus Nord",
        price: 17999,
        image: "https://images.unsplash.com/photo-1678775702101-9ed9cdb1e0f5?w=500",
        description: "Snapdragon 765G, 48MP camera",
        brand: "OnePlus",
        rating: 4.3,
        reviews: 89,
        stock: 45,
        originalPrice: 20999,
        discount: 14
      },
      {
        id: 40,
        name: "Google Pixel 3a",
        price: 19999,
        image: "https://images.unsplash.com/photo-1598327105666-5b89351aff97?w=500",
        description: "Snapdragon 670, 12MP camera",
        brand: "Google",
        rating: 4.4,
        reviews: 123,
        stock: 35,
        originalPrice: 24999,
        discount: 20
      },
      {
        id: 41,
        name: "iPhone 11",
        price: 39900,
        image: "https://images.unsplash.com/photo-1632661674596-79bd3e16d1b7?w=500",
        description: "A13 Bionic chip, Dual camera system",
        brand: "Apple",
        rating: 4.5,
        reviews: 156,
        stock: 45,
        originalPrice: 49900,
        discount: 20
      },
      {
        id: 42,
        name: "Samsung Galaxy A51",
        price: 19999,
        image: "https://images.unsplash.com/photo-1610945415295-d9bbf067e59c?w=500",
        description: "Exynos 9611, 48MP camera",
        brand: "Samsung",
        rating: 4.3,
        reviews: 98,
        stock: 50,
        originalPrice: 22999,
        discount: 13
      },
      {
        id: 43,
        name: "OnePlus 8T",
        price: 34999,
        image: "https://images.unsplash.com/photo-1678775702101-9ed9cdb1e0f5?w=500",
        description: "Snapdragon 865, 48MP camera",
        brand: "OnePlus",
        rating: 4.4,
        reviews: 112,
        stock: 30,
        originalPrice: 39999,
        discount: 13
      },
      {
        id: 44,
        name: "Google Pixel 2",
        price: 14999,
        image: "https://images.unsplash.com/photo-1598327105666-5b89351aff97?w=500",
        description: "Snapdragon 835, 12MP camera",
        brand: "Google",
        rating: 4.3,
        reviews: 89,
        stock: 40,
        originalPrice: 19999,
        discount: 25
      },
      {
        id: 45,
        name: "Xiaomi Mi 11",
        price: 34999,
        image: "https://images.unsplash.com/photo-1598327105666-5b89351aff97?w=500",
        description: "Snapdragon 888, 108MP camera",
        brand: "Xiaomi",
        rating: 4.4,
        reviews: 98,
        stock: 35,
        originalPrice: 39999,
        discount: 13
      },
      {
        id: 46,
        name: "iPhone SE (2022)",
        price: 49900,
        image: "https://images.unsplash.com/photo-1632661674596-79bd3e16d1b7?w=500",
        description: "A15 Bionic chip, Single camera",
        brand: "Apple",
        rating: 4.5,
        reviews: 134,
        stock: 40,
        originalPrice: 54900,
        discount: 9
      },
      {
        id: 47,
        name: "Samsung Galaxy A32",
        price: 17999,
        image: "https://images.unsplash.com/photo-1610945415295-d9bbf067e59c?w=500",
        description: "MediaTek Helio G80, 64MP camera",
        brand: "Samsung",
        rating: 4.2,
        reviews: 87,
        stock: 45,
        originalPrice: 20999,
        discount: 14
      },
      {
        id: 48,
        name: "OnePlus 7T",
        price: 29999,
        image: "https://images.unsplash.com/photo-1678775702101-9ed9cdb1e0f5?w=500",
        description: "Snapdragon 855+, 48MP camera",
        brand: "OnePlus",
        rating: 4.3,
        reviews: 98,
        stock: 35,
        originalPrice: 34999,
        discount: 14
      },
      {
        id: 49,
        name: "Google Pixel 1",
        price: 9999,
        image: "https://images.unsplash.com/photo-1598327105666-5b89351aff97?w=500",
        description: "Snapdragon 821, 12MP camera",
        brand: "Google",
        rating: 4.2,
        reviews: 76,
        stock: 30,
        originalPrice: 14999,
        discount: 33
      },
      {
        id: 50,
        name: "Xiaomi Redmi Note 12 Pro",
        price: 19999,
        image: "https://images.unsplash.com/photo-1598327105666-5b89351aff97?w=500",
        description: "MediaTek Dimensity 1080, 108MP camera",
        brand: "Xiaomi",
        rating: 4.3,
        reviews: 89,
        stock: 50,
        originalPrice: 22999,
        discount: 13
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

export default MobileProducts; 