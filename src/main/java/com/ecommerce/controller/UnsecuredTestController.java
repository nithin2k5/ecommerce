package com.ecommerce.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/unsecured")
@CrossOrigin(origins = {"http://localhost:3000", "http://localhost:3001"})
public class UnsecuredTestController {
    
    @GetMapping("/test")
    public String test() {
        return "This is an unsecured test endpoint";
    }
    
    @GetMapping("/hello")
    public String hello() {
        return "Hello from unsecured controller!";
    }
    
    @PostMapping("/login-test")
    public ResponseEntity<?> loginTest(@RequestBody Map<String, String> credentials) {
        Map<String, Object> response = new HashMap<>();
        
        response.put("username", credentials.get("username"));
        response.put("message", "Login test successful");
        response.put("token", "test-token-123");
        response.put("userId", "123456");
        response.put("roles", new String[]{"USER", "ADMIN"});
        
        return ResponseEntity.ok(response);
    }
} 