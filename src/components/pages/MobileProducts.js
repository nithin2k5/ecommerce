import { useState, useEffect } from 'react';
import { FaRupeeSign, FaShoppingCart } from 'react-icons/fa';
import '../../styles/Products.css';

function MobileProducts() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

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
      // Add more products as needed
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
  );
}

export default MobileProducts; 