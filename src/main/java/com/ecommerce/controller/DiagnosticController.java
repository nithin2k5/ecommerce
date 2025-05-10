package com.ecommerce.controller;

import com.ecommerce.service.BusinessProductService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/diagnostics")
public class DiagnosticController {
    
    @Autowired
    private BusinessProductService businessProductService;

    @GetMapping("/auth-info")
    public Map<String, Object> getAuthInfo() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        Map<String, Object> info = new HashMap<>();
        
        info.put("authenticated", auth.isAuthenticated());
        info.put("principal", auth.getPrincipal().toString());
        info.put("name", auth.getName());
        info.put("authorities", auth.getAuthorities().toString());
        info.put("details", auth.getDetails() != null ? auth.getDetails().toString() : null);
        
        return info;
    }
    
    @GetMapping("/test-business-products")
    public ResponseEntity<?> testBusinessProducts() {
        try {
            Authentication auth = SecurityContextHolder.getContext().getAuthentication();
            Map<String, Object> response = new HashMap<>();
            
            response.put("authenticated", auth.isAuthenticated());
            response.put("username", auth.getName());
            response.put("authorities", auth.getAuthorities().toString());
            
            // Try to get products to diagnose the service layer
            try {
                response.put("products", businessProductService.getMyProducts());
                response.put("productsSuccess", true);
            } catch (Exception e) {
                response.put("productsSuccess", false);
                response.put("productError", e.getMessage());
                e.printStackTrace();
            }
            
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(500).body(Map.of("error", e.getMessage()));
        }
    }
} 