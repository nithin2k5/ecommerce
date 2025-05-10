package com.ecommerce.service;

import com.ecommerce.dto.ProductDTO;
import com.ecommerce.model.BusinessDetails;
import com.ecommerce.model.Category;
import com.ecommerce.model.Product;
import com.ecommerce.model.User;
import com.ecommerce.repository.BusinessDetailsRepository;
import com.ecommerce.repository.CategoryRepository;
import com.ecommerce.repository.ProductRepository;
import com.ecommerce.repository.UserRepository;
import jakarta.persistence.EntityNotFoundException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class BusinessProductService {

    @Autowired
    private ProductRepository productRepository;
    
    @Autowired
    private BusinessDetailsRepository businessRepository;
    
    @Autowired
    private CategoryRepository categoryRepository;
    
    @Autowired
    private UserRepository userRepository;
    
    /**
     * Get the business details of the currently authenticated user
     * @return The BusinessDetails of the authenticated user
     * @throws EntityNotFoundException if the business is not found
     */
    private BusinessDetails getAuthenticatedBusiness() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String username = authentication.getName();
        
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new EntityNotFoundException("User not found"));
        
        return businessRepository.findByUser(user)
                .orElseThrow(() -> new EntityNotFoundException("Business not found for current user"));
    }
    
    /**
     * Create a new product for the authenticated business
     * @param productDTO Details of the product to create
     * @return The created product
     */
    @Transactional
    public Product createProduct(ProductDTO productDTO) {
        // Get authenticated business
        BusinessDetails business = getAuthenticatedBusiness();
        System.out.println("Creating product for business: " + business.getBusinessName() + 
                          " (Brand: " + business.getBrandName() + ")");
        
        // Log the authentication details
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        System.out.println("Authentication details - Name: " + authentication.getName() + 
                           ", Principal: " + authentication.getPrincipal() + 
                           ", Authorities: " + authentication.getAuthorities());
        
        Category category = null;
        if (productDTO.getCategoryId() != null) {
            category = categoryRepository.findById(productDTO.getCategoryId())
                .orElseThrow(() -> new EntityNotFoundException("Category not found with id: " + productDTO.getCategoryId()));
        }
        
        Product product = new Product();
        product.setTitle(productDTO.getTitle());
        product.setDescription(productDTO.getDescription());
        product.setPrice(productDTO.getPrice());
        product.setStock(productDTO.getStock() != null ? productDTO.getStock() : 0);
        product.setDiscountPercentage(productDTO.getDiscountPercentage() != null ? productDTO.getDiscountPercentage() : 0.0);
        product.setHidden(productDTO.getHidden() != null ? productDTO.getHidden() : false);
        product.setImageUrls(productDTO.getImageUrls());
        product.setCurrency(productDTO.getCurrency() != null ? productDTO.getCurrency() : "INR");
        product.setCategory(category);
        product.setBusiness(business);
        
        // Validate required fields
        if (product.getTitle() == null || product.getTitle().trim().isEmpty()) {
            throw new IllegalArgumentException("Product title cannot be empty");
        }
        
        if (product.getPrice() == null || product.getPrice() <= 0) {
            throw new IllegalArgumentException("Product price must be greater than zero");
        }
        
        // Set timestamps
        LocalDateTime now = LocalDateTime.now();
        product.setCreatedAt(now);
        product.setUpdatedAt(now);
        
        // Calculate final price
        double finalPrice = product.getPrice() * (1 - product.getDiscountPercentage() / 100);
        product.setFinalPrice(finalPrice);
        
        System.out.println("Saving product: " + product.getTitle() + 
                          ", price: " + product.getPrice() + 
                          ", finalPrice: " + product.getFinalPrice() + 
                          ", business: " + business.getBusinessName());
        
        try {
            Product savedProduct = productRepository.save(product);
            System.out.println("Product saved successfully with ID: " + savedProduct.getId());
            return savedProduct;
        } catch (Exception e) {
            System.err.println("Error saving product: " + e.getMessage());
            e.printStackTrace();
            throw e;
        }
    }
    
    /**
     * Update an existing product owned by the authenticated business
     * @param id ID of the product to update
     * @param productDTO Updated product details
     * @return The updated product
     */
    @Transactional
    public Product updateProduct(Long id, ProductDTO productDTO) {
        BusinessDetails business = getAuthenticatedBusiness();
        
        Product product = productRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Product not found with id: " + id));
        
        // Verify ownership
        if (!product.getBusiness().getId().equals(business.getId())) {
            throw new SecurityException("You don't have permission to update this product");
        }
        
        // Update category if provided
        if (productDTO.getCategoryId() != null) {
            Category category = categoryRepository.findById(productDTO.getCategoryId())
                    .orElseThrow(() -> new EntityNotFoundException("Category not found with id: " + productDTO.getCategoryId()));
            product.setCategory(category);
        }
        
        // Update product fields if provided
        if (productDTO.getTitle() != null && !productDTO.getTitle().trim().isEmpty()) {
            product.setTitle(productDTO.getTitle());
        }
        
        if (productDTO.getDescription() != null) {
            product.setDescription(productDTO.getDescription());
        }
        
        if (productDTO.getPrice() != null) {
            product.setPrice(productDTO.getPrice());
        }
        
        if (productDTO.getDiscountPercentage() != null) {
            product.setDiscountPercentage(productDTO.getDiscountPercentage());
        }
        
        if (productDTO.getStock() != null) {
            product.setStock(productDTO.getStock());
        }
        
        if (productDTO.getHidden() != null) {
            product.setHidden(productDTO.getHidden());
        }
        
        if (productDTO.getCurrency() != null) {
            product.setCurrency(productDTO.getCurrency());
        }
        
        if (productDTO.getImageUrls() != null && !productDTO.getImageUrls().isEmpty()) {
            product.setImageUrls(productDTO.getImageUrls());
        }
        
        // Update timestamp
        product.setUpdatedAt(LocalDateTime.now());
        
        // Recalculate final price
        double finalPrice = product.getPrice() * (1 - product.getDiscountPercentage() / 100);
        product.setFinalPrice(finalPrice);
        
        System.out.println("Updating product: " + product.getId() + 
                         ", title: " + product.getTitle() + 
                         ", business: " + business.getBusinessName());
        
        return productRepository.save(product);
    }
    
    /**
     * Delete a product owned by the authenticated business
     * @param id ID of the product to delete
     */
    @Transactional
    public void deleteProduct(Long id) {
        BusinessDetails business = getAuthenticatedBusiness();
        
        Product product = productRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Product not found with id: " + id));
        
        // Verify ownership
        if (!product.getBusiness().getId().equals(business.getId())) {
            throw new SecurityException("You don't have permission to delete this product");
        }
        
        productRepository.delete(product);
        System.out.println("Deleted product: " + product.getId() + 
                         ", title: " + product.getTitle() + 
                         ", business: " + business.getBusinessName());
    }
    
    /**
     * Get all products owned by the authenticated business
     * @return List of products
     */
    public List<Product> getMyProducts() {
        BusinessDetails business = getAuthenticatedBusiness();
        return productRepository.findByBusiness(business);
    }
    
    /**
     * Get a product by ID if owned by the authenticated business
     * @param id ID of the product
     * @return The product
     */
    public Product getMyProductById(Long id) {
        BusinessDetails business = getAuthenticatedBusiness();
        
        Product product = productRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Product not found with id: " + id));
        
        // Verify ownership
        if (!product.getBusiness().getId().equals(business.getId())) {
            throw new SecurityException("You don't have permission to view this product");
        }
        
        return product;
    }
} 