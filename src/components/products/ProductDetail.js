import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { FaRupeeSign, FaShoppingCart, FaStar, FaTruck, FaUndo, FaShieldAlt } from 'react-icons/fa';
import { addToCart } from '../../features/cartSlice';
import '../../styles/ProductDetail.css';

function ProductDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    // In a real app, this would be an API call
    const mockProduct = {
      id: parseInt(id),
      name: "Sample Product",
      price: 1299.99,
      image: "https://example.com/product.jpg",
      description: "This is a detailed description of the product. It includes all the important features and specifications that a customer would want to know about.",
      rating: 4.5,
      reviews: 128,
      stock: 15,
      brand: "Sample Brand",
      category: "Electronics",
      features: [
        "High-quality materials",
        "Durable construction",
        "Easy to use",
        "Long-lasting battery"
      ],
      specifications: {
        "Dimensions": "10 x 5 x 2 inches",
        "Weight": "1.5 lbs",
        "Color": "Black",
        "Warranty": "1 year"
      }
    };
    
    setProduct(mockProduct);
    setLoading(false);
  }, [id]);

  const handleAddToCart = () => {
    dispatch(addToCart({ ...product, quantity }));
  };

  const handleBuyNow = () => {
    dispatch(addToCart({ ...product, quantity }));
    navigate('/checkout');
  };

  const handleQuantityChange = (value) => {
    const newQuantity = quantity + value;
    if (newQuantity >= 1 && newQuantity <= product.stock) {
      setQuantity(newQuantity);
    }
  };

  if (loading) return <div className="loading">Loading...</div>;
  if (!product) return <div className="error">Product not found</div>;

  return (
    <div className="product-detail-container">
      <div className="product-detail">
        <div className="product-image-container">
          <img src={product.image} alt={product.name} />
        </div>
        
        <div className="product-info">
          <div className="product-header">
            <h1>{product.name}</h1>
            <div className="product-rating">
              <div className="stars">
                {[...Array(5)].map((_, index) => (
                  <FaStar
                    key={index}
                    className={index < Math.floor(product.rating) ? 'star filled' : 'star'}
                  />
                ))}
              </div>
              <span className="reviews">({product.reviews} reviews)</span>
            </div>
          </div>

          <div className="product-price">
            <FaRupeeSign className="rupee-icon" />
            <span>{product.price.toLocaleString('en-IN')}</span>
          </div>

          <div className="product-description">
            <h3>Description</h3>
            <p>{product.description}</p>
          </div>

          <div className="product-features">
            <h3>Key Features</h3>
            <ul>
              {product.features.map((feature, index) => (
                <li key={index}>{feature}</li>
              ))}
            </ul>
          </div>

          <div className="product-specifications">
            <h3>Specifications</h3>
            <div className="specs-grid">
              {Object.entries(product.specifications).map(([key, value]) => (
                <div key={key} className="spec-item">
                  <span className="spec-label">{key}:</span>
                  <span className="spec-value">{value}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="product-actions">
            <div className="quantity-selector">
              <button onClick={() => handleQuantityChange(-1)}>-</button>
              <span>{quantity}</span>
              <button onClick={() => handleQuantityChange(1)}>+</button>
            </div>

            <div className="action-buttons">
              <button className="add-to-cart-btn" onClick={handleAddToCart}>
                <FaShoppingCart className="cart-icon" />
                Add to Cart
              </button>
              <button className="buy-now-btn" onClick={handleBuyNow}>
                Buy Now
              </button>
            </div>
          </div>

          <div className="product-benefits">
            <div className="benefit-item">
              <FaTruck className="benefit-icon" />
              <span>Free Delivery</span>
            </div>
            <div className="benefit-item">
              <FaUndo className="benefit-icon" />
              <span>7 Days Return</span>
            </div>
            <div className="benefit-item">
              <FaShieldAlt className="benefit-icon" />
              <span>Warranty</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProductDetail; 