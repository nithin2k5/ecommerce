package com.ecommerce.config;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.jdbc.core.JdbcTemplate;

import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;
import jakarta.transaction.Transactional;

@Configuration
public class DatabaseConfig {

    @PersistenceContext
    private EntityManager entityManager;

    @Bean
    @Transactional
    public CommandLineRunner initDatabase(JdbcTemplate jdbcTemplate) {
        return args -> {
            // Check if tables exist
            try {
                System.out.println("==================================================");
                System.out.println("Checking database tables...");
                
                // First ensure the database exists
                jdbcTemplate.execute("CREATE DATABASE IF NOT EXISTS ecommerce");
                jdbcTemplate.execute("USE ecommerce");
                
                // Check Product table existence
                String checkProductTable = "SELECT COUNT(*) FROM information_schema.tables WHERE table_schema = DATABASE() AND table_name = 'product'";
                Integer productTableExists = jdbcTemplate.queryForObject(checkProductTable, Integer.class);
                
                System.out.println("Product table exists: " + (productTableExists > 0));
                
                // Create tables if they don't exist
                if (productTableExists == 0) {
                    System.out.println("Creating Product table...");
                    jdbcTemplate.execute(
                        "CREATE TABLE IF NOT EXISTS product (" +
                        "id BIGINT AUTO_INCREMENT PRIMARY KEY, " +
                        "title VARCHAR(255) NOT NULL, " +
                        "description TEXT, " +
                        "price DOUBLE NOT NULL, " +
                        "discount_percentage DOUBLE DEFAULT 0.0, " +
                        "final_price DOUBLE, " +
                        "stock INTEGER DEFAULT 0, " +
                        "hidden BOOLEAN DEFAULT FALSE, " +
                        "created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP, " +
                        "updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP, " +
                        "business_id BIGINT, " +
                        "category_id BIGINT" +
                        ")");
                } else {
                    // Update existing table if needed - add missing columns
                    System.out.println("Ensuring product table has all required columns...");
                    
                    // First check if the hidden column exists
                    String checkHiddenColumn = "SELECT COUNT(*) FROM information_schema.columns " +
                                             "WHERE table_schema = DATABASE() " +
                                             "AND table_name = 'product' " +
                                             "AND column_name = 'hidden'";
                    Integer hiddenColumnExists = jdbcTemplate.queryForObject(checkHiddenColumn, Integer.class);
                    
                    if (hiddenColumnExists == 0) {
                        System.out.println("Adding 'hidden' column to product table...");
                        jdbcTemplate.execute("ALTER TABLE product ADD COLUMN hidden BOOLEAN DEFAULT FALSE");
                    } else {
                        System.out.println("'hidden' column already exists in product table.");
                    }
                    
                    // Check for discount_percentage column
                    String checkDiscountColumn = "SELECT COUNT(*) FROM information_schema.columns " +
                                               "WHERE table_schema = DATABASE() " +
                                               "AND table_name = 'product' " +
                                               "AND column_name = 'discount_percentage'";
                    Integer discountColumnExists = jdbcTemplate.queryForObject(checkDiscountColumn, Integer.class);
                    
                    if (discountColumnExists == 0) {
                        System.out.println("Adding 'discount_percentage' column to product table...");
                        jdbcTemplate.execute("ALTER TABLE product ADD COLUMN discount_percentage DOUBLE DEFAULT 0.0");
                    }
                    
                    // Check for final_price column
                    String checkFinalPriceColumn = "SELECT COUNT(*) FROM information_schema.columns " +
                                                 "WHERE table_schema = DATABASE() " +
                                                 "AND table_name = 'product' " +
                                                 "AND column_name = 'final_price'";
                    Integer finalPriceColumnExists = jdbcTemplate.queryForObject(checkFinalPriceColumn, Integer.class);
                    
                    if (finalPriceColumnExists == 0) {
                        System.out.println("Adding 'final_price' column to product table...");
                        jdbcTemplate.execute("ALTER TABLE product ADD COLUMN final_price DOUBLE");
                    }
                    
                    // Ensure created_at and updated_at timestamps exist
                    String checkCreatedAtColumn = "SELECT COUNT(*) FROM information_schema.columns " +
                                                "WHERE table_schema = DATABASE() " +
                                                "AND table_name = 'product' " +
                                                "AND column_name = 'created_at'";
                    Integer createdAtColumnExists = jdbcTemplate.queryForObject(checkCreatedAtColumn, Integer.class);
                    
                    if (createdAtColumnExists == 0) {
                        System.out.println("Adding timestamp columns to product table...");
                        jdbcTemplate.execute("ALTER TABLE product ADD COLUMN created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP");
                        jdbcTemplate.execute("ALTER TABLE product ADD COLUMN updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP");
                    }
                }
                
                // Check product_images table
                String checkProductImagesTable = "SELECT COUNT(*) FROM information_schema.tables WHERE table_schema = DATABASE() AND table_name = 'product_images'";
                Integer productImagesTableExists = jdbcTemplate.queryForObject(checkProductImagesTable, Integer.class);
                
                System.out.println("Product images table exists: " + (productImagesTableExists > 0));
                
                // Create product_images table if it doesn't exist
                if (productImagesTableExists == 0) {
                    System.out.println("Creating product_images table...");
                    jdbcTemplate.execute(
                        "CREATE TABLE IF NOT EXISTS product_images (" +
                        "product_id BIGINT, " +
                        "image_url VARCHAR(255), " +
                        "FOREIGN KEY (product_id) REFERENCES product(id) ON DELETE CASCADE" +
                        ")");
                }
                
                // Verify business_details table exists
                String checkBusinessTable = "SELECT COUNT(*) FROM information_schema.tables WHERE table_schema = DATABASE() AND table_name = 'business_details'";
                Integer businessTableExists = jdbcTemplate.queryForObject(checkBusinessTable, Integer.class);
                
                System.out.println("Business table exists: " + (businessTableExists > 0));
                
                // Create business_details table if it doesn't exist
                if (businessTableExists == 0) {
                    System.out.println("Creating business_details table...");
                    jdbcTemplate.execute(
                        "CREATE TABLE IF NOT EXISTS business_details (" +
                        "id BIGINT AUTO_INCREMENT PRIMARY KEY, " +
                        "business_name VARCHAR(255) NOT NULL, " +
                        "business_address VARCHAR(255), " +
                        "business_phone VARCHAR(20), " +
                        "business_email VARCHAR(100), " +
                        "business_description TEXT, " +
                        "business_logo VARCHAR(255), " +
                        "created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP, " +
                        "updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP, " +
                        "user_id BIGINT" +
                        ")");
                    
                    // Insert a test business
                    jdbcTemplate.execute(
                        "INSERT INTO business_details (business_name, business_address, business_phone, business_email) " +
                        "VALUES ('Test Business', '123 Test Street', '555-1234', 'test@example.com')");
                }
                
                // Verify category table exists
                String checkCategoryTable = "SELECT COUNT(*) FROM information_schema.tables WHERE table_schema = DATABASE() AND table_name = 'category'";
                Integer categoryTableExists = jdbcTemplate.queryForObject(checkCategoryTable, Integer.class);
                
                System.out.println("Category table exists: " + (categoryTableExists > 0));
                
                // Create category table if it doesn't exist
                if (categoryTableExists == 0) {
                    System.out.println("Creating category table...");
                    jdbcTemplate.execute(
                        "CREATE TABLE IF NOT EXISTS category (" +
                        "id BIGINT AUTO_INCREMENT PRIMARY KEY, " +
                        "name VARCHAR(255) NOT NULL, " +
                        "description TEXT, " +
                        "created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP, " +
                        "updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP" +
                        ")");
                    
                    // Insert some test categories
                    jdbcTemplate.execute("INSERT INTO category (name) VALUES ('Electronics')");
                    jdbcTemplate.execute("INSERT INTO category (name) VALUES ('Clothing')");
                    jdbcTemplate.execute("INSERT INTO category (name) VALUES ('Home & Kitchen')");
                }
                
                // Update any existing product records to calculate final price if null
                jdbcTemplate.execute(
                    "UPDATE product SET final_price = price * (1 - discount_percentage / 100) " +
                    "WHERE final_price IS NULL");
                
                System.out.println("Database initialization completed successfully.");
                System.out.println("==================================================");
            } catch (Exception e) {
                System.err.println("Error initializing database: " + e.getMessage());
                e.printStackTrace();
            }
        };
    }
} 