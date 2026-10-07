package com.florafusion.service.email;

import com.florafusion.service.email.provider.EmailProvider;
import com.florafusion.service.email.provider.EmailProvider.EmailMessage;
import com.florafusion.service.email.provider.EmailProvider.EmailSendResult;
import lombok.extern.slf4j.Slf4j;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Component;

import java.util.concurrent.CompletableFuture;

/**
 * Dedicated asynchronous dispatcher for immutable EmailMessage objects.
 * Guarantees that asynchronous task threads only execute network I/O and NEVER
 * access managed JPA entities or Hibernate sessions across threads.
 */
@Slf4j
@Component
public class AsyncEmailDispatcher {

    @Async
    public CompletableFuture<EmailSendResult> dispatch(EmailProvider emailProvider, EmailMessage message) {
        try {
            EmailSendResult result = emailProvider.sendEmail(message);
            return CompletableFuture.completedFuture(result);
        } catch (Exception e) {
            log.error("[AsyncEmailDispatcher] Failed to dispatch email to {}: {}", message.to(), e.getMessage(), e);
            return CompletableFuture.completedFuture(EmailSendResult.fail(e.getMessage()));
        }
    }
}
