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
      },
      {
        id: 13,
        name: "iPad mini 6",
        price: 49900,
        image: "https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=500",
        description: "A15 Bionic, 64GB, Wi-Fi",
        brand: "Apple",
        rating: 4.8,
        reviews: 178,
        stock: 25,
        originalPrice: 54900,
        discount: 9
      },
      {
        id: 14,
        name: "Sony WF-1000XM5",
        price: 24990,
        image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500",
        description: "Wireless Earbuds, Noise Cancelling",
        brand: "Sony",
        rating: 4.7,
        reviews: 167,
        stock: 30,
        originalPrice: 26990,
        discount: 7
      },
      {
        id: 15,
        name: "Dell XPS 15",
        price: 159990,
        image: "https://images.unsplash.com/photo-1593642632823-8f785ba67e45?w=500",
        description: "Intel i9, 32GB RAM, 1TB SSD",
        brand: "Dell",
        rating: 4.8,
        reviews: 145,
        stock: 8,
        originalPrice: 169990,
        discount: 6
      },
      {
        id: 16,
        name: "Apple Watch Ultra",
        price: 89900,
        image: "https://images.unsplash.com/photo-1579586337278-3befd40fd17a?w=500",
        description: "GPS + Cellular, 49mm, Titanium",
        brand: "Apple",
        rating: 4.9,
        reviews: 198,
        stock: 15,
        originalPrice: 94900,
        discount: 5
      },
      {
        id: 17,
        name: "Mac mini M2",
        price: 69900,
        image: "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=500",
        description: "8GB RAM, 256GB SSD",
        brand: "Apple",
        rating: 4.7,
        reviews: 156,
        stock: 20,
        originalPrice: 74900,
        discount: 7
      },
      {
        id: 18,
        name: "Bose SoundLink Flex",
        price: 12990,
        image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500",
        description: "Portable Bluetooth Speaker",
        brand: "Bose",
        rating: 4.6,
        reviews: 134,
        stock: 35,
        originalPrice: 14990,
        discount: 13
      },
      {
        id: 19,
        name: "Microsoft Surface Laptop 5",
        price: 99990,
        image: "https://images.unsplash.com/photo-1593642632823-8f785ba67e45?w=500",
        description: "Intel i7, 16GB RAM, 512GB SSD",
        brand: "Microsoft",
        rating: 4.7,
        reviews: 145,
        stock: 18,
        originalPrice: 104990,
        discount: 5
      },
      {
        id: 20,
        name: "Samsung Galaxy Watch 6",
        price: 29990,
        image: "https://images.unsplash.com/photo-1579586337278-3befd40fd17a?w=500",
        description: "44mm, LTE, Stainless Steel",
        brand: "Samsung",
        rating: 4.6,
        reviews: 123,
        stock: 25,
        originalPrice: 32990,
        discount: 9
      },
      {
        id: 21,
        name: "Mac Studio",
        price: 199900,
        image: "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=500",
        description: "M2 Max, 32GB RAM, 512GB SSD",
        brand: "Apple",
        rating: 4.9,
        reviews: 167,
        stock: 10,
        originalPrice: 219900,
        discount: 9
      },
      {
        id: 22,
        name: "Sony WH-1000XM4",
        price: 24990,
        image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500",
        description: "Wireless Noise Cancelling Headphones",
        brand: "Sony",
        rating: 4.7,
        reviews: 198,
        stock: 30,
        originalPrice: 27990,
        discount: 11
      },
      {
        id: 23,
        name: "iPad 10th Gen",
        price: 44900,
        image: "https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=500",
        description: "A14 Bionic, 64GB, Wi-Fi",
        brand: "Apple",
        rating: 4.6,
        reviews: 145,
        stock: 25,
        originalPrice: 49900,
        discount: 10
      },
      {
        id: 24,
        name: "Dell Alienware x17",
        price: 199990,
        image: "https://images.unsplash.com/photo-1593642632823-8f785ba67e45?w=500",
        description: "Intel i9, 32GB RAM, RTX 3080",
        brand: "Dell",
        rating: 4.8,
        reviews: 134,
        stock: 8,
        originalPrice: 209990,
        discount: 5
      },
      {
        id: 25,
        name: "Apple Watch SE",
        price: 29900,
        image: "https://images.unsplash.com/photo-1579586337278-3befd40fd17a?w=500",
        description: "GPS, 40mm, Aluminum",
        brand: "Apple",
        rating: 4.7,
        reviews: 178,
        stock: 35,
        originalPrice: 32900,
        discount: 9
      },
      {
        id: 26,
        name: "MacBook Pro 14",
        price: 189900,
        image: "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=500",
        description: "M2 Pro, 16GB RAM, 512GB SSD",
        brand: "Apple",
        rating: 4.9,
        reviews: 189,
        stock: 12,
        originalPrice: 199900,
        discount: 5
      },
      {
        id: 27,
        name: "Bose QuietComfort Earbuds II",
        price: 22990,
        image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500",
        description: "Wireless Earbuds, Noise Cancelling",
        brand: "Bose",
        rating: 4.7,
        reviews: 156,
        stock: 28,
        originalPrice: 24990,
        discount: 8
      },
      {
        id: 28,
        name: "Microsoft Surface Studio",
        price: 249990,
        image: "https://images.unsplash.com/photo-1593642632823-8f785ba67e45?w=500",
        description: "Intel i7, 32GB RAM, 2TB SSD",
        brand: "Microsoft",
        rating: 4.8,
        reviews: 123,
        stock: 5,
        originalPrice: 259990,
        discount: 4
      },
      {
        id: 29,
        name: "Samsung Galaxy Book3 Ultra",
        price: 179990,
        image: "https://images.unsplash.com/photo-1593642632823-8f785ba67e45?w=500",
        description: "Intel i9, 32GB RAM, RTX 4070",
        brand: "Samsung",
        rating: 4.8,
        reviews: 134,
        stock: 8,
        originalPrice: 189990,
        discount: 5
      },
      {
        id: 30,
        name: "Apple Watch Series 8",
        price: 45900,
        image: "https://images.unsplash.com/photo-1579586337278-3befd40fd17a?w=500",
        description: "GPS + Cellular, 45mm",
        brand: "Apple",
        rating: 4.8,
        reviews: 167,
        stock: 25,
        originalPrice: 49900,
        discount: 8
      },
      {
        id: 31,
        name: "Mac Pro",
        price: 699900,
        image: "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=500",
        description: "Intel Xeon, 32GB RAM, 1TB SSD",
        brand: "Apple",
        rating: 4.9,
        reviews: 89,
        stock: 5,
        originalPrice: 749900,
        discount: 7
      },
      {
        id: 32,
        name: "Sony WH-XB910N",
        price: 19990,
        image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500",
        description: "Extra Bass Wireless Headphones",
        brand: "Sony",
        rating: 4.5,
        reviews: 112,
        stock: 35,
        originalPrice: 22990,
        discount: 13
      },
      {
        id: 33,
        name: "iPad Air 4th Gen",
        price: 49900,
        image: "https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=500",
        description: "A14 Bionic, 64GB, Wi-Fi",
        brand: "Apple",
        rating: 4.7,
        reviews: 145,
        stock: 30,
        originalPrice: 54900,
        discount: 9
      },
      {
        id: 34,
        name: "Dell XPS 17",
        price: 189990,
        image: "https://images.unsplash.com/photo-1593642632823-8f785ba67e45?w=500",
        description: "Intel i9, 32GB RAM, RTX 3060",
        brand: "Dell",
        rating: 4.8,
        reviews: 123,
        stock: 10,
        originalPrice: 199990,
        discount: 5
      },
      {
        id: 35,
        name: "Apple Watch Series 7",
        price: 39900,
        image: "https://images.unsplash.com/photo-1579586337278-3befd40fd17a?w=500",
        description: "GPS, 45mm, Aluminum",
        brand: "Apple",
        rating: 4.7,
        reviews: 156,
        stock: 30,
        originalPrice: 44900,
        discount: 11
      },
      {
        id: 36,
        name: "MacBook Air M1",
        price: 89900,
        image: "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=500",
        description: "13-inch, 8GB RAM, 256GB SSD",
        brand: "Apple",
        rating: 4.8,
        reviews: 198,
        stock: 25,
        originalPrice: 99900,
        discount: 10
      },
      {
        id: 37,
        name: "Bose SoundLink Revolve+",
        price: 19990,
        image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500",
        description: "360° Bluetooth Speaker",
        brand: "Bose",
        rating: 4.6,
        reviews: 134,
        stock: 30,
        originalPrice: 22990,
        discount: 13
      },
      {
        id: 38,
        name: "Microsoft Surface Go 3",
        price: 49990,
        image: "https://images.unsplash.com/photo-1593642632823-8f785ba67e45?w=500",
        description: "Intel Pentium, 8GB RAM, 128GB SSD",
        brand: "Microsoft",
        rating: 4.5,
        reviews: 112,
        stock: 35,
        originalPrice: 54990,
        discount: 9
      },
      {
        id: 39,
        name: "Samsung Galaxy Watch 5",
        price: 24990,
        image: "https://images.unsplash.com/photo-1579586337278-3befd40fd17a?w=500",
        description: "40mm, Bluetooth, Aluminum",
        brand: "Samsung",
        rating: 4.6,
        reviews: 145,
        stock: 30,
        originalPrice: 27990,
        discount: 11
      },
      {
        id: 40,
        name: "Apple Watch Series 6",
        price: 34900,
        image: "https://images.unsplash.com/photo-1579586337278-3befd40fd17a?w=500",
        description: "GPS, 44mm, Aluminum",
        brand: "Apple",
        rating: 4.7,
        reviews: 167,
        stock: 35,
        originalPrice: 39900,
        discount: 13
      },
      {
        id: 41,
        name: "MacBook Pro 13",
        price: 129900,
        image: "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=500",
        description: "M2, 8GB RAM, 256GB SSD",
        brand: "Apple",
        rating: 4.8,
        reviews: 178,
        stock: 20,
        originalPrice: 139900,
        discount: 7
      },
      {
        id: 42,
        name: "Sony WH-CH720N",
        price: 14990,
        image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500",
        description: "Wireless Noise Cancelling Headphones",
        brand: "Sony",
        rating: 4.5,
        reviews: 98,
        stock: 40,
        originalPrice: 17990,
        discount: 17
      },
      {
        id: 43,
        name: "iPad Pro 11",
        price: 79900,
        image: "https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=500",
        description: "M2, 128GB, Wi-Fi",
        brand: "Apple",
        rating: 4.8,
        reviews: 156,
        stock: 25,
        originalPrice: 84900,
        discount: 6
      },
      {
        id: 44,
        name: "Dell XPS 13 Plus",
        price: 149990,
        image: "https://images.unsplash.com/photo-1593642632823-8f785ba67e45?w=500",
        description: "Intel i7, 16GB RAM, 512GB SSD",
        brand: "Dell",
        rating: 4.7,
        reviews: 134,
        stock: 15,
        originalPrice: 159990,
        discount: 6
      },
      {
        id: 45,
        name: "Apple Watch Series 5",
        price: 29900,
        image: "https://images.unsplash.com/photo-1579586337278-3befd40fd17a?w=500",
        description: "GPS, 44mm, Aluminum",
        brand: "Apple",
        rating: 4.6,
        reviews: 145,
        stock: 40,
        originalPrice: 34900,
        discount: 14
      },
      {
        id: 46,
        name: "MacBook Air M1",
        price: 79900,
        image: "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=500",
        description: "13-inch, 8GB RAM, 256GB SSD",
        brand: "Apple",
        rating: 4.8,
        reviews: 189,
        stock: 30,
        originalPrice: 89900,
        discount: 11
      },
      {
        id: 47,
        name: "Bose QuietComfort 35 II",
        price: 19990,
        image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500",
        description: "Wireless Noise Cancelling Headphones",
        brand: "Bose",
        rating: 4.7,
        reviews: 167,
        stock: 35,
        originalPrice: 22990,
        discount: 13
      },
      {
        id: 48,
        name: "Microsoft Surface Laptop 4",
        price: 89990,
        image: "https://images.unsplash.com/photo-1593642632823-8f785ba67e45?w=500",
        description: "Intel i5, 8GB RAM, 256GB SSD",
        brand: "Microsoft",
        rating: 4.6,
        reviews: 134,
        stock: 25,
        originalPrice: 94990,
        discount: 5
      },
      {
        id: 49,
        name: "Samsung Galaxy Watch 4",
        price: 19990,
        image: "https://images.unsplash.com/photo-1579586337278-3befd40fd17a?w=500",
        description: "40mm, Bluetooth, Aluminum",
        brand: "Samsung",
        rating: 4.5,
        reviews: 123,
        stock: 35,
        originalPrice: 22990,
        discount: 13
      },
      {
        id: 50,
        name: "Apple Watch Series 4",
        price: 24900,
        image: "https://images.unsplash.com/photo-1579586337278-3befd40fd17a?w=500",
        description: "GPS, 44mm, Aluminum",
        brand: "Apple",
        rating: 4.6,
        reviews: 134,
        stock: 45,
        originalPrice: 29900,
        discount: 17
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

export default ElectronicsProducts; 