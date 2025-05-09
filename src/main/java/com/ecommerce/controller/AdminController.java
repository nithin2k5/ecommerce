package com.ecommerce.controller;

import com.ecommerce.model.Product;
import com.ecommerce.service.ProductService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Arrays;

import com.mongodb.client.MongoDatabase;
import com.mongodb.client.model.CreateCollectionOptions;
import com.mongodb.client.model.ValidationOptions;
import org.bson.Document;

@RestController
@RequestMapping("/api/admin")
@PreAuthorize("hasAnyAuthority('ADMIN', 'BUSINESS_ADMIN')")
public class AdminController {

    @Autowired
    private ProductService productService;

    @GetMapping("/products")
    public ResponseEntity<List<Product>> getAllProducts() {
        return ResponseEntity.ok(productService.getAllProducts());
    }

    @GetMapping("/products/{id}")
    public ResponseEntity<?> getProductById(@PathVariable String id) {
        return productService.getProductById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/my-products")
    public ResponseEntity<List<Product>> getMyProducts(Authentication authentication) {
        UserDetails userDetails = (UserDetails) authentication.getPrincipal();
        return ResponseEntity.ok(productService.getProductsByUser(userDetails.getUsername()));
    }

    @PostMapping("/products")
    public ResponseEntity<Product> createProduct(@RequestBody Product product, Authentication authentication) {
        UserDetails userDetails = (UserDetails) authentication.getPrincipal();
        return ResponseEntity.ok(productService.createProduct(product, userDetails.getUsername()));
    }

    @PutMapping("/products/{id}")
    public ResponseEntity<?> updateProduct(@PathVariable String id, @RequestBody Product product) {
        Product updatedProduct = productService.updateProduct(id, product);
        if (updatedProduct != null) {
            return ResponseEntity.ok(updatedProduct);
        }
        return ResponseEntity.notFound().build();
    }

    @DeleteMapping("/products/{id}")
    public ResponseEntity<?> deleteProduct(@PathVariable String id) {
        if (productService.deleteProduct(id)) {
            return ResponseEntity.ok().build();
        }
        return ResponseEntity.notFound().build();
    }

    @GetMapping("/dashboard")
    public ResponseEntity<?> getAdminDashboardData() {
        // In a real application, you would aggregate data about products, sales, etc.
        return ResponseEntity.ok("Admin Dashboard Data");
    }

    private void createCollectionsWithValidation(MongoDatabase database) {
        // Users collection validation
        Document userSchemaDoc = new Document("$jsonSchema", new Document()
            .append("bsonType", "object")
            .append("required", Arrays.asList("username", "email", "password", "roles"))
            .append("properties", new Document()
                .append("username", new Document("bsonType", "string"))
                .append("email", new Document("bsonType", "string"))
                .append("password", new Document("bsonType", "string"))
                .append("roles", new Document("bsonType", "array"))
                .append("active", new Document("bsonType", "bool"))
            )
        );
        ValidationOptions userValidation = new ValidationOptions().validator(userSchemaDoc);
        CreateCollectionOptions userOptions = new CreateCollectionOptions()
            .validationOptions(userValidation);

        // Products collection validation
        Document productSchemaDoc = new Document("$jsonSchema", new Document()
            .append("bsonType", "object")
            .append("required", Arrays.asList("name", "price", "stockQuantity", "categories"))
            .append("properties", new Document()
                .append("name", new Document("bsonType", "string"))
                .append("price", new Document("bsonType", "double"))
                .append("stockQuantity", new Document("bsonType", "int"))
                .append("categories", new Document("bsonType", "array"))
                .append("active", new Document("bsonType", "bool"))
            )
        );
        ValidationOptions productValidation = new ValidationOptions().validator(productSchemaDoc);
        CreateCollectionOptions productOptions = new CreateCollectionOptions()
            .validationOptions(productValidation);

        // Orders collection validation
        Document orderSchemaDoc = new Document("$jsonSchema", new Document()
            .append("bsonType", "object")
            .append("required", Arrays.asList("userId", "products", "quantities", "total", "status"))
            .append("properties", new Document()
                .append("userId", new Document("bsonType", "string"))
                .append("products", new Document("bsonType", "array"))
                .append("quantities", new Document("bsonType", "array"))
                .append("total", new Document("bsonType", "double"))
                .append("status", new Document("bsonType", "string"))
            )
        );
        ValidationOptions orderValidation = new ValidationOptions().validator(orderSchemaDoc);
        CreateCollectionOptions orderOptions = new CreateCollectionOptions()
            .validationOptions(orderValidation);

        try {
            database.createCollection("users", userOptions);
            database.createCollection("products", productOptions);
            database.createCollection("orders", orderOptions);
            database.createCollection("categories");
            database.createCollection("cart");
            database.createCollection("wishlist");
            database.createCollection("reviews");
            database.createCollection("transactions");
            System.out.println("Collections created successfully with validation");
        } catch (Exception e) {
            System.out.println("Collections already exist or error creating: " + e.getMessage());
        }
    }
} 