package com.ecommerce.service;

import com.ecommerce.model.Brand;
import com.ecommerce.model.BusinessDetails;
import com.ecommerce.model.Category;
import com.ecommerce.model.Product;
import com.ecommerce.repository.BrandRepository;
import com.ecommerce.repository.BusinessDetailsRepository;
import com.ecommerce.repository.CategoryRepository;
import com.ecommerce.repository.ProductRepository;
import jakarta.persistence.EntityNotFoundException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
public class ProductService {
    
    @Autowired
    private ProductRepository productRepository;
    
    @Autowired
    private BusinessDetailsRepository businessRepository;
    
    @Autowired
    private CategoryRepository categoryRepository;
    
    @Autowired
    private BrandRepository brandRepository;
    
    public List<Product> findAllProducts() {
        return productRepository.findAll();
    }
    
    public Optional<Product> findProductById(Long id) {
        return productRepository.findById(id);
    }
    
    @Transactional
    public Product saveProduct(Product product) {
        try {
            System.out.println("Saving product to database: ID=" + product.getId() + 
                             ", Title=" + product.getTitle() + 
                             ", Price=" + product.getPrice() + 
                             ", Stock=" + product.getStock());
                             
            // Ensure final price is calculated
            if (product.getPrice() != null && product.getDiscountPercentage() != null) {
                double finalPrice = product.getPrice() * (1 - product.getDiscountPercentage() / 100);
                product.setFinalPrice(finalPrice);
                System.out.println("Final price calculated: " + finalPrice);
            }
            
            Product savedProduct = productRepository.save(product);
            System.out.println("Product saved successfully with ID: " + savedProduct.getId());
            return savedProduct;
        } catch (Exception e) {
            System.err.println("Error saving product: " + e.getMessage());
            e.printStackTrace();
            throw e;
        }
    }
    
    @Transactional
    public void deleteProduct(Long id) {
        productRepository.deleteById(id);
    }
    
    @Transactional
    public Product createProduct(Product product, Long businessId, Long categoryId) {
        BusinessDetails business = businessRepository.findById(businessId)
            .orElseThrow(() -> new EntityNotFoundException("Business not found with id: " + businessId));
        
        Category category = null;
        if (categoryId != null) {
            category = categoryRepository.findById(categoryId)
                .orElseThrow(() -> new EntityNotFoundException("Category not found with id: " + categoryId));
        }
        
        // Set required fields
        product.setBusiness(business);
        product.setCategory(category);
        
        // Handle brand relationship
        if (product.getBrandName() != null && !product.getBrandName().isEmpty()) {
            // Check if a brand with this name exists for this business
            Optional<Brand> existingBrand = brandRepository.findByNameAndBusinessId(product.getBrandName(), businessId);
            
            if (existingBrand.isPresent()) {
                // Use existing brand
                product.setBrand(existingBrand.get());
            } else {
                // Create a new brand
                Brand newBrand = new Brand();
                newBrand.setName(product.getBrandName());
                newBrand.setBusiness(business);
                Brand savedBrand = brandRepository.save(newBrand);
                product.setBrand(savedBrand);
            }
        }
        
        // Ensure required fields are set
        if (product.getTitle() == null || product.getTitle().trim().isEmpty()) {
            throw new IllegalArgumentException("Product title cannot be empty");
        }
        
        if (product.getPrice() == null) {
            throw new IllegalArgumentException("Product price cannot be null");
        }
        
        if (product.getStock() == null) {
            product.setStock(0);
        }
        
        // Calculate final price
        if (product.getDiscountPercentage() == null) {
            product.setDiscountPercentage(0.0);
        }
        
        // Set hidden status (default to visible)
        if (product.getHidden() == null) {
            product.setHidden(false);
        }
        
        // Set timestamps
        if (product.getCreatedAt() == null) {
            product.setCreatedAt(LocalDateTime.now());
        }
        product.setUpdatedAt(LocalDateTime.now());
        
        // Calculate the final price
        double finalPrice = product.getPrice() * (1 - product.getDiscountPercentage() / 100);
        product.setFinalPrice(finalPrice);
        
        System.out.println("About to save product: " + product.getTitle() + 
                          ", price: " + product.getPrice() + 
                          ", finalPrice: " + product.getFinalPrice() + 
                          ", hidden: " + product.getHidden() +
                          ", business: " + business.getBusinessName() +
                          ", brand: " + (product.getBrand() != null ? product.getBrand().getName() : product.getBrandName()));
        
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
    
    @Transactional
    public Product updateProduct(Long id, Product productDetails) {
        Product product = productRepository.findById(id)
            .orElseThrow(() -> new EntityNotFoundException("Product not found with id: " + id));
        
        // Update basic information
        if (productDetails.getTitle() != null && !productDetails.getTitle().trim().isEmpty()) {
            product.setTitle(productDetails.getTitle());
        }
        
        if (productDetails.getDescription() != null) {
            product.setDescription(productDetails.getDescription());
        }
        
        if (productDetails.getPrice() != null) {
            product.setPrice(productDetails.getPrice());
        }
        
        if (productDetails.getStock() != null) {
            product.setStock(productDetails.getStock());
        }
        
        if (productDetails.getImageUrls() != null && !productDetails.getImageUrls().isEmpty()) {
            product.setImageUrls(productDetails.getImageUrls());
        }
        
        if (productDetails.getDiscountPercentage() != null) {
            product.setDiscountPercentage(productDetails.getDiscountPercentage());
        }
        
        if (productDetails.getCategory() != null) {
            product.setCategory(productDetails.getCategory());
        }
        
        // Update brand
        if (productDetails.getBrandName() != null) {
            // First save the brandName field
            product.setBrandName(productDetails.getBrandName());
            
            // If not empty, try to find or create the Brand entity
            if (!productDetails.getBrandName().isEmpty()) {
                BusinessDetails business = product.getBusiness();
                Optional<Brand> existingBrand = brandRepository.findByNameAndBusinessId(
                    productDetails.getBrandName(), business.getId());
                
                if (existingBrand.isPresent()) {
                    product.setBrand(existingBrand.get());
                } else {
                    // Create a new brand
                    Brand newBrand = new Brand();
                    newBrand.setName(productDetails.getBrandName());
                    newBrand.setBusiness(business);
                    Brand savedBrand = brandRepository.save(newBrand);
                    product.setBrand(savedBrand);
                }
            } else {
                // If brand name is empty, remove brand association
                product.setBrand(null);
            }
        }
        
        // Preserve the hidden status unless explicitly changed
        if (productDetails.getHidden() != null) {
            product.setHidden(productDetails.getHidden());
        }
        
        // Update timestamp
        product.setUpdatedAt(LocalDateTime.now());
        
        // Recalculate final price
        double finalPrice = product.getPrice() * (1 - product.getDiscountPercentage() / 100);
        product.setFinalPrice(finalPrice);
        
        System.out.println("Updating product: " + product.getId() + 
                           ", title: " + product.getTitle() + 
                           ", price: " + product.getPrice() + 
                           ", finalPrice: " + product.getFinalPrice() + 
                           ", hidden: " + product.getHidden() +
                           ", brand: " + (product.getBrand() != null ? product.getBrand().getName() : product.getBrandName()));
        
        return saveProduct(product);
    }
    
    @Transactional
    public Product updateProductDiscount(Long id, Double discountPercentage) {
        Product product = productRepository.findById(id)
            .orElseThrow(() -> new EntityNotFoundException("Product not found with id: " + id));
        
        product.setDiscountPercentage(discountPercentage);
        return saveProduct(product);
    }
    
    @Transactional
    public Product toggleProductVisibility(Long id, Boolean hidden) {
        Product product = productRepository.findById(id)
            .orElseThrow(() -> new EntityNotFoundException("Product not found with id: " + id));
        
        product.setHidden(hidden);
        System.out.println("Toggling product visibility: " + product.getId() + 
                           ", title: " + product.getTitle() + 
                           ", hidden: " + product.getHidden());
        
        return saveProduct(product);
    }
    
    public List<Product> findProductsByBusiness(Long businessId) {
        return productRepository.findByBusinessId(businessId);
    }
    
    public List<Product> findVisibleProductsByBusiness(Long businessId) {
        return productRepository.findByBusinessIdAndHiddenFalse(businessId);
    }
    
    public List<Product> findProductsByCategory(Long categoryId) {
        return productRepository.findByCategoryId(categoryId);
    }
    
    public List<Product> findVisibleProductsByCategory(Long categoryId) {
        return productRepository.findByCategoryIdAndHiddenFalse(categoryId);
    }
    
    public List<Product> searchProducts(String keyword) {
        return productRepository.searchProducts(keyword);
    }
    
    public List<Product> findLowStockProducts(Long businessId, Integer threshold) {
        return productRepository.findLowStockProducts(businessId, threshold);
    }
} 