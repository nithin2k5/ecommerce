package com.ecommerce.controller;

import com.ecommerce.model.Product;
import com.ecommerce.service.ProductService;
import jakarta.persistence.EntityNotFoundException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/products")
@CrossOrigin(origins = "*") // Allow cross-origin requests
public class ProductController {

    @Autowired
    private ProductService productService;

    @GetMapping
    public List<Product> getAllProducts() {
        return productService.findAllProducts();
    }
    
    @GetMapping("/{id}")
    public ResponseEntity<Product> getProductById(@PathVariable Long id) {
        return productService.findProductById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public ResponseEntity<?> createProduct(
            @RequestBody Product product,
            @RequestParam Long businessId,
            @RequestParam(required = false) Long categoryId) {
        try {
            System.out.println("Received product: " + product);
            System.out.println("BusinessId: " + businessId + ", CategoryId: " + categoryId);
            Product createdProduct = productService.createProduct(product, businessId, categoryId);
            System.out.println("Created product: " + createdProduct);
            return ResponseEntity.status(HttpStatus.CREATED).body(createdProduct);
        } catch (EntityNotFoundException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }
    
    @PutMapping("/{id}")
    public ResponseEntity<?> updateProduct(@PathVariable Long id, @RequestBody Product product) {
        try {
            return ResponseEntity.ok(productService.updateProduct(id, product));
        } catch (EntityNotFoundException e) {
            return ResponseEntity.notFound().build();
        }
    }
    
    @PatchMapping("/{id}/discount")
    public ResponseEntity<?> updateProductDiscount(
            @PathVariable Long id, 
            @RequestBody Map<String, Double> payload) {
        try {
            Double discountPercentage = payload.get("discountPercentage");
            if (discountPercentage == null) {
                return ResponseEntity.badRequest().body("discountPercentage is required");
            }
            return ResponseEntity.ok(productService.updateProductDiscount(id, discountPercentage));
        } catch (EntityNotFoundException e) {
            return ResponseEntity.notFound().build();
        }
    }
    
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteProduct(@PathVariable Long id) {
        return productService.findProductById(id)
                .map(product -> {
                    productService.deleteProduct(id);
                    return ResponseEntity.noContent().<Void>build();
                })
                .orElse(ResponseEntity.notFound().build());
    }
    
    @GetMapping("/business/{businessId}")
    public List<Product> getProductsByBusiness(@PathVariable Long businessId) {
        return productService.findProductsByBusiness(businessId);
    }
    
    @GetMapping("/business/{businessId}/visible")
    public List<Product> getVisibleProductsByBusiness(@PathVariable Long businessId) {
        return productService.findVisibleProductsByBusiness(businessId);
    }
    
    @GetMapping("/category/{categoryId}")
    public List<Product> getProductsByCategory(@PathVariable Long categoryId) {
        return productService.findProductsByCategory(categoryId);
    }
    
    @GetMapping("/category/{categoryId}/visible")
    public List<Product> getVisibleProductsByCategory(@PathVariable Long categoryId) {
        return productService.findVisibleProductsByCategory(categoryId);
    }
    
    @GetMapping("/search")
    public List<Product> searchProducts(@RequestParam String keyword) {
        return productService.searchProducts(keyword);
    }
    
    @GetMapping("/business/{businessId}/low-stock")
    public List<Product> getLowStockProducts(
            @PathVariable Long businessId,
            @RequestParam(defaultValue = "5") Integer threshold) {
        return productService.findLowStockProducts(businessId, threshold);
    }
    
    @PatchMapping("/{id}/visibility")
    public ResponseEntity<?> toggleProductVisibility(
            @PathVariable Long id,
            @RequestBody Map<String, Boolean> payload) {
        try {
            Boolean hidden = payload.get("hidden");
            if (hidden == null) {
                return ResponseEntity.badRequest().body("hidden status is required");
            }
            return ResponseEntity.ok(productService.toggleProductVisibility(id, hidden));
        } catch (EntityNotFoundException e) {
            return ResponseEntity.notFound().build();
        }
    }
} 