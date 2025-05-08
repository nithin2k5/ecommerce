import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
// Modify this line to handle missing react-toastify
// import { toast } from 'react-toastify';
import './BusinessRegister.css';
import { authApi } from '../../services/api';

// Add this function to show alerts instead of toasts if react-toastify is missing
const showAlert = (message, type) => {
  if (type === 'success') {
    alert('Success: ' + message);
  } else {
    alert('Error: ' + message);
  }
};

const BusinessRegister = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [sameAsPersonal, setSameAsPersonal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [apiStatus, setApiStatus] = useState({ checked: false, connected: false });
  
  const [formData, setFormData] = useState({
    // Personal Information
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
    country: '',
    
    // Business Information
    businessName: '',
    businessDescription: '',
    taxId: '',
    businessStreet: '',
    businessCity: '',
    businessState: '',
    businessZipCode: '',
    businessCountry: '',
    
    // Verification
    registrationCode: 'SECRET_BUSINESS_CODE' // Pre-filled for testing
  });

  // Check API connection when component mounts
  useEffect(() => {
    const checkApiConnection = async () => {
      try {
        await authApi.testConnection();
        setApiStatus({ checked: true, connected: true });
      } catch (error) {
        console.error('API connection test failed:', error);
        setApiStatus({ checked: true, connected: false });
      }
    };
    
    checkApiConnection();
  }, []);

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    
    // Clear field-specific error when user types
    if (errors[name]) {
      setErrors({ ...errors, [name]: null });
    }
  };

  // Handle address checkbox
  const handleAddressCheckboxChange = (e) => {
    setSameAsPersonal(e.target.checked);
    
    if (e.target.checked) {
      setFormData({
        ...formData,
        businessStreet: formData.street,
        businessCity: formData.city,
        businessState: formData.state,
        businessZipCode: formData.zipCode,
        businessCountry: formData.country
      });
    }
  };

  // Validate first step (personal information)
  const validateStep1 = () => {
    const newErrors = {};
    
    if (!formData.username.trim()) newErrors.username = 'Username is required';
    if (!formData.email.trim()) newErrors.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = 'Email is invalid';
    
    if (!formData.password) newErrors.password = 'Password is required';
    else if (formData.password.length < 6) newErrors.password = 'Password must be at least 6 characters';
    
    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }
    
    if (!formData.fullName.trim()) newErrors.fullName = 'Full name is required';
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Validate second step (business information)
  const validateStep2 = () => {
    const newErrors = {};
    
    if (!formData.businessName.trim()) newErrors.businessName = 'Business name is required';
    if (!formData.taxId.trim()) newErrors.taxId = 'Business ID/Tax ID is required';
    if (!formData.businessStreet.trim()) newErrors.businessStreet = 'Business address is required';
    if (!formData.businessCity.trim()) newErrors.businessCity = 'City is required';
    if (!formData.businessState.trim()) newErrors.businessState = 'State is required';
    if (!formData.businessZipCode.trim()) newErrors.businessZipCode = 'Zip code is required';
    if (!formData.businessCountry.trim()) newErrors.businessCountry = 'Country is required';
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Validate third step (verification code)
  const validateStep3 = () => {
    const newErrors = {};
    
    if (!formData.registrationCode.trim()) {
      newErrors.registrationCode = 'Registration code is required';
    }
    
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

  // Form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateStep3()) return;
    
    setLoading(true);
    
    try {
      console.log('Submitting business registration:', formData);
      
      const response = await authApi.registerBusiness(formData);
      
      console.log('Registration successful:', response);
      
      alert('Business registration successful! Your account will be reviewed by our team.');
      navigate('/business-login');
    } catch (error) {
      console.error('Registration failed:', error);
      
      alert('Registration failed: ' + (error.message || 'Unknown error'));
      
      setErrors({ 
        ...errors, 
        form: error.message || 'Failed to register. Please try again.'
      });
    } finally {
      setLoading(false);
    }
  };

  // If API connection check has been done but failed
  if (apiStatus.checked && !apiStatus.connected) {
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

  // Render step 1: Personal Information
  const renderPersonalInfo = () => {
    return (
      <div className="form-step">
        <h3>Personal Information</h3>
        <p className="step-description">
          Please provide your personal information for the account
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
        
        <div className="form-section">
          <h4>Personal Address</h4>
          
          <div className="form-group">
            <label htmlFor="street">Street Address*</label>
            <input
              type="text"
              id="street"
              name="street"
              value={formData.street}
              onChange={handleChange}
              placeholder="Street address"
            />
            {errors.street && <span className="error">{errors.street}</span>}
          </div>
          
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="city">City*</label>
              <input
                type="text"
                id="city"
                name="city"
                value={formData.city}
                onChange={handleChange}
                placeholder="City"
              />
              {errors.city && <span className="error">{errors.city}</span>}
            </div>
            
            <div className="form-group">
              <label htmlFor="state">State/Province*</label>
              <input
                type="text"
                id="state"
                name="state"
                value={formData.state}
                onChange={handleChange}
                placeholder="State/Province"
              />
              {errors.state && <span className="error">{errors.state}</span>}
            </div>
          </div>
          
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="zipCode">Zip/Postal Code*</label>
              <input
                type="text"
                id="zipCode"
                name="zipCode"
                value={formData.zipCode}
                onChange={handleChange}
                placeholder="Zip/Postal code"
              />
              {errors.zipCode && <span className="error">{errors.zipCode}</span>}
            </div>
            
            <div className="form-group">
              <label htmlFor="country">Country*</label>
              <input
                type="text"
                id="country"
                name="country"
                value={formData.country}
                onChange={handleChange}
                placeholder="Country"
              />
              {errors.country && <span className="error">{errors.country}</span>}
            </div>
          </div>
        </div>
        
        <div className="form-nav">
          <button type="button" className="next-btn" onClick={nextStep}>
            Continue to Business Information
          </button>
        </div>
      </div>
    );
  };

  // Render step 2: Business Information
  const renderBusinessInfo = () => {
    return (
      <div className="form-step">
        <h3>Business Information</h3>
        <p className="step-description">
          Please provide details about your business
        </p>
        
        <div className="form-group">
          <label htmlFor="businessName">Business Name*</label>
          <input
            type="text"
            id="businessName"
            name="businessName"
            value={formData.businessName}
            onChange={handleChange}
            placeholder="Your company name"
          />
          {errors.businessName && <span className="error">{errors.businessName}</span>}
        </div>
        
        <div className="form-group">
          <label htmlFor="businessDescription">Business Description</label>
          <textarea
            id="businessDescription"
            name="businessDescription"
            value={formData.businessDescription}
            onChange={handleChange}
            placeholder="Brief description of your business"
            rows="3"
          />
        </div>
        
        <div className="form-group">
          <label htmlFor="taxId">Business ID/Tax ID*</label>
          <input
            type="text"
            id="taxId"
            name="taxId"
            value={formData.taxId}
            onChange={handleChange}
            placeholder="Business registration or tax ID"
          />
          {errors.taxId && <span className="error">{errors.taxId}</span>}
        </div>
        
        <div className="form-section">
          <h4>Business Address</h4>
          
          <div className="checkbox-group">
            <input
              type="checkbox"
              id="sameAddress"
              checked={sameAsPersonal}
              onChange={handleAddressCheckboxChange}
            />
            <label htmlFor="sameAddress">Same as personal address</label>
          </div>
          
          <div className="form-group">
            <label htmlFor="businessStreet">Street Address*</label>
            <input
              type="text"
              id="businessStreet"
              name="businessStreet"
              value={formData.businessStreet}
              onChange={handleChange}
              placeholder="Business street address"
              disabled={sameAsPersonal}
            />
            {errors.businessStreet && <span className="error">{errors.businessStreet}</span>}
          </div>
          
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="businessCity">City*</label>
              <input
                type="text"
                id="businessCity"
                name="businessCity"
                value={formData.businessCity}
                onChange={handleChange}
                placeholder="City"
                disabled={sameAsPersonal}
              />
              {errors.businessCity && <span className="error">{errors.businessCity}</span>}
            </div>
            
            <div className="form-group">
              <label htmlFor="businessState">State/Province*</label>
              <input
                type="text"
                id="businessState"
                name="businessState"
                value={formData.businessState}
                onChange={handleChange}
                placeholder="State/Province"
                disabled={sameAsPersonal}
              />
              {errors.businessState && <span className="error">{errors.businessState}</span>}
            </div>
          </div>
          
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="businessZipCode">Zip/Postal Code*</label>
              <input
                type="text"
                id="businessZipCode"
                name="businessZipCode"
                value={formData.businessZipCode}
                onChange={handleChange}
                placeholder="Zip/Postal code"
                disabled={sameAsPersonal}
              />
              {errors.businessZipCode && <span className="error">{errors.businessZipCode}</span>}
            </div>
            
            <div className="form-group">
              <label htmlFor="businessCountry">Country*</label>
              <input
                type="text"
                id="businessCountry"
                name="businessCountry"
                value={formData.businessCountry}
                onChange={handleChange}
                placeholder="Country"
                disabled={sameAsPersonal}
              />
              {errors.businessCountry && <span className="error">{errors.businessCountry}</span>}
            </div>
          </div>
        </div>
        
        <div className="form-nav">
          <button type="button" className="back-btn" onClick={prevStep}>
            Back to Personal Information
          </button>
          <button type="button" className="next-btn" onClick={nextStep}>
            Continue to Verification
          </button>
        </div>
      </div>
    );
  };

  // Render step 3: Verification
  const renderVerification = () => {
    return (
      <div className="form-step">
        <h3>Verification</h3>
        <p className="step-description">
          Please enter your business registration code to complete the registration
        </p>
        
        <div className="form-group">
          <label htmlFor="registrationCode">Business Registration Code*</label>
          <input
            type="text"
            id="registrationCode"
            name="registrationCode"
            value={formData.registrationCode}
            onChange={handleChange}
            placeholder="Enter your registration code"
          />
          {errors.registrationCode && <span className="error">{errors.registrationCode}</span>}
        </div>
        
        <div className="verification-info">
          <h4>What happens next?</h4>
          <ol>
            <li>Our team will review your business information</li>
            <li>You will receive an email notification when your account is approved</li>
            <li>Once approved, you can log in and start selling on our platform</li>
          </ol>
          <p>The approval process usually takes 1-2 business days.</p>
        </div>
        
        <div className="form-nav">
          <button type="button" className="back-btn" onClick={prevStep}>
            Back to Business Information
          </button>
          <button 
            type="submit" 
            className="submit-btn" 
            disabled={loading}
          >
            {loading ? 'Submitting...' : 'Complete Registration'}
          </button>
        </div>
      </div>
    );
  };

  // Render current step
  const renderCurrentStep = () => {
    switch (step) {
      case 1:
        return renderPersonalInfo();
      case 2:
        return renderBusinessInfo();
      case 3:
        return renderVerification();
      default:
        return renderPersonalInfo();
    }
  };

  return (
    <div className="business-register-container">
      {/* API status indicator */}
      {apiStatus.checked && apiStatus.connected && (
        <div className="api-status connected">
          ✓ API Connected
        </div>
      )}
      
      <div className="business-register-card">
        <h2>Business Account Registration</h2>
        
        {errors.form && <div className="form-error">{errors.form}</div>}
        
        <div className="progress-indicator">
          <div className={`progress-step ${step >= 1 ? 'active' : ''}`}>
            <div className="step-number">1</div>
            <div className="step-label">Personal Info</div>
          </div>
          <div className="progress-line"></div>
          <div className={`progress-step ${step >= 2 ? 'active' : ''}`}>
            <div className="step-number">2</div>
            <div className="step-label">Business Info</div>
          </div>
          <div className="progress-line"></div>
          <div className={`progress-step ${step >= 3 ? 'active' : ''}`}>
            <div className="step-number">3</div>
            <div className="step-label">Verification</div>
          </div>
        </div>
        
        <form onSubmit={handleSubmit}>
          {renderCurrentStep()}
        </form>
        
        <div className="business-register-footer">
          <p>Already have an account? <Link to="/business-login">Login here</Link></p>
          <p>Registering as a customer? <Link to="/register">Register here</Link></p>
        </div>
      </div>
      
      {/* Sample Registration Info */}
      <div className="registration-info-card">
        <h3>Testing Information</h3>
        <p>Use the following code for business registration:</p>
        <div className="code-box">SECRET_BUSINESS_CODE</div>
        <p>This is for demonstration purposes only.</p>
      </div>
    </div>
  );
};

export default BusinessRegister; 