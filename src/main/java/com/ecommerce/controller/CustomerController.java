package com.ecommerce.controller;

import com.ecommerce.model.CustomerDetails;
import com.ecommerce.model.User;
import com.ecommerce.repository.CustomerDetailsRepository;
import com.ecommerce.repository.UserRepository;
import com.ecommerce.security.JwtUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;
import java.util.Optional;

@CrossOrigin(origins = "http://localhost:3000", maxAge = 3600, allowCredentials = "true")
@RestController
@RequestMapping("/api/customer")
public class CustomerController {

    @Autowired
    private CustomerDetailsRepository customerDetailsRepository;
    
    @Autowired
    private UserRepository userRepository;
    
    @Autowired
    private JwtUtils jwtUtils;
    
    @GetMapping("/details")
    @PreAuthorize("hasRole('USER')")
    public ResponseEntity<?> getCustomerDetails() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String username = authentication.getName();
        
        Optional<User> userOpt = userRepository.findByUsername(username);
        if (!userOpt.isPresent()) {
            return ResponseEntity.notFound().build();
        }
        
        User user = userOpt.get();
        Optional<CustomerDetails> customerDetailsOpt = customerDetailsRepository.findByUser(user);
        
        if (!customerDetailsOpt.isPresent()) {
            Map<String, String> response = new HashMap<>();
            response.put("message", "No customer details found");
            return ResponseEntity.ok(response);
        }
        
        return ResponseEntity.ok(customerDetailsOpt.get());
    }
    
    @PutMapping("/details")
    @PreAuthorize("hasRole('USER')")
    public ResponseEntity<?> updateCustomerDetails(@RequestBody CustomerDetails updatedDetails) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String username = authentication.getName();
        
        Optional<User> userOpt = userRepository.findByUsername(username);
        if (!userOpt.isPresent()) {
            return ResponseEntity.notFound().build();
        }
        
        User user = userOpt.get();
        Optional<CustomerDetails> customerDetailsOpt = customerDetailsRepository.findByUser(user);
        
        CustomerDetails customerDetails;
        
        if (customerDetailsOpt.isPresent()) {
            customerDetails = customerDetailsOpt.get();
            // Update fields
            customerDetails.setPhone(updatedDetails.getPhone());
            customerDetails.setStreet(updatedDetails.getStreet());
            customerDetails.setCity(updatedDetails.getCity());
            customerDetails.setState(updatedDetails.getState());
            customerDetails.setZipCode(updatedDetails.getZipCode());
            customerDetails.setCountry(updatedDetails.getCountry());
        } else {
            // Create new customer details
            customerDetails = new CustomerDetails();
            customerDetails.setUser(user);
            customerDetails.setPhone(updatedDetails.getPhone());
            customerDetails.setStreet(updatedDetails.getStreet());
            customerDetails.setCity(updatedDetails.getCity());
            customerDetails.setState(updatedDetails.getState());
            customerDetails.setZipCode(updatedDetails.getZipCode());
            customerDetails.setCountry(updatedDetails.getCountry());
        }
        
        customerDetailsRepository.save(customerDetails);
        
        Map<String, String> response = new HashMap<>();
        response.put("message", "Customer details updated successfully");
        return ResponseEntity.ok(response);
    }
} 