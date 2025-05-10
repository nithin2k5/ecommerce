-- Add currency column if it doesn't exist
ALTER TABLE product ADD COLUMN IF NOT EXISTS currency VARCHAR(10) DEFAULT 'INR';

-- Update existing products to have 'INR' as the default currency if value is NULL
UPDATE product SET currency = 'INR' WHERE currency IS NULL; 