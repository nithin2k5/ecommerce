package com.ecommerce.repository;

import com.ecommerce.model.BusinessDetails;
import com.ecommerce.model.Category;
import com.ecommerce.model.Product;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
 
public interface ProductRepository extends JpaRepository<Product, Long> {
    
    List<Product> findByBusiness(BusinessDetails business);
    
    List<Product> findByBusinessId(Long businessId);
    
    List<Product> findByBusinessIdAndHiddenFalse(Long businessId);
    
    List<Product> findByCategory(Category category);
    
    List<Product> findByCategoryId(Long categoryId);
    
    List<Product> findByCategoryIdAndHiddenFalse(Long categoryId);
    
    @Query("SELECT p FROM Product p WHERE p.title LIKE %:keyword% OR p.description LIKE %:keyword%")
    List<Product> searchProducts(@Param("keyword") String keyword);
    
    List<Product> findByTitleContainingIgnoreCase(String title);
    
    List<Product> findByPriceBetween(Double minPrice, Double maxPrice);
    
    List<Product> findByDiscountPercentageGreaterThan(Double discount);
    
    @Query("SELECT p FROM Product p WHERE p.business.id = :businessId AND p.stock < :threshold")
    List<Product> findLowStockProducts(@Param("businessId") Long businessId, @Param("threshold") Integer threshold);
} 