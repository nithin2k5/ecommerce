import { FaArrowRight } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import '../../styles/TopTrends.css';

function TopTrends() {
  const trendingGadgets = [
    {
      id: 1,
      title: 'iPhone 14 Pro',
      price: '₹89,999',
      discount: '10% OFF',
      image: 'https://images.unsplash.com/photo-1678685888221-cda773a3dcdb',
      category: 'Smartphones'
    },
    {
      id: 2,
      title: 'MacBook Pro M2',
      price: '₹1,19,999',
      discount: '15% OFF',
      image: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca4',
      category: 'Laptops'
    },
    {
      id: 3,
      title: 'Samsung Galaxy Watch 5',
      price: '₹24,999',
      discount: '20% OFF',
      image: 'https://images.unsplash.com/photo-1579586337278-3befd40fd17a',
      category: 'Smartwatches'
    },
    {
      id: 4,
      title: 'AirPods Pro',
      price: '₹19,999',
      discount: '12% OFF',
      image: 'https://images.unsplash.com/photo-1588423771073-b8903fbb85b5',
      category: 'Audio'
    }
  ];

  return (
    <section className="top-trends">
      <div className="section-header">
        <h2>Trending Gadgets</h2>
        <Link to="/category/gadgets" className="view-all">
          View All <FaArrowRight />
        </Link>
      </div>
      <div className="trends-grid">
        {trendingGadgets.map((item) => (
          <Link to={`/product/${item.id}`} key={item.id} className="trend-card">
            <div className="trend-image">
              <img src={item.image} alt={item.title} />
              <span className="discount-tag">{item.discount}</span>
            </div>
            <div className="trend-info">
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

export default TopTrends; 