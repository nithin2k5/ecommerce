import { useState } from 'react';
import { FaGoogle } from 'react-icons/fa';
import '../../styles/LoginForm.css';

function LoginForm({ isBusinessLogin = false }) {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    mobileNumber: '',
    verificationCode: '',
    businessName: '',
    businessType: '',
  });
  const [showVerification, setShowVerification] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!showVerification) {
      // Send verification code logic here
      setShowVerification(true);
    } else {
      // Verify code and complete login/register
      console.log('Form submitted:', formData);
    }
  };

  const handleGoogleLogin = () => {
    // Implement Google login logic here
    console.log('Google login clicked');
  };

  return (
    <div className="login-container">
      <h2>{isBusinessLogin ? 'Business ' : ''}{isLogin ? 'Login' : 'Register'}</h2>
      
      <button className="google-login-btn" onClick={handleGoogleLogin}>
        <FaGoogle />
        <span>Continue with Google</span>
      </button>

      <div className="divider">
        <span>OR</span>
      </div>

      <form onSubmit={handleSubmit}>
        {!isLogin && (
          <div className="form-group">
            <label htmlFor="name">Full Name</label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              required={!isLogin}
            />
          </div>
        )}

        {isBusinessLogin && !isLogin && (
          <>
            <div className="form-group">
              <label htmlFor="businessName">Business Name</label>
              <input
                type="text"
                id="businessName"
                name="businessName"
                value={formData.businessName}
                onChange={handleInputChange}
                required={!isLogin}
              />
            </div>
            <div className="form-group">
              <label htmlFor="businessType">Business Type</label>
              <select
                id="businessType"
                name="businessType"
                value={formData.businessType}
                onChange={handleInputChange}
                required={!isLogin}
              >
                <option value="">Select Business Type</option>
                <option value="retail">Retail</option>
                <option value="wholesale">Wholesale</option>
                <option value="manufacturer">Manufacturer</option>
                <option value="service">Service Provider</option>
              </select>
            </div>
          </>
        )}

        <div className="form-group">
          <label htmlFor="email">Email</label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleInputChange}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="mobileNumber">Mobile Number</label>
          <input
            type="tel"
            id="mobileNumber"
            name="mobileNumber"
            value={formData.mobileNumber}
            onChange={handleInputChange}
            required
          />
        </div>

        {showVerification && (
          <div className="form-group">
            <label htmlFor="verificationCode">Verification Code</label>
            <input
              type="text"
              id="verificationCode"
              name="verificationCode"
              value={formData.verificationCode}
              onChange={handleInputChange}
              required
            />
          </div>
        )}

        <button type="submit" className="submit-btn">
          {showVerification ? 'Verify Code' : 'Send Verification Code'}
        </button>
      </form>

      <p className="toggle-form">
        {isLogin ? "Don't have an account? " : "Already have an account? "}
        <button
          className="toggle-btn"
          onClick={() => setIsLogin(!isLogin)}
        >
          {isLogin ? 'Register' : 'Login'}
        </button>
      </p>
    </div>
  );
}

export default LoginForm; 