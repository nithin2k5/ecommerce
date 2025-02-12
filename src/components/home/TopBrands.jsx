import { FaArrowRight } from 'react-icons/fa';
import '../../styles/TopBrands.css';

function TopBrands() {
  const brands = [
    {
      id: 1,
      name: 'Apple',
      logo: 'https://example.com/apple-logo.png',
      discount: 'Up to 30% Off',
      backgroundColor: '#f5f5f7'
    },
    {
      id: 2,
      name: 'Samsung',
      logo: 'https://example.com/samsung-logo.png',
      discount: 'Up to 25% Off',
      backgroundColor: '#1428a0'
    },
    {
      id: 3,
      name: 'Nike',
      logo: 'https://example.com/nike-logo.png',
      discount: 'Up to 40% Off',
      backgroundColor: '#f5f5f5'
    },
    {
      id: 4,
      name: 'Adidas',
      logo: 'https://example.com/adidas-logo.png',
      discount: 'Up to 35% Off',
      backgroundColor: '#000000'
    },
    {
      id: 5,
      name: 'Sony',
      logo: 'https://example.com/sony-logo.png',
      discount: 'Up to 20% Off',
      backgroundColor: '#f5f5f5'
    },
    {
      id: 6,
      name: 'LG',
      logo: 'https://example.com/lg-logo.png',
      discount: 'Up to 30% Off',
      backgroundColor: '#f5f5f5'
    }
  ];

  return (
    <section className="top-brands">
      <div className="section-header">
        <h2>Top Brands</h2>
        <a href="/brands" className="view-all">
          View All <FaArrowRight />
        </a>
      </div>
      <div className="brands-grid">
        {brands.map((brand) => (
          <div 
            key={brand.id} 
            className="brand-card"
            style={{ backgroundColor: brand.backgroundColor }}
          >
            <div className="brand-logo">
              <img src={brand.logo} alt={brand.name} />
            </div>
            <div className="brand-info">
              <h3>{brand.name}</h3>
              <p className="discount">{brand.discount}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

export default TopBrands; 