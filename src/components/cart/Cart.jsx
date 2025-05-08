import { useSelector, useDispatch } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { FaRupeeSign, FaTrash, FaArrowLeft, FaShoppingBag } from 'react-icons/fa';
import { removeFromCart, updateQuantity } from '../../features/cartSlice';
import '../../styles/Cart.css';

function Cart() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { items, total } = useSelector((state) => state.cart);

  const handleQuantityChange = (id, quantity) => {
    if (quantity < 1) return;
    dispatch(updateQuantity({ id, quantity }));
  };

  const handleRemoveItem = (id) => {
    dispatch(removeFromCart(id));
  };

  const formatPrice = (price) => {
    return price.toLocaleString('en-IN');
  };

  if (items.length === 0) {
    return (
      <div className="cart-empty">
        <div className="empty-cart-content">
          <FaShoppingBag className="empty-cart-icon" />
          <h2>Your cart is empty</h2>
          <p>Looks like you haven't added anything to your cart yet.</p>
          <Link to="/" className="continue-shopping">
            <FaArrowLeft className="arrow-icon" />
            Continue Shopping
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="cart-page">
      <div className="cart-container">
        <div className="cart-header">
          <h1>Shopping Cart</h1>
          <span className="item-count">{items.length} {items.length === 1 ? 'item' : 'items'}</span>
        </div>

        <div className="cart-content">
          <div className="cart-items">
            {items.map((item) => (
              <div key={item.id} className="cart-item">
                <div className="item-image-container">
                  <img src={item.image} alt={item.name} className="item-image" />
                </div>
                
                <div className="item-details">
                  <h3 className="item-name">{item.name}</h3>
                  <p className="item-description">{item.description}</p>
                  <div className="item-price">
                    <FaRupeeSign className="rupee-icon" />
                    <span>{formatPrice(item.price)}</span>
                  </div>
                </div>

                <div className="item-actions">
                  <div className="quantity-controls">
                    <button
                      className="quantity-btn"
                      onClick={() => handleQuantityChange(item.id, item.quantity - 1)}
                      disabled={item.quantity <= 1}
                    >
                      -
                    </button>
                    <span className="quantity">{item.quantity}</span>
                    <button
                      className="quantity-btn"
                      onClick={() => handleQuantityChange(item.id, item.quantity + 1)}
                    >
                      +
                    </button>
                  </div>

                  <div className="item-total">
                    <span className="total-label">Total:</span>
                    <div className="total-amount">
                      <FaRupeeSign className="rupee-icon" />
                      <span>{formatPrice(item.price * item.quantity)}</span>
                    </div>
                  </div>

                  <button
                    className="remove-btn"
                    onClick={() => handleRemoveItem(item.id)}
                  >
                    <FaTrash className="trash-icon" />
                    Remove
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div className="cart-summary">
            <div className="summary-header">
              <h2>Order Summary</h2>
            </div>
            
            <div className="summary-content">
              <div className="summary-row">
                <span>Subtotal</span>
                <div className="amount">
                  <FaRupeeSign className="rupee-icon" />
                  <span>{formatPrice(total)}</span>
                </div>
              </div>
              
              <div className="summary-row">
                <span>Shipping</span>
                <div className="amount">
                  <FaRupeeSign className="rupee-icon" />
                  <span>Free</span>
                </div>
              </div>
              
              <div className="summary-row total">
                <span>Total</span>
                <div className="amount">
                  <FaRupeeSign className="rupee-icon" />
                  <span>{formatPrice(total)}</span>
                </div>
              </div>
            </div>

            <div className="summary-actions">
              <Link to="/checkout" className="checkout-btn">
                Proceed to Checkout
              </Link>
              <Link to="/" className="continue-shopping">
                <FaArrowLeft className="arrow-icon" />
                Continue Shopping
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Cart; 