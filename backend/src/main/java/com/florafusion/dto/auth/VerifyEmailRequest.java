package com.florafusion.dto.auth;

public record VerifyEmailRequest(
    String email,
    String code,
    String token
) {
    public String getEffectiveTokenOrCode() {
        if (code != null && !code.isBlank()) return code.trim();
        if (token != null && !token.isBlank()) return token.trim();
        return null;
    }
}
