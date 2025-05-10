import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import AuthService from '../../services/auth.service';
import './LoginForm.css'; // Reuse existing styles
import './BusinessRegisterForm.css'; // Add this new CSS file later

const BusinessRegisterForm = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
    fullName: '',
    businessName: '',
    brandName: '',
    businessType: '',
    phoneNumber: '',
    registrationCode: 'BUSINESS_SECRET_CODE' // Pre-filled with the correct code from application.properties
  });
  const [errors, setErrors] = useState({});
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const [serverStatus, setServerStatus] = useState({ checking: false, connected: true });
  
  // We're removing the automatic server check to prevent blocking the form
  // Users will see errors only when they try to submit the form

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
    // Clear error when field is being edited
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: null
      });
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    // Validate username
    if (!formData.username) {
      newErrors.username = 'Username is required';
    } else if (formData.username.length < 3) {
      newErrors.username = 'Username must be at least 3 characters long';
    }
    
    // Validate email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!emailRegex.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }
    
    // Validate password
    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters long';
    }
    
    // Validate password confirmation
    if (!formData.confirmPassword) {
      newErrors.confirmPassword = 'Please confirm your password';
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }
    
    // Validate full name
    if (!formData.fullName) {
      newErrors.fullName = 'Full name is required';
    }
    
    // Validate business name
    if (!formData.businessName) {
      newErrors.businessName = 'Business name is required';
    }
    
    // Validate brand name
    if (!formData.brandName) {
      newErrors.brandName = 'Brand name is required';
    }
    
    // Validate business type
    if (!formData.businessType) {
      newErrors.businessType = 'Please select a business type';
    }
    
    // Validate phone number
    if (!formData.phoneNumber) {
      newErrors.phoneNumber = 'Phone number is required';
    }
    
    // Validate registration code
    if (!formData.registrationCode) {
      newErrors.registrationCode = 'Registration code is required';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    setLoading(true);
    
    try {
      // First check if server is available
      try {
        await axios.get('http://localhost:8080/api/auth/status', { timeout: 3000 });
        setServerStatus({ checking: false, connected: true });
      } catch (connectionError) {
        // If server check fails, show error but don't block form submission yet
        setServerStatus({ checking: false, connected: false });
        throw new Error('Unable to connect to authentication server. Please try again later.');
      }
      
      // Remove confirmPassword from data sent to server
      const { confirmPassword, ...dataToSend } = formData;
      
      // Call our auth service to register business
      const response = await AuthService.registerBusiness(
        formData.username,
        formData.email,
        formData.password,
        formData.fullName,
        formData.businessName,
        formData.brandName,
        formData.registrationCode
      );
      
      setSuccess('Business registration successful! You can now login with your credentials.');
      
      // Clear form after successful registration
      setFormData({
        username: '',
        email: '',
        password: '',
        confirmPassword: '',
        fullName: '',
        businessName: '',
        brandName: '',
        businessType: '',
        phoneNumber: '',
        registrationCode: 'BUSINESS_SECRET_CODE'
      });
      
      // Redirect to business login after successful registration
      setTimeout(() => {
        navigate('/business-login');
      }, 3000);
    } catch (error) {
      setLoading(false);
      
      if (error.response) {
        // The request was made and the server responded with an error status
        if (error.response.status === 400 && error.response.data) {
          setErrors({
            submit: error.response.data.message || 'Registration failed. Please check your information.'
          });
          
          // If there's specific field errors in the response, handle them
          if (error.response.data.errors) {
            const fieldErrors = {};
            error.response.data.errors.forEach(err => {
              fieldErrors[err.field] = err.defaultMessage;
            });
            setErrors(prev => ({ ...prev, ...fieldErrors }));
          }
        } else {
          setErrors({
            submit: `Server error (${error.response.status}): ${error.response.data.message || 'Unknown error'}`
          });
        }
      } else if (error.request) {
        // The request was made but no response was received
        setErrors({
          submit: 'No response from server. Please check your internet connection and try again.'
        });
      } else {
        // Something happened in setting up the request that triggered an error
        setErrors({
          submit: `Error: ${error.message}`
        });
      }
    }
  };

  // Display server connectivity warning banner instead of blocking the entire form
  const ServerWarningBanner = () => {
    if (serverStatus.connected) return null;
    
    return (
      <div className="server-warning-banner">
        <p>
          <strong>Warning:</strong> Unable to connect to the authentication server. 
          You can still fill out the form, but registration may fail.
        </p>
        <button 
          onClick={() => window.location.reload()}
          className="retry-connection-btn-small"
        >
          Retry Connection
        </button>
      </div>
    );
  };

  return (
    <div className="business-register-container">
      <div className="business-register-form-wrapper">
        <h2>Register Your Business</h2>
        <p className="register-subtitle">Create an account to access business management features</p>
        
        <ServerWarningBanner />
        
        {success && <div className="success-message">{success}</div>}
        {errors.submit && <div className="error-message">{errors.submit}</div>}
        
        <form className="business-register-form" onSubmit={handleSubmit}>
          <div className="form-section">
            <h3>Account Information</h3>
            
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="username">Username*</label>
                <input
                  type="text"
                  id="username"
                  name="username"
                  value={formData.username}
                  onChange={handleChange}
                  placeholder="Choose a username"
                  disabled={loading}
                />
                {errors.username && <div className="field-error">{errors.username}</div>}
              </div>
              
              <div className="form-group">
                <label htmlFor="email">Email Address*</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="Business email address"
                  disabled={loading}
                />
                {errors.email && <div className="field-error">{errors.email}</div>}
              </div>
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
                  disabled={loading}
                />
                {errors.password && <div className="field-error">{errors.password}</div>}
              </div>
              
              <div className="form-group">
                <label htmlFor="confirmPassword">Confirm Password*</label>
                <input
                  type="password"
                  id="confirmPassword"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  placeholder="Confirm password"
                  disabled={loading}
                />
                {errors.confirmPassword && <div className="field-error">{errors.confirmPassword}</div>}
              </div>
            </div>
          </div>
          
          <div className="form-section">
            <h3>Business Information</h3>
            
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="fullName">Full Name*</label>
                <input
                  type="text"
                  id="fullName"
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleChange}
                  placeholder="Your full name"
                  disabled={loading}
                />
                {errors.fullName && <div className="field-error">{errors.fullName}</div>}
              </div>
              
              <div className="form-group">
                <label htmlFor="phoneNumber">Phone Number*</label>
                <input
                  type="tel"
                  id="phoneNumber"
                  name="phoneNumber"
                  value={formData.phoneNumber}
                  onChange={handleChange}
                  placeholder="Business phone number"
                  disabled={loading}
                />
                {errors.phoneNumber && <div className="field-error">{errors.phoneNumber}</div>}
              </div>
            </div>
            
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="businessName">Business Name*</label>
                <input
                  type="text"
                  id="businessName"
                  name="businessName"
                  value={formData.businessName}
                  onChange={handleChange}
                  placeholder="Your business name"
                  disabled={loading}
                />
                {errors.businessName && <div className="field-error">{errors.businessName}</div>}
              </div>
              
              <div className="form-group">
                <label htmlFor="businessType">Business Type*</label>
                <select
                  id="businessType"
                  name="businessType"
                  value={formData.businessType}
                  onChange={handleChange}
                  disabled={loading}
                >
                  <option value="">Select business type</option>
                  <option value="retail">Retail</option>
                  <option value="wholesale">Wholesale</option>
                  <option value="manufacturing">Manufacturing</option>
                  <option value="services">Services</option>
                  <option value="other">Other</option>
                </select>
                {errors.businessType && <div className="field-error">{errors.businessType}</div>}
              </div>
            </div>
            
            <div className="form-row">
              <div className="form-group brand-name-group">
                <label htmlFor="brandName">Brand Name* <span className="permanent-field-notice">Cannot be changed later</span></label>
                <input
                  type="text"
                  id="brandName"
                  name="brandName"
                  value={formData.brandName}
                  onChange={handleChange}
                  placeholder="Your brand name"
                  disabled={loading}
                  className="permanent-field"
                />
                {errors.brandName && <div className="field-error">{errors.brandName}</div>}
                <small className="field-description">This is how your brand will appear to customers and cannot be modified after registration.</small>
              </div>
            </div>
          </div>
          
          <div className="form-section">
            <h3>Verification</h3>
            
            <div className="form-group">
              <label htmlFor="registrationCode">Business Registration Code*</label>
              <input
                type="text"
                id="registrationCode"
                name="registrationCode"
                value={formData.registrationCode}
                onChange={handleChange}
                placeholder="Enter your registration code"
                disabled={loading}
              />
              {errors.registrationCode && <div className="field-error">{errors.registrationCode}</div>}
              <small>This code verifies you as an authorized business user</small>
            </div>
          </div>
          
          <div className="form-actions">
            <button 
              type="submit" 
              className="business-register-button"
              disabled={loading}
            >
              {loading ? 'Registering...' : 'Register Business'}
            </button>
          </div>
        </form>
        
        <div className="login-link">
          <p>Already have a business account? <a href="/business-login">Login here</a></p>
          <p>Not a business? <a href="/register">Register as customer</a></p>
        </div>
      </div>
    </div>
  );
};

export default BusinessRegisterForm; 