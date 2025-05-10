package com.ecommerce.controller;

import com.ecommerce.model.Product;
import com.ecommerce.repository.ProductRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@CrossOrigin(origins = {"http://localhost:3000", "http://127.0.0.1:3000"}, maxAge = 3600, allowCredentials = "true")
@RestController
@RequestMapping("/api/test/db")
public class TestDbController {

    @Autowired
    private ProductRepository productRepository;

    @GetMapping("/products/count")
    public ResponseEntity<?> getProductCount() {
        long count = productRepository.count();
        return ResponseEntity.ok(Map.of("count", count));
    }
    
    @GetMapping("/products")
    public ResponseEntity<List<Product>> getAllProducts() {
        List<Product> products = productRepository.findAll();
        return ResponseEntity.ok(products);
    }
    
    @PostMapping("/products/direct")
    public ResponseEntity<?> createProductDirectly(@RequestBody Map<String, Object> productData) {
        try {
            Product product = new Product();
            
            // Set basic product info
            product.setTitle((String) productData.get("title"));
            product.setDescription((String) productData.get("description"));
            
            // Handle numeric values
            if (productData.get("price") != null) {
                if (productData.get("price") instanceof Double) {
                    product.setPrice((Double) productData.get("price"));
                } else if (productData.get("price") instanceof Integer) {
                    product.setPrice(((Integer) productData.get("price")).doubleValue());
                } else {
                    product.setPrice(Double.parseDouble(productData.get("price").toString()));
                }
            }
            
            if (productData.get("stock") != null) {
                if (productData.get("stock") instanceof Integer) {
                    product.setStock((Integer) productData.get("stock"));
                } else {
                    product.setStock(Integer.parseInt(productData.get("stock").toString()));
                }
            } else {
                product.setStock(0);
            }
            
            // Set defaults
            product.setHidden(false);
            product.setCurrency("INR");
            product.setDiscountPercentage(0.0);
            product.setFinalPrice(product.getPrice()); // No discount
            
            // Set timestamps
            LocalDateTime now = LocalDateTime.now();
            product.setCreatedAt(now);
            product.setUpdatedAt(now);
            
            // Save to database
            Product savedProduct = productRepository.save(product);
            
            // Response
            Map<String, Object> response = new HashMap<>();
            response.put("message", "Product created directly in database");
            response.put("product", savedProduct);
            
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.badRequest().body(Map.of(
                "error", "Failed to create product directly",
                "message", e.getMessage()
            ));
        }
    }
} 