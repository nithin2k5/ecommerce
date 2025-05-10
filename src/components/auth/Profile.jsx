import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { FaUser, FaEnvelope, FaPhone, FaMapMarkerAlt, FaEdit, FaSave, FaTimes } from 'react-icons/fa';
import axios from 'axios';
import './BusinessRegister.css';
import '../../styles/Auth.css';
import './Profile.css';
import authService from '../../services/auth.service';

const Profile = () => {
  const auth = useSelector((state) => state.auth) || { isAuthenticated: false, user: null };
  const { user } = auth;
  
  // Get user from localStorage as fallback
  const localUser = localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user')) : null;
  const effectiveUser = user || localUser;
  
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [editMode, setEditMode] = useState(false);
  const [customerDetails, setCustomerDetails] = useState(null);
  const [formData, setFormData] = useState({
    phone: '',
    street: '',
    city: '',
    state: '',
    zipCode: '',
    country: ''
  });

  // Fetch customer details
  useEffect(() => {
    const fetchCustomerDetails = async () => {
      setLoading(true);
      setError('');
      
      try {
        // Get the JWT token
        const token = localStorage.getItem('token');
        
        if (!token) {
          setError('Authentication token not found. Please log in again.');
          setLoading(false);
          return;
        }
        
        // Make API request to get customer details
        const response = await axios.get('http://localhost:8080/api/customer/details', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        
        console.log('Customer details response:', response.data);
        
        if (response.data && !response.data.message) {
          // If we got actual customer details
          setCustomerDetails(response.data);
          // Initialize form data with current customer details
          setFormData({
            phone: response.data.phone || '',
            street: response.data.street || '',
            city: response.data.city || '',
            state: response.data.state || '',
            zipCode: response.data.zipCode || '',
            country: response.data.country || ''
          });
        } else if (response.data && response.data.message === 'No customer details found') {
          // If no customer details found yet, create an empty record
          console.log('No customer details found, showing empty form');
          setCustomerDetails({
            phone: '',
            street: '',
            city: '',
            state: '',
            zipCode: '',
            country: ''
          });
          
          // Initialize form with empty values for new customers
          setFormData({
            phone: '',
            street: '',
            city: '',
            state: '',
            zipCode: '',
            country: ''
          });
        } else {
          // Unknown response format
          console.warn('Unexpected response format:', response.data);
          setCustomerDetails(null);
        }
      } catch (err) {
        console.error('Error fetching customer details:', err);
        
        if (err.response && err.response.status === 404) {
          // User exists but no customer details found yet
          console.log('No customer details found (404), showing empty form');
          setCustomerDetails(null);
          
          // Initialize form with empty values for new customers
          setFormData({
            phone: '',
            street: '',
            city: '',
            state: '',
            zipCode: '',
            country: ''
          });
        } else {
          setError('Failed to fetch profile details. Please try again later.');
        }
      } finally {
        setLoading(false);
      }
    };
    
    if (effectiveUser) {
      fetchCustomerDetails();
    } else {
      setLoading(false);
      setError('Not logged in');
    }
  }, [effectiveUser]);
  
  // Handle form input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };
  
  // Handle form submission to update customer details
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    try {
      // Get the JWT token
      const token = localStorage.getItem('token');
      
      if (!token) {
        setError('Authentication token not found. Please log in again.');
        setLoading(false);
        return;
      }
      
      // Prepare the updated details - only include non-empty fields
      const updatedDetails = {};
      
      // Add each field if it has a value
      Object.keys(formData).forEach(key => {
        if (formData[key] && formData[key].trim() !== '') {
          updatedDetails[key] = formData[key];
        }
      });
      
      console.log('Submitting updated customer details:', updatedDetails);
      
      // Make API request to update customer details
      const response = await axios.put('http://localhost:8080/api/customer/details', updatedDetails, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      console.log('Update response:', response.data);
      
      // Update local state with the new details, preserving any existing data not included in update
      setCustomerDetails(prev => ({
        ...prev,
        ...updatedDetails
      }));
      
      // Exit edit mode
      setEditMode(false);
      
      // Show success alert
      alert('Profile updated successfully!');
    } catch (err) {
      console.error('Error updating customer details:', err);
      
      if (err.response && err.response.status === 404) {
        // User exists but no customer details found yet - create a new record
        setError('Could not update profile. Please try again later.');
      } else if (err.response && err.response.data && err.response.data.message) {
        setError(err.response.data.message);
      } else {
        setError('Failed to update profile. Please try again later.');
      }
    } finally {
      setLoading(false);
    }
  };
  
  // Toggle edit mode
  const toggleEditMode = () => {
    if (editMode) {
      // If canceling edit, reset form to original values
      setFormData({
        phone: customerDetails?.phone || '',
        street: customerDetails?.street || '',
        city: customerDetails?.city || '',
        state: customerDetails?.state || '',
        zipCode: customerDetails?.zipCode || '',
        country: customerDetails?.country || ''
      });
    }
    setEditMode(!editMode);
  };
  
  if (loading && !customerDetails) {
    return (
      <div className="business-register-container">
        <div className="business-register-card">
          <h2>User Profile</h2>
          <div className="loading">Loading profile information...</div>
        </div>
      </div>
    );
  }
  
  if (error && !customerDetails && !effectiveUser) {
    return (
      <div className="business-register-container">
        <div className="business-register-card">
          <h2>User Profile</h2>
          <div className="form-error">{error}</div>
          <p>Please <a href="/login">log in</a> to view your profile.</p>
        </div>
      </div>
    );
  }
  
  return (
    <div className="business-register-container">
      <div className="business-register-card">
        <div className="profile-header">
          <h2>User Profile</h2>
          {!editMode ? (
            <button className="edit-btn" onClick={toggleEditMode}>
              <FaEdit /> Edit Profile
            </button>
          ) : (
            <button className="cancel-btn" onClick={toggleEditMode}>
              <FaTimes /> Cancel
            </button>
          )}
        </div>
        
        {error && <div className="form-error">{error}</div>}
        
        <div className="profile-section">
          <h3>Account Information</h3>
          <div className="profile-info">
            <div className="info-item">
              <FaUser className="info-icon" />
              <div className="info-content">
                <label>Username</label>
                <p>{effectiveUser?.username || 'N/A'}</p>
              </div>
            </div>
            
            <div className="info-item">
              <FaEnvelope className="info-icon" />
              <div className="info-content">
                <label>Email</label>
                <p>{effectiveUser?.email || 'N/A'}</p>
              </div>
            </div>
          </div>
        </div>
        
        {editMode ? (
          <form onSubmit={handleSubmit}>
            <div className="profile-section">
              <h3>Contact Information</h3>
              <div className="form-group">
                <label htmlFor="phone">Phone Number</label>
                <input
                  type="text"
                  id="phone"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="Enter your phone number"
                />
              </div>
            </div>
            
            <div className="profile-section">
              <h3>Shipping Address</h3>
              <div className="form-group">
                <label htmlFor="street">Street Address</label>
                <input
                  type="text"
                  id="street"
                  name="street"
                  value={formData.street}
                  onChange={handleChange}
                  placeholder="Enter your street address"
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
                    placeholder="Enter your city"
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
                    placeholder="Enter your state/province"
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
                    placeholder="Enter your zip/postal code"
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
                    placeholder="Enter your country"
                  />
                </div>
              </div>
            </div>
            
            <div className="form-nav">
              <button type="submit" className="submit-btn" disabled={loading}>
                {loading ? 'Updating...' : 'Save Changes'}
              </button>
            </div>
          </form>
        ) : (
          <>
            <div className="profile-section">
              <h3>Contact Information</h3>
              <div className="profile-info">
                <div className="info-item">
                  <FaPhone className="info-icon" />
                  <div className="info-content">
                    <label>Phone</label>
                    <p>{customerDetails?.phone || 'Not provided'}</p>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="profile-section">
              <h3>Shipping Address</h3>
              <div className="profile-info">
                <div className="info-item">
                  <FaMapMarkerAlt className="info-icon" />
                  <div className="info-content">
                    <label>Address</label>
                    {customerDetails?.street ? (
                      <div className="address-block">
                        <p>{customerDetails.street}</p>
                        <p>{customerDetails.city}{customerDetails.state ? `, ${customerDetails.state}` : ''} {customerDetails.zipCode}</p>
                        <p>{customerDetails.country}</p>
                      </div>
                    ) : (
                      <p>No address provided</p>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
      
      {/* Order History or other sections could be added here */}
      <div className="registration-info-card">
        <h3>Account Benefits</h3>
        <ul>
          <li>Manage your personal information</li>
          <li>Track your order history</li>
          <li>Save shipping addresses for faster checkout</li>
          <li>Update your contact preferences</li>
        </ul>
        <p>Keep your profile information up-to-date for the best shopping experience!</p>
      </div>
    </div>
  );
};

export default Profile; 