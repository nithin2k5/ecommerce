import { useState, useEffect } from 'react';
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa';
import '../../styles/Slider.css';

function Slider() {
  const [currentSlide, setCurrentSlide] = useState(0);

  const slides = [
    {
      image: 'https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?ixlib=rb-1.2.1&auto=format&fit=crop&w=1920&q=80',
      title: 'Summer Sale',
      description: 'Up to 50% off on all summer collection',
    },
    {
      image: 'https://images.unsplash.com/photo-1607082349566-187342175e2f?ixlib=rb-1.2.1&auto=format&fit=crop&w=1920&q=80',
      title: 'New Arrivals',
      description: 'Check out our latest collection',
    },
    {
      image: 'https://images.unsplash.com/photo-1607082350899-7e105aa886ae?ixlib=rb-1.2.1&auto=format&fit=crop&w=1920&q=80',
      title: 'Flash Sale',
      description: 'Limited time offers on premium brands',
    },
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prevSlide) => 
        prevSlide === slides.length - 1 ? 0 : prevSlide + 1
      );
    }, 5000); // Change slide every 5 seconds

    return () => clearInterval(timer);
  }, [slides.length]);

  const nextSlide = () => {
    setCurrentSlide(currentSlide === slides.length - 1 ? 0 : currentSlide + 1);
  };

  const prevSlide = () => {
    setCurrentSlide(currentSlide === 0 ? slides.length - 1 : currentSlide - 1);
  };

  return (
    <section className="slider-section">
      <div className="slider-container">
        <div className="slider">
          {slides.map((slide, index) => (
            <div
              key={index}
              className={`slide ${index === currentSlide ? 'active' : ''}`}
              style={{ transform: `translateX(-${currentSlide * 100}%)` }}
            >
              <img src={slide.image} alt={slide.title} />
              <div className="slide-content">
                <h2>{slide.title}</h2>
                <p>{slide.description}</p>
              </div>
            </div>
          ))}
        </div>

        <button className="slider-button prev" onClick={prevSlide}>
          <FaChevronLeft />
        </button>
        <button className="slider-button next" onClick={nextSlide}>
          <FaChevronRight />
        </button>

        <div className="slider-dots">
          {slides.map((_, index) => (
            <button
              key={index}
              className={`dot ${index === currentSlide ? 'active' : ''}`}
              onClick={() => setCurrentSlide(index)}
            />
          ))}
        </div>
      </div>

      <div className="trending-section">
        <div className="trending-container">
          <div className="trending-card">
            <div className="discount-badge">-30%</div>
            <img src="https://images.unsplash.com/photo-1523275335684-37898b6baf30" alt="Trending 1" />
            <div className="trending-content">
              <h3>Smart Watches</h3>
              <p>Starting from $99</p>
            </div>
          </div>

          <div className="trending-card">
            <div className="discount-badge">-20%</div>
            <img src="https://images.unsplash.com/photo-1505740420928-5e560c06d30e" alt="Trending 2" />
            <div className="trending-content">
              <h3>Headphones</h3>
              <p>Premium Collection</p>
            </div>
          </div>

          <div className="trending-card">
            <div className="discount-badge">-40%</div>
            <img src="https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f" alt="Trending 3" />
            <div className="trending-content">
              <h3>Cameras</h3>
              <p>Latest Models</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Slider; 