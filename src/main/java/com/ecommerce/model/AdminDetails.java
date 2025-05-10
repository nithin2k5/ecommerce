package com.ecommerce.model;

import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalDateTime;

@Entity
@Table(name = "admin_details")
@Data
public class AdminDetails {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @OneToOne
    @JoinColumn(name = "user_id", nullable = false)
    private User user;
    
    @Column(nullable = false)
    private String department;
    
    @Column(nullable = false)
    private String position;
    
    @Column(name = "access_level")
    private Integer accessLevel;
    
    @Column(name = "last_login")
    private LocalDateTime lastLogin;
    
    @Column(name = "created_at")
    private LocalDateTime createdAt;
    
    @Column(name = "is_super_admin")
    private boolean isSuperAdmin = false;
    
    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
    }
    
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
    
    public String getDepartment() {
        return department;
    }
    
    public void setDepartment(String department) {
        this.department = department;
    }
    
    public String getPosition() {
        return position;
    }
    
    public void setPosition(String position) {
        this.position = position;
    }
    
    public Integer getAccessLevel() {
        return accessLevel;
    }
    
    public void setAccessLevel(Integer accessLevel) {
        this.accessLevel = accessLevel;
    }
    
    public LocalDateTime getLastLogin() {
        return lastLogin;
    }
    
    public void setLastLogin(LocalDateTime lastLogin) {
        this.lastLogin = lastLogin;
    }
    
    public LocalDateTime getCreatedAt() {
        return createdAt;
    }
    
    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }
    
    public boolean isSuperAdmin() {
        return isSuperAdmin;
    }
    
    public void setSuperAdmin(boolean superAdmin) {
        isSuperAdmin = superAdmin;
    }
} 