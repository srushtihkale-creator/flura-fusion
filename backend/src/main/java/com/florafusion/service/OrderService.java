package com.florafusion.service;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.florafusion.dto.order.*;
import com.florafusion.entity.*;
import com.florafusion.exception.BadRequestException;
import com.florafusion.exception.OutOfStockException;
import com.florafusion.exception.ResourceNotFoundException;
import com.florafusion.repository.*;
import com.florafusion.service.email.EmailService;
import com.florafusion.service.payment.PaymentService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.security.SecureRandom;
import java.time.Instant;
import java.util.*;

@Slf4j
@Service
@RequiredArgsConstructor
public class OrderService {

    private final OrderRepository orderRepository;
    private final ProductRepository productRepository;
    private final CouponRepository couponRepository;
    private final UserRepository userRepository;
    private final CartItemRepository cartItemRepository;
    private final CartRepository cartRepository;
    private final PaymentService paymentService;
    private final InvoiceService invoiceService;
    private final EmailService emailService;
    private final ObjectMapper objectMapper;

    @Value("${application.commerce.free-shipping-threshold:799.00}")
    private BigDecimal freeShippingThreshold;

    @Value("${application.commerce.standard-shipping-fee:79.00}")
    private BigDecimal standardShippingFee;

    private static final SecureRandom RANDOM = new SecureRandom();

    public record ProductItemContext(Product product, int quantity, BigDecimal lineTotal) {}
    public record CalculatedDiscount(BigDecimal discount, boolean isFreeShipping, String error) {}

    @Transactional(readOnly = true)
    public OrderValidationResponse validateOrder(ValidateOrderRequest request) {
        List<String> errors = new ArrayList<>();
        BigDecimal subtotal = BigDecimal.ZERO;
        List<ProductItemContext> itemContexts = new ArrayList<>();

        for (OrderItemRequest item : request.items()) {
            Product product = findProductByIdentifier(item.productId());

            if (product == null) {
                errors.add("Product not found: " + item.productId());
                continue;
            }
            if (!product.isInStock() || product.getStockQuantity() < item.quantity()) {
                errors.add("Product '" + product.getName() + "' is out of stock (available: " + product.getStockQuantity() + ")");
                continue;
            }

            BigDecimal lineTotal = product.getBasePrice().multiply(BigDecimal.valueOf(item.quantity()));
            subtotal = subtotal.add(lineTotal);
            itemContexts.add(new ProductItemContext(product, item.quantity(), lineTotal));
        }

        BigDecimal discount = BigDecimal.ZERO;
        String appliedCoupon = null;
        boolean couponFreeShipping = false;

        if (request.couponCode() != null && !request.couponCode().isBlank()) {
            Optional<Coupon> couponOpt = couponRepository.findByCodeIgnoreCaseAndIsActiveTrue(request.couponCode().trim());
            if (couponOpt.isPresent()) {
                Coupon c = couponOpt.get();
                CalculatedDiscount calc = evaluateCoupon(c, itemContexts, subtotal);
                if (calc.error() != null) {
                    errors.add(calc.error());
                } else {
                    appliedCoupon = c.getCode();
                    discount = calc.discount();
                    couponFreeShipping = calc.isFreeShipping();
                }
            } else {
                errors.add("Invalid or inactive coupon code: " + request.couponCode());
            }
        } else {
            // Auto-apply check: Find best qualifying active offer with autoApply=true
            List<Coupon> activeAutoApply = couponRepository.findAllByIsActiveTrueOrderByDisplayOrderAsc()
                    .stream()
                    .filter(Coupon::isAutoApply)
                    .toList();

            Coupon bestCoupon = null;
            CalculatedDiscount bestCalc = null;

            for (Coupon c : activeAutoApply) {
                CalculatedDiscount calc = evaluateCoupon(c, itemContexts, subtotal);
                if (calc.error() == null && (calc.discount().compareTo(BigDecimal.ZERO) > 0 || calc.isFreeShipping())) {
                    if (bestCalc == null || calc.discount().compareTo(bestCalc.discount()) > 0) {
                        bestCoupon = c;
                        bestCalc = calc;
                    }
                }
            }

            if (bestCoupon != null && bestCalc != null) {
                appliedCoupon = bestCoupon.getCode();
                discount = bestCalc.discount();
                couponFreeShipping = bestCalc.isFreeShipping();
            }
        }

        boolean isFree = couponFreeShipping || (subtotal.compareTo(freeShippingThreshold) >= 0);
        BigDecimal shipping = (subtotal.compareTo(BigDecimal.ZERO) == 0 || isFree) ? BigDecimal.ZERO : standardShippingFee;
        BigDecimal total = subtotal.subtract(discount).add(shipping);
        if (total.compareTo(BigDecimal.ZERO) < 0) {
            total = BigDecimal.ZERO;
        }

        return new OrderValidationResponse(
            errors.isEmpty(),
            subtotal,
            discount,
            shipping,
            total,
            freeShippingThreshold,
            isFree,
            appliedCoupon,
            errors
        );
    }

    private CalculatedDiscount evaluateCoupon(Coupon c, List<ProductItemContext> items, BigDecimal subtotal) {
        Instant now = Instant.now();
        if (c.getStartDate() != null && c.getStartDate().isAfter(now)) {
            return new CalculatedDiscount(BigDecimal.ZERO, false, "Coupon " + c.getCode() + " is not active yet");
        }
        if (c.getEndDate() != null && c.getEndDate().isBefore(now)) {
            return new CalculatedDiscount(BigDecimal.ZERO, false, "Coupon " + c.getCode() + " has expired");
        }
        if (c.getUsageLimit() != null && c.getTimesUsed() >= c.getUsageLimit()) {
            return new CalculatedDiscount(BigDecimal.ZERO, false, "Coupon " + c.getCode() + " usage limit reached");
        }
        if (c.getMinCartValue() != null && subtotal.compareTo(c.getMinCartValue()) < 0) {
            return new CalculatedDiscount(BigDecimal.ZERO, false, "Coupon " + c.getCode() + " requires minimum order of ₹" + c.getMinCartValue().intValue());
        }

        // Filter eligible products based on applicableCategory or applicableProductIds
        List<ProductItemContext> eligibleItems = items.stream().filter(item -> {
            String cat = c.getApplicableCategory();
            if (cat != null && !cat.isBlank() && !"all".equalsIgnoreCase(cat)) {
                String itemCat = item.product().getCategory() != null ? item.product().getCategory().getSlug() : "";
                if (!cat.equalsIgnoreCase(itemCat)) {
                    return false;
                }
            }
            if (c.getApplicableProductIds() != null && !c.getApplicableProductIds().isBlank()) {
                String idStr = item.product().getId().toString();
                if (!c.getApplicableProductIds().contains(idStr)) {
                    return false;
                }
            }
            return true;
        }).toList();

        if (c.getApplicableCategory() != null && !"all".equalsIgnoreCase(c.getApplicableCategory()) && eligibleItems.isEmpty()) {
            return new CalculatedDiscount(BigDecimal.ZERO, false, "Coupon " + c.getCode() + " is only applicable to " + c.getApplicableCategory());
        }

        BigDecimal eligibleSubtotal = eligibleItems.stream()
                .map(ProductItemContext::lineTotal)
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        int eligibleQty = eligibleItems.stream()
                .mapToInt(ProductItemContext::quantity)
                .sum();

        BigDecimal discount = BigDecimal.ZERO;
        boolean freeShipping = false;
        String type = c.getDiscountType() != null ? c.getDiscountType().toUpperCase() : "PERCENTAGE";

        if ("BUNDLE".equals(type)) {
            int reqQty = c.getBundleQty() != null ? c.getBundleQty() : 4;
            BigDecimal bundlePrice = c.getBundlePrice() != null ? c.getBundlePrice() : c.getDiscountValue();
            if (eligibleQty < reqQty) {
                return new CalculatedDiscount(BigDecimal.ZERO, false, "Offer " + c.getCode() + " requires at least " + reqQty + " eligible items from " + c.getApplicableCategory() + " (currently " + eligibleQty + ")");
            }
            // Take the reqQty items to price them at bundlePrice
            List<BigDecimal> unitPrices = new ArrayList<>();
            for (ProductItemContext it : eligibleItems) {
                for (int q = 0; q < it.quantity(); q++) {
                    unitPrices.add(it.product().getBasePrice());
                }
            }
            unitPrices.sort(Collections.reverseOrder());
            BigDecimal regularSum = BigDecimal.ZERO;
            for (int i = 0; i < reqQty && i < unitPrices.size(); i++) {
                regularSum = regularSum.add(unitPrices.get(i));
            }
            if (regularSum.compareTo(bundlePrice) > 0) {
                discount = regularSum.subtract(bundlePrice);
            }
        } else if ("FREE_SHIPPING".equals(type)) {
            freeShipping = true;
        } else if ("FIXED_AMOUNT".equals(type)) {
            discount = c.getDiscountValue();
            if (discount.compareTo(eligibleSubtotal) > 0) {
                discount = eligibleSubtotal;
            }
        } else { // PERCENTAGE
            discount = eligibleSubtotal.multiply(c.getDiscountValue()).divide(BigDecimal.valueOf(100), 2, RoundingMode.HALF_UP);
            if (c.getMaxDiscount() != null && discount.compareTo(c.getMaxDiscount()) > 0) {
                discount = c.getMaxDiscount();
            }
        }

        if (discount.compareTo(subtotal) > 0) {
            discount = subtotal;
        }

        return new CalculatedDiscount(discount, freeShipping, null);
    }

    @Transactional
    public OrderResponse createOrder(CreateOrderRequest request, UUID userId) {
        // Idempotency check
        if (request.idempotencyKey() != null && !request.idempotencyKey().isBlank()) {
            Optional<Order> existing = orderRepository.findByIdempotencyKey(request.idempotencyKey().trim());
            if (existing.isPresent()) {
                return OrderResponse.fromEntity(existing.get());
            }
        }

        // Authoritative Stock and Pricing Validation
        ValidateOrderRequest validateRequest = new ValidateOrderRequest(request.items(), request.couponCode());
        OrderValidationResponse validation = validateOrder(validateRequest);

        if (!validation.valid()) {
            throw new BadRequestException("Order validation failed: " + String.join(", ", validation.errors()));
        }

        String orderNumber = "FF-" + (100000 + RANDOM.nextInt(900000));

        // Decrement inventory atomically
        List<OrderItem> orderItems = new ArrayList<>();
        Order order = Order.builder()
                .orderNumber(orderNumber)
                .subtotal(validation.subtotal())
                .discountAmount(validation.discount())
                .shippingAmount(validation.shipping())
                .totalAmount(validation.total())
                .paymentMethod(request.paymentMethod())
                .paymentStatus("PENDING")
                .orderStatus("Placed")
                .idempotencyKey(request.idempotencyKey() != null ? request.idempotencyKey().trim() : null)
                .build();

        if (userId != null) {
            User user = userRepository.findById(userId).orElse(null);
            order.setUser(user);
        } else {
            order.setGuestEmail(request.guestEmail() != null ? request.guestEmail().trim().toLowerCase() : null);
        }

        try {
            order.setShippingAddressSnapshot(objectMapper.writeValueAsString(request.shippingAddress()));
        } catch (Exception e) {
            throw new BadRequestException("Could not serialize shipping address");
        }

        for (OrderItemRequest itemReq : request.items()) {
            Product product = findProductByIdentifier(itemReq.productId());
            if (product == null) {
                throw new ResourceNotFoundException("Product not found: " + itemReq.productId());
            }

            if (product.getStockQuantity() < itemReq.quantity()) {
                throw new OutOfStockException("Insufficient stock for " + product.getName());
            }

            product.setStockQuantity(product.getStockQuantity() - itemReq.quantity());
            if (product.getStockQuantity() == 0) {
                product.setInStock(false);
            }
            productRepository.save(product);

            String primaryImage = product.getImages() != null && !product.getImages().isEmpty()
                    ? product.getImages().get(0).getMediaUrl()
                    : null;

            BigDecimal lineTotal = product.getBasePrice().multiply(BigDecimal.valueOf(itemReq.quantity()));

            OrderItem orderItem = OrderItem.builder()
                    .order(order)
                    .product(product)
                    .productNameSnapshot(product.getName())
                    .skuSnapshot(product.getSku())
                    .productImageSnapshot(primaryImage)
                    .categorySnapshot(product.getCategory() != null ? product.getCategory().getSlug() : null)
                    .quantity(itemReq.quantity())
                    .unitPrice(product.getBasePrice())
                    .discountAmount(BigDecimal.ZERO)
                    .lineTotal(lineTotal)
                    .build();

            orderItems.add(orderItem);
        }

        order.setItems(orderItems);

        // Process Mock Payment
        PaymentService.PaymentResult paymentResult = paymentService.processPayment(
                orderNumber,
                validation.total(),
                request.paymentMethod()
        );

        if (paymentResult.success()) {
            order.setPaymentStatus("COMPLETED");
            order.setPaymentTransactionId(paymentResult.transactionId());
        } else {
            order.setPaymentStatus("FAILED");
        }

        order = orderRepository.save(order);

        // Clear cart if authenticated
        if (userId != null) {
            cartRepository.findByUserId(userId).ifPresent(cart -> cartItemRepository.deleteByCartId(cart.getId()));
        }

        // Increment coupon times used if applicable
        if (validation.appliedCoupon() != null) {
            couponRepository.findByCodeIgnoreCaseAndIsActiveTrue(validation.appliedCoupon()).ifPresent(c -> {
                c.setTimesUsed(c.getTimesUsed() + 1);
                couponRepository.save(c);
            });
        }

        // Asynchronously generate PDF and dispatch Order Confirmation & Invoice email
        try {
            byte[] invoicePdf = invoiceService.generateInvoicePdf(order);
            emailService.sendOrderConfirmationEmail(order, invoicePdf);
        } catch (Exception e) {
            log.warn("[OrderService] Non-blocking email dispatch failed for order {}: {}", order.getOrderNumber(), e.getMessage());
        }

        return OrderResponse.fromEntity(order);
    }

    @Transactional
    public OrderResponse updateOrderStatus(UUID orderId, String newStatus) {
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new ResourceNotFoundException("Order not found with id: " + orderId));

        String previousStatus = order.getOrderStatus();
        if (newStatus != null && !newStatus.isBlank()) {
            order.setOrderStatus(newStatus.trim());
            order = orderRepository.save(order);

            // Asynchronously dispatch Order Status Update email
            try {
                emailService.sendOrderStatusUpdateEmail(order, previousStatus, newStatus.trim());
            } catch (Exception e) {
                log.warn("[OrderService] Non-blocking status email dispatch failed for order {}: {}", order.getOrderNumber(), e.getMessage());
            }
        }

        return OrderResponse.fromEntity(order);
    }

    @Transactional(readOnly = true)
    public OrderResponse getOrderByNumber(String orderNumber) {
        Order order = orderRepository.findByOrderNumber(orderNumber.trim())
                .orElseThrow(() -> new ResourceNotFoundException("Order not found with number: " + orderNumber));
        return OrderResponse.fromEntity(order);
    }

    @Transactional(readOnly = true)
    public Order getOrderEntity(String orderNumber) {
        return orderRepository.findByOrderNumber(orderNumber.trim())
                .orElseThrow(() -> new ResourceNotFoundException("Order not found with number: " + orderNumber));
    }

    @Transactional
    public Page<OrderResponse> getMyOrders(UUID userId, Pageable pageable) {
        if (userId != null) {
            User user = userRepository.findById(userId).orElse(null);
            if (user != null && user.getEmail() != null && !user.getEmail().isBlank()) {
                List<Order> guestOrders = orderRepository.findByGuestEmailIgnoreCaseAndUserIsNull(user.getEmail().trim().toLowerCase());
                if (!guestOrders.isEmpty()) {
                    for (Order go : guestOrders) {
                        go.setUser(user);
                    }
                    orderRepository.saveAll(guestOrders);
                }
            }
        }
        return orderRepository.findByUserIdOrderByCreatedAtDesc(userId, pageable)
                .map(OrderResponse::fromEntity);
    }

    @Transactional(readOnly = true)
    public OrderResponse getOrderByIdentifier(String identifier) {
        return getOrderByIdentifier(identifier, null, true);
    }

    @Transactional(readOnly = true)
    public OrderResponse getOrderByIdentifier(String identifier, UUID requestingUserId, boolean isAdmin) {
        if (identifier == null || identifier.isBlank()) {
            throw new ResourceNotFoundException("Order identifier is required");
        }
        Order order = null;
        UUID uuid = parseUuid(identifier);
        if (uuid != null) {
            order = orderRepository.findById(uuid).orElse(null);
        }
        if (order == null) {
            order = orderRepository.findByOrderNumber(identifier.trim()).orElse(null);
        }
        if (order == null) {
            throw new ResourceNotFoundException("Order not found with identifier: " + identifier);
        }

        // Privacy RBAC check: Customers cannot access another customer's order
        if (order.getUser() != null) {
            if (!isAdmin && (requestingUserId == null || !order.getUser().getId().equals(requestingUserId))) {
                throw new org.springframework.security.access.AccessDeniedException("Access denied: You are not authorized to view another customer's order.");
            }
        }

        return OrderResponse.fromEntity(order);
    }

    public Product findProductByIdentifier(String identifier) {
        if (identifier == null || identifier.isBlank()) {
            return null;
        }
        UUID uuid = parseUuid(identifier);
        if (uuid != null) {
            Optional<Product> p = productRepository.findById(uuid);
            if (p.isPresent()) return p.get();
        }
        Optional<Product> bySlug = productRepository.findBySlug(identifier.trim());
        if (bySlug.isPresent()) return bySlug.get();

        Optional<Product> bySku = productRepository.findBySku(identifier.trim());
        if (bySku.isPresent()) return bySku.get();

        return null;
    }

    private UUID parseUuid(String str) {
        try {
            return UUID.fromString(str);
        } catch (Exception e) {
            return null;
        }
    }
}
