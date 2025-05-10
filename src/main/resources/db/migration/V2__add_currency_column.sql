-- Create product table if it doesn't exist
CREATE TABLE IF NOT EXISTS product (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    price DOUBLE NOT NULL,
    discount_percentage DOUBLE DEFAULT 0.0,
    final_price DOUBLE,
    stock INT,
    hidden BOOLEAN DEFAULT false,
    currency VARCHAR(10) DEFAULT 'INR',
    category_id BIGINT,
    business_id BIGINT,
    created_at TIMESTAMP,
    updated_at TIMESTAMP
);

-- Create product_images table if it doesn't exist
CREATE TABLE IF NOT EXISTS product_images (
    product_id BIGINT,
    image_url VARCHAR(255),
    PRIMARY KEY (product_id, image_url),
    FOREIGN KEY (product_id) REFERENCES product(id) ON DELETE CASCADE
);

-- Update existing products to set final_price if null
UPDATE product SET final_price = price * (1 - COALESCE(discount_percentage, 0) / 100) WHERE final_price IS NULL;

-- Update existing products to set currency if null
UPDATE product SET currency = 'INR' WHERE currency IS NULL; 