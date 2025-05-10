package com.ecommerce.controller;

import com.ecommerce.dto.JwtResponse;
import com.ecommerce.dto.LoginRequest;
import com.ecommerce.dto.MessageResponse;
import com.ecommerce.dto.SignupRequest;
import com.ecommerce.model.BusinessDetails;
import com.ecommerce.model.CustomerDetails;
import com.ecommerce.model.User;
import com.ecommerce.repository.BusinessDetailsRepository;
import com.ecommerce.repository.CustomerDetailsRepository;
import com.ecommerce.repository.UserRepository;
import com.ecommerce.security.JwtUtils;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.HashSet;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

@CrossOrigin(origins = "http://localhost:3000", maxAge = 3600, allowCredentials = "true")
@RestController
@RequestMapping("/api/auth")
public class AuthController {
    
    @Value("${business.registration.code:BUSINESS_SECRET_CODE}")
    private String businessRegistrationCode;
    
    @Autowired
    AuthenticationManager authenticationManager;

    @Autowired
    UserRepository userRepository;
    
    @Autowired
    CustomerDetailsRepository customerDetailsRepository;

    @Autowired
    BusinessDetailsRepository businessDetailsRepository;

    @Autowired
    PasswordEncoder encoder;

    @Autowired
    JwtUtils jwtUtils;

    @PostMapping("/signin")
    public ResponseEntity<?> authenticateUser(@Valid @RequestBody LoginRequest loginRequest) {
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(loginRequest.getUsername(), loginRequest.getPassword()));

        SecurityContextHolder.getContext().setAuthentication(authentication);
        String jwt = jwtUtils.generateJwtToken(authentication);
        
        UserDetails userDetails = (UserDetails) authentication.getPrincipal();
        User user = userRepository.findByUsername(userDetails.getUsername()).orElseThrow();
        
        List<String> roles = userDetails.getAuthorities().stream()
                .map(item -> item.getAuthority())
                .collect(Collectors.toList());

        return ResponseEntity.ok(new JwtResponse(jwt,
                user.getId(),
                userDetails.getUsername(),
                user.getEmail(),
                roles));
    }

    @PostMapping("/signup")
    public ResponseEntity<?> registerUser(@Valid @RequestBody SignupRequest signUpRequest) {
        if (userRepository.existsByUsername(signUpRequest.getUsername())) {
            return ResponseEntity
                    .badRequest()
                    .body(new MessageResponse("Error: Username is already taken!"));
        }

        if (userRepository.existsByEmail(signUpRequest.getEmail())) {
            return ResponseEntity
                    .badRequest()
                    .body(new MessageResponse("Error: Email is already in use!"));
        }

        try {
            // Create new user's account
            User user = new User();
            user.setUsername(signUpRequest.getUsername());
            user.setEmail(signUpRequest.getEmail());
            user.setPassword(encoder.encode(signUpRequest.getPassword()));
            user.setFullName(signUpRequest.getFullName());
    
            Set<String> strRoles = signUpRequest.getRoles();
            Set<String> roles = new HashSet<>();
    
            if (strRoles == null || strRoles.isEmpty()) {
                roles.add("ROLE_USER");
            } else {
                strRoles.forEach(role -> {
                    switch (role) {
                        case "admin":
                            roles.add("ROLE_ADMIN");
                            break;
                        case "business":
                            roles.add("ROLE_BUSINESS");
                            break;
                        default:
                            roles.add("ROLE_USER");
                    }
                });
            }
    
            user.setRoles(roles);
            User savedUser = userRepository.save(user);
            
            // Save customer details if provided
            boolean hasCustomerDetails = signUpRequest.getPhone() != null || 
                                        signUpRequest.getStreet() != null || 
                                        signUpRequest.getCity() != null || 
                                        signUpRequest.getState() != null || 
                                        signUpRequest.getZipCode() != null || 
                                        signUpRequest.getCountry() != null;
                                        
            if (hasCustomerDetails) {
                CustomerDetails customerDetails = new CustomerDetails();
                customerDetails.setUser(savedUser);
                customerDetails.setPhone(signUpRequest.getPhone());
                customerDetails.setStreet(signUpRequest.getStreet());
                customerDetails.setCity(signUpRequest.getCity());
                customerDetails.setState(signUpRequest.getState());
                customerDetails.setZipCode(signUpRequest.getZipCode());
                customerDetails.setCountry(signUpRequest.getCountry());
                
                customerDetailsRepository.save(customerDetails);
            }
    
            return ResponseEntity.ok(new MessageResponse("User registered successfully!"));
        } catch (Exception e) {
            return ResponseEntity
                    .badRequest()
                    .body(new MessageResponse("Error: " + e.getMessage()));
        }
    }
    
    @PostMapping("/business/signup")
    public ResponseEntity<?> registerBusinessUser(@Valid @RequestBody SignupRequest signUpRequest) {
        // Validate business registration code
        if (signUpRequest.getRegistrationCode() == null || 
            !signUpRequest.getRegistrationCode().equals(businessRegistrationCode)) {
            return ResponseEntity
                    .badRequest()
                    .body(new MessageResponse("Error: Invalid business registration code"));
        }
        
        if (userRepository.existsByUsername(signUpRequest.getUsername())) {
            return ResponseEntity
                    .badRequest()
                    .body(new MessageResponse("Error: Username is already taken!"));
        }

        if (userRepository.existsByEmail(signUpRequest.getEmail())) {
            return ResponseEntity
                    .badRequest()
                    .body(new MessageResponse("Error: Email is already in use!"));
        }
        
        // Validate that brand name is provided
        if (signUpRequest.getBrandName() == null || signUpRequest.getBrandName().trim().isEmpty()) {
            return ResponseEntity
                    .badRequest()
                    .body(new MessageResponse("Error: Brand name is required and cannot be empty"));
        }

        try {
            // Create new business user
            User user = new User();
            user.setUsername(signUpRequest.getUsername());
            user.setEmail(signUpRequest.getEmail());
            user.setPassword(encoder.encode(signUpRequest.getPassword()));
            user.setFullName(signUpRequest.getFullName());
            
            // Assign business role
            Set<String> roles = new HashSet<>();
            roles.add("ROLE_BUSINESS");
            user.setRoles(roles);
            
            User savedUser = userRepository.save(user);
            
            // Create and save business details
            BusinessDetails businessDetails = new BusinessDetails();
            businessDetails.setUser(savedUser);
            businessDetails.setBusinessName(signUpRequest.getBusinessName());
            businessDetails.setBrandName(signUpRequest.getBrandName()); // Set brand name
            businessDetails.setPhone(signUpRequest.getPhone());
            
            businessDetailsRepository.save(businessDetails);
    
            return ResponseEntity.ok(new MessageResponse("Business account registered successfully!"));
        } catch (Exception e) {
            return ResponseEntity
                    .badRequest()
                    .body(new MessageResponse("Error: " + e.getMessage()));
        }
    }

    @GetMapping("/status")
    @PreAuthorize("permitAll()")
    public ResponseEntity<?> checkStatus() {
        return ResponseEntity.ok().body(new MessageResponse("Server is running"));
    }
} 