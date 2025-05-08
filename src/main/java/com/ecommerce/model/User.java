package com.ecommerce.model;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.index.Indexed;
import org.springframework.data.mongodb.core.mapping.Document;

import java.util.Date;
import java.util.HashSet;
import java.util.Set;

@Document(collection = "users")
public class User {
    @Id
    private String id;
    
    @Indexed(unique = true)
    private String username;
    
    @Indexed(unique = true)
    private String email;
    
    private String password;
    private String fullName;
    private String phone;
    private Set<Role> roles = new HashSet<>();
    private boolean active;
    private Date createdAt;
    private Date updatedAt;
    
    // Address fields
    private Address address;
    
    // Business fields
    private String businessName;
    private String businessDescription;
    private String taxId;
    private Address businessAddress;
    private boolean verifiedBusiness;
    
    // Nested Address class
    public static class Address {
        private String street;
        private String city;
        private String state;
        private String zipCode;
        private String country;
        
        // Getters and Setters
        public String getStreet() { return street; }
        public void setStreet(String street) { this.street = street; }
        
        public String getCity() { return city; }
        public void setCity(String city) { this.city = city; }
        
        public String getState() { return state; }
        public void setState(String state) { this.state = state; }
        
        public String getZipCode() { return zipCode; }
        public void setZipCode(String zipCode) { this.zipCode = zipCode; }
        
        public String getCountry() { return country; }
        public void setCountry(String country) { this.country = country; }
    }
    
    // Constructors
    public User() {
        this.createdAt = new Date();
        this.active = true;
    }
    
    public User(String username, String email, String password, String fullName) {
        this.username = username;
        this.email = email;
        this.password = password;
        this.fullName = fullName;
        this.createdAt = new Date();
        this.active = true;
    }
    
    // Getters and Setters
    public String getId() { return id; }
    public void setId(String id) { this.id = id; }
    
    public String getUsername() { return username; }
    public void setUsername(String username) { this.username = username; }
    
    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }
    
    public String getPassword() { return password; }
    public void setPassword(String password) { this.password = password; }
    
    public String getFullName() { return fullName; }
    public void setFullName(String fullName) { this.fullName = fullName; }
    
    public String getPhone() { return phone; }
    public void setPhone(String phone) { this.phone = phone; }
    
    public Set<Role> getRoles() { return roles; }
    public void setRoles(Set<Role> roles) { this.roles = roles; }
    
    public boolean isActive() { return active; }
    public void setActive(boolean active) { this.active = active; }
    
    public Date getCreatedAt() { return createdAt; }
    public void setCreatedAt(Date createdAt) { this.createdAt = createdAt; }
    
    public Date getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(Date updatedAt) { this.updatedAt = updatedAt; }
    
    public Address getAddress() { return address; }
    public void setAddress(Address address) { this.address = address; }
    
    public String getBusinessName() { return businessName; }
    public void setBusinessName(String businessName) { this.businessName = businessName; }
    
    public String getBusinessDescription() { return businessDescription; }
    public void setBusinessDescription(String businessDescription) { this.businessDescription = businessDescription; }
    
    public String getTaxId() { return taxId; }
    public void setTaxId(String taxId) { this.taxId = taxId; }
    
    public Address getBusinessAddress() { return businessAddress; }
    public void setBusinessAddress(Address businessAddress) { this.businessAddress = businessAddress; }
    
    public boolean isVerifiedBusiness() { return verifiedBusiness; }
    public void setVerifiedBusiness(boolean verifiedBusiness) { this.verifiedBusiness = verifiedBusiness; }
} 