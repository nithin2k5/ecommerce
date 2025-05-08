import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { 
  FaRupeeSign, 
  FaShoppingCart, 
  FaStar, 
  FaTruck, 
  FaUndo, 
  FaShieldAlt, 
  FaHeart, 
  FaShare, 
  FaCheck,
  FaRegStar,
  FaStarHalfAlt,
  FaRegHeart,
  FaHeart as FaSolidHeart
} from 'react-icons/fa';
import { addToCart } from '../../features/cartSlice';
import '../../styles/ProductDetail.css';

function ProductDetail() {
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [quantity, setQuantity] = useState(1);
  const [selectedImage, setSelectedImage] = useState(0);
  const [activeTab, setActiveTab] = useState('features');
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [showShareModal, setShowShareModal] = useState(false);

  // Mock product data (replace with actual API call)
  const product = {
    id: id,
    name: "Premium Wireless Headphones",
    price: 4999,
    originalPrice: 6999,
    discount: 28,
    description: "Experience crystal-clear sound with our premium wireless headphones. Featuring active noise cancellation, 30-hour battery life, and ultra-comfortable ear cushions.",
    images: [
      "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500",
      "https://images.unsplash.com/photo-1572536147248-ac59a8abfa4b?w=500",
      "https://images.unsplash.com/photo-1546435770-a3e426bf472b?w=500",
      "https://images.unsplash.com/photo-1545127398-14699f92334b?w=500"
    ],
    rating: 4.5,
    reviews: 128,
    stock: 15,
    brand: "SoundMaster",
    category: "Electronics",
    features: [
      "Active Noise Cancellation",
      "30-hour Battery Life",
      "Bluetooth 5.0",
      "Built-in Microphone",
      "Foldable Design",
      "Quick Charge Support"
    ],
    specifications: {
      "Connectivity": "Bluetooth 5.0",
      "Battery Life": "30 hours",
      "Charging Time": "2 hours",
      "Weight": "250g",
      "Warranty": "1 year",
      "Color": "Black"
    },
    highlights: [
      "Premium Sound Quality",
      "Comfortable for Long Hours",
      "Durable Build Quality",
      "Latest Technology"
    ],
    delivery: {
      "Standard Delivery": "3-5 business days",
      "Express Delivery": "1-2 business days",
      "Free Delivery": "On orders above ₹999"
    }
  };

  const handleAddToCart = () => {
    dispatch(addToCart({
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.images[0],
      quantity: quantity
    }));
  };

  const handleBuyNow = () => {
    handleAddToCart();
    navigate('/checkout');
  };

  const handleQuantityChange = (value) => {
    const newQuantity = quantity + value;
    if (newQuantity >= 1 && newQuantity <= product.stock) {
      setQuantity(newQuantity);
    }
  };

  const renderStars = (rating) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;

    for (let i = 0; i < 5; i++) {
      if (i < fullStars) {
        stars.push(<FaStar key={i} className="star-icon filled" />);
      } else if (i === fullStars && hasHalfStar) {
        stars.push(<FaStarHalfAlt key={i} className="star-icon half" />);
      } else {
        stars.push(<FaRegStar key={i} className="star-icon" />);
      }
    }
    return stars;
  };

  const handleShare = () => {
    setShowShareModal(true);
    // Implement share functionality
  };

  const toggleWishlist = () => {
    setIsWishlisted(!isWishlisted);
    // Implement wishlist functionality
  };

  return (
    <div className="product-detail-page">
      <div className="product-detail-container">
        <div className="product-gallery">
          <div className="main-image">
            <img src={product.images[selectedImage]} alt={product.name} />
            {product.discount > 0 && (
              <div className="discount-badge">
                {product.discount}% OFF
              </div>
            )}
          </div>
          <div className="thumbnail-list">
            {product.images.map((image, index) => (
              <div
                key={index}
                className={`thumbnail ${selectedImage === index ? 'active' : ''}`}
                onClick={() => setSelectedImage(index)}
              >
                <img src={image} alt={`${product.name} view ${index + 1}`} />
              </div>
            ))}
          </div>
        </div>

        <div className="product-info">
          <div className="product-header">
            <div className="brand-badge">{product.brand}</div>
            <h1 className="product-name">{product.name}</h1>
            <div className="product-meta">
              <div className="rating">
                {renderStars(product.rating)}
                <span className="rating-value">{product.rating}</span>
                <span className="reviews">({product.reviews} reviews)</span>
              </div>
            </div>
          </div>

          <div className="price-section">
            <div className="product-price">
              <FaRupeeSign className="rupee-icon" />
              <span>{product.price.toLocaleString('en-IN')}</span>
            </div>
            {product.originalPrice && (
              <div className="original-price">
                <FaRupeeSign className="rupee-icon" />
                <span>{product.originalPrice.toLocaleString('en-IN')}</span>
              </div>
            )}
          </div>

          <div className="product-highlights">
            {product.highlights.map((highlight, index) => (
              <div key={index} className="highlight-item">
                <FaCheck className="check-icon" />
                <span>{highlight}</span>
              </div>
            ))}
          </div>

          <p className="product-description">{product.description}</p>

          <div className="product-stock">
            <span className={`stock-status ${product.stock > 0 ? 'in-stock' : 'out-of-stock'}`}>
              {product.stock > 0 ? 'In Stock' : 'Out of Stock'}
            </span>
            {product.stock > 0 && <span className="stock-count">{product.stock} units available</span>}
          </div>

          <div className="quantity-selector">
            <span className="quantity-label">Quantity:</span>
            <div className="quantity-controls">
              <button
                className="quantity-btn"
                onClick={() => handleQuantityChange(-1)}
                disabled={quantity <= 1}
              >
                -
              </button>
              <span className="quantity">{quantity}</span>
              <button
                className="quantity-btn"
                onClick={() => handleQuantityChange(1)}
                disabled={quantity >= product.stock}
              >
                +
              </button>
            </div>
          </div>

          <div className="product-actions">
            <button className="add-to-cart-btn" onClick={handleAddToCart}>
              <FaShoppingCart className="cart-icon" />
              Add to Cart
            </button>
            <button className="buy-now-btn" onClick={handleBuyNow}>
              Buy Now
            </button>
            <button 
              className={`wishlist-btn ${isWishlisted ? 'active' : ''}`}
              onClick={toggleWishlist}
            >
              {isWishlisted ? <FaSolidHeart className="heart-icon" /> : <FaRegHeart className="heart-icon" />}
            </button>
            <button className="share-btn" onClick={handleShare}>
              <FaShare className="share-icon" />
            </button>
          </div>

          <div className="product-features">
            <div className="feature">
              <FaTruck className="feature-icon" />
              <div className="feature-content">
                <span className="feature-title">Free Delivery</span>
                <span className="feature-subtitle">On orders above ₹999</span>
              </div>
            </div>
            <div className="feature">
              <FaUndo className="feature-icon" />
              <div className="feature-content">
                <span className="feature-title">7 Days Return</span>
                <span className="feature-subtitle">Easy return policy</span>
              </div>
            </div>
            <div className="feature">
              <FaShieldAlt className="feature-icon" />
              <div className="feature-content">
                <span className="feature-title">1 Year Warranty</span>
                <span className="feature-subtitle">Manufacturer warranty</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="product-details-section">
        <div className="details-tabs">
          <div 
            className={`tab ${activeTab === 'features' ? 'active' : ''}`}
            onClick={() => setActiveTab('features')}
          >
            Features
          </div>
          <div 
            className={`tab ${activeTab === 'specifications' ? 'active' : ''}`}
            onClick={() => setActiveTab('specifications')}
          >
            Specifications
          </div>
          <div 
            className={`tab ${activeTab === 'delivery' ? 'active' : ''}`}
            onClick={() => setActiveTab('delivery')}
          >
            Delivery
          </div>
        </div>

        <div className="tab-content">
          {activeTab === 'features' && (
            <div className="features-list">
              {product.features.map((feature, index) => (
                <div key={index} className="feature-item">
                  <FaStar className="feature-bullet" />
                  <span>{feature}</span>
                </div>
              ))}
            </div>
          )}

          {activeTab === 'specifications' && (
            <div className="specifications-table">
              {Object.entries(product.specifications).map(([key, value]) => (
                <div key={key} className="spec-row">
                  <span className="spec-label">{key}</span>
                  <span className="spec-value">{value}</span>
                </div>
              ))}
            </div>
          )}

          {activeTab === 'delivery' && (
            <div className="delivery-info">
              {Object.entries(product.delivery).map(([type, time]) => (
                <div key={type} className="delivery-row">
                  <span className="delivery-type">{type}</span>
                  <span className="delivery-time">{time}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default ProductDetail; 