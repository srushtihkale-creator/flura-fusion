package com.florafusion.dto.auth;

import java.util.UUID;

public record AuthResponse(
    String token,
    String tokenType,
    UUID id,
    String name,
    String email,
    String role,
    boolean emailVerified,
    String message
) {
    public static AuthResponse of(String token, UUID id, String name, String email, String role) {
        return new AuthResponse(token, "Bearer", id, name, email, role, true, null);
    }

    public static AuthResponse pendingVerification(UUID id, String name, String email, String message) {
        return new AuthResponse(null, null, id, name, email, "CUSTOMER", false, message);
    }
}
