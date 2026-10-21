-- =============================================================================
-- Flora Fusion — Flyway Migration V5
-- Promotional Email Campaigns, Marketing Consent & Idempotent Recipient Logs
-- =============================================================================

-- 1. Extend users table with marketing consent, unsubscribe timestamp and unguessable token
ALTER TABLE users ADD COLUMN IF NOT EXISTS marketing_consent BOOLEAN NOT NULL DEFAULT FALSE;
ALTER TABLE users ADD COLUMN IF NOT EXISTS unsubscribed_at TIMESTAMP WITH TIME ZONE DEFAULT NULL;
ALTER TABLE users ADD COLUMN IF NOT EXISTS unsubscribe_token VARCHAR(64) UNIQUE;

-- 2. Populate cryptographically secure, unguessable random tokens for existing users who do not have one yet
-- Uses pgcrypto's CSPRNG (32 bytes = 256 bits entropy) with zero derivation from user email, ID or fixed salts
UPDATE users 
SET unsubscribe_token = encode(gen_random_bytes(32), 'hex')
WHERE unsubscribe_token IS NULL;

-- 3. Create email_campaigns table
CREATE TABLE IF NOT EXISTS email_campaigns (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title VARCHAR(150) NOT NULL,
    subject VARCHAR(200) NOT NULL,
    promotional_message TEXT NOT NULL,
    coupon_id UUID REFERENCES coupons(id) ON DELETE SET NULL,
    target_category VARCHAR(50) NOT NULL DEFAULT 'all',
    target_product_ids TEXT DEFAULT NULL,
    status VARCHAR(30) NOT NULL DEFAULT 'DRAFT' 
        CHECK (status IN ('DRAFT', 'APPROVED', 'PROCESSING', 'SENT', 'PARTIALLY_FAILED', 'FAILED', 'CANCELLED')),
    start_date TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL,
    end_date TIMESTAMP WITH TIME ZONE,
    total_recipients INT NOT NULL DEFAULT 0,
    sent_count INT NOT NULL DEFAULT 0,
    failed_count INT NOT NULL DEFAULT 0,
    test_mode BOOLEAN NOT NULL DEFAULT FALSE,
    test_recipient VARCHAR(255) DEFAULT NULL,
    approved_at TIMESTAMP WITH TIME ZONE,
    sent_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_email_campaigns_status ON email_campaigns(status);
CREATE INDEX IF NOT EXISTS idx_email_campaigns_created ON email_campaigns(created_at DESC);

-- 4. Create campaign_recipients table (Audit Log & Strict Idempotency Guard)
CREATE TABLE IF NOT EXISTS campaign_recipients (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    campaign_id UUID NOT NULL REFERENCES email_campaigns(id) ON DELETE CASCADE,
    user_id UUID REFERENCES users(id) ON DELETE SET NULL,
    email VARCHAR(255) NOT NULL,
    recipient_name VARCHAR(120),
    status VARCHAR(30) NOT NULL DEFAULT 'PENDING' 
        CHECK (status IN ('PENDING', 'PROCESSING', 'SENT', 'FAILED', 'SUPPRESSED')),
    message_id VARCHAR(150),
    error_message TEXT,
    sent_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL,
    CONSTRAINT uq_campaign_recipient UNIQUE (campaign_id, email)
);

CREATE INDEX IF NOT EXISTS idx_campaign_recipients_campaign_status ON campaign_recipients(campaign_id, status);
CREATE INDEX IF NOT EXISTS idx_campaign_recipients_email ON campaign_recipients(email);
