package com.florafusion.service;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.florafusion.dto.order.OrderItemRequest;
import com.florafusion.dto.order.OrderValidationResponse;
import com.florafusion.dto.order.ValidateOrderRequest;
import com.florafusion.entity.Category;
import com.florafusion.entity.Coupon;
import com.florafusion.entity.Product;
import com.florafusion.repository.*;
import com.florafusion.service.payment.PaymentService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.test.util.ReflectionTestUtils;

import java.math.BigDecimal;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class OrderServiceTest {

    @Mock
    private OrderRepository orderRepository;

    @Mock
    private ProductRepository productRepository;

    @Mock
    private CouponRepository couponRepository;

    @Mock
    private UserRepository userRepository;

    @Mock
    private CartItemRepository cartItemRepository;

    @Mock
    private CartRepository cartRepository;

    @Mock
    private PaymentService paymentService;

    @Mock
    private ObjectMapper objectMapper;

    @InjectMocks
    private OrderService orderService;

    private UUID productId;
    private Product product;

    @BeforeEach
    void setUp() {
        ReflectionTestUtils.setField(orderService, "freeShippingThreshold", new BigDecimal("799.00"));
        ReflectionTestUtils.setField(orderService, "standardShippingFee", new BigDecimal("79.00"));

        productId = UUID.randomUUID();
        Category plantsCat = Category.builder().slug("plants").name("Plants").build();
        product = Product.builder()
                .id(productId)
                .name("Monstera Deliciosa")
                .slug("monstera-deliciosa")
                .sku("FF-PLN-009")
                .basePrice(new BigDecimal("999.00"))
                .inStock(true)
                .stockQuantity(10)
                .category(plantsCat)
                .build();
    }

    @Test
    @DisplayName("Authoritative order validation calculates free shipping when subtotal >= 799")
    void testValidateOrder_FreeShipping() {
        when(productRepository.findById(productId)).thenReturn(Optional.of(product));

        ValidateOrderRequest request = new ValidateOrderRequest(
                List.of(new OrderItemRequest(productId.toString(), 1)),
                null
        );

        OrderValidationResponse response = orderService.validateOrder(request);

        assertTrue(response.valid());
        assertEquals(new BigDecimal("999.00"), response.subtotal());
        assertEquals(BigDecimal.ZERO, response.discount());
        assertEquals(BigDecimal.ZERO, response.shipping());
        assertEquals(new BigDecimal("999.00"), response.total());
        assertTrue(response.isFreeDelivery());
    }

    @Test
    @DisplayName("Authoritative order validation applies 10% coupon discount")
    void testValidateOrder_WithCoupon() {
        when(productRepository.findById(productId)).thenReturn(Optional.of(product));

        Coupon coupon = Coupon.builder()
                .code("FLORA10")
                .discountType("PERCENTAGE")
                .discountValue(new BigDecimal("10.00"))
                .minCartValue(BigDecimal.ZERO)
                .maxDiscount(new BigDecimal("500.00"))
                .isActive(true)
                .build();

        when(couponRepository.findByCodeIgnoreCaseAndIsActiveTrue("FLORA10")).thenReturn(Optional.of(coupon));

        ValidateOrderRequest request = new ValidateOrderRequest(
                List.of(new OrderItemRequest(productId.toString(), 1)),
                "FLORA10"
        );

        OrderValidationResponse response = orderService.validateOrder(request);

        assertTrue(response.valid());
        assertEquals(new BigDecimal("999.00"), response.subtotal());
        assertEquals(new BigDecimal("99.90"), response.discount());
        assertEquals(new BigDecimal("899.10"), response.total());
        assertEquals("FLORA10", response.appliedCoupon());
    }

    @Test
    @DisplayName("Authoritative order validation rejects out-of-stock item")
    void testValidateOrder_OutOfStock() {
        product.setInStock(false);
        product.setStockQuantity(0);
        when(productRepository.findById(productId)).thenReturn(Optional.of(product));

        ValidateOrderRequest request = new ValidateOrderRequest(
                List.of(new OrderItemRequest(productId.toString(), 1)),
                null
        );

        OrderValidationResponse response = orderService.validateOrder(request);

        assertFalse(response.valid());
        assertFalse(response.errors().isEmpty());
        assertTrue(response.errors().get(0).contains("out of stock"));
    }
}
