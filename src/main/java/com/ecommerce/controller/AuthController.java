package com.ecommerce.controller;

import com.ecommerce.dto.AuthRequest;
import com.ecommerce.dto.AuthResponse;
import com.ecommerce.model.Role;
import com.ecommerce.model.User;
import com.ecommerce.repository.UserRepository;
import com.ecommerce.security.JwtTokenProvider;
import com.ecommerce.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;
import java.util.HashSet;
import java.util.Set;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = {"http://localhost:3000", "http://localhost:3001"})
public class AuthController {

    @Autowired
    private AuthenticationManager authenticationManager;

    @Autowired
    private JwtTokenProvider jwtTokenProvider;

    @Autowired
    private UserService userService;

    @Autowired
    private UserRepository userRepository;

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody AuthRequest authRequest) {
        try {
            Authentication authentication = authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(authRequest.getUsername(), authRequest.getPassword())
            );

            SecurityContextHolder.getContext().setAuthentication(authentication);
            UserDetails userDetails = (UserDetails) authentication.getPrincipal();
            String token = jwtTokenProvider.generateToken(userDetails);

            User user = userService.getUserByUsername(authRequest.getUsername())
                    .orElseThrow(() -> new RuntimeException("User not found"));

            return ResponseEntity.ok(new AuthResponse(token, user.getUsername(), user.getId(), user.getRoles()));
        } catch (BadCredentialsException e) {
            Map<String, String> response = new HashMap<>();
            response.put("error", "Invalid username or password");
            response.put("message", "Authentication failed");
            return new ResponseEntity<>(response, HttpStatus.UNAUTHORIZED);
        } catch (Exception e) {
            Map<String, String> response = new HashMap<>();
            response.put("error", e.getMessage());
            response.put("message", "Login failed");
            return new ResponseEntity<>(response, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody User user) {
        try {
            // Check if username or email already exists
            if (userService.usernameExists(user.getUsername())) {
                Map<String, String> response = new HashMap<>();
                response.put("error", "Username already exists");
                return new ResponseEntity<>(response, HttpStatus.BAD_REQUEST);
            }

            if (userService.emailExists(user.getEmail())) {
                Map<String, String> response = new HashMap<>();
                response.put("error", "Email already exists");
                return new ResponseEntity<>(response, HttpStatus.BAD_REQUEST);
            }

            // Create new user
            Set<Role> roles = new HashSet<>();
            roles.add(Role.USER);
            User registeredUser = userService.createUser(user, roles);

            return new ResponseEntity<>(registeredUser, HttpStatus.CREATED);
        } catch (Exception e) {
            Map<String, String> response = new HashMap<>();
            response.put("error", e.getMessage());
            return new ResponseEntity<>(response, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    
    @PostMapping("/register/business")
    public ResponseEntity<?> registerBusiness(@RequestBody Map<String, Object> requestBody) {
        try {
            // Extract user details from request
            User user = new User();
            user.setUsername((String) requestBody.get("username"));
            user.setPassword((String) requestBody.get("password"));
            user.setEmail((String) requestBody.get("email"));
            user.setFullName((String) requestBody.get("fullName"));
            
            // Set business details
            user.setBusinessName((String) requestBody.get("businessName"));
            user.setBusinessDescription((String) requestBody.getOrDefault("businessType", ""));
            
            // Check if username or email already exists
            if (userService.usernameExists(user.getUsername())) {
                Map<String, String> response = new HashMap<>();
                response.put("error", "Username already exists");
                return new ResponseEntity<>(response, HttpStatus.BAD_REQUEST);
            }

            if (userService.emailExists(user.getEmail())) {
                Map<String, String> response = new HashMap<>();
                response.put("error", "Email already exists");
                return new ResponseEntity<>(response, HttpStatus.BAD_REQUEST);
            }

            // Create business admin user with BUSINESS_ADMIN role
            Set<Role> roles = new HashSet<>();
            roles.add(Role.BUSINESS_ADMIN); // Primary role
            roles.add(Role.USER); // Secondary role for basic access
            
            User registeredUser = userService.createUser(user, roles);

            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("message", "Business account registered successfully");
            response.put("userId", registeredUser.getId());
            response.put("username", registeredUser.getUsername());
            
            return new ResponseEntity<>(response, HttpStatus.CREATED);
        } catch (Exception e) {
            Map<String, String> response = new HashMap<>();
            response.put("error", e.getMessage());
            return new ResponseEntity<>(response, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
} 