package com.florafusion.dto.auth;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record ResetPasswordRequest(
    String email,
    String token,
    String code,

    @NotBlank(message = "New password is required")
    @Size(min = 6, message = "Password must be at least 6 characters")
    String newPassword
) {
    public String getEffectiveTokenOrCode() {
        if (code != null && !code.isBlank()) return code.trim();
        if (token != null && !token.isBlank()) return token.trim();
        return null;
    }
}
