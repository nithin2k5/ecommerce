package com.ecommerce.repository;

import com.ecommerce.model.Product;
import org.bson.types.ObjectId;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ProductRepository extends MongoRepository<Product, String> {
    List<Product> findByCategory(String category);
    List<Product> findByNameContainingIgnoreCase(String keyword);
    List<Product> findByFeatured(boolean featured);
    List<Product> findByAddedByUserId(ObjectId userId);
} 