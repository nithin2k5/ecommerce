-- Initial schema migration (baseline)
-- This will be the state from which our V2 migrations will apply 

-- This is the baseline migration
-- It's intentionally empty as we're using spring.jpa.hibernate.ddl-auto=update
-- and we already have schema.sql for initial schema

-- If you need to start from scratch, you can uncomment and use the following:

/*
CREATE TABLE IF NOT EXISTS user (
  id BIGINT AUTO_INCREMENT PRIMARY KEY,
  username VARCHAR(50) NOT NULL UNIQUE,
  password VARCHAR(255) NOT NULL,
  email VARCHAR(100) NOT NULL UNIQUE,
  role VARCHAR(20) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS business_details (
  id BIGINT AUTO_INCREMENT PRIMARY KEY,
  business_name VARCHAR(100) NOT NULL,
  brand_name VARCHAR(100),
  contact_email VARCHAR(100),
  phone_number VARCHAR(20),
  address TEXT,
  description TEXT,
  user_id BIGINT NOT NULL,
  FOREIGN KEY (user_id) REFERENCES user(id)
);

CREATE TABLE IF NOT EXISTS category (
  id BIGINT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(50) NOT NULL,
  description TEXT,
  parent_id BIGINT,
  FOREIGN KEY (parent_id) REFERENCES category(id)
);

CREATE TABLE IF NOT EXISTS product (
  id BIGINT AUTO_INCREMENT PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  price DOUBLE NOT NULL,
  discount_percentage DOUBLE DEFAULT 0.0,
  final_price DOUBLE,
  stock INT DEFAULT 0,
  hidden BOOLEAN DEFAULT FALSE,
  currency VARCHAR(5) DEFAULT 'INR',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  business_id BIGINT NOT NULL,
  category_id BIGINT,
  FOREIGN KEY (business_id) REFERENCES business_details(id),
  FOREIGN KEY (category_id) REFERENCES category(id)
);

CREATE TABLE IF NOT EXISTS product_images (
  id BIGINT AUTO_INCREMENT PRIMARY KEY,
  product_id BIGINT NOT NULL,
  image_url VARCHAR(255) NOT NULL,
  FOREIGN KEY (product_id) REFERENCES product(id) ON DELETE CASCADE
);
*/ 