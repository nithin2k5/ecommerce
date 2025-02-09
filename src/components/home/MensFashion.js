import { FaArrowRight } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import '../../styles/Fashion.css';

function MensFashion() {
  const mensCollection = [
    {
      id: 'm1',
      title: 'Casual Denim Jacket',
      price: '$79.99',
      discount: '25% OFF',
      image: 'https://images.unsplash.com/photo-1591047139829-d91aecb6caea',
      category: 'Jackets'
    },
    {
      id: 'm2',
      title: 'Slim Fit Suit',
      price: '$299.99',
      discount: '20% OFF',
      image: 'https://images.unsplash.com/photo-1594938298603-c8148c4dae35',
      category: 'Formal'
    },
    {
      id: 'm3',
      title: 'Premium Cotton Shirt',
      price: '$49.99',
      discount: '15% OFF',
      image: 'https://images.unsplash.com/photo-1596755094514-f87e34085b2c',
      category: 'Shirts'
    },
    {
      id: 'm4',
      title: 'Designer Sneakers',
      price: '$129.99',
      discount: '30% OFF',
      image: 'https://images.unsplash.com/photo-1491553895911-0055eca6402d',
      category: 'Footwear'
    }
  ];

  return (
    <section className="fashion-section">
      <div className="section-header">
        <h2>Men's Fashion</h2>
        <Link to="/category/mens-fashion" className="view-all">
          View All <FaArrowRight />
        </Link>
      </div>
      <div className="fashion-grid">
        {mensCollection.map((item) => (
          <Link to={`/product/${item.id}`} key={item.id} className="fashion-card">
            <div className="fashion-image">
              <img src={item.image} alt={item.title} />
              <span className="discount-tag">{item.discount}</span>
            </div>
            <div className="fashion-info">
              <span className="category">{item.category}</span>
              <h3>{item.title}</h3>
              <p className="price">{item.price}</p>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}

export default MensFashion; 