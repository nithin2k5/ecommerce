package com.ecommerce.dto;

import com.ecommerce.model.Role;
import java.util.Set;

public class AuthResponse {
    private String token;
    private String username;
    private String userId;
    private Set<Role> roles;
    
    // Constructors
    public AuthResponse() {
    }
    
    public AuthResponse(String token, String username, String userId) {
        this.token = token;
        this.username = username;
        this.userId = userId;
    }
    
    public AuthResponse(String token, String username, String userId, Set<Role> roles) {
        this.token = token;
        this.username = username;
        this.userId = userId;
        this.roles = roles;
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
    
    public Set<Role> getRoles() {
        return roles;
    }
    
    public void setRoles(Set<Role> roles) {
        this.roles = roles;
    }
} 