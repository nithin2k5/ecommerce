package com.ecommerce.model;

import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "product")
@Data
public class Product {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(name = "title", nullable = false)
    private String title;
    
    @Column(name = "description", columnDefinition = "TEXT")
    private String description;
    
    @Column(name = "price", nullable = false)
    private Double price;
    
    @Column(name = "discount_percentage")
    private Double discountPercentage = 0.0;
    
    @Column(name = "final_price")
    private Double finalPrice;
    
    @Column(name = "stock")
    private Integer stock;
    
    @Column(name = "hidden")
    private Boolean hidden = false;
    
    @Column(name = "currency")
    private String currency = "INR";
    
    @Column(name = "brand_name")
    private String brandName;
    
    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "brand_id")
    private Brand brand;
    
    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "category_id")
    private Category category;
    
    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "business_id")
    private BusinessDetails business;
    
    @ElementCollection(fetch = FetchType.EAGER)
    @CollectionTable(name = "product_images", joinColumns = @JoinColumn(name = "product_id"))
    @Column(name = "image_url")
    private List<String> imageUrls = new ArrayList<>();
    
    @Column(name = "created_at")
    private LocalDateTime createdAt;
    
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;
    
    @Transient
    public String getBusinessBrandName() {
        return business != null ? business.getBusinessName() : null;
    }
    
    @Transient
    public String getEffectiveBrandName() {
        if (brandName != null && !brandName.isEmpty()) {
            return brandName;
        } else if (brand != null) {
            return brand.getName();
        } else if (business != null && business.getBrandName() != null) {
            return business.getBrandName();
        } else if (business != null) {
            return business.getBusinessName();
        }
        return null;
    }
    
    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
        calculateFinalPrice();
    }
    
    @PreUpdate
    protected void onUpdate() {
        updatedAt = LocalDateTime.now();
        calculateFinalPrice();
    }
    
    private void calculateFinalPrice() {
        if (price != null && discountPercentage != null) {
            finalPrice = price * (1 - discountPercentage / 100);
        } else if (price != null) {
            finalPrice = price;
        }
    }
    
    public void setTitle(String title) {
        this.title = title;
    }
    
    public void setDescription(String description) {
        this.description = description;
    }
    
    public void setPrice(Double price) {
        this.price = price;
        calculateFinalPrice();
    }
    
    public void setDiscountPercentage(Double discountPercentage) {
        this.discountPercentage = discountPercentage;
        calculateFinalPrice();
    }
    
    public void setStock(Integer stock) {
        this.stock = stock;
    }
    
    public void setCategory(Category category) {
        this.category = category;
    }
    
    public void setBusiness(BusinessDetails business) {
        this.business = business;
    }
    
    public void setImageUrls(List<String> imageUrls) {
        this.imageUrls = imageUrls;
    }
    
    public void setFinalPrice(Double finalPrice) {
        this.finalPrice = finalPrice;
    }
    
    public Long getId() {
        return id;
    }
    
    public void setId(Long id) {
        this.id = id;
    }
    
    public String getTitle() {
        return title;
    }
    
    public String getDescription() {
        return description;
    }
    
    public Double getPrice() {
        return price;
    }
    
    public Double getDiscountPercentage() {
        return discountPercentage;
    }
    
    public Double getFinalPrice() {
        return finalPrice;
    }
    
    public Integer getStock() {
        return stock;
    }
    
    public Category getCategory() {
        return category;
    }
    
    public BusinessDetails getBusiness() {
        return business;
    }
    
    public List<String> getImageUrls() {
        return imageUrls;
    }
    
    public LocalDateTime getCreatedAt() {
        return createdAt;
    }
    
    public LocalDateTime getUpdatedAt() {
        return updatedAt;
    }
    
    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }
    
    public void setUpdatedAt(LocalDateTime updatedAt) {
        this.updatedAt = updatedAt;
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
    
    public Brand getBrand() {
        return brand;
    }
    
    public void setBrand(Brand brand) {
        this.brand = brand;
    }
    
    public String getBrandName() {
        return brandName;
    }
    
    public void setBrandName(String brandName) {
        this.brandName = brandName;
    }
} 