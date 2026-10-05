package com.florafusion.dto.auth;

import java.util.UUID;

public record AuthResponse(
    String token,
    String tokenType,
    UUID id,
    String name,
    String email,
    String role
) {
    public static AuthResponse of(String token, UUID id, String name, String email, String role) {
        return new AuthResponse(token, "Bearer", id, name, email, role);
    }
}
