package com.ecommerce.dto;

public class RegistrationResponse {
    private boolean success;
    private String message;
    private String userId;
    
    public RegistrationResponse(boolean success, String message) {
        this.success = success;
        this.message = message;
    }
    
    public RegistrationResponse(boolean success, String message, String userId) {
        this.success = success;
        this.message = message;
        this.userId = userId;
    }
    
    // Getters and Setters
    public boolean isSuccess() { return success; }
    public void setSuccess(boolean success) { this.success = success; }
    
    public String getMessage() { return message; }
    public void setMessage(String message) { this.message = message; }
    
    public String getUserId() { return userId; }
    public void setUserId(String userId) { this.userId = userId; }
} 