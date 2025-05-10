-- Create tables if they don't exist
CREATE TABLE IF NOT EXISTS business_details (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    business_name VARCHAR(255) NOT NULL,
    business_address VARCHAR(255),
    business_phone VARCHAR(20),
    business_email VARCHAR(100),
    business_description TEXT,
    business_logo VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    user_id BIGINT
);

CREATE TABLE IF NOT EXISTS category (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS product (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    price DOUBLE NOT NULL,
    discount_percentage DOUBLE DEFAULT 0.0,
    final_price DOUBLE,
    stock INTEGER DEFAULT 0,
    hidden BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    business_id BIGINT,
    category_id BIGINT,
    FOREIGN KEY (business_id) REFERENCES business_details(id),
    FOREIGN KEY (category_id) REFERENCES category(id)
);

CREATE TABLE IF NOT EXISTS product_images (
    product_id BIGINT,
    image_url VARCHAR(255),
    PRIMARY KEY (product_id, image_url),
    FOREIGN KEY (product_id) REFERENCES product(id) ON DELETE CASCADE
); 