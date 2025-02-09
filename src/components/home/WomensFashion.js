import { FaArrowRight } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import '../../styles/Fashion.css';

function WomensFashion() {
  const womensCollection = [
    {
      id: 'w1',
      title: 'Floral Summer Dress',
      price: '$89.99',
      discount: '20% OFF',
      image: 'https://images.unsplash.com/photo-1572804013309-59a88b7e92f1',
      category: 'Dresses'
    },
    {
      id: 'w2',
      title: 'Designer Handbag',
      price: '$199.99',
      discount: '15% OFF',
      image: 'https://images.unsplash.com/photo-1584917865442-de89df76afd3',
      category: 'Accessories'
    },
    {
      id: 'w3',
      title: 'Elegant Blazer',
      price: '$149.99',
      discount: '25% OFF',
      image: 'https://images.unsplash.com/photo-1591369822096-ffd140ec948f',
      category: 'Formal'
    },
    {
      id: 'w4',
      title: 'Stylish Heels',
      price: '$119.99',
      discount: '30% OFF',
      image: 'https://images.unsplash.com/photo-1543163521-1bf539c55dd2',
      category: 'Footwear'
    }
  ];

  return (
    <section className="fashion-section">
      <div className="section-header">
        <h2>Women's Fashion</h2>
        <Link to="/category/womens-fashion" className="view-all">
          View All <FaArrowRight />
        </Link>
      </div>
      <div className="fashion-grid">
        {womensCollection.map((item) => (
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

export default WomensFashion; 