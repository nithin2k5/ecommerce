-- Check if id column exists and rename to product_id if it does
DROP PROCEDURE IF EXISTS alter_product_table_if_exists;
DELIMITER //
CREATE PROCEDURE alter_product_table_if_exists()
BEGIN
    DECLARE CONTINUE HANDLER FOR SQLSTATE '42S22' BEGIN END;
    ALTER TABLE product CHANGE COLUMN id product_id BIGINT AUTO_INCREMENT;
END //
DELIMITER ;
CALL alter_product_table_if_exists();
DROP PROCEDURE IF EXISTS alter_product_table_if_exists;

-- Ensure required columns exist and have proper constraints
ALTER TABLE product 
    MODIFY COLUMN title VARCHAR(255) NOT NULL,
    MODIFY COLUMN description TEXT,
    MODIFY COLUMN price DOUBLE NOT NULL,
    MODIFY COLUMN discount_percentage DOUBLE DEFAULT 0.0,
    MODIFY COLUMN stock INT DEFAULT 0,
    MODIFY COLUMN hidden BOOLEAN DEFAULT FALSE,
    MODIFY COLUMN currency VARCHAR(5) DEFAULT 'INR';

-- Add indexes for better performance
DROP PROCEDURE IF EXISTS create_indexes_if_not_exists;
DELIMITER //
CREATE PROCEDURE create_indexes_if_not_exists()
BEGIN
    DECLARE CONTINUE HANDLER FOR SQLSTATE '42000' BEGIN END;
    
    CREATE INDEX idx_product_title ON product(title);
    CREATE INDEX idx_product_business_id ON product(business_id);
    CREATE INDEX idx_product_category_id ON product(category_id);
    CREATE INDEX idx_product_hidden ON product(hidden);
END //
DELIMITER ;
CALL create_indexes_if_not_exists();
DROP PROCEDURE IF EXISTS create_indexes_if_not_exists; 