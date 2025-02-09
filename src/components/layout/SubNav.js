import { Link } from 'react-router-dom';
import { FaMobile, FaLaptop, FaHome, FaTshirt, FaShoppingBasket } from 'react-icons/fa';
import '../../styles/SubNav.css';

function SubNav() {
  const categories = [
    { name: 'Mobiles', icon: <FaMobile />, path: '/category/mobiles' },
    { name: 'Electronics', icon: <FaLaptop />, path: '/category/electronics' },
    { name: 'Home Appliances', icon: <FaHome />, path: '/category/appliances' },
    { name: 'Fashion', icon: <FaTshirt />, path: '/category/fashion' },
    { name: 'Provisions', icon: <FaShoppingBasket />, path: '/category/provisions' },
  ];

  return (
    <nav className="subnav">
      <div className="subnav-content">
        {categories.map((category) => (
          <Link 
            key={category.name} 
            to={category.path} 
            className="category-link"
          >
            <span className="category-icon">{category.icon}</span>
            <span className="category-name">{category.name}</span>
          </Link>
        ))}
      </div>
    </nav>
  );
}

export default SubNav; 