package com.ecommerce.model;

import jakarta.persistence.*;
import lombok.Data;

@Entity
@Table(name = "business_details")
@Data
public class BusinessDetails {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @OneToOne
    @JoinColumn(name = "user_id", nullable = false)
    private User user;
    
    @Column(nullable = false)
    private String businessName;
    
    @Column(nullable = false, updatable = false) // Cannot be changed after creation
    private String brandName;
    
    private String phone;
    
    // Getters and setters
    public Long getId() {
        return id;
    }
    
    public void setId(Long id) {
        this.id = id;
    }
    
    public User getUser() {
        return user;
    }
    
    public void setUser(User user) {
        this.user = user;
    }
    
    public String getBusinessName() {
        return businessName;
    }
    
    public void setBusinessName(String businessName) {
        this.businessName = businessName;
    }
    
    public String getBrandName() {
        return brandName;
    }
    
    public void setBrandName(String brandName) {
        this.brandName = brandName;
    }
    
    public String getPhone() {
        return phone;
    }
    
    public void setPhone(String phone) {
        this.phone = phone;
    }
} 