package com.ecommerce.dto;

import com.ecommerce.model.Role;
import com.ecommerce.model.User;
import lombok.Data;

import java.util.Date;
import java.util.Set;

@Data
public class UserDTO {
    private String id;
    private String username;
    private String email;
    private String password;
    private String fullName;
    private String phone;
    private Set<Role> roles;
    private boolean active;
    private String businessName;
    private String businessDescription;
    private String taxId;
    private User.Address address;
    private User.Address businessAddress;
    private boolean verifiedBusiness;
    private Date createdAt;
    private Date updatedAt;
} 