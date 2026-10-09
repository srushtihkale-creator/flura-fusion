package com.florafusion.service.email.provider;

import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Primary;

/**
 * Configuration factory providing the active EmailProvider bean.
 * Supports environment-based selection:
 * - Local development ("dev" profile): defaults to SmtpEmailProvider
 * - Production deployment ("prod" profile): defaults to BrevoEmailProvider
 *
 * Can also be overridden explicitly via EMAIL_PROVIDER ("smtp", "brevo", "resend", "mock").
 */
@Slf4j
@Configuration
public class EmailProviderConfig {

    @Value("${application.email.provider:${EMAIL_PROVIDER:}}")
    private String configuredProvider;

    @Value("${spring.profiles.active:${SPRING_PROFILES_ACTIVE:dev}}")
    private String activeProfile;

    @Bean
    @Primary
    public EmailProvider primaryEmailProvider(
            SmtpEmailProvider smtpProvider,
            BrevoEmailProvider brevoProvider,
            ResendEmailProvider resendProvider,
            MockEmailProvider mockProvider
    ) {
        String selected = determineProvider();
        log.info("[EmailProviderConfig] Active environment profile: '{}', selected EmailProvider: '{}'", activeProfile, selected);

        return switch (selected) {
            case "brevo" -> {
                log.info("[EmailProviderConfig] Using BrevoEmailProvider (production transactional REST API)");
                yield brevoProvider;
            }
            case "smtp" -> {
                log.info("[EmailProviderConfig] Using SmtpEmailProvider (local SMTP provider)");
                yield smtpProvider;
            }
            case "resend" -> {
                log.info("[EmailProviderConfig] Using ResendEmailProvider (preserved alternative / fallback provider)");
                yield resendProvider;
            }
            case "mock", "test", "local" -> {
                log.info("[EmailProviderConfig] Using MockEmailProvider for test environment");
                yield mockProvider;
            }
            default -> {
                log.warn("[EmailProviderConfig] Unrecognized provider '{}', falling back to SmtpEmailProvider", selected);
                yield smtpProvider;
            }
        };
    }

    private String determineProvider() {
        if (configuredProvider != null && !configuredProvider.isBlank() && !configuredProvider.equalsIgnoreCase("auto")) {
            return configuredProvider.trim().toLowerCase();
        }

        // Automatic environment-based selection:
        // Production ("prod" / "production") -> Brevo
        // Local development ("dev" / "local" / default) -> SMTP
        if (activeProfile != null && (activeProfile.equalsIgnoreCase("prod") || activeProfile.equalsIgnoreCase("production"))) {
            return "brevo";
        }
        return "smtp";
    }
}

