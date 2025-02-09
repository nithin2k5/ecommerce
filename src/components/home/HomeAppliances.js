import { FaArrowRight } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import '../../styles/HomeAppliances.css';

function HomeAppliances() {
  const appliances = [
    {
      id: 1,
      title: 'Smart Refrigerator',
      price: '$1499.99',
      discount: '15% OFF',
      image: 'https://images.unsplash.com/photo-1571175443880-49e1d25b2bc5',
      category: 'Kitchen'
    },
    {
      id: 2,
      title: 'Robot Vacuum Cleaner',
      price: '$399.99',
      discount: '20% OFF',
      image: 'https://images.unsplash.com/photo-1589894404892-7310b92ea7a2',
      category: 'Cleaning'
    },
    {
      id: 3,
      title: 'Smart Air Conditioner',
      price: '$699.99',
      discount: '10% OFF',
      image: 'https://images.unsplash.com/photo-1585338107529-13afc5f02586',
      category: 'Climate Control'
    },
    {
      id: 4,
      title: 'Washing Machine',
      price: '$799.99',
      discount: '25% OFF',
      image: 'https://images.unsplash.com/photo-1626806787461-102c1bfbed7a',
      category: 'Laundry'
    }
  ];

  return (
    <section className="home-appliances">
      <div className="section-header">
        <h2>Home Appliances</h2>
        <Link to="/category/appliances" className="view-all">
          View All <FaArrowRight />
        </Link>
      </div>
      <div className="appliances-grid">
        {appliances.map((item) => (
          <Link to={`/product/${item.id}`} key={item.id} className="appliance-card">
            <div className="appliance-image">
              <img src={item.image} alt={item.title} />
              <span className="discount-tag">{item.discount}</span>
            </div>
            <div className="appliance-info">
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

export default HomeAppliances; 