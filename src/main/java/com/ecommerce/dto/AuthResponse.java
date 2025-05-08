package com.ecommerce.dto;

public class AuthResponse {
    private String token;
    private String username;
    private String userId;
    
    // Constructors
    public AuthResponse() {
    }
    
    public AuthResponse(String token, String username, String userId) {
        this.token = token;
        this.username = username;
        this.userId = userId;
    }
    
    // Getters and Setters
    public String getToken() {
        return token;
    }
    
    public void setToken(String token) {
        this.token = token;
    }
    
    public String getUsername() {
        return username;
    }
    
    public void setUsername(String username) {
        this.username = username;
    }
    
    public String getUserId() {
        return userId;
    }
    
    public void setUserId(String userId) {
        this.userId = userId;
    }
} 