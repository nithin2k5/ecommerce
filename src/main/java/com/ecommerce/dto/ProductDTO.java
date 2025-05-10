package com.ecommerce.dto;

import java.util.ArrayList;
import java.util.List;

public class ProductDTO {
    private Long id;
    private String title;
    private String description;
    private Double price;
    private Double discountPercentage;
    private Integer stock;
    private Boolean hidden;
    private String currency;
    private Long categoryId;
    private Long businessId;
    private List<String> imageUrls = new ArrayList<>();
    private String brandName;
    
    // No-args constructor
    public ProductDTO() {
    }
    
    // Constructor with fields
    public ProductDTO(Long id, String title, String description, Double price, 
                     Double discountPercentage, Integer stock, Boolean hidden, 
                     String currency, Long categoryId, Long businessId) {
        this.id = id;
        this.title = title;
        this.description = description;
        this.price = price;
        this.discountPercentage = discountPercentage;
        this.stock = stock;
        this.hidden = hidden;
        this.currency = currency;
        this.categoryId = categoryId;
        this.businessId = businessId;
    }
    
    // Getters and Setters
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public Double getPrice() {
        return price;
    }

    public void setPrice(Double price) {
        this.price = price;
    }

    public Double getDiscountPercentage() {
        return discountPercentage;
    }

    public void setDiscountPercentage(Double discountPercentage) {
        this.discountPercentage = discountPercentage;
    }

    public Integer getStock() {
        return stock;
    }

    public void setStock(Integer stock) {
        this.stock = stock;
    }

    public Boolean getHidden() {
        return hidden;
    }

    public void setHidden(Boolean hidden) {
        this.hidden = hidden;
    }

    public String getCurrency() {
        return currency;
    }

    public void setCurrency(String currency) {
        this.currency = currency;
    }

    public Long getCategoryId() {
        return categoryId;
    }

    public void setCategoryId(Long categoryId) {
        this.categoryId = categoryId;
    }

    public Long getBusinessId() {
        return businessId;
    }

    public void setBusinessId(Long businessId) {
        this.businessId = businessId;
    }

    public List<String> getImageUrls() {
        return imageUrls;
    }

    public void setImageUrls(List<String> imageUrls) {
        this.imageUrls = imageUrls;
    }

    public String getBrandName() {
        return brandName;
    }

    public void setBrandName(String brandName) {
        this.brandName = brandName;
    }
} 