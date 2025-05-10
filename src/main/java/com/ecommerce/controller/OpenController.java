package com.ecommerce.controller;

import com.ecommerce.model.Product;
import com.ecommerce.model.Category;
import com.ecommerce.service.ProductService;
import com.ecommerce.service.CategoryService;
import jakarta.persistence.EntityNotFoundException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/open")
public class OpenController {

    @Autowired
    private ProductService productService;
    
    @Autowired
    private CategoryService categoryService;

    @GetMapping("/hello")
    public String hello() {
        return "Hello, Public World!";
    }
    
    @GetMapping("/products")
    public List<Product> getAllProducts() {
        return productService.findAllProducts();
    }
    
    @GetMapping("/products/{id}")
    public ResponseEntity<Product> getProductById(@PathVariable Long id) {
        return productService.findProductById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }
    
    @PostMapping("/products")
    @ResponseStatus(HttpStatus.CREATED)
    public ResponseEntity<?> createProduct(
            @RequestBody Product product,
            @RequestParam Long businessId,
            @RequestParam(required = false) Long categoryId) {
        try {
            System.out.println("Received product in OpenController: " + product);
            System.out.println("BusinessId: " + businessId + ", CategoryId: " + categoryId);
            Product createdProduct = productService.createProduct(product, businessId, categoryId);
            System.out.println("Created product: " + createdProduct);
            return ResponseEntity.status(HttpStatus.CREATED).body(createdProduct);
        } catch (EntityNotFoundException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }
    
    @PutMapping("/products/{id}")
    public ResponseEntity<?> updateProduct(@PathVariable Long id, @RequestBody Product product) {
        try {
            return ResponseEntity.ok(productService.updateProduct(id, product));
        } catch (EntityNotFoundException e) {
            return ResponseEntity.notFound().build();
        }
    }
    
    @DeleteMapping("/products/{id}")
    public ResponseEntity<Void> deleteProduct(@PathVariable Long id) {
        return productService.findProductById(id)
                .map(product -> {
                    productService.deleteProduct(id);
                    return ResponseEntity.noContent().<Void>build();
                })
                .orElse(ResponseEntity.notFound().build());
    }
    
    @GetMapping("/products/search")
    public List<Product> searchProducts(@RequestParam String keyword) {
        return productService.searchProducts(keyword);
    }
    
    @PatchMapping("/products/{id}/visibility")
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
    
    @PatchMapping("/products/{id}/discount")
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
    
    // Category endpoints
    @GetMapping("/categories")
    public List<Category> getAllCategories() {
        return categoryService.findAllCategories();
    }
    
    @GetMapping("/categories/{id}")
    public ResponseEntity<Category> getCategoryById(@PathVariable Long id) {
        return categoryService.findCategoryById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }
    
    @PostMapping("/categories")
    @ResponseStatus(HttpStatus.CREATED)
    public ResponseEntity<?> createCategory(@RequestBody Category category) {
        try {
            Category createdCategory = categoryService.createCategory(category);
            return ResponseEntity.status(HttpStatus.CREATED).body(createdCategory);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }
    
    @PutMapping("/categories/{id}")
    public ResponseEntity<?> updateCategory(@PathVariable Long id, @RequestBody Category category) {
        try {
            Category updatedCategory = categoryService.updateCategory(id, category);
            return ResponseEntity.ok(updatedCategory);
        } catch (EntityNotFoundException e) {
            return ResponseEntity.notFound().build();
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }
    
    @DeleteMapping("/categories/{id}")
    public ResponseEntity<Void> deleteCategory(@PathVariable Long id) {
        try {
            categoryService.deleteCategory(id);
            return ResponseEntity.noContent().build();
        } catch (EntityNotFoundException e) {
            return ResponseEntity.notFound().build();
        }
    }
    
    @GetMapping("/categories/search")
    public List<Category> searchCategories(@RequestParam String keyword) {
        return categoryService.searchCategories(keyword);
    }
} 