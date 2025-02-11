import { useState, useEffect } from 'react';
import { FaRupeeSign, FaShoppingCart } from 'react-icons/fa';
import '../../styles/Products.css';

function AppliancesProducts() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const mockProducts = [
      {
        id: 1,
        name: "LG 8kg Washing Machine",
        price: 35990,
        image: "https://example.com/washing.jpg",
        description: "Fully Automatic Front Load"
      },
      {
        id: 2,
        name: "Samsung 253L Refrigerator",
        price: 24990,
        image: "https://example.com/fridge.jpg",
        description: "Double Door Frost Free"
      },
      {
        id: 3,
        name: "Havells Air Conditioner",
        price: 32990,
        image: "https://example.com/ac.jpg",
        description: "1.5 Ton Split AC, 5 Star"
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
  // ... rest of the component is similar to ElectronicsProducts
}

export default AppliancesProducts; 