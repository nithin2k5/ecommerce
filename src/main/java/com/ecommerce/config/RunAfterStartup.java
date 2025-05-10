package com.ecommerce.config;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.context.event.ApplicationReadyEvent;
import org.springframework.context.event.EventListener;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Component;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.transaction.annotation.Transactional;

/**
 * Component that runs after application startup to verify and update database schema if needed
 */
@Component
public class RunAfterStartup {
    
    private static final Logger logger = LoggerFactory.getLogger(RunAfterStartup.class);
    
    @Autowired
    private JdbcTemplate jdbcTemplate;
    
    @EventListener(ApplicationReadyEvent.class)
    @Transactional
    public void runAfterStartup() {
        logger.info("Checking database schema after startup...");
        
        try {
            // Check product table for currency column
            checkProductCurrencyColumn();
            
            // Check for product_images table
            checkProductImagesTable();
            
            // Check and update final price calculation
            updateFinalPriceCalculation();
            
            logger.info("Database schema check completed successfully");
        } catch (Exception e) {
            logger.error("Error checking database schema: " + e.getMessage(), e);
        }
    }
    
    private void checkProductCurrencyColumn() {
        String checkCurrencyColumn = "SELECT COUNT(*) FROM information_schema.columns " +
                                    "WHERE table_schema = DATABASE() " +
                                    "AND table_name = 'product' " +
                                    "AND column_name = 'currency'";
        Integer currencyColumnExists = jdbcTemplate.queryForObject(checkCurrencyColumn, Integer.class);
        
        if (currencyColumnExists == null || currencyColumnExists == 0) {
            logger.info("Adding 'currency' column to product table...");
            try {
                jdbcTemplate.execute("ALTER TABLE product ADD COLUMN currency VARCHAR(10) DEFAULT 'INR'");
                logger.info("Added 'currency' column to product table");
            } catch (Exception e) {
                logger.error("Failed to add currency column: " + e.getMessage(), e);
            }
        } else {
            logger.info("'currency' column already exists in product table");
        }
    }
    
    private void checkProductImagesTable() {
        String checkProductImagesTable = "SELECT COUNT(*) FROM information_schema.tables " +
                                        "WHERE table_schema = DATABASE() " +
                                        "AND table_name = 'product_images'";
        Integer productImagesTableExists = jdbcTemplate.queryForObject(checkProductImagesTable, Integer.class);
        
        if (productImagesTableExists == null || productImagesTableExists == 0) {
            logger.info("Creating 'product_images' table...");
            try {
                jdbcTemplate.execute(
                    "CREATE TABLE IF NOT EXISTS product_images (" +
                    "product_id BIGINT, " +
                    "image_url VARCHAR(255), " +
                    "PRIMARY KEY (product_id, image_url), " +
                    "FOREIGN KEY (product_id) REFERENCES product(id) ON DELETE CASCADE" +
                    ")");
                logger.info("Created 'product_images' table");
            } catch (Exception e) {
                logger.error("Failed to create product_images table: " + e.getMessage(), e);
            }
        } else {
            logger.info("'product_images' table already exists");
        }
    }
    
    private void updateFinalPriceCalculation() {
        logger.info("Updating final price calculation for existing products...");
        try {
            int updatedRows = jdbcTemplate.update(
                "UPDATE product SET final_price = price * (1 - COALESCE(discount_percentage, 0) / 100) " +
                "WHERE final_price IS NULL OR final_price = 0");
            logger.info("Updated final price for " + updatedRows + " products");
        } catch (Exception e) {
            logger.error("Failed to update final prices: " + e.getMessage(), e);
        }
    }
} 