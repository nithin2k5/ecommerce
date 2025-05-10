-- SQL script to check and fix the product table

-- Get the table schema
SHOW CREATE TABLE product;

-- Describe the table structure
DESC product;

-- Count current products
SELECT COUNT(*) AS product_count FROM product;

-- Test inserting a product directly
INSERT INTO product (title, description, price, stock, discount_percentage, hidden, currency, created_at, updated_at)
VALUES ('Test Product', 'Test description', 100.00, 10, 0.0, false, 'INR', NOW(), NOW());

-- Check if it was inserted
SELECT * FROM product WHERE title = 'Test Product';

-- If needed, rename the primary key column from 'id' to 'product_id'
-- ALTER TABLE product CHANGE COLUMN id product_id BIGINT AUTO_INCREMENT;

-- If needed, add missing columns
-- ALTER TABLE product ADD COLUMN final_price DOUBLE AFTER discount_percentage;
-- ALTER TABLE product ADD COLUMN created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP;
-- ALTER TABLE product ADD COLUMN updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP;

-- Update final_price for all products
UPDATE product SET final_price = price * (1 - COALESCE(discount_percentage, 0) / 100)
WHERE final_price IS NULL OR final_price = 0; 