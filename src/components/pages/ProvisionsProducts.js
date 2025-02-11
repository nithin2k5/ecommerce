import { useState, useEffect } from 'react';
import { FaRupeeSign, FaShoppingCart } from 'react-icons/fa';
import '../../styles/Products.css';

function ProvisionsProducts() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const mockProducts = [
      {
        id: 1,
        name: "Organic Rice",
        price: 899,
        image: "https://example.com/rice.jpg",
        description: "5kg Premium Basmati"
      },
      {
        id: 2,
        name: "Cooking Oil",
        price: 199,
        image: "https://example.com/oil.jpg",
        description: "1L Refined Sunflower Oil"
      },
      {
        id: 3,
        name: "Pulses Combo",
        price: 599,
        image: "https://example.com/pulses.jpg",
        description: "Assorted Dal Pack 2kg"
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
  
}

export default ProvisionsProducts; 