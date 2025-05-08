package com.ecommerce.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/test")
public class TestController {

    @Autowired
    private MongoTemplate mongoTemplate;

    @GetMapping("/status")
    public Map<String, String> getStatus() {
        Map<String, String> response = new HashMap<>();
        response.put("status", "success");
        response.put("message", "Spring Boot API is running");
        return response;
    }

    @GetMapping("/db-status")
    public ResponseEntity<?> getDatabaseStatus() {
        Map<String, Object> status = new HashMap<>();
        
        try {
            // Get collection counts
            long usersCount = mongoTemplate.getCollection("users").countDocuments();
            long productsCount = mongoTemplate.getCollection("products").countDocuments();
            long categoriesCount = mongoTemplate.getCollection("categories").countDocuments();
            long ordersCount = mongoTemplate.getCollection("orders").countDocuments();

            status.put("status", "connected");
            status.put("database", "ecommerce_db");
            status.put("collections", new HashMap<String, Long>() {{
                put("users", usersCount);
                put("products", productsCount);
                put("categories", categoriesCount);
                put("orders", ordersCount);
            }});

            return ResponseEntity.ok(status);
        } catch (Exception e) {
            status.put("status", "error");
            status.put("message", e.getMessage());
            return ResponseEntity.status(500).body(status);
        }
    }
} 