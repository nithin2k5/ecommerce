import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { 
  FaUser, FaEnvelope, FaLock, FaIdCard, FaPhone, 
  FaMapMarkerAlt, FaCity, FaGlobe, FaUserPlus, 
  FaExclamationTriangle, FaShoppingBag
} from 'react-icons/fa';
import authService from '../../services/auth.service';
import '../../styles/Auth.css';
import './BusinessRegister.css'; // Import the BusinessRegister styles

// Add this function to show alerts instead of toasts if react-toastify is missing
const showAlert = (message, type) => {
  if (type === 'success') {
    alert('Success: ' + message);
  } else {
    alert('Error: ' + message);
  }
};

const Register = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
    fullName: '',
    phone: '',
    street: '',
    city: '',
    state: '',
    zipCode: '',
    country: ''
  });
  
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [success, setSuccess] = useState('');
  const [serverStatus, setServerStatus] = useState({ checking: true, connected: false });
  const [step, setStep] = useState(1);
  const totalSteps = 3;

  // Check server connection on component mount
  useEffect(() => {
    const checkServerConnection = async () => {
      try {
        const isConnected = await authService.testConnection();
        setServerStatus({ checking: false, connected: isConnected });
      } catch (err) {
        setServerStatus({ checking: false, connected: false });
      }
    };
    
    checkServerConnection();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    
    // Clear field-specific error when user types
    if (errors[name]) {
      setErrors({ ...errors, [name]: null });
    }
  };

  // Validate first step
  const validateStep1 = () => {
    const newErrors = {};
    
    if (!formData.username.trim()) newErrors.username = 'Username is required';
    else if (formData.username.length < 3) newErrors.username = 'Username must be at least 3 characters';
    
    if (!formData.email.trim()) newErrors.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = 'Email is invalid';
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Validate second step
  const validateStep2 = () => {
    const newErrors = {};
    
    if (!formData.password) newErrors.password = 'Password is required';
    else if (formData.password.length < 6) newErrors.password = 'Password must be at least 6 characters';
    
    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }
    
    if (!formData.fullName.trim()) newErrors.fullName = 'Full name is required';
    if (!formData.phone.trim()) newErrors.phone = 'Phone number is required';
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Navigation functions
  const nextStep = () => {
    if (step === 1 && validateStep1()) {
      setStep(2);
      window.scrollTo(0, 0);
    } else if (step === 2 && validateStep2()) {
      setStep(3);
      window.scrollTo(0, 0);
    }
  };

  const prevStep = () => {
    setStep(step - 1);
    window.scrollTo(0, 0);
  };

  const validateForm = () => {
    // For final submission, we validate all fields
    const isStep1Valid = validateStep1();
    const isStep2Valid = validateStep2();
    
    return isStep1Valid && isStep2Valid;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setLoading(true);
    
    // Verify server connection before trying to register
    if (!serverStatus.connected) {
      try {
        const isConnected = await authService.testConnection();
        setServerStatus({ checking: false, connected: isConnected });
        if (!isConnected) {
          setErrors({ form: 'Unable to connect to the server. Please try again later.' });
          setLoading(false);
          return;
        }
      } catch (err) {
        setErrors({ form: 'Server connection failed. Please try again later.' });
        setLoading(false);
        return;
      }
    }
    
    try {
      console.log('Attempting registration with:', formData.username, formData.email);
      
      // Extract address data to separate object for customer details table
      const addressData = {
        phone: formData.phone || '',
        street: formData.street || '',
        city: formData.city || '',
        state: formData.state || '',
        zipCode: formData.zipCode || '',
        country: formData.country || ''
      };
      
      // Log the customer details being sent
      console.log('Customer details being sent:', addressData);
      
      // Make sure at least one address field is provided to create the customer_details record
      const hasAddressData = Object.values(addressData).some(value => value.trim() !== '');
      
      if (!hasAddressData) {
        console.log('No address data provided, will only create user record');
      }
      
      const response = await authService.register(
        formData.username,
        formData.email,
        formData.password,
        formData.fullName,
        addressData
      );
      
      console.log('Registration successful:', response);
      setSuccess('Registration successful! Please log in to start shopping.');
      
      // Show success alert
      alert(`Account created successfully for ${formData.fullName}! Please log in to start shopping.`);
      
      // Only redirect if registration was successful
      if (response && response.success !== false) {
        setTimeout(() => {
          navigate('/login');
        }, 2000);
      } else {
        // Handle case when server returns success: false
        setErrors({ form: response.message || 'Registration failed. Please try again.' });
        setLoading(false);
      }
    } catch (error) {
      console.error('Registration error:', error);
      setLoading(false);
      
      if (!error.response) {
        // For network errors or server timeout
        setErrors({ form: 'Unable to connect to the server. Please try again later.' });
        return;
      }
      
      if (error.response && error.response.data) {
        if (error.response.data.message) {
          setErrors({ form: error.response.data.message });
        } else if (error.response.data.errors) {
          const fieldErrors = {};
          error.response.data.errors.forEach(err => {
            fieldErrors[err.field] = err.defaultMessage;
          });
          setErrors(fieldErrors);
        }
      } else if (error.message) {
        setErrors({ form: error.message });
      } else {
        setErrors({ form: 'Registration failed. Please try again.' });
      }
    }
  };

  // Show server warning if not connected
  const ServerWarningBanner = () => {
    if (serverStatus.connected || serverStatus.checking) return null;
    
    // Check if we're in development mode
    const isDevelopment = process.env.NODE_ENV === 'development';
    
    return (
      <div className="server-warning-banner">
        <FaExclamationTriangle className="warning-icon" />
        <p>
          <strong>Warning:</strong> Unable to connect to the authentication server. 
          {isDevelopment ? (
            <> Using mock data mode for development. Registration will be simulated.</>
          ) : (
            <> You can still fill out the form, but registration may fail.</>
          )}
        </p>
        <div className="server-warning-actions">
          <button 
            onClick={() => window.location.reload()}
            className="retry-connection-btn"
          >
            Retry Connection
          </button>
          
          {isDevelopment && (
            <button 
              onClick={() => {
                authService.enableMockMode();
                setServerStatus({ checking: false, connected: true });
              }}
              className="enable-mock-btn"
            >
              Enable Mock Mode
            </button>
          )}
        </div>
      </div>
    );
  };

  // Render step 1: Account Information
  const renderAccountInfo = () => {
    return (
      <div className="form-step">
        <h3>Account Information</h3>
        <p className="step-description">
          Please create your customer account credentials
        </p>
        
        <div className="form-group">
          <label htmlFor="username">Username*</label>
          <input
            type="text"
            id="username"
            name="username"
            value={formData.username}
            onChange={handleChange}
            placeholder="Choose a unique username"
            autoFocus
          />
          {errors.username && <span className="error">{errors.username}</span>}
        </div>
        
        <div className="form-group">
          <label htmlFor="email">Email Address*</label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="Your email address"
          />
          {errors.email && <span className="error">{errors.email}</span>}
        </div>
        
        <div className="form-nav">
          <button type="button" className="next-btn" onClick={nextStep}>
            Continue to Personal Information
          </button>
        </div>
      </div>
    );
  };

  // Render step 2: Personal Information
  const renderPersonalInfo = () => {
    return (
      <div className="form-step">
        <h3>Personal Information</h3>
        <p className="step-description">
          Please provide your personal details and create a password
        </p>
        
        <div className="form-row">
          <div className="form-group">
            <label htmlFor="password">Password*</label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Create a password"
              autoFocus
            />
            {errors.password && <span className="error">{errors.password}</span>}
          </div>
          
          <div className="form-group">
            <label htmlFor="confirmPassword">Confirm Password*</label>
            <input
              type="password"
              id="confirmPassword"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              placeholder="Re-enter your password"
            />
            {errors.confirmPassword && <span className="error">{errors.confirmPassword}</span>}
          </div>
        </div>
        
        <div className="form-group">
          <label htmlFor="fullName">Full Name*</label>
          <input
            type="text"
            id="fullName"
            name="fullName"
            value={formData.fullName}
            onChange={handleChange}
            placeholder="Your full name"
          />
          {errors.fullName && <span className="error">{errors.fullName}</span>}
        </div>
        
        <div className="form-group">
          <label htmlFor="phone">Phone Number*</label>
          <input
            type="text"
            id="phone"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            placeholder="Your contact number"
          />
          {errors.phone && <span className="error">{errors.phone}</span>}
        </div>
        
        <div className="form-nav">
          <button type="button" className="back-btn" onClick={prevStep}>
            Back to Account Information
          </button>
          <button type="button" className="next-btn" onClick={nextStep}>
            Continue to Shipping Address
          </button>
        </div>
      </div>
    );
  };

  // Render step 3: Shipping Address
  const renderShippingAddress = () => {
    return (
      <div className="form-step">
        <h3>Shipping Address (Optional)</h3>
        <p className="step-description">
          Please provide your shipping address for future purchases
        </p>
        
        <div className="form-group">
          <label htmlFor="street">Street Address</label>
          <input
            type="text"
            id="street"
            name="street"
            value={formData.street}
            onChange={handleChange}
            placeholder="Street address"
            autoFocus
          />
        </div>
        
        <div className="form-row">
          <div className="form-group">
            <label htmlFor="city">City</label>
            <input
              type="text"
              id="city"
              name="city"
              value={formData.city}
              onChange={handleChange}
              placeholder="City"
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="state">State/Province</label>
            <input
              type="text"
              id="state"
              name="state"
              value={formData.state}
              onChange={handleChange}
              placeholder="State/Province"
            />
          </div>
        </div>
        
        <div className="form-row">
          <div className="form-group">
            <label htmlFor="zipCode">Zip/Postal Code</label>
            <input
              type="text"
              id="zipCode"
              name="zipCode"
              value={formData.zipCode}
              onChange={handleChange}
              placeholder="Zip/Postal code"
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="country">Country</label>
            <input
              type="text"
              id="country"
              name="country"
              value={formData.country}
              onChange={handleChange}
              placeholder="Country"
            />
          </div>
        </div>
        
        <div className="verification-info">
          <h4>What happens next?</h4>
          <ol>
            <li>Your account will be created immediately</li>
            <li>You'll be redirected to the login page</li>
            <li>Once logged in, you can start shopping right away!</li>
          </ol>
        </div>
        
        <div className="form-nav">
          <button type="button" className="back-btn" onClick={prevStep}>
            Back to Personal Information
          </button>
          <button 
            type="submit" 
            className="submit-btn" 
            disabled={loading}
          >
            {loading ? 'Creating Account...' : 'Complete Registration'}
          </button>
        </div>
      </div>
    );
  };

  // Render current step
  const renderCurrentStep = () => {
    switch (step) {
      case 1:
        return renderAccountInfo();
      case 2:
        return renderPersonalInfo();
      case 3:
        return renderShippingAddress();
      default:
        return renderAccountInfo();
    }
  };

  // If API connection check has been done but failed
  if (serverStatus.checked && !serverStatus.connected && !process.env.NODE_ENV === 'development') {
    return (
      <div className="connection-error">
        <h2>Connection Error</h2>
        <p>
          Unable to connect to the server. Please make sure:
        </p>
        <ol>
          <li>The backend server is running at http://localhost:8080</li>
          <li>There are no network issues preventing the connection</li>
          <li>CORS is properly configured on the server</li>
        </ol>
        <button onClick={() => window.location.reload()}>
          Retry Connection
        </button>
      </div>
    );
  }

  return (
    <div className="business-register-container">
      {/* API status indicator */}
      {serverStatus.connected && (
        <div className="api-status connected">
          ✓ API Connected
        </div>
      )}
      
      <div className="business-register-card">
        <h2>Customer Account Registration</h2>
        
        {errors.form && <div className="form-error">{errors.form}</div>}
        {success && <div className="form-success">{success}</div>}
        
        <div className="progress-indicator">
          <div className={`progress-step ${step >= 1 ? 'active' : ''}`}>
            <div className="step-number">1</div>
            <div className="step-label">Account Info</div>
          </div>
          <div className="progress-line"></div>
          <div className={`progress-step ${step >= 2 ? 'active' : ''}`}>
            <div className="step-number">2</div>
            <div className="step-label">Personal Info</div>
          </div>
          <div className="progress-line"></div>
          <div className={`progress-step ${step >= 3 ? 'active' : ''}`}>
            <div className="step-number">3</div>
            <div className="step-label">Shipping Address</div>
          </div>
        </div>
        
        <ServerWarningBanner />
        
        <form onSubmit={handleSubmit}>
          {renderCurrentStep()}
        </form>
        
        <div className="business-register-footer">
          <p>Already have an account? <Link to="/login">Login here</Link></p>
          <p>Registering as a business? <Link to="/business-register">Register as Business</Link></p>
        </div>
      </div>
      
      {/* Shopping Benefits Info */}
      <div className="registration-info-card">
        <h3>Shopping Benefits</h3>
        <ul>
          <li>Fast checkout with saved shipping details</li>
          <li>Order tracking and history</li>
          <li>Exclusive deals and discounts</li>
          <li>Wishlist and favorites</li>
        </ul>
        <p>Join today for the best shopping experience!</p>
      </div>
    </div>
  );
};

export default Register; 