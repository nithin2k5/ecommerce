import '../../styles/Footer.css';

function Footer() {
  return (
    <footer className="footer">
      <div className="footer-content">
        <div className="footer-section">
          <h3>About Us</h3>
          <p>Your trusted e-commerce platform for quality products.</p>
        </div>
        <div className="footer-section">
          <h3>Contact</h3>
          <p>Email: support@example.com</p>
          <p>Phone: (555) 123-4567</p>
        </div>
        <div className="footer-section">
          <h3>Follow Us</h3>
          <div className="social-links">
            <a href="#facebook">Facebook</a>
            <a href="#twitter">Twitter</a>
            <a href="#instagram">Instagram</a>
          </div>
        </div>
      </div>
      <div className="footer-bottom">
        <p>&copy; 2024 E-Commerce Store. All rights reserved.</p>
      </div>
    </footer>
  );
}

export default Footer; 