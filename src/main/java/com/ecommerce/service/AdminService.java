package com.ecommerce.service;

import com.ecommerce.model.AdminDetails;
import com.ecommerce.model.User;
import com.ecommerce.repository.AdminDetailsRepository;
import com.ecommerce.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.HashSet;
import java.util.List;
import java.util.Optional;
import java.util.Set;

@Service
public class AdminService {
    
    @Autowired
    private AdminDetailsRepository adminDetailsRepository;
    
    @Autowired
    private UserRepository userRepository;
    
    @Autowired
    private PasswordEncoder passwordEncoder;
    
    /**
     * Get all admin details
     */
    public List<AdminDetails> getAllAdmins() {
        return adminDetailsRepository.findAll();
    }
    
    /**
     * Get super admins only
     */
    public List<AdminDetails> getSuperAdmins() {
        return adminDetailsRepository.findByIsSuperAdmin(true);
    }
    
    /**
     * Create new admin account
     */
    @Transactional
    public AdminDetails createAdmin(String username, String email, String password, 
                                   String fullName, String department, String position, 
                                   Integer accessLevel, boolean isSuperAdmin) {
        // Create user with ADMIN role
        User user = new User();
        user.setUsername(username);
        user.setEmail(email);
        user.setPassword(passwordEncoder.encode(password));
        user.setFullName(fullName);
        user.setEnabled(true);
        
        Set<String> roles = new HashSet<>();
        roles.add("ROLE_ADMIN");
        if (isSuperAdmin) {
            roles.add("SUPER_ADMIN");
        }
        user.setRoles(roles);
        
        User savedUser = userRepository.save(user);
        
        // Create admin details
        AdminDetails adminDetails = new AdminDetails();
        adminDetails.setUser(savedUser);
        adminDetails.setDepartment(department);
        adminDetails.setPosition(position);
        adminDetails.setAccessLevel(accessLevel);
        adminDetails.setSuperAdmin(isSuperAdmin);
        adminDetails.setLastLogin(LocalDateTime.now());
        
        return adminDetailsRepository.save(adminDetails);
    }
    
    /**
     * Check if user is a super admin
     */
    public boolean isSuperAdmin(String username) {
        Optional<AdminDetails> adminDetailsOpt = adminDetailsRepository.findByUserUsername(username);
        return adminDetailsOpt.isPresent() && adminDetailsOpt.get().isSuperAdmin();
    }
    
    /**
     * Update last login time
     */
    @Transactional
    public void updateLastLogin(String username) {
        Optional<AdminDetails> adminDetailsOpt = adminDetailsRepository.findByUserUsername(username);
        if (adminDetailsOpt.isPresent()) {
            AdminDetails adminDetails = adminDetailsOpt.get();
            adminDetails.setLastLogin(LocalDateTime.now());
            adminDetailsRepository.save(adminDetails);
        }
    }
    
    /**
     * Grant super admin privileges
     */
    @Transactional
    public boolean grantSuperAdminPrivilege(String username, String superAdminUsername, String superAdminPassword) {
        // Verify that the super admin credentials are valid
        Optional<User> superAdminUserOpt = userRepository.findByUsername(superAdminUsername);
        if (!superAdminUserOpt.isPresent()) {
            return false;
        }
        
        User superAdminUser = superAdminUserOpt.get();
        if (!passwordEncoder.matches(superAdminPassword, superAdminUser.getPassword())) {
            return false;
        }
        
        Optional<AdminDetails> superAdminDetailsOpt = adminDetailsRepository.findByUser(superAdminUser);
        if (!superAdminDetailsOpt.isPresent() || !superAdminDetailsOpt.get().isSuperAdmin()) {
            return false;
        }
        
        // Grant super admin privilege to target user
        Optional<User> targetUserOpt = userRepository.findByUsername(username);
        if (!targetUserOpt.isPresent()) {
            return false;
        }
        
        User targetUser = targetUserOpt.get();
        Set<String> roles = targetUser.getRoles();
        if (!roles.contains("SUPER_ADMIN")) {
            roles.add("SUPER_ADMIN");
            targetUser.setRoles(roles);
            userRepository.save(targetUser);
        }
        
        Optional<AdminDetails> targetAdminDetailsOpt = adminDetailsRepository.findByUser(targetUser);
        if (targetAdminDetailsOpt.isPresent()) {
            AdminDetails targetAdminDetails = targetAdminDetailsOpt.get();
            targetAdminDetails.setSuperAdmin(true);
            adminDetailsRepository.save(targetAdminDetails);
        }
        
        return true;
    }
} 