import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { FaShoppingCart, FaSearch, FaUser, FaBox } from 'react-icons/fa';
import '../../styles/Header.css';

function Header() {
  const { items } = useSelector((state) => state.cart);
  const cartItemsCount = items.reduce((total, item) => total + item.quantity, 0);

  return (
    <header className="header">
      <div className="header-content">
        <Link to="/" className="logo">
        
          <span className="logo-text">Pazar</span>
        </Link>

        <div className="search-bar">
          <FaSearch className="search-icon" />
          <input
            type="text"
            placeholder="Search for products..."
            className="search-input"
          />
          <button className="search-button">Search</button>
        </div>

        <nav className="nav-links">
          <Link to="/orders" className="nav-link">
            <FaBox />
            <span>Orders</span>
          </Link>
          
          <Link to="/login" className="nav-link">
            <FaUser />
            <span>Login</span>
          </Link>
          
          <Link to="/cart" className="cart-link">
            <FaShoppingCart />
            <span>Cart ({cartItemsCount})</span>
          </Link>
        </nav>
      </div>
    </header>
  );
}

export default Header; 