package com.ecommerce.dto;

import lombok.Data;

import jakarta.validation.constraints.NotBlank;

@Data
public class SuperAdminRequest {
    
    @NotBlank
    private String username;
    
    @NotBlank
    private String superAdminUsername;
    
    @NotBlank
    private String superAdminPassword;
    
    // Getters and setters
    public String getUsername() {
        return username;
    }
    
    public void setUsername(String username) {
        this.username = username;
    }
    
    public String getSuperAdminUsername() {
        return superAdminUsername;
    }
    
    public void setSuperAdminUsername(String superAdminUsername) {
        this.superAdminUsername = superAdminUsername;
    }
    
    public String getSuperAdminPassword() {
        return superAdminPassword;
    }
    
    public void setSuperAdminPassword(String superAdminPassword) {
        this.superAdminPassword = superAdminPassword;
    }
} 