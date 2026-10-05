-- =============================================================================
-- Flora Fusion — Database Seed Data Script
-- Populates exact 31 catalog products, 3 categories, multi-angle images,
-- coupons, default users, CMS banners, and plant care guides.
-- =============================================================================

-- -----------------------------------------------------------------------------
-- 1. SEED DEFAULT USERS (BCrypt password: Password@123)
-- Hash: $2a$10$QlAdLtjqG1qSkDPB9TFfi.dBpb1Nf8D7CiKM9b.NTZg3kZZAFbQ26
-- -----------------------------------------------------------------------------
INSERT INTO users (id, name, email, phone, password_hash, role, status)
VALUES 
    ('11111111-1111-1111-1111-111111111111', 'Flora Admin', 'admin@florafusion.com', '+91 9876543210', '$2a$10$QlAdLtjqG1qSkDPB9TFfi.dBpb1Nf8D7CiKM9b.NTZg3kZZAFbQ26', 'ADMIN', 'ACTIVE'),
    ('22222222-2222-2222-2222-222222222222', 'Srushti Kale', 'srushti@florafusion.com', '+91 9123456780', '$2a$10$QlAdLtjqG1qSkDPB9TFfi.dBpb1Nf8D7CiKM9b.NTZg3kZZAFbQ26', 'CUSTOMER', 'ACTIVE')
ON CONFLICT (email) DO NOTHING;

-- -----------------------------------------------------------------------------
-- 2. SEED CATEGORIES
-- -----------------------------------------------------------------------------
INSERT INTO categories (id, name, slug, description, image_url, display_order, is_active)
VALUES
    ('c1111111-1111-1111-1111-111111111111', 'Plants', 'plants', 'Healthy, indoor and air-purifying plants potted with care.', '/assets/banners/promo_plants.png', 1, TRUE),
    ('c2222222-2222-2222-2222-222222222222', 'Pots', 'pots', 'Artisan ceramic, terracotta, and modern indoor planters.', '/assets/banners/promo_pots.png', 2, TRUE),
    ('c3333333-3333-3333-3333-333333333333', 'Seeds', 'seeds', 'High-germination organic flower, herb and vegetable seeds.', '/assets/banners/promo_seeds.png', 3, TRUE)
ON CONFLICT (slug) DO NOTHING;

-- -----------------------------------------------------------------------------
-- 3. SEED 11 PLANTS
-- -----------------------------------------------------------------------------
INSERT INTO products (id, category_id, sub_category, name, slug, tagline, description, sku, base_price, original_price, rating, review_count, badge, in_stock, stock_quantity, metadata, care_guide)
VALUES
(
    'a1000001-0000-0000-0000-000000000001',
    'c1111111-1111-1111-1111-111111111111',
    'indoor',
    'Money Plant',
    'money-plant',
    'Brings good luck & positivity',
    'An enduring indoor favorite celebrated for its lush heart-shaped foliage. Believed to attract wealth, positive energy, and prosperity into the home. Thrives in moderate indirect light with very low maintenance.',
    'FF-PLN-001',
    399.00,
    499.00,
    4.8,
    124,
    'Bestseller',
    TRUE,
    85,
    '{"placement": "Indoor", "water": "Low Water (once a week)", "light": "Indirect Sun / Medium", "difficulty": "Easy for Beginners", "airPurifying": true, "petFriendly": false, "size": "Medium (8-12 inches)"}'::jsonb,
    '{"watering": "Water thoroughly only when the top 2 inches of soil feel dry to the touch.", "sunlight": "Prefers bright, indirect light; tolerates moderate fluorescent room light.", "repotting": "Repot once every 18-24 months into a slightly larger ceramic or terracotta pot.", "proTip": "Wipe leaves gently with a damp cotton cloth once a month to maximize photosynthesis."}'::jsonb
),
(
    'a1000001-0000-0000-0000-000000000002',
    'c1111111-1111-1111-1111-111111111111',
    'air-purifying',
    'Snake Plant',
    'snake-plant',
    'Purifies air & filters toxins',
    'A champion air purifier recommended by NASA clean air studies. Features sculptural, sword-like leaves with architectural golden borders. Releases oxygen even at night, making it ideal for bedrooms.',
    'FF-PLN-002',
    499.00,
    599.00,
    4.9,
    210,
    'Popular',
    TRUE,
    120,
    '{"placement": "Indoor", "water": "Low Water (every 2-3 weeks)", "light": "Low to Bright Indirect", "difficulty": "Indestructible", "airPurifying": true, "petFriendly": false, "size": "Medium-Tall (12-16 inches)"}'::jsonb,
    '{"watering": "Allow soil to completely dry out between waterings. Less is always more.", "sunlight": "Adapts to dim corners or sunny window sills effortlessly.", "repotting": "Rarely needs repotting; happy even when slightly root-bound.", "proTip": "Keep away from cold drafty air conditioners in summer."}'::jsonb
),
(
    'a1000001-0000-0000-0000-000000000003',
    'c1111111-1111-1111-1111-111111111111',
    'flowering',
    'Peace Lily',
    'peace-lily',
    'Serene white blooms & natural humidity',
    'Stunning deep emerald foliage crowned with elegant ivory spathes. Highly effective at breaking down airborne household toxins like formaldehyde and carbon monoxide.',
    'FF-PLN-003',
    749.00,
    899.00,
    4.7,
    88,
    'Featured',
    TRUE,
    45,
    '{"placement": "Indoor", "water": "Medium Water (2-3 times/week)", "light": "Low to Medium Indirect", "difficulty": "Moderate", "airPurifying": true, "petFriendly": false, "size": "Medium (10-14 inches)"}'::jsonb,
    '{"watering": "Keep potting mix consistently moist but never soggy.", "sunlight": "Thrives best in low-to-medium filtered light. Direct sun scorches the blooms.", "repotting": "Repot every spring with peat-rich organic soil.", "proTip": "The leaves visibly droop when thirsty — water immediately and it bounces back in hours."}'::jsonb
),
(
    'a1000001-0000-0000-0000-000000000004',
    'c1111111-1111-1111-1111-111111111111',
    'large',
    'Areca Palm',
    'areca-palm',
    'Tropical flair & natural humidifier',
    'Graceful arching frills that instantly transform living rooms into tranquil botanical retreats. Excellent natural humidifier that gently increases moisture in air-conditioned environments.',
    'FF-PLN-004',
    699.00,
    849.00,
    4.6,
    95,
    NULL,
    TRUE,
    60,
    '{"placement": "Indoor / Balcony", "water": "Medium Water (twice a week)", "light": "Bright Indirect Sun", "difficulty": "Easy", "airPurifying": true, "petFriendly": true, "size": "Tall (24-36 inches)"}'::jsonb,
    '{"watering": "Water evenly when top layer begins drying. Use filtered or rested water.", "sunlight": "Bright filtered room light. Avoid harsh mid-day scorching sun.", "repotting": "Repot every 2-3 years into a heavy, broad base planter.", "proTip": "Mist fronds twice a week during dry winter spells."}'::jsonb
),
(
    'a1000001-0000-0000-0000-000000000005',
    'c1111111-1111-1111-1111-111111111111',
    'low-light',
    'ZZ Plant',
    'zz-plant',
    'Glossy leaves that thrive in neglect',
    'Celebrated for waxy, feather-like stems of deep obsidian-green. Features subterranean rhizomes that store water, allowing it to survive weeks of missed waterings.',
    'FF-PLN-005',
    599.00,
    699.00,
    4.9,
    167,
    'Low Light',
    TRUE,
    75,
    '{"placement": "Indoor", "water": "Low Water (every 2-3 weeks)", "light": "Low to Bright Indirect", "difficulty": "Zero Maintenance", "airPurifying": true, "petFriendly": false, "size": "Medium (12-16 inches)"}'::jsonb,
    '{"watering": "Allow substrate to dry completely down to bottom before watering.", "sunlight": "One of the absolute best plants for windowless offices and shaded rooms.", "repotting": "Repot only when rhizomes visibly press against pot edges.", "proTip": "Do not use artificial leaf shine sprays; dusting with a soft cloth keeps it glowing."}'::jsonb
),
(
    'a1000001-0000-0000-0000-000000000006',
    'c1111111-1111-1111-1111-111111111111',
    'easy-care',
    'Jade Plant',
    'jade-plant',
    'Symbol of prosperity & timeless resilience',
    'Thick fleshy miniature tree-like stems bearing rich jade-green succulent leaves. Traditionally placed near entrances and workstations to attract favorable fortune and harmony.',
    'FF-PLN-006',
    499.00,
    599.00,
    4.7,
    112,
    NULL,
    TRUE,
    90,
    '{"placement": "Indoor Sunny / Desk", "water": "Low Water (once in 10-14 days)", "light": "Bright Sun / Partial Direct", "difficulty": "Easy", "airPurifying": false, "petFriendly": false, "size": "Compact (6-10 inches)"}'::jsonb,
    '{"watering": "Drench thoroughly then allow soil to turn dry. Never let roots sit in water.", "sunlight": "Loves at least 3-4 hours of bright daily morning sunlight.", "repotting": "Use porous succulent/cactus soil mix with high pumice or perlite.", "proTip": "Prune branch tips in spring to encourage lush, dense bonsai-like branching."}'::jsonb
),
(
    'a1000001-0000-0000-0000-000000000007',
    'c1111111-1111-1111-1111-111111111111',
    'flowering',
    'Lavender',
    'lavender',
    'Soothing botanical fragrance & violet blooms',
    'Beloved aromatic herb renowned for silvery-green needle foliage and soothing purple flower spikes. Fills sunny balconies and patios with natural calming fragrance.',
    'FF-PLN-007',
    399.00,
    499.00,
    4.5,
    76,
    'Fragrant',
    TRUE,
    50,
    '{"placement": "Balcony / Outdoor", "water": "Low to Moderate Water", "light": "Full Direct Sun", "difficulty": "Moderate", "airPurifying": false, "petFriendly": true, "size": "Compact (8-12 inches)"}'::jsonb,
    '{"watering": "Water at base when top 2 inches dry out. Keep foliage dry.", "sunlight": "Requires 5+ hours of uninterrupted direct outdoor sunlight daily.", "repotting": "Use very gritty, alkaline, free-draining potting soil.", "proTip": "Deadhead spent flower stalks to stimulate continuous fresh blooms."}'::jsonb
),
(
    'a1000001-0000-0000-0000-000000000008',
    'c1111111-1111-1111-1111-111111111111',
    'large',
    'Ficus Elastica',
    'ficus-elastica',
    'Architectural burgundy statement tree',
    'Bold ornamental tree featuring broad, glossy, burgundy-tinted leaves that unfurl from crimson sheaths. Makes an impressive architectural centerpiece for modern living spaces.',
    'FF-PLN-008',
    799.00,
    949.00,
    4.8,
    103,
    'Statement',
    TRUE,
    40,
    '{"placement": "Indoor Bright", "water": "Moderate Water (once a week)", "light": "Bright Indirect Sun", "difficulty": "Easy to Moderate", "airPurifying": true, "petFriendly": false, "size": "Tall (18-28 inches)"}'::jsonb,
    '{"watering": "Water only when top half of pot is dry. Yellow lower leaves indicate overwatering.", "sunlight": "Bright diffused light preserves rich deep burgundy pigmentation.", "repotting": "Repot every 2 years in spring into well-drained loam.", "proTip": "Rotate pot 90 degrees every week so stems grow straight upward."}'::jsonb
),
(
    'a1000001-0000-0000-0000-000000000009',
    'c1111111-1111-1111-1111-111111111111',
    'indoor',
    'Monstera Deliciosa',
    'monstera-deliciosa',
    'The iconic split-leaf Swiss Cheese plant',
    'The crowning jewel of interior plant styling. Boasts dramatic perforated foliage that develops deeper natural fenestrations as it matures. An undeniable tropical centerpiece.',
    'FF-PLN-009',
    999.00,
    1199.00,
    4.9,
    240,
    'Bestseller',
    TRUE,
    65,
    '{"placement": "Indoor Bright", "water": "Moderate Water (once every 7-10 days)", "light": "Bright Indirect Sun", "difficulty": "Easy", "airPurifying": true, "petFriendly": false, "size": "Large (18-24 inches)"}'::jsonb,
    '{"watering": "Soak thoroughly when top 2-3 inches feel dry, letting excess drain completely.", "sunlight": "Bright filtered light; direct hot afternoon sun can burn delicate leaf tissue.", "repotting": "Provide a sturdy moss pole support when stems begin vining.", "proTip": "Tuck aerial roots into soil or around the moss pole to help larger leaves develop."}'::jsonb
),
(
    'a1000001-0000-0000-0000-000000000010',
    'c1111111-1111-1111-1111-111111111111',
    'easy-care',
    'Aloe Vera',
    'aloe-vera',
    'Therapeutic gel & hardy desert resilience',
    'Plump, serrated succulent leaves packed with nutrient-rich soothing gel known for burns, skincare, and natural wellness. Requires minimal care and effortlessly endures sunny sills.',
    'FF-PLN-010',
    299.00,
    399.00,
    4.7,
    145,
    NULL,
    TRUE,
    110,
    '{"placement": "Sunny Sills / Balcony", "water": "Low Water (every 2-3 weeks)", "light": "Direct to Bright Indirect", "difficulty": "Indestructible", "airPurifying": true, "petFriendly": false, "size": "Compact (8-12 inches)"}'::jsonb,
    '{"watering": "Water sparingly; allow root zone to thoroughly dry between soakings.", "sunlight": "Requires 4-6 hours of bright natural daylight.", "repotting": "Use shallow terracotta pots that promote rapid substrate evaporation.", "proTip": "Harvest outer mature leaves by cutting close to base with a clean knife."}'::jsonb
),
(
    'a1000001-0000-0000-0000-000000000011',
    'c1111111-1111-1111-1111-111111111111',
    'indoor',
    'Rubber Plant',
    'rubber-plant',
    'Lustrous evergreen foliage with striking style',
    'A classic variety celebrated for thick leathery oval leaves with a refined satin sheen. Compact, upright, and adapts smoothly to indoor apartment living.',
    'FF-PLN-011',
    699.00,
    799.00,
    4.8,
    89,
    'Classic',
    TRUE,
    55,
    '{"placement": "Indoor Living / Office", "water": "Low to Moderate Water", "light": "Medium to Bright Indirect", "difficulty": "Easy", "airPurifying": true, "petFriendly": false, "size": "Medium-Tall (14-20 inches)"}'::jsonb,
    '{"watering": "Allow top 50% of soil to dry out before giving a moderate drink.", "sunlight": "Prefers consistent indirect light away from harsh direct sunbeams.", "repotting": "Repot in early spring when roots circle bottom drainage holes.", "proTip": "Regular dusting keeps the deep green leaf sheen radiant."}'::jsonb
)
ON CONFLICT (slug) DO NOTHING;

-- -----------------------------------------------------------------------------
-- 4. SEED 10 POTS
-- -----------------------------------------------------------------------------
INSERT INTO products (id, category_id, sub_category, name, slug, tagline, description, sku, base_price, original_price, rating, review_count, badge, in_stock, stock_quantity, metadata, care_guide)
VALUES
(
    'a2000001-0000-0000-0000-000000000001',
    'c2222222-2222-2222-2222-222222222222',
    'ceramic',
    'Ceramic Ripple Pot',
    'ceramic-ripple-pot',
    'Textured fluted ceramic with artisan matte glaze',
    'Hand-finished high-fired stoneware planter featuring organic horizontal ripples. Complete with silicone-plugged drainage hole and matching underplate for clean indoor tabletop use.',
    'FF-POT-001',
    499.00,
    599.00,
    4.9,
    115,
    'Bestseller',
    TRUE,
    70,
    '{"material": "High-fired Stoneware Ceramic", "size": "7.5 inch diameter x 7 inch height", "drainage": "Includes drainage hole + removable silicone plug", "finish": "Matte Off-White Ripple Glaze", "colors": ["Warm Cream", "Forest Sage"]}'::jsonb,
    '{"watering": "Allow soil to drain through drainage hole; remove plug during watering.", "sunlight": "Weatherproof for both indoor styling and sheltered balcony use.", "repotting": "Ideal for 6-inch nursery grow pots.", "proTip": "Clean outer ceramic surface with mild soapy water and a soft microfiber towel."}'::jsonb
),
(
    'a2000001-0000-0000-0000-000000000002',
    'c2222222-2222-2222-2222-222222222222',
    'terracotta',
    'Terracotta Pot',
    'terracotta-pot',
    'Breathable natural baked terracotta clay',
    'Authentic porous terracotta fired from natural clay minerals. Allows air and moisture to penetrate walls, naturally preventing root rot for succulents and moisture-sensitive plants.',
    'FF-POT-002',
    299.00,
    399.00,
    4.8,
    140,
    'Essential',
    TRUE,
    150,
    '{"material": "Natural Kiln-Fired Terracotta", "size": "8 inch diameter x 7.5 inch height", "drainage": "Generous center drainage hole included", "finish": "Raw Earthy Terracotta", "colors": ["Natural Earth"]}'::jsonb,
    '{"watering": "Substrate dries faster in clay; monitor moisture weekly.", "sunlight": "UV-resistant and safe for outdoor sun exposure.", "repotting": "Soak new pot in water for 30 minutes before first potting.", "proTip": "Natural mineral patina develops over time, lending authentic antique charm."}'::jsonb
),
(
    'a2000001-0000-0000-0000-000000000003',
    'c2222222-2222-2222-2222-222222222222',
    'self-watering',
    'Self-Watering Pot',
    'self-watering-pot',
    'Wick-based sub-irrigation reservoir planter',
    'Smart dual-chamber planter with capillary cotton wick and water-level float indicator. Keeps roots hydrated consistently for up to 14 days — ideal for travelers and busy plant parents.',
    'FF-POT-003',
    699.00,
    799.00,
    4.7,
    89,
    'Smart Pot',
    TRUE,
    50,
    '{"material": "BPA-Free UV-Stabilized Polymer", "size": "8.5 inch diameter x 8 inch height", "drainage": "Sub-irrigation reservoir with overflow spout", "finish": "Satin Forest Green", "colors": ["Forest Green", "Nordic White"]}'::jsonb,
    '{"watering": "Fill water reservoir until visual gauge reaches max line.", "sunlight": "Suitable for desks, living rooms, and indoor shelves.", "repotting": "Thread cotton wick into bottom soil before filling with potting mix.", "proTip": "Check float gauge every 10-14 days and top up clean water."}'::jsonb
),
(
    'a2000001-0000-0000-0000-000000000004',
    'c2222222-2222-2222-2222-222222222222',
    'hanging',
    'Hanging Planter',
    'hanging-planter',
    'Handwoven jute rope with textured ceramic bowl',
    'Elevate trailing pothos, ivy, and philodendrons. Features a glazed ceramic bowl suspended by heavy-duty triple braided natural jute rope with solid brass hanging loop.',
    'FF-POT-004',
    399.00,
    499.00,
    4.6,
    62,
    NULL,
    TRUE,
    45,
    '{"material": "Ceramic Pot + 100% Natural Jute Rope", "size": "6.5 inch diameter x 5 inch bowl, 30 inch total hang length", "drainage": "Internal sealed cachepot design (no drip)", "finish": "Matte Speckled Cream", "colors": ["Speckled Cream"]}'::jsonb,
    '{"watering": "Remove inner grow pot to water in sink, then place back.", "sunlight": "Hang near bright windows away from direct heavy rain.", "repotting": "Fits 5-6 inch standard nursery pots.", "proTip": "Rotate hanging planter weekly to ensure even trailing growth."}'::jsonb
),
(
    'a2000001-0000-0000-0000-000000000005',
    'c2222222-2222-2222-2222-222222222222',
    'ceramic',
    'Marble Pot',
    'marble-pot',
    'Artisan swirl marble-finish ceramic centerpiece',
    'Hand-swirled mineral glaze recreating natural Carrara marble veining. Each individual pot displays a one-of-a-kind organic pattern. Accented with a sleek gold-rim base.',
    'FF-POT-005',
    799.00,
    949.00,
    4.9,
    78,
    'Luxury',
    TRUE,
    35,
    '{"material": "Glazed Dense Ceramic", "size": "8 inch diameter x 8 inch height", "drainage": "Drainage hole with matching marble saucer", "finish": "Glossy Carrara Marble Pattern", "colors": ["Carrara White", "Black Gold"]}'::jsonb,
    '{"watering": "Drainage saucer catches excess water; empty after 20 minutes.", "sunlight": "High-end indoor tabletop and console styling.", "repotting": "Line base with a small mesh screen over drainage hole.", "proTip": "Pair with deep green foliage like ZZ Plant or Rubber Tree for contrast."}'::jsonb
),
(
    'a2000001-0000-0000-0000-000000000006',
    'c2222222-2222-2222-2222-222222222222',
    'metal',
    'Metal Pot',
    'metal-pot',
    'Spun brass metal planter on architectural tripod stand',
    'Mid-century modern spun galvanized iron pot treated with a protective antique brass electroplate finish. Elevates plants off the ground for optimal air circulation.',
    'FF-POT-006',
    749.00,
    899.00,
    4.8,
    54,
    'Modern',
    TRUE,
    40,
    '{"material": "Galvanized Iron with Brass Electroplate", "size": "8 inch pot, 14 inch total height with stand", "drainage": "Designed as a decorative cachepot", "finish": "Brushed Antique Brass", "colors": ["Brushed Brass", "Matte Black"]}'::jsonb,
    '{"watering": "Use as a cover pot; keep plant inside plastic nursery pot.", "sunlight": "Indoor living room and bedroom accent.", "repotting": "Easily lift pot off stand for watering or cleaning.", "proTip": "Wipe with dry microfiber; avoid harsh acidic chemical cleansers."}'::jsonb
),
(
    'a2000001-0000-0000-0000-000000000007',
    'c2222222-2222-2222-2222-222222222222',
    'ceramic',
    'Ribbed Ceramic Pot',
    'ribbed-ceramic-pot',
    'Blush ribbed ceramic with fluted architectural texture',
    'Sculptural vertical fluting in a gentle warm blush-terracotta hue. Cast from premium ceramic clay with velvety satin finish that catches ambient room light softly.',
    'FF-POT-007',
    549.00,
    649.00,
    4.8,
    92,
    'Popular',
    TRUE,
    80,
    '{"material": "Architectural Ceramic", "size": "7.5 inch diameter x 7 inch height", "drainage": "Pre-drilled drainage hole with silicone plug", "finish": "Satin Fluted Blush Glaze", "colors": ["Blush Terracotta", "Sage Green"]}'::jsonb,
    '{"watering": "Unplug for deep watering; plug for tabletop presentation.", "sunlight": "Indoor living, desk, and shelf placement.", "repotting": "Ideal pairing with Monstera or Ficus foliage.", "proTip": "Slight variations in the fluted ribbing showcase authentic artisan casting."}'::jsonb
),
(
    'a2000001-0000-0000-0000-000000000008',
    'c2222222-2222-2222-2222-222222222222',
    'eco-friendly',
    'Bamboo Pot',
    'bamboo-pot',
    'Sustainable pressed bamboo eco-fiber composite',
    'Crafted from renewable bamboo fiber and agricultural plant starches. Fully biodegradable at end of life while offering 5+ years of durable indoor service.',
    'FF-POT-008',
    449.00,
    549.00,
    4.7,
    67,
    'Eco-Choice',
    TRUE,
    95,
    '{"material": "Organic Bamboo Fiber & Resin Composite", "size": "7 inch diameter x 6.5 inch height", "drainage": "Bottom drainage holes with snap-on tray", "finish": "Matte Earthy Sand Texture", "colors": ["Sand Beige", "Earthy Charcoal"]}'::jsonb,
    '{"watering": "Snap on drip tray to catch seepage after watering.", "sunlight": "Indoor and shaded covered patio use.", "repotting": "Lightweight, easy to move around during repotting.", "proTip": "100% microplastic-free construction supports sustainable gardening."}'::jsonb
),
(
    'a2000001-0000-0000-0000-000000000009',
    'c2222222-2222-2222-2222-222222222222',
    'decorative',
    'Decorative Pot',
    'decorative-pot',
    'Embossed botanical relief motif on warm stoneware',
    'Stately cylindrical pot featuring an embossed botanical leaf relief around the perimeter. Hand-rubbed glaze highlights the raised relief artwork beautifully.',
    'FF-POT-009',
    599.00,
    699.00,
    4.8,
    73,
    NULL,
    TRUE,
    60,
    '{"material": "Heavyweight Stoneware", "size": "8 inch diameter x 7.8 inch height", "drainage": "Includes drainage hole + underplate saucer", "finish": "Hand-rubbed Warm Ivory Glaze", "colors": ["Warm Ivory", "Terracotta Ochre"]}'::jsonb,
    '{"watering": "Allows healthy bottom drainage onto the included underplate.", "sunlight": "Living room, entrance console, or study desk.", "repotting": "Broad opening simplifies repotting large root balls.", "proTip": "Pair with flowering Peace Lily or Lavender for a coordinated botanical look."}'::jsonb
),
(
    'a2000001-0000-0000-0000-000000000010',
    'c2222222-2222-2222-2222-222222222222',
    'ceramic',
    'Minimal White Pot',
    'minimal-white-pot',
    'Scandinavian cylindrical matte white ceramic planter',
    'Clean-lined Nordic minimalism at its purest. Pure matte chalk-white porcelain cylinder that lets vibrant botanical greens command center stage.',
    'FF-POT-010',
    399.00,
    499.00,
    4.9,
    132,
    'Minimalist',
    TRUE,
    110,
    '{"material": "Fine Porcelain Ceramic", "size": "7.5 inch diameter x 7.5 inch height", "drainage": "Drainage hole with silicone stopper", "finish": "Velvet Matte Chalk White", "colors": ["Matte White"]}'::jsonb,
    '{"watering": "Can be utilized as both direct potting vessel or cachepot.", "sunlight": "Matches every contemporary interior palette.", "repotting": "Standard cylindrical shape fits 6-7 inch nursery liners.", "proTip": "Pencil marks or scuffs wipe away instantly with a melamine foam sponge."}'::jsonb
)
ON CONFLICT (slug) DO NOTHING;

-- -----------------------------------------------------------------------------
-- 5. SEED 10 SEEDS
-- -----------------------------------------------------------------------------
INSERT INTO products (id, category_id, sub_category, name, slug, tagline, description, sku, base_price, original_price, rating, review_count, badge, in_stock, stock_quantity, metadata, care_guide)
VALUES
(
    'a3000001-0000-0000-0000-000000000001',
    'c3333333-3333-3333-3333-333333333333',
    'herb',
    'Basil Seeds',
    'basil-seeds',
    'Heirloom Italian Sweet Genovese aromatic basil',
    'Premium non-GMO Italian sweet basil seeds with 90%+ germination rate. Grow sweet, peppery aromatic leaves ideal for fresh pestos, pastas, pizzas, and herbal teas right on your kitchen sill.',
    'FF-SED-001',
    99.00,
    149.00,
    4.8,
    184,
    'Bestseller',
    TRUE,
    250,
    '{"type": "Aromatic Culinary Herb", "seedCount": "100+ seeds per packet", "germination": "5-8 Days", "harvest": "30-40 Days", "difficulty": "Easy for Beginners", "season": "All Year Round"}'::jsonb,
    '{"watering": "Keep seedbed consistently moist with a fine spray mister until sprouted.", "sunlight": "Loves 4-6 hours of bright sunny windowsill exposure.", "repotting": "Thin seedlings to 6 inches apart once second set of true leaves appear.", "proTip": "Pinch off flowering top spikes to encourage bushy continuous leaf production."}'::jsonb
),
(
    'a3000001-0000-0000-0000-000000000002',
    'c3333333-3333-3333-3333-333333333333',
    'vegetable',
    'Tomato Seeds',
    'tomato-seeds',
    'Sweet juicy high-yield red cherry tomatoes',
    'Prolific indeterminate cherry tomato variety adapted for pot and container gardening. Produces abundant clusters of sweet, candy-like bite-sized fruits all through the harvesting season.',
    'FF-SED-002',
    79.00,
    119.00,
    4.7,
    128,
    'High Yield',
    TRUE,
    200,
    '{"type": "Container Vegetable", "seedCount": "50+ seeds per packet", "germination": "6-10 Days", "harvest": "60-70 Days", "difficulty": "Easy to Moderate", "season": "Spring / Monsoon"}'::jsonb,
    '{"watering": "Water deeply at base; irregular watering causes fruit skin cracking.", "sunlight": "Requires 6+ hours of warm direct outdoor sunshine daily.", "repotting": "Transplant single seedling into an 8-10 inch pot with a tomato stake.", "proTip": "Prune lower suckers between stem forks to channel energy into plump fruits."}'::jsonb
),
(
    'a3000001-0000-0000-0000-000000000003',
    'c3333333-3333-3333-3333-333333333333',
    'flower',
    'Sunflower Seeds',
    'sunflower-seeds',
    'Dwarf sunny yellow golden ornamental sunflowers',
    'Compact dwarf sunflower variety bred especially for balcony pots, patio planters, and terrace gardens. Bright golden disc petals surrounding deep honey pollen centers that attract butterflies.',
    'FF-SED-003',
    89.00,
    129.00,
    4.9,
    95,
    'Popular',
    TRUE,
    180,
    '{"type": "Flowering Annual", "seedCount": "30+ seeds per packet", "germination": "7-10 Days", "harvest": "55-65 Days to Bloom", "difficulty": "Very Easy", "season": "Summer / Autumn"}'::jsonb,
    '{"watering": "Water deeply once seedlings establish; moderately drought tolerant.", "sunlight": "Loves full, blazing outdoor sunshine (6-8 hours).", "repotting": "Direct sow 1-2 seeds per 8-inch pot at 1-inch depth.", "proTip": "Face pots east-to-south so blooms track morning sun effortlessly."}'::jsonb
),
(
    'a3000001-0000-0000-0000-000000000004',
    'c3333333-3333-3333-3333-333333333333',
    'flower',
    'Marigold Seeds',
    'marigold-seeds',
    'Vibrant golden-orange natural garden companion blooms',
    'Double-petal French Marigold seeds producing radiant orange and golden ruffled flowers. Famous natural pest deterrent that repels harmful garden nematodes while brightening containers.',
    'FF-SED-004',
    69.00,
    99.00,
    4.8,
    142,
    'Pest Repeller',
    TRUE,
    220,
    '{"type": "Companion Flower", "seedCount": "80+ seeds per packet", "germination": "4-7 Days", "harvest": "45-50 Days to Bloom", "difficulty": "Super Easy", "season": "Year Round"}'::jsonb,
    '{"watering": "Moderate watering; allow soil surface to dry between waterings.", "sunlight": "Thrives in direct sunlight for brightest flower coloration.", "repotting": "Excellent companion plant when sown alongside tomato or chilli pots.", "proTip": "Pinch off old fading blooms to trigger abundant secondary flushes."}'::jsonb
),
(
    'a3000001-0000-0000-0000-000000000005',
    'c3333333-3333-3333-3333-333333333333',
    'herb',
    'Mint Seeds',
    'mint-seeds',
    'Fast-growing refreshing spearmint for teas & drinks',
    'Invigorating spearmint seeds with exceptional vitality. Yields fragrant serrated leaves packed with menthol essential oils for summer lemonades, chutneys, and garnishes.',
    'FF-SED-005',
    79.00,
    109.00,
    4.6,
    88,
    'Fast Grower',
    TRUE,
    160,
    '{"type": "Refreshing Herb", "seedCount": "100+ seeds per packet", "germination": "7-12 Days", "harvest": "35-45 Days", "difficulty": "Easy", "season": "Spring / Summer"}'::jsonb,
    '{"watering": "Keep soil evenly moist; mint loves continuous hydration.", "sunlight": "Partial shade to morning sun prevents delicate leaf scorch.", "repotting": "Always grow in dedicated containers to prevent roots spreading out.", "proTip": "Harvest outer stems frequently to encourage dense bushy center growth."}'::jsonb
),
(
    'a3000001-0000-0000-0000-000000000006',
    'c3333333-3333-3333-3333-333333333333',
    'vegetable',
    'Lettuce Seeds',
    'lettuce-seeds',
    'Crisp green salad butterhead lettuce',
    'Tender, sweet butterhead salad greens with ruffled emerald leaves. Grow your own organic salad bowls right in shallow balcony troughs with fast turnaround.',
    'FF-SED-006',
    69.00,
    99.00,
    4.7,
    71,
    'Quick Harvest',
    TRUE,
    175,
    '{"type": "Salad Greens", "seedCount": "150+ seeds per packet", "germination": "4-6 Days", "harvest": "25-35 Days", "difficulty": "Easy", "season": "Autumn / Winter / Spring"}'::jsonb,
    '{"watering": "Shallow root system requires light daily moisture spraying.", "sunlight": "Prefers cool weather and gentle morning or filtered light.", "repotting": "Requires only 4-6 inches of soil depth; perfect for wide troughs.", "proTip": "Harvest using cut-and-come-again method taking outer leaves first."}'::jsonb
),
(
    'a3000001-0000-0000-0000-000000000007',
    'c3333333-3333-3333-3333-333333333333',
    'vegetable',
    'Chilli Seeds',
    'chilli-seeds',
    'Fiery Indian green birds-eye spicy hot peppers',
    'High-germination seeds of sharp, piquant Indian green chillies. Prolific branching habit yielding hundreds of spicy peppers per plant across multiple harvests.',
    'FF-SED-007',
    79.00,
    119.00,
    4.8,
    155,
    'Hot & Spicy',
    TRUE,
    210,
    '{"type": "Hot Pepper", "seedCount": "60+ seeds per packet", "germination": "8-14 Days", "harvest": "70-80 Days", "difficulty": "Easy to Moderate", "season": "Warm Season"}'::jsonb,
    '{"watering": "Water only when topsoil dries; slight water stress enhances heat.", "sunlight": "Requires 6+ hours of intense warm sunshine.", "repotting": "Transplant into an 8-inch pot once seedlings reach 4 inches.", "proTip": "Spray with organic neem spray every 2 weeks to repel whiteflies."}'::jsonb
),
(
    'a3000001-0000-0000-0000-000000000008',
    'c3333333-3333-3333-3333-333333333333',
    'herb',
    'Coriander Seeds',
    'coriander-seeds',
    'Split aromatic cilantro seeds with rapid sprouting',
    'Carefully split coriander seed carps promoting 2x faster emergence. Essential kitchen herb with bright citrusy aromatic leaves for everyday Indian culinary curries and chutneys.',
    'FF-SED-008',
    59.00,
    89.00,
    4.6,
    168,
    'Kitchen Essential',
    TRUE,
    300,
    '{"type": "Culinary Herb", "seedCount": "120+ seeds per packet", "germination": "6-10 Days", "harvest": "28-35 Days", "difficulty": "Beginner Friendly", "season": "Year Round"}'::jsonb,
    '{"watering": "Keep top layer moist; avoid waterlogging.", "sunlight": "Direct morning light; filtered afternoon shade prevents premature bolting.", "repotting": "Sow directly into final wide shallow planter pot.", "proTip": "Sow a fresh pinch of seeds every 2 weeks for continuous year-round supply."}'::jsonb
),
(
    'a3000001-0000-0000-0000-000000000009',
    'c3333333-3333-3333-3333-333333333333',
    'vegetable',
    'Carrot Seeds',
    'carrot-seeds',
    'Sweet crunchy baby orange Nantes carrots',
    'Slender, coreless baby Nantes carrot seeds. Sweet, tender, and uniquely adapted for deep pot and raised-bed container cultivation with clean stone-free soil.',
    'FF-SED-009',
    69.00,
    99.00,
    4.5,
    64,
    NULL,
    TRUE,
    140,
    '{"type": "Root Vegetable", "seedCount": "150+ seeds per packet", "germination": "8-12 Days", "harvest": "60-70 Days", "difficulty": "Moderate", "season": "Autumn / Winter"}'::jsonb,
    '{"watering": "Gentle, consistent moisture prevents root splitting.", "sunlight": "Full sun for sweet, crisp root development.", "repotting": "Requires at least 10-12 inches of loose, stone-free deep potting mix.", "proTip": "Thin seedlings early to 2-3 inches apart so roots have room to expand."}'::jsonb
),
(
    'a3000001-0000-0000-0000-000000000010',
    'c3333333-3333-3333-3333-333333333333',
    'flower',
    'Wildflower Seeds',
    'wildflower-seeds',
    'Biodiverse native nectar-rich butterfly mix',
    'Curated blend of 12 native flowering annuals and perennials including cosmo, zinnia, and cornflower. Transforms bare balcony corners into vibrant, pollinator-friendly havens.',
    'FF-SED-010',
    99.00,
    149.00,
    4.9,
    119,
    'Pollinator Friendly',
    TRUE,
    190,
    '{"type": "Flowering Blend", "seedCount": "200+ seeds per packet", "germination": "5-10 Days", "harvest": "45-60 Days to Bloom", "difficulty": "Zero Maintenance", "season": "Spring / Monsoon"}'::jsonb,
    '{"watering": "Mist lightly after scattering; water moderately once established.", "sunlight": "Bright sunny balcony or terrace spot.", "repotting": "Scatter evenly over surface and press lightly into soil.", "proTip": "Produces a dynamic multi-colored succession of blooms lasting for months."}'::jsonb
)
ON CONFLICT (slug) DO NOTHING;

-- -----------------------------------------------------------------------------
-- 6. SEED PRODUCT MULTI-ANGLE & GALLERY IMAGES
-- -----------------------------------------------------------------------------
-- Money Plant (4 studio angles)
INSERT INTO product_images (product_id, media_url, media_type, sort_order, alt_text) VALUES
('a1000001-0000-0000-0000-000000000001', '/assets/products/plants/money-plant-1.jpg', 'PRIMARY', 0, 'Money Plant front studio photo'),
('a1000001-0000-0000-0000-000000000001', '/assets/products/plants/money-plant-2.jpg', 'ANGLE_360', 1, 'Money Plant right angle photo'),
('a1000001-0000-0000-0000-000000000001', '/assets/products/plants/money-plant-3.jpg', 'ANGLE_360', 2, 'Money Plant back angle photo'),
('a1000001-0000-0000-0000-000000000001', '/assets/products/plants/money-plant-4.jpg', 'ANGLE_360', 3, 'Money Plant left angle photo');

-- Snake Plant (4 studio angles)
INSERT INTO product_images (product_id, media_url, media_type, sort_order, alt_text) VALUES
('a1000001-0000-0000-0000-000000000002', '/assets/products/plants/snake-plant-1.jpg', 'PRIMARY', 0, 'Snake Plant front studio photo'),
('a1000001-0000-0000-0000-000000000002', '/assets/products/plants/snake-plant-2.jpg', 'ANGLE_360', 1, 'Snake Plant right angle photo'),
('a1000001-0000-0000-0000-000000000002', '/assets/products/plants/snake-plant-3.jpg', 'ANGLE_360', 2, 'Snake Plant back angle photo'),
('a1000001-0000-0000-0000-000000000002', '/assets/products/plants/snake-plant-4.jpg', 'ANGLE_360', 3, 'Snake Plant left angle photo');

-- Peace Lily (4 studio angles)
INSERT INTO product_images (product_id, media_url, media_type, sort_order, alt_text) VALUES
('a1000001-0000-0000-0000-000000000003', '/assets/products/plants/peace-lily-1.jpg', 'PRIMARY', 0, 'Peace Lily front studio photo'),
('a1000001-0000-0000-0000-000000000003', '/assets/products/plants/peace-lily-2.jpg', 'ANGLE_360', 1, 'Peace Lily right angle photo'),
('a1000001-0000-0000-0000-000000000003', '/assets/products/plants/peace-lily-3.jpg', 'ANGLE_360', 2, 'Peace Lily back angle photo'),
('a1000001-0000-0000-0000-000000000003', '/assets/products/plants/peace-lily-4.jpg', 'ANGLE_360', 3, 'Peace Lily left angle photo');

-- Areca Palm (4 studio angles)
INSERT INTO product_images (product_id, media_url, media_type, sort_order, alt_text) VALUES
('a1000001-0000-0000-0000-000000000004', '/assets/products/plants/areca-palm-1.jpg', 'PRIMARY', 0, 'Areca Palm front studio photo'),
('a1000001-0000-0000-0000-000000000004', '/assets/products/plants/areca-palm-2.jpg', 'ANGLE_360', 1, 'Areca Palm right angle photo'),
('a1000001-0000-0000-0000-000000000004', '/assets/products/plants/areca-palm-3.jpg', 'ANGLE_360', 2, 'Areca Palm back angle photo'),
('a1000001-0000-0000-0000-000000000004', '/assets/products/plants/areca-palm-4.jpg', 'ANGLE_360', 3, 'Areca Palm left angle photo');

-- ZZ Plant (4 studio angles)
INSERT INTO product_images (product_id, media_url, media_type, sort_order, alt_text) VALUES
('a1000001-0000-0000-0000-000000000005', '/assets/products/plants/zz-plant-1.jpg', 'PRIMARY', 0, 'ZZ Plant front studio photo'),
('a1000001-0000-0000-0000-000000000005', '/assets/products/plants/zz-plant-2.jpg', 'ANGLE_360', 1, 'ZZ Plant right angle photo'),
('a1000001-0000-0000-0000-000000000005', '/assets/products/plants/zz-plant-3.jpg', 'ANGLE_360', 2, 'ZZ Plant back angle photo'),
('a1000001-0000-0000-0000-000000000005', '/assets/products/plants/zz-plant-4.jpg', 'ANGLE_360', 3, 'ZZ Plant left angle photo');

-- Jade Plant (4 studio angles)
INSERT INTO product_images (product_id, media_url, media_type, sort_order, alt_text) VALUES
('a1000001-0000-0000-0000-000000000006', '/assets/products/plants/jade-plant-1.jpg', 'PRIMARY', 0, 'Jade Plant front studio photo'),
('a1000001-0000-0000-0000-000000000006', '/assets/products/plants/jade-plant-2.jpg', 'ANGLE_360', 1, 'Jade Plant right angle photo'),
('a1000001-0000-0000-0000-000000000006', '/assets/products/plants/jade-plant-3.jpg', 'ANGLE_360', 2, 'Jade Plant back angle photo'),
('a1000001-0000-0000-0000-000000000006', '/assets/products/plants/jade-plant-4.jpg', 'ANGLE_360', 3, 'Jade Plant left angle photo');

-- Lavender (4 studio angles)
INSERT INTO product_images (product_id, media_url, media_type, sort_order, alt_text) VALUES
('a1000001-0000-0000-0000-000000000007', '/assets/products/plants/lavender-1.jpg', 'PRIMARY', 0, 'Lavender front studio photo'),
('a1000001-0000-0000-0000-000000000007', '/assets/products/plants/lavender-2.jpg', 'ANGLE_360', 1, 'Lavender right angle photo'),
('a1000001-0000-0000-0000-000000000007', '/assets/products/plants/lavender-3.jpg', 'ANGLE_360', 2, 'Lavender back angle photo'),
('a1000001-0000-0000-0000-000000000007', '/assets/products/plants/lavender-4.jpg', 'ANGLE_360', 3, 'Lavender left angle photo');

-- Ficus Elastica (4 studio angles)
INSERT INTO product_images (product_id, media_url, media_type, sort_order, alt_text) VALUES
('a1000001-0000-0000-0000-000000000008', '/assets/products/plants/ficus-elastica-1.jpg', 'PRIMARY', 0, 'Ficus Elastica front studio photo'),
('a1000001-0000-0000-0000-000000000008', '/assets/products/plants/ficus-elastica-2.jpg', 'ANGLE_360', 1, 'Ficus Elastica right angle photo'),
('a1000001-0000-0000-0000-000000000008', '/assets/products/plants/ficus-elastica-3.jpg', 'ANGLE_360', 2, 'Ficus Elastica back angle photo'),
('a1000001-0000-0000-0000-000000000008', '/assets/products/plants/ficus-elastica-4.jpg', 'ANGLE_360', 3, 'Ficus Elastica left angle photo');

-- Monstera Deliciosa (4 studio angles)
INSERT INTO product_images (product_id, media_url, media_type, sort_order, alt_text) VALUES
('a1000001-0000-0000-0000-000000000009', '/assets/products/plants/monstera-deliciosa.jpg', 'PRIMARY', 0, 'Monstera Deliciosa front studio photo'),
('a1000001-0000-0000-0000-000000000009', '/assets/products/plants/monstera-deliciosa-2.jpg', 'ANGLE_360', 1, 'Monstera Deliciosa angle 2'),
('a1000001-0000-0000-0000-000000000009', '/assets/products/plants/monstera-deliciosa-3.jpg', 'ANGLE_360', 2, 'Monstera Deliciosa angle 3'),
('a1000001-0000-0000-0000-000000000009', '/assets/products/plants/monstera-deliciosa-4.jpg', 'ANGLE_360', 3, 'Monstera Deliciosa angle 4');

-- Aloe Vera (4 studio angles)
INSERT INTO product_images (product_id, media_url, media_type, sort_order, alt_text) VALUES
('a1000001-0000-0000-0000-000000000010', '/assets/products/plants/aloe-vera-1.jpg', 'PRIMARY', 0, 'Aloe Vera front studio photo'),
('a1000001-0000-0000-0000-000000000010', '/assets/products/plants/aloe-vera-2.jpg', 'ANGLE_360', 1, 'Aloe Vera right angle photo'),
('a1000001-0000-0000-0000-000000000010', '/assets/products/plants/aloe-vera-3.jpg', 'ANGLE_360', 2, 'Aloe Vera back angle photo'),
('a1000001-0000-0000-0000-000000000010', '/assets/products/plants/aloe-vera-4.jpg', 'ANGLE_360', 3, 'Aloe Vera left angle photo');

-- Rubber Plant (4 studio angles)
INSERT INTO product_images (product_id, media_url, media_type, sort_order, alt_text) VALUES
('a1000001-0000-0000-0000-000000000011', '/assets/products/plants/rubber-plant-1.jpg', 'PRIMARY', 0, 'Rubber Plant front studio photo'),
('a1000001-0000-0000-0000-000000000011', '/assets/products/plants/rubber-plant-2.jpg', 'ANGLE_360', 1, 'Rubber Plant right angle photo'),
('a1000001-0000-0000-0000-000000000011', '/assets/products/plants/rubber-plant-3.jpg', 'ANGLE_360', 2, 'Rubber Plant back angle photo'),
('a1000001-0000-0000-0000-000000000011', '/assets/products/plants/rubber-plant-4.jpg', 'ANGLE_360', 3, 'Rubber Plant left angle photo');

-- 10 Pots (Primary HD studio images)
INSERT INTO product_images (product_id, media_url, media_type, sort_order, alt_text) VALUES
('a2000001-0000-0000-0000-000000000001', '/assets/products/pots/ceramic-ripple-pot.jpg', 'PRIMARY', 0, 'Ceramic Ripple Pot'),
('a2000001-0000-0000-0000-000000000002', '/assets/products/pots/terracotta-pot.jpg', 'PRIMARY', 0, 'Terracotta Pot'),
('a2000001-0000-0000-0000-000000000003', '/assets/products/pots/self-watering-pot.jpg', 'PRIMARY', 0, 'Self-Watering Pot'),
('a2000001-0000-0000-0000-000000000004', '/assets/products/pots/hanging-planter.jpg', 'PRIMARY', 0, 'Hanging Planter'),
('a2000001-0000-0000-0000-000000000005', '/assets/products/pots/marble-pot.jpg', 'PRIMARY', 0, 'Marble Pot'),
('a2000001-0000-0000-0000-000000000006', '/assets/products/pots/metal-pot.jpg', 'PRIMARY', 0, 'Metal Pot'),
('a2000001-0000-0000-0000-000000000007', '/assets/products/pots/ribbed-ceramic-pot.jpg', 'PRIMARY', 0, 'Ribbed Ceramic Pot'),
('a2000001-0000-0000-0000-000000000008', '/assets/products/pots/bamboo-pot.jpg', 'PRIMARY', 0, 'Bamboo Pot'),
('a2000001-0000-0000-0000-000000000009', '/assets/products/pots/decorative-pot.jpg', 'PRIMARY', 0, 'Decorative Pot'),
('a2000001-0000-0000-0000-000000000010', '/assets/products/pots/minimal-white-pot.jpg', 'PRIMARY', 0, 'Minimal White Pot');

-- 10 Seeds (Primary HD studio images)
INSERT INTO product_images (product_id, media_url, media_type, sort_order, alt_text) VALUES
('a3000001-0000-0000-0000-000000000001', '/assets/products/seeds/basil-seeds.jpg', 'PRIMARY', 0, 'Basil Seeds'),
('a3000001-0000-0000-0000-000000000002', '/assets/products/seeds/tomato-seeds.jpg', 'PRIMARY', 0, 'Tomato Seeds'),
('a3000001-0000-0000-0000-000000000003', '/assets/products/seeds/sunflower-seeds.jpg', 'PRIMARY', 0, 'Sunflower Seeds'),
('a3000001-0000-0000-0000-000000000004', '/assets/products/seeds/marigold-seeds.jpg', 'PRIMARY', 0, 'Marigold Seeds'),
('a3000001-0000-0000-0000-000000000005', '/assets/products/seeds/mint-seeds.jpg', 'PRIMARY', 0, 'Mint Seeds'),
('a3000001-0000-0000-0000-000000000006', '/assets/products/seeds/lettuce-seeds.jpg', 'PRIMARY', 0, 'Lettuce Seeds'),
('a3000001-0000-0000-0000-000000000007', '/assets/products/seeds/chilli-seeds.jpg', 'PRIMARY', 0, 'Chilli Seeds'),
('a3000001-0000-0000-0000-000000000008', '/assets/products/seeds/coriander-seeds.jpg', 'PRIMARY', 0, 'Coriander Seeds'),
('a3000001-0000-0000-0000-000000000009', '/assets/products/seeds/carrot-seeds.jpg', 'PRIMARY', 0, 'Carrot Seeds'),
('a3000001-0000-0000-0000-000000000010', '/assets/products/seeds/wildflower-seeds.jpg', 'PRIMARY', 0, 'Wildflower Seeds');

-- -----------------------------------------------------------------------------
-- 7. SEED COUPONS
-- -----------------------------------------------------------------------------
INSERT INTO coupons (code, discount_type, discount_value, min_cart_value, max_discount, usage_limit, is_active)
VALUES
    ('FLORA10', 'PERCENTAGE', 10.00, 0.00, 500.00, 1000, TRUE),
    ('NATURE20', 'PERCENTAGE', 20.00, 1000.00, 1000.00, 500, TRUE),
    ('WELCOME50', 'FIXED_AMOUNT', 50.00, 499.00, 50.00, 2000, TRUE)
ON CONFLICT (code) DO NOTHING;

-- -----------------------------------------------------------------------------
-- 8. SEED CMS BANNERS & HOMEPAGE PROMOTIONS
-- -----------------------------------------------------------------------------
INSERT INTO cms_banners (slot_key, title, subtitle, eyebrow, cta_text, cta_link, image_url, is_active, display_order)
VALUES
    ('home_hero', 'Bring Nature Home', 'Discover a wide range of healthy plants, beautiful pots and quality seeds — all in one place.', '🍃 GREEN SPACES. HAPPIER PLACES.', 'Shop Now →', '/plants', '/assets/hero/hero_plants.png', TRUE, 1),
    ('promo_plants', 'Indoor & Air Purifying Plants', 'Curated botanical species for living rooms and workspaces.', 'LIVING SPACES', 'Explore Plants →', '/plants', '/assets/banners/promo_plants.png', TRUE, 2),
    ('promo_pots', 'Artisan Planters & Pots', 'High-fired ceramic and porous terracotta pots.', 'HANDCRAFTED', 'Browse Pots →', '/pots', '/assets/banners/promo_pots.png', TRUE, 3),
    ('promo_seeds', 'Organic Non-GMO Seeds', 'Fast-germinating herbs, vegetables, and native wildflowers.', 'GROW YOUR OWN', 'Discover Seeds →', '/seeds', '/assets/banners/promo_seeds.png', TRUE, 4)
ON CONFLICT (slot_key) DO NOTHING;

-- -----------------------------------------------------------------------------
-- 9. SEED PLANT CARE ARTICLES
-- -----------------------------------------------------------------------------
INSERT INTO cms_pages (slug, title, category, author, reading_time, cover_image, excerpt, content_markdown, is_published)
VALUES
(
    'watering-guide',
    'The Complete Guide to Houseplant Watering',
    'Watering',
    'Aarav Sharma (Botanist)',
    '5 min read',
    '/assets/hero/hero_lush.jpg',
    'Learn how to water plants properly and avoid the number one plant killer: overwatering.',
    '# The Complete Guide to Houseplant Watering

Overwatering kills far more indoor plants than neglect. Most plants need their soil to dry out between waterings.

## The Moisture Test
Insert your finger 2 inches into the soil. If it feels completely dry, it is time to water.

## Drainage is Essential
Always use pots with functional drainage holes to allow excess water to escape freely.',
    TRUE
),
(
    'sunlight-essentials',
    'Understanding Indoor Sunlight & Lighting',
    'Lighting',
    'Pooja Nair (Horticulturist)',
    '4 min read',
    '/assets/hero/hero_plants.png',
    'Demystify direct sun, bright indirect light, and low-light conditions for indoor spaces.',
    '# Understanding Indoor Sunlight & Lighting

Light is your plant''s primary food source. Matching your space''s natural light to the right species is key to a thriving green space.

## Bright Indirect Light
Position plants 3 to 5 feet away from a south or east-facing window.',
    TRUE
)
ON CONFLICT (slug) DO NOTHING;
