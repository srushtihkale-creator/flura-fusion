-- -----------------------------------------------------------------------------
-- V3__offers_and_marquee.sql
-- Flora Fusion — Marquee Offers, Bundle Discounts & Dynamic Admin Promotion Controls
-- -----------------------------------------------------------------------------

-- 1. Extend discount_type check constraint to support BUNDLE and FREE_SHIPPING
ALTER TABLE coupons DROP CONSTRAINT IF EXISTS coupons_discount_type_check;
ALTER TABLE coupons ADD CONSTRAINT coupons_discount_type_check 
    CHECK (discount_type IN ('PERCENTAGE', 'FIXED_AMOUNT', 'BUNDLE', 'FREE_SHIPPING'));

-- 2. Add offer marquee and applicability metadata columns
ALTER TABLE coupons ADD COLUMN IF NOT EXISTS title VARCHAR(150);
ALTER TABLE coupons ADD COLUMN IF NOT EXISTS banner_text VARCHAR(255);
ALTER TABLE coupons ADD COLUMN IF NOT EXISTS auto_apply BOOLEAN DEFAULT FALSE NOT NULL;
ALTER TABLE coupons ADD COLUMN IF NOT EXISTS applicable_category VARCHAR(50) DEFAULT 'all' NOT NULL;
ALTER TABLE coupons ADD COLUMN IF NOT EXISTS applicable_product_ids TEXT DEFAULT NULL;
ALTER TABLE coupons ADD COLUMN IF NOT EXISTS target_link VARCHAR(255) DEFAULT '/plants';
ALTER TABLE coupons ADD COLUMN IF NOT EXISTS bundle_qty INT DEFAULT NULL;
ALTER TABLE coupons ADD COLUMN IF NOT EXISTS bundle_price DECIMAL(10, 2) DEFAULT NULL;
ALTER TABLE coupons ADD COLUMN IF NOT EXISTS display_order INT DEFAULT 0 NOT NULL;

-- 3. Update existing seed coupons with standardized display metadata
UPDATE coupons 
SET title = '10% OFF',
    banner_text = '🎉 GET 10% OFF ON ORDERS ABOVE ₹1,499',
    min_cart_value = 1499.00,
    auto_apply = TRUE,
    applicable_category = 'all',
    target_link = '/plants',
    display_order = 2
WHERE code = 'FLORA10';

UPDATE coupons 
SET title = '20% OFF',
    banner_text = '🌱 GET 20% OFF ON ORDERS ABOVE ₹1,000',
    min_cart_value = 1000.00,
    auto_apply = FALSE,
    applicable_category = 'all',
    target_link = '/plants',
    display_order = 4
WHERE code = 'NATURE20';

UPDATE coupons 
SET title = '₹50 OFF',
    banner_text = '✨ FLAT ₹50 OFF ON ORDERS ABOVE ₹499',
    min_cart_value = 499.00,
    auto_apply = FALSE,
    applicable_category = 'all',
    target_link = '/plants',
    display_order = 5
WHERE code = 'WELCOME50';

-- 4. Seed featured marquee offers required by Flora Fusion specification
INSERT INTO coupons (code, discount_type, discount_value, min_cart_value, max_discount, usage_limit, is_active, title, banner_text, auto_apply, applicable_category, target_link, bundle_qty, bundle_price, display_order)
VALUES
    ('PLANTBUNDLE4', 'BUNDLE', 1199.00, 0.00, NULL, 5000, TRUE, 'Buy Any 4 Plants @ ₹1,199', '🌿 BUY ANY 4 PLANTS @ ₹1,199', TRUE, 'plants', '/plants', 4, 1199.00, 1),
    ('FREESHIP499', 'FREE_SHIPPING', 79.00, 499.00, 79.00, 10000, TRUE, 'Free Shipping', '🚚 FREE SHIPPING ABOVE ₹499', TRUE, 'all', '/plants', NULL, NULL, 3)
ON CONFLICT (code) DO UPDATE
SET title = EXCLUDED.title,
    banner_text = EXCLUDED.banner_text,
    discount_type = EXCLUDED.discount_type,
    discount_value = EXCLUDED.discount_value,
    min_cart_value = EXCLUDED.min_cart_value,
    auto_apply = EXCLUDED.auto_apply,
    applicable_category = EXCLUDED.applicable_category,
    target_link = EXCLUDED.target_link,
    bundle_qty = EXCLUDED.bundle_qty,
    bundle_price = EXCLUDED.bundle_price,
    display_order = EXCLUDED.display_order,
    is_active = TRUE;
