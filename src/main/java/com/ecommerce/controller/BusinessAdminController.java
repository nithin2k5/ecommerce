package com.ecommerce.controller;

import com.ecommerce.dto.UserDTO;
import com.ecommerce.model.Role;
import com.ecommerce.model.User;
import com.ecommerce.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.HashSet;
import java.util.List;
import java.util.Set;

@RestController
@RequestMapping("/api/business-admin")
@PreAuthorize("hasAuthority('BUSINESS_ADMIN')")
public class BusinessAdminController {

    @Autowired
    private UserService userService;

    @GetMapping("/admins")
    public ResponseEntity<List<UserDTO>> getAllAdmins() {
        List<UserDTO> admins = userService.getUsersByRole(Role.ADMIN);
        return ResponseEntity.ok(admins);
    }

    @PostMapping("/admins")
    public ResponseEntity<?> createAdmin(@RequestBody UserDTO userDTO) {
        if (userService.usernameExists(userDTO.getUsername())) {
            return ResponseEntity.badRequest().body("Username is already taken");
        }

        if (userService.emailExists(userDTO.getEmail())) {
            return ResponseEntity.badRequest().body("Email is already in use");
        }

        Set<Role> roles = new HashSet<>();
        roles.add(Role.ADMIN);
        
        UserDTO createdUser = userService.createUser(userDTO, roles);
        return ResponseEntity.ok(createdUser);
    }

    @PutMapping("/admins/{id}")
    public ResponseEntity<?> updateAdmin(@PathVariable String id, @RequestBody UserDTO userDTO) {
        UserDTO updatedUser = userService.updateUser(id, userDTO);
        if (updatedUser != null) {
            return ResponseEntity.ok(updatedUser);
        }
        return ResponseEntity.notFound().build();
    }

    @DeleteMapping("/admins/{id}")
    public ResponseEntity<?> deleteAdmin(@PathVariable String id) {
        if (userService.deleteUser(id)) {
            return ResponseEntity.ok().build();
        }
        return ResponseEntity.notFound().build();
    }

    @GetMapping("/dashboard")
    public ResponseEntity<?> getBusinessDashboardData() {
        // In a real application, you would aggregate data about products, sales, etc.
        return ResponseEntity.ok("Business Admin Dashboard Data");
    }
} 