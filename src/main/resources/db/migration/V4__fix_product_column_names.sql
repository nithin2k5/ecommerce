-- Fix product table column names to be consistent with JPA entity
-- V4 migration that builds on V3__alter_product_table.sql

-- First, check if product_id column exists
DROP PROCEDURE IF EXISTS fix_product_table;
DELIMITER //
CREATE PROCEDURE fix_product_table()
BEGIN
    -- Store the table creation DDL for later
    SET @table_ddl = (SELECT GROUP_CONCAT(COLUMN_NAME) FROM INFORMATION_SCHEMA.COLUMNS 
                      WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = 'product');
    
    -- Check the primary key column name
    SET @id_column = (SELECT COLUMN_NAME FROM INFORMATION_SCHEMA.COLUMNS 
                      WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = 'product' 
                      AND COLUMN_KEY = 'PRI' LIMIT 1);
    
    IF @id_column = 'id' OR @id_column IS NULL THEN
        -- If primary key column is 'id' or no primary key found, rename to 'product_id'
        ALTER TABLE product CHANGE COLUMN id product_id BIGINT AUTO_INCREMENT;
        SELECT 'Primary key column renamed from id to product_id' AS message;
    ELSEIF @id_column = 'product_id' THEN
        SELECT 'Primary key column already named correctly as product_id' AS message;
    END IF;
    
    -- Ensure all FK references to this table use the correct column name
    -- For product_images table
    SET @fk_name = (SELECT CONSTRAINT_NAME FROM INFORMATION_SCHEMA.KEY_COLUMN_USAGE 
                    WHERE REFERENCED_TABLE_NAME = 'product' 
                    AND TABLE_NAME = 'product_images' 
                    AND REFERENCED_COLUMN_NAME != 'product_id' LIMIT 1);
    
    IF @fk_name IS NOT NULL THEN
        -- Drop and recreate foreign key constraint using dynamic SQL
        SET @sql = CONCAT('ALTER TABLE product_images DROP FOREIGN KEY ', @fk_name);
        PREPARE stmt FROM @sql;
        EXECUTE stmt;
        DEALLOCATE PREPARE stmt;
        
        ALTER TABLE product_images ADD CONSTRAINT fk_product_images_product
            FOREIGN KEY (product_id) REFERENCES product(product_id) ON DELETE CASCADE;
        SELECT 'Fixed foreign key in product_images table' AS message;
    END IF;
    
    -- Now ensure all required columns exist
    -- Check if final_price column exists
    IF NOT EXISTS (SELECT 1 FROM INFORMATION_SCHEMA.COLUMNS 
                  WHERE TABLE_SCHEMA = DATABASE() 
                  AND TABLE_NAME = 'product' 
                  AND COLUMN_NAME = 'final_price') THEN
        ALTER TABLE product ADD COLUMN final_price DOUBLE AFTER discount_percentage;
        UPDATE product SET final_price = price * (1 - COALESCE(discount_percentage, 0) / 100);
        SELECT 'Added final_price column' AS message;
    END IF;
    
    -- Check if created_at column exists
    IF NOT EXISTS (SELECT 1 FROM INFORMATION_SCHEMA.COLUMNS 
                  WHERE TABLE_SCHEMA = DATABASE() 
                  AND TABLE_NAME = 'product' 
                  AND COLUMN_NAME = 'created_at') THEN
        ALTER TABLE product ADD COLUMN created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP;
        SELECT 'Added created_at column' AS message;
    END IF;
    
    -- Check if updated_at column exists
    IF NOT EXISTS (SELECT 1 FROM INFORMATION_SCHEMA.COLUMNS 
                  WHERE TABLE_SCHEMA = DATABASE() 
                  AND TABLE_NAME = 'product' 
                  AND COLUMN_NAME = 'updated_at') THEN
        ALTER TABLE product ADD COLUMN updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP;
        SELECT 'Added updated_at column' AS message;
    END IF;
END //
DELIMITER ;

-- Run the procedure
CALL fix_product_table();

-- Clean up
DROP PROCEDURE IF EXISTS fix_product_table; 