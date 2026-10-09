package com.florafusion.dto.auth;

/**
 * Request payload for Google OAuth2 authentication.
 * Accepts either 'idToken' (Google ID token JWT) or 'credential' (Google Identity Services credential).
 */
public record GoogleAuthRequest(
    String idToken,
    String credential
) {
    public String getEffectiveToken() {
        if (idToken != null && !idToken.isBlank()) {
            return idToken.trim();
        }
        if (credential != null && !credential.isBlank()) {
            return credential.trim();
        }
        return null;
    }
}
