package com.florafusion.security;

import java.security.SecureRandom;
import java.util.HexFormat;

/**
 * Cryptographic security utility functions for Flora Fusion.
 */
public final class SecurityUtils {

    private static final SecureRandom SECURE_RANDOM = new SecureRandom();

    private SecurityUtils() {
        // Prevent instantiation
    }

    /**
     * Generates a cryptographically strong, unguessable 64-character hexadecimal token
     * backed by 32 bytes (256 bits) of entropy from SecureRandom.
     * Fits perfectly in VARCHAR(64) columns.
     *
     * @return 64-character lowercase hex string
     */
    public static String generateSecureToken() {
        byte[] randomBytes = new byte[32];
        SECURE_RANDOM.nextBytes(randomBytes);
        return HexFormat.of().formatHex(randomBytes);
    }
}
