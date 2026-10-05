package com.florafusion.service.payment;

import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.util.UUID;

@Service
public class MockPaymentService implements PaymentService {

    @Override
    public PaymentResult processPayment(String orderNumber, BigDecimal amount, String paymentMethod) {
        // Mock payment simulation always succeeds in test/demo mode
        String transactionId = "MOCK-TXN-" + UUID.randomUUID().toString().substring(0, 8).toUpperCase();
        return new PaymentResult(true, transactionId, "Mock payment processed successfully via " + paymentMethod);
    }
}
