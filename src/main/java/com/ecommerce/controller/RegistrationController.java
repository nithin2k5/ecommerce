package com.ecommerce.controller;

import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/register")
public class RegistrationController {

    @PostMapping("/user")
    public Map<String, Object> registerUser(@RequestBody Map<String, Object> userRequest) {
        // This is a placeholder implementation
        Map<String, Object> response = new HashMap<>();
        response.put("success", true);
        response.put("message", "User registration endpoint reached successfully");
        response.put("data", userRequest);
        return response;
    }
    
    @PostMapping("/business")
    public Map<String, Object> registerBusiness(@RequestBody Map<String, Object> businessRequest) {
        // This is a placeholder implementation
        Map<String, Object> response = new HashMap<>();
        response.put("success", true);
        response.put("message", "Business registration endpoint reached successfully");
        response.put("data", businessRequest);
        return response;
    }
} 