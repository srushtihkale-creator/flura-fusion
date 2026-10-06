package com.florafusion.service.email.provider;

import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Primary;

/**
 * Configuration factory providing the active EmailProvider bean.
 * Allows switching providers via environment variable EMAIL_PROVIDER:
 * - "resend" (default production / cloud provider)
 * - "mock" (offline / automated test provider)
 * - "smtp" (future standard SMTP / Gmail SMTP provider)
 */
@Slf4j
@Configuration
public class EmailProviderConfig {

    @Value("${application.email.provider:${EMAIL_PROVIDER:resend}}")
    private String providerName;

    @Bean
    @Primary
    public EmailProvider primaryEmailProvider(
            SmtpEmailProvider smtpProvider,
            ResendEmailProvider resendProvider,
            MockEmailProvider mockProvider
    ) {
        String selected = providerName != null ? providerName.trim().toLowerCase() : "smtp";
        log.info("[EmailProviderConfig] Initializing primary EmailProvider: '{}'", selected);

        return switch (selected) {
            case "mock", "test", "local" -> {
                log.info("[EmailProviderConfig] Using MockEmailProvider for local / test environment");
                yield mockProvider;
            }
            case "resend" -> {
                log.info("[EmailProviderConfig] Using ResendEmailProvider as primary email delivery provider");
                yield resendProvider;
            }
            case "smtp" -> {
                log.info("[EmailProviderConfig] Using SmtpEmailProvider as primary email delivery provider");
                yield smtpProvider;
            }
            default -> {
                log.warn("[EmailProviderConfig] Unrecognized provider '{}', defaulting to SmtpEmailProvider", selected);
                yield smtpProvider;
            }
        };
    }
}
