package com.ecommerce.controller;

import com.ecommerce.dto.AuthRequest;
import com.ecommerce.dto.AuthResponse;
import com.ecommerce.model.Role;
import com.ecommerce.model.User;
import com.ecommerce.repository.UserRepository;
import com.ecommerce.security.JwtTokenProvider;
import com.ecommerce.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.HashSet;
import java.util.Map;
import java.util.Set;

@RestController
@RequestMapping("/auth")
public class AuthController {

    @Autowired
    private AuthenticationManager authenticationManager;

    @Autowired
    private JwtTokenProvider tokenProvider;

    @Autowired
    private UserService userService;

    @Autowired
    private UserRepository userRepository;

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody Map<String, String> credentials) {
        Map<String, Object> response = new HashMap<>();
        
        // Simple hardcoded authentication for testing
        if ("businessadmin".equals(credentials.get("username")) && 
            "admin123".equals(credentials.get("password"))) {
            
            response.put("status", "success");
            response.put("token", "sample-token");
            response.put("role", "BUSINESS_ADMIN");
            return ResponseEntity.ok(response);
        }
        
        response.put("status", "error");
        response.put("message", "Invalid credentials");
        return ResponseEntity.badRequest().body(response);
    }

    @PostMapping("/register")
    public ResponseEntity<?> registerUser(@RequestBody User user) {
        if (userService.usernameExists(user.getUsername())) {
            return ResponseEntity.badRequest().body("Username is already taken");
        }

        if (userService.emailExists(user.getEmail())) {
            return ResponseEntity.badRequest().body("Email is already in use");
        }

        // Set default role as USER
        Set<Role> roles = new HashSet<>();
        roles.add(Role.USER);
        
        return ResponseEntity.ok(userService.createUser(user, roles));
    }
} 