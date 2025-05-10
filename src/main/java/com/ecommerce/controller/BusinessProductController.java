package com.ecommerce.controller;

import com.ecommerce.dto.ProductDTO;
import com.ecommerce.model.Product;
import com.ecommerce.service.BusinessProductService;
import jakarta.persistence.EntityNotFoundException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/business/products")
@CrossOrigin(origins = {"http://localhost:3000", "http://127.0.0.1:3000"}, maxAge = 3600, allowCredentials = "true")
public class BusinessProductController {

    @Autowired
    private BusinessProductService businessProductService;

    /**
     * Get all products owned by the authenticated business
     * @return List of products
     */
    @GetMapping
    // Temporarily remove authorization requirements for testing
    // @PreAuthorize("hasAuthority('ROLE_BUSINESS')")
    public ResponseEntity<List<Product>> getMyProducts() {
        try {
            Authentication auth = SecurityContextHolder.getContext().getAuthentication();
            System.out.println("Current Authentication: " + auth);
            System.out.println("User: " + auth.getName());
            System.out.println("Authorities: " + auth.getAuthorities());
            System.out.println("Is Authenticated: " + auth.isAuthenticated());
            
            List<Product> products = businessProductService.getMyProducts();
            return ResponseEntity.ok(products);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    /**
     * Get a product by ID if owned by the authenticated business
     * @param id ID of the product
     * @return The product
     */
    @GetMapping("/{id}")
    // @PreAuthorize("hasAuthority('ROLE_BUSINESS')")
    public ResponseEntity<?> getMyProductById(@PathVariable Long id) {
        try {
            Product product = businessProductService.getMyProductById(id);
            return ResponseEntity.ok(product);
        } catch (EntityNotFoundException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(Map.of("error", e.getMessage()));
        } catch (SecurityException e) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN)
                    .body(Map.of("error", e.getMessage()));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("error", "Failed to retrieve product"));
        }
    }

    /**
     * Create a new product for the authenticated business
     * @param productDTO Details of the product to create
     * @return The created product
     */
    @PostMapping
    // @PreAuthorize("hasAuthority('ROLE_BUSINESS')")
    public ResponseEntity<?> createProduct(@RequestBody ProductDTO productDTO) {
        try {
            System.out.println("BusinessProductController: Request received to create product: " + productDTO.getTitle());
            
            // Get the current authentication to log the user attempting the operation
            Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
            System.out.println("Request from user: " + authentication.getName() + 
                              " with roles: " + authentication.getAuthorities());
            
            // Validate required fields
            if (productDTO.getTitle() == null || productDTO.getTitle().trim().isEmpty()) {
                return ResponseEntity.badRequest().body(Map.of("error", "Product title is required"));
            }
            
            if (productDTO.getPrice() == null || productDTO.getPrice() <= 0) {
                return ResponseEntity.badRequest().body(Map.of("error", "Valid product price is required"));
            }
            
            // Set default currency if not provided
            if (productDTO.getCurrency() == null || productDTO.getCurrency().trim().isEmpty()) {
                productDTO.setCurrency("INR");
            }
            
            // Log all fields for debugging
            System.out.println("Product details: " + 
                              "Title=" + productDTO.getTitle() + 
                              ", Price=" + productDTO.getPrice() + 
                              ", Stock=" + productDTO.getStock() + 
                              ", Hidden=" + productDTO.getHidden() + 
                              ", Category=" + productDTO.getCategoryId() + 
                              ", Currency=" + productDTO.getCurrency());
                              
            Product createdProduct = businessProductService.createProduct(productDTO);
            
            Map<String, Object> response = new HashMap<>();
            response.put("message", "Product created successfully");
            response.put("product", createdProduct);
            response.put("brandName", createdProduct.getBusiness().getBrandName());
            
            return ResponseEntity.status(HttpStatus.CREATED).body(response);
        } catch (Exception e) {
            System.err.println("Critical error in createProduct controller method: " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("error", "An unexpected error occurred: " + e.getMessage()));
        }
    }

    /**
     * Update an existing product owned by the authenticated business
     * @param id ID of the product to update
     * @param productDTO Updated product details
     * @return The updated product
     */
    @PutMapping("/{id}")
    // @PreAuthorize("hasAuthority('ROLE_BUSINESS')")
    public ResponseEntity<?> updateProduct(@PathVariable Long id, @RequestBody ProductDTO productDTO) {
        try {
            Product updatedProduct = businessProductService.updateProduct(id, productDTO);
            
            Map<String, Object> response = new HashMap<>();
            response.put("message", "Product updated successfully");
            response.put("product", updatedProduct);
            response.put("brandName", updatedProduct.getBusiness().getBrandName());
            
            return ResponseEntity.ok(response);
        } catch (EntityNotFoundException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(Map.of("error", e.getMessage()));
        } catch (SecurityException e) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN)
                    .body(Map.of("error", e.getMessage()));
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("error", "Failed to update product: " + e.getMessage()));
        }
    }

    /**
     * Delete a product owned by the authenticated business
     * @param id ID of the product to delete
     * @return Response with deletion status
     */
    @DeleteMapping("/{id}")
    // @PreAuthorize("hasAuthority('ROLE_BUSINESS')")
    public ResponseEntity<?> deleteProduct(@PathVariable Long id) {
        try {
            businessProductService.deleteProduct(id);
            return ResponseEntity.ok(Map.of("message", "Product deleted successfully"));
        } catch (EntityNotFoundException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(Map.of("error", e.getMessage()));
        } catch (SecurityException e) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN)
                    .body(Map.of("error", e.getMessage()));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("error", "Failed to delete product"));
        }
    }
} 