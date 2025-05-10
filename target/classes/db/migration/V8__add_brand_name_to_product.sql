-- Add brand_name column to product table
ALTER TABLE product ADD COLUMN brand_name VARCHAR(255);

-- Create index for brand_name for better query performance
CREATE INDEX idx_product_brand_name ON product(brand_name); 