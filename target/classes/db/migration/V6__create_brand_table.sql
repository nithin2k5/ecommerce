-- Create brand table
CREATE TABLE IF NOT EXISTS product_brand (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    logo_url VARCHAR(255),
    business_id BIGINT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (business_id) REFERENCES business_details(id)
);

-- Create index for brand name
CREATE INDEX IF NOT EXISTS idx_brand_name ON product_brand(name);

-- Add foreign key to product table
ALTER TABLE product ADD COLUMN IF NOT EXISTS brand_id BIGINT;
ALTER TABLE product ADD CONSTRAINT IF NOT EXISTS fk_product_brand FOREIGN KEY (brand_id) REFERENCES product_brand(id);

-- For existing products that have a brand_name but no relationship to a brand entity,
-- we'll just keep their brand_name field for now.
-- Later, a data migration script could be created to populate brand entities and update relationships.

-- Create index for the brand_id column
CREATE INDEX IF NOT EXISTS idx_product_brand_id ON product(brand_id); 