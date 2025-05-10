package com.ecommerce.controller;

import com.ecommerce.dto.MessageResponse;
import com.ecommerce.dto.SuperAdminRequest;
import com.ecommerce.model.AdminDetails;
import com.ecommerce.service.AdminService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@CrossOrigin(origins = "http://localhost:3000")
@RestController
@RequestMapping("/api/admin")
public class AdminController {
    
    @Autowired
    private AdminService adminService;
    
    /**
     * Get all admins (requires super admin role)
     */
    @GetMapping("/all")
    @PreAuthorize("hasRole('ADMIN') and hasAuthority('SUPER_ADMIN')")
    public ResponseEntity<List<AdminDetails>> getAllAdmins() {
        List<AdminDetails> admins = adminService.getAllAdmins();
        return ResponseEntity.ok(admins);
    }
    
    /**
     * Check if user is super admin
     */
    @GetMapping("/check-super-admin")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Boolean> checkSuperAdmin(@RequestParam String username) {
        boolean isSuperAdmin = adminService.isSuperAdmin(username);
        return ResponseEntity.ok(isSuperAdmin);
    }
    
    /**
     * Super admin login endpoint (for existing admins to become super admins)
     */
    @PostMapping("/super-admin-login")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> superAdminLogin(@RequestBody SuperAdminRequest request) {
        boolean success = adminService.grantSuperAdminPrivilege(
            request.getUsername(),
            request.getSuperAdminUsername(),
            request.getSuperAdminPassword()
        );
        
        if (success) {
            return ResponseEntity.ok(new MessageResponse("Super Admin privileges granted successfully!"));
        } else {
            return ResponseEntity.badRequest().body(new MessageResponse("Invalid Super Admin credentials!"));
        }
    }
    
    /**
     * Log admin login for tracking
     */
    @PostMapping("/login-tracking")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> trackLogin(@RequestParam String username) {
        adminService.updateLastLogin(username);
        return ResponseEntity.ok(new MessageResponse("Login tracked successfully"));
    }
} 