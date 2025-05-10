-- Clear existing data
DELETE FROM admin_details;
DELETE FROM business_details;
DELETE FROM user_roles;
DELETE FROM product;
DELETE FROM orders;
DELETE FROM order_items;
DELETE FROM category;
DELETE FROM users;

-- Insert categories
INSERT INTO category (id, name, description) VALUES
(1, 'Electronics', 'Electronic devices and accessories'),
(2, 'Mobiles', 'Mobile phones and accessories'),
(3, 'Fashion', 'Clothing, shoes and accessories'),
(4, 'Provisions', 'Grocery and household items'),
(5, 'Appliances', 'Home and kitchen appliances');

-- Insert base users
-- Note: Password is 'password123' encoded with BCrypt
INSERT INTO users (id, username, password, email, full_name, enabled) VALUES 
(1, 'superadmin', '$2a$10$dXJ3SW6G7P50lGmMkkmwe.20cQQubK3.HZWzG3YB1tlRy.fqvM/BG', 'superadmin@pazar.com', 'Super Admin', true),
(2, 'businessadmin', '$2a$10$dXJ3SW6G7P50lGmMkkmwe.20cQQubK3.HZWzG3YB1tlRy.fqvM/BG', 'businessadmin@pazar.com', 'Business Admin', true),
(3, 'fashionadmin', '$2a$10$dXJ3SW6G7P50lGmMkkmwe.20cQQubK3.HZWzG3YB1tlRy.fqvM/BG', 'fashion@pazar.com', 'Fashion Admin', true),
(4, 'electronics', '$2a$10$dXJ3SW6G7P50lGmMkkmwe.20cQQubK3.HZWzG3YB1tlRy.fqvM/BG', 'electronics@pazar.com', 'Electronics Admin', true),
(5, 'marketing', '$2a$10$dXJ3SW6G7P50lGmMkkmwe.20cQQubK3.HZWzG3YB1tlRy.fqvM/BG', 'marketing@pazar.com', 'Marketing Team', true),
(6, 'customerservice', '$2a$10$dXJ3SW6G7P50lGmMkkmwe.20cQQubK3.HZWzG3YB1tlRy.fqvM/BG', 'support@pazar.com', 'Customer Service', true),
(7, 'business1', '$2a$10$dXJ3SW6G7P50lGmMkkmwe.20cQQubK3.HZWzG3YB1tlRy.fqvM/BG', 'business1@company.com', 'Business Owner 1', true),
(8, 'business2', '$2a$10$dXJ3SW6G7P50lGmMkkmwe.20cQQubK3.HZWzG3YB1tlRy.fqvM/BG', 'business2@company.com', 'Business Owner 2', true),
(9, 'customer1', '$2a$10$dXJ3SW6G7P50lGmMkkmwe.20cQQubK3.HZWzG3YB1tlRy.fqvM/BG', 'customer1@example.com', 'John Customer', true),
(10, 'customer2', '$2a$10$dXJ3SW6G7P50lGmMkkmwe.20cQQubK3.HZWzG3YB1tlRy.fqvM/BG', 'customer2@example.com', 'Jane Customer', true),
(11, 'appliances', '$2a$10$dXJ3SW6G7P50lGmMkkmwe.20cQQubK3.HZWzG3YB1tlRy.fqvM/BG', 'appliances@pazar.com', 'Appliances Admin', true),
(12, 'provisions', '$2a$10$dXJ3SW6G7P50lGmMkkmwe.20cQQubK3.HZWzG3YB1tlRy.fqvM/BG', 'provisions@pazar.com', 'Provisions Admin', true),
(13, 'business3', '$2a$10$dXJ3SW6G7P50lGmMkkmwe.20cQQubK3.HZWzG3YB1tlRy.fqvM/BG', 'business3@example.com', 'Business Owner 3', true);

-- Assign roles to users
INSERT INTO user_roles (user_id, role) VALUES
(1, 'ROLE_ADMIN'),
(1, 'SUPER_ADMIN'),
(2, 'ROLE_ADMIN'),
(2, 'BUSINESS_ADMIN'),
(3, 'ROLE_ADMIN'),
(4, 'ROLE_ADMIN'),
(5, 'ROLE_ADMIN'),
(6, 'ROLE_ADMIN'),
(7, 'ROLE_BUSINESS'),
(8, 'ROLE_BUSINESS'),
(9, 'ROLE_USER'),
(10, 'ROLE_USER'),
(11, 'ROLE_ADMIN'),
(12, 'ROLE_ADMIN'),
(13, 'ROLE_BUSINESS');

-- Insert admin details
INSERT INTO admin_details (id, user_id, department, position, access_level, last_login, created_at, is_super_admin) VALUES
(1, 1, 'Administration', 'Chief Administrator', 100, CURRENT_TIMESTAMP(), CURRENT_TIMESTAMP(), true),
(2, 2, 'Business Operations', 'Business Admin Manager', 80, CURRENT_TIMESTAMP(), CURRENT_TIMESTAMP(), false),
(3, 3, 'Fashion', 'Fashion Category Manager', 60, CURRENT_TIMESTAMP(), CURRENT_TIMESTAMP(), false),
(4, 4, 'Electronics', 'Electronics Category Manager', 60, CURRENT_TIMESTAMP(), CURRENT_TIMESTAMP(), false),
(5, 5, 'Marketing', 'Marketing Manager', 50, CURRENT_TIMESTAMP(), CURRENT_TIMESTAMP(), false),
(6, 6, 'Customer Service', 'Support Team Lead', 40, CURRENT_TIMESTAMP(), CURRENT_TIMESTAMP(), false),
(7, 11, 'Appliances', 'Appliances Category Manager', 60, CURRENT_TIMESTAMP(), CURRENT_TIMESTAMP(), false),
(8, 12, 'Provisions', 'Provisions Category Manager', 60, CURRENT_TIMESTAMP(), CURRENT_TIMESTAMP(), false);

-- Insert business details
INSERT INTO business_details (id, user_id, business_name, brand_name, phone) VALUES 
(1, 7, 'Fashion Emporium Ltd', 'Fashion Emporium', '+1234567890'),
(2, 8, 'Tech Solutions Inc', 'TechGadgets', '+0987654321'),
(3, 13, 'Home Essentials LLC', 'HomeSmart', '+1122334455');

-- Insert products
INSERT INTO product (id, title, description, price, stock, image_url, category_id, business_id, created_at) VALUES
-- Electronics products (Business 2 - Tech Solutions)
(1, 'Smartphone X Pro', 'Latest flagship smartphone with advanced features', 999.99, 50, 'https://example.com/smartphone.jpg', 2, 2, CURRENT_TIMESTAMP()),
(2, 'Ultra HD Smart TV', '65-inch 4K Ultra HD Smart TV with voice control', 1299.99, 20, 'https://example.com/tv.jpg', 1, 2, CURRENT_TIMESTAMP()),
(3, 'Wireless Headphones', 'Premium noise-cancelling wireless headphones', 199.99, 100, 'https://example.com/headphones.jpg', 1, 2, CURRENT_TIMESTAMP()),
(4, 'Tablet Pro', '10.5-inch professional tablet with stylus support', 499.99, 35, 'https://example.com/tablet.jpg', 1, 2, CURRENT_TIMESTAMP()),
(5, 'Smart Watch Series 5', 'Advanced fitness and health tracking smartwatch', 249.99, 60, 'https://example.com/smartwatch.jpg', 1, 2, CURRENT_TIMESTAMP()),

-- Fashion products (Business 1 - Fashion Emporium)
(6, 'Designer Jeans', 'Premium quality designer jeans for men', 89.99, 200, 'https://example.com/jeans.jpg', 3, 1, CURRENT_TIMESTAMP()),
(7, 'Leather Jacket', 'Classic leather jacket for all seasons', 199.99, 40, 'https://example.com/jacket.jpg', 3, 1, CURRENT_TIMESTAMP()),
(8, 'Summer Dress', 'Lightweight cotton summer dress for women', 59.99, 150, 'https://example.com/dress.jpg', 3, 1, CURRENT_TIMESTAMP()),
(9, 'Sports Shoes', 'High-performance athletic footwear', 79.99, 120, 'https://example.com/shoes.jpg', 3, 1, CURRENT_TIMESTAMP()),
(10, 'Formal Suit', 'Tailored formal suit for professional occasions', 299.99, 30, 'https://example.com/suit.jpg', 3, 1, CURRENT_TIMESTAMP()),

-- Home products (Business 3 - Home Essentials)
(11, 'Coffee Maker', 'Programmable coffee maker with thermal carafe', 129.99, 45, 'https://example.com/coffeemaker.jpg', 5, 3, CURRENT_TIMESTAMP()),
(12, 'Blender Set', 'High-speed blender with multiple attachments', 89.99, 50, 'https://example.com/blender.jpg', 5, 3, CURRENT_TIMESTAMP()),
(13, 'Microwave Oven', 'Smart microwave oven with multiple cooking functions', 149.99, 35, 'https://example.com/microwave.jpg', 5, 3, CURRENT_TIMESTAMP()),
(14, 'Toaster', '4-slice toaster with adjustable browning control', 49.99, 75, 'https://example.com/toaster.jpg', 5, 3, CURRENT_TIMESTAMP()),
(15, 'Air Fryer', 'Digital air fryer for healthier cooking', 119.99, 60, 'https://example.com/airfryer.jpg', 5, 3, CURRENT_TIMESTAMP());

-- Insert customer details
INSERT INTO customer_details (id, user_id, address, city, state, zip_code, phone) VALUES
(1, 9, '123 Main St', 'New York', 'NY', '10001', '+1112223333'),
(2, 10, '456 Park Ave', 'Los Angeles', 'CA', '90001', '+4445556666');

-- Insert orders
INSERT INTO orders (id, user_id, order_date, total_amount, status, shipping_address) VALUES
(1, 9, CURRENT_TIMESTAMP() - INTERVAL 10 DAY, 1499.98, 'DELIVERED', '123 Main St, New York, NY, 10001'),
(2, 10, CURRENT_TIMESTAMP() - INTERVAL 5 DAY, 349.98, 'SHIPPED', '456 Park Ave, Los Angeles, CA, 90001'),
(3, 9, CURRENT_TIMESTAMP() - INTERVAL 2 DAY, 279.98, 'PROCESSING', '123 Main St, New York, NY, 10001'),
(4, 10, CURRENT_TIMESTAMP() - INTERVAL 1 DAY, 1349.98, 'PENDING', '456 Park Ave, Los Angeles, CA, 90001');

-- Insert order items
INSERT INTO order_items (id, order_id, product_id, quantity, price) VALUES
(1, 1, 2, 1, 1299.99),  -- TV
(2, 1, 3, 1, 199.99),   -- Headphones
(3, 2, 8, 2, 59.99),    -- Summer Dress (2x)
(4, 2, 9, 1, 79.99),    -- Sports Shoes
(5, 2, 6, 1, 89.99),    -- Designer Jeans
(6, 3, 5, 1, 249.99),   -- Smart Watch
(7, 3, 3, 1, 199.99),   -- Headphones (another pair)
(8, 4, 2, 1, 1299.99),  -- Another TV
(9, 4, 7, 1, 199.99);   -- Leather Jacket

-- Sample data for business_details (will only insert if not exists)
INSERT IGNORE INTO business_details (business_name, business_address, business_phone, business_email) 
VALUES ('Test Business', '123 Test Street', '555-1234', 'test@example.com');

-- Sample categories (will only insert if not exists)
INSERT IGNORE INTO category (name, description) 
VALUES ('Electronics', 'Electronic devices and accessories');

INSERT IGNORE INTO category (name, description) 
VALUES ('Clothing', 'Apparel and accessories');

INSERT IGNORE INTO category (name, description) 
VALUES ('Home & Kitchen', 'Home and kitchen appliances and accessories');

-- Sample product if none exist
INSERT IGNORE INTO product (title, description, price, stock, discount_percentage, business_id, category_id, hidden)
SELECT 'Sample Product', 'This is a sample product', 999.99, 10, 0.0, b.id, c.id, false
FROM business_details b, category c 
WHERE c.name = 'Electronics' AND b.business_name = 'Test Business'
AND NOT EXISTS (SELECT 1 FROM product LIMIT 1); 