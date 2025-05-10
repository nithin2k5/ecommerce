package com.ecommerce.service;

import com.ecommerce.model.Category;
import com.ecommerce.repository.CategoryRepository;
import jakarta.persistence.EntityNotFoundException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Service
public class CategoryService {
    
    @Autowired
    private CategoryRepository categoryRepository;
    
    public List<Category> findAllCategories() {
        return categoryRepository.findAll();
    }
    
    public Optional<Category> findCategoryById(Long id) {
        return categoryRepository.findById(id);
    }
    
    public Optional<Category> findCategoryByName(String name) {
        return categoryRepository.findByName(name);
    }
    
    @Transactional
    public Category saveCategory(Category category) {
        return categoryRepository.save(category);
    }
    
    @Transactional
    public Category createCategory(Category category) {
        // Check if category with same name already exists
        Optional<Category> existingCategory = categoryRepository.findByName(category.getName());
        if (existingCategory.isPresent()) {
            throw new IllegalArgumentException("Category with name " + category.getName() + " already exists");
        }
        
        return saveCategory(category);
    }
    
    @Transactional
    public Category updateCategory(Long id, Category categoryDetails) {
        Category category = categoryRepository.findById(id)
            .orElseThrow(() -> new EntityNotFoundException("Category not found with id: " + id));
        
        // Check if name is being changed and if so, ensure it's unique
        if (!category.getName().equals(categoryDetails.getName())) {
            Optional<Category> existingCategory = categoryRepository.findByName(categoryDetails.getName());
            if (existingCategory.isPresent()) {
                throw new IllegalArgumentException("Category with name " + categoryDetails.getName() + " already exists");
            }
        }
        
        category.setName(categoryDetails.getName());
        category.setDescription(categoryDetails.getDescription());
        
        return saveCategory(category);
    }
    
    @Transactional
    public void deleteCategory(Long id) {
        categoryRepository.deleteById(id);
    }
    
    public List<Category> searchCategories(String keyword) {
        return categoryRepository.findByNameContainingIgnoreCase(keyword);
    }
} 