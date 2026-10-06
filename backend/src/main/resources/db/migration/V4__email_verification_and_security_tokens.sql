-- =============================================================================
-- Flora Fusion — Flyway Migration V4
-- Email Verification, Account Status & Security Token Persistence
-- =============================================================================

-- 1. Extend users table with email_verified flag
ALTER TABLE users ADD COLUMN IF NOT EXISTS email_verified BOOLEAN NOT NULL DEFAULT FALSE;

-- 2. Update users_status_check constraint to allow PENDING_VERIFICATION
ALTER TABLE users DROP CONSTRAINT IF EXISTS users_status_check;
ALTER TABLE users ADD CONSTRAINT users_status_check CHECK (status IN ('ACTIVE', 'SUSPENDED', 'DELETED', 'PENDING_VERIFICATION'));

-- 3. Ensure existing active users (seed admin, seed customers) are marked verified
UPDATE users SET email_verified = TRUE WHERE status = 'ACTIVE';

-- 4. Create security_tokens table for single-use verification and password reset codes
CREATE TABLE IF NOT EXISTS security_tokens (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    token_hash VARCHAR(255) NOT NULL,
    token_type VARCHAR(50) NOT NULL CHECK (token_type IN ('EMAIL_VERIFICATION', 'PASSWORD_RESET')),
    code VARCHAR(20),
    expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
    used_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_security_tokens_user_type ON security_tokens(user_id, token_type);
CREATE INDEX IF NOT EXISTS idx_security_tokens_hash ON security_tokens(token_hash);
CREATE INDEX IF NOT EXISTS idx_security_tokens_expires ON security_tokens(expires_at);
