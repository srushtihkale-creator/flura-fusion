package com.florafusion.service.payment;

import java.math.BigDecimal;

public interface PaymentService {
    PaymentResult processPayment(String orderNumber, BigDecimal amount, String paymentMethod);

    record PaymentResult(
        boolean success,
        String transactionId,
        String message
    ) {}
}
