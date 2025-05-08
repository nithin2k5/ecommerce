package com.ecommerce.service;

import com.ecommerce.model.Product;
import com.ecommerce.model.User;
import com.ecommerce.repository.ProductRepository;
import com.ecommerce.repository.UserRepository;
import org.bson.types.ObjectId;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
public class ProductService {

    @Autowired
    private ProductRepository productRepository;

    @Autowired
    private UserRepository userRepository;
    
    // Create a new product
    public Product createProduct(Product product, String username) {
        Optional<User> userOpt = userRepository.findByUsername(username);
        if (userOpt.isPresent()) {
            product.setAddedByUserId(new ObjectId(userOpt.get().getId()));
            LocalDateTime now = LocalDateTime.now();
            product.setCreatedAt(now);
            product.setUpdatedAt(now);
            product.setActive(true);
            return productRepository.save(product);
        }
        return null;
    }
    
    // Get all products
    public List<Product> getAllProducts() {
        return productRepository.findAll();
    }
    
    // Get product by ID
    public Optional<Product> getProductById(String id) {
        return productRepository.findById(id);
    }
    
    // Update product
    public Product updateProduct(String id, Product productDetails) {
        Optional<Product> optionalProduct = productRepository.findById(id);
        
        if (optionalProduct.isPresent()) {
            Product existingProduct = optionalProduct.get();
            
            existingProduct.setName(productDetails.getName());
            existingProduct.setDescription(productDetails.getDescription());
            existingProduct.setPrice(productDetails.getPrice());
            existingProduct.setStockQuantity(productDetails.getStockQuantity());
            existingProduct.setImageUrls(productDetails.getImageUrls());
            existingProduct.setCategory(productDetails.getCategory());
            existingProduct.setFeatured(productDetails.isFeatured());
            existingProduct.setUpdatedAt(LocalDateTime.now());
            
            return productRepository.save(existingProduct);
        }
        
        return null;
    }
    
    // Delete product
    public boolean deleteProduct(String id) {
        if (productRepository.existsById(id)) {
            productRepository.deleteById(id);
            return true;
        }
        return false;
    }
    
    // Find products by category
    public List<Product> getProductsByCategory(String category) {
        return productRepository.findByCategory(category);
    }
    
    // Search products by keyword
    public List<Product> searchProducts(String keyword) {
        return productRepository.findByNameContainingIgnoreCase(keyword);
    }
    
    // Get featured products
    public List<Product> getFeaturedProducts() {
        return productRepository.findByFeatured(true);
    }

    // Get products by user
    public List<Product> getProductsByUser(String username) {
        Optional<User> userOpt = userRepository.findByUsername(username);
        if (userOpt.isPresent()) {
            return productRepository.findByAddedByUserId(new ObjectId(userOpt.get().getId()));
        }
        return List.of();
    }
} 