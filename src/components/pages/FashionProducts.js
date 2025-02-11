import { useState, useEffect } from 'react';
import { FaRupeeSign, FaShoppingCart } from 'react-icons/fa';
import '../../styles/Products.css';

function FashionProducts() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const mockProducts = [
      {
        id: 1,
        name: "Men's Casual Shirt",
        price: 1499,
        image: "https://example.com/shirt.jpg",
        description: "Cotton Regular Fit"
      },
      {
        id: 2,
        name: "Women's Dress",
        price: 2499,
        image: "https://example.com/dress.jpg",
        description: "Floral Print Maxi"
      },
      {
        id: 3,
        name: "Running Shoes",
        price: 3999,
        image: "https://example.com/shoes.jpg",
        description: "Lightweight Sports Shoes"
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

export default FashionProducts; 