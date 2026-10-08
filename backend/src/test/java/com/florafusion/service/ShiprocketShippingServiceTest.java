package com.florafusion.service;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.florafusion.dto.shipping.ShiprocketOrderItemRequest;
import com.florafusion.dto.shipping.ShiprocketOrderRequest;
import com.florafusion.dto.shipping.ShippingShipmentDto;
import com.florafusion.entity.Category;
import com.florafusion.entity.Order;
import com.florafusion.entity.OrderItem;
import com.florafusion.entity.Product;
import com.florafusion.entity.User;
import com.florafusion.service.shipping.ShiprocketShippingService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.io.IOException;
import java.math.BigDecimal;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.time.Instant;
import java.util.ArrayList;
import java.util.UUID;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class ShiprocketShippingServiceTest {

    private ObjectMapper objectMapper;
    private ShiprocketShippingService shippingService;

    @Mock
    private HttpClient mockHttpClient;

    @Mock
    private HttpResponse<String> mockAuthResponse;

    @Mock
    private HttpResponse<String> mockOrderResponse;

    @BeforeEach
    void setUp() {
        objectMapper = new ObjectMapper();
        shippingService = new ShiprocketShippingService(objectMapper);
        shippingService.setHttpClient(mockHttpClient);
        shippingService.setBaseUrl("https://apiv2.shiprocket.in");
        shippingService.setTestMode(true);
        shippingService.setEmail("api@florafusion.com");
        shippingService.setPassword("FloraFusionTestPass123");
        shippingService.setPickupLocation("Primary");
    }

    private Order createSampleOrder() {
        User user = User.builder()
                .id(UUID.randomUUID())
                .email("srushti@florafusion.com")
                .name("Srushti Kale")
                .build();

        Category plantsCategory = Category.builder()
                .name("Plants")
                .slug("plants")
                .build();

        Product plant = Product.builder()
                .id(UUID.randomUUID())
                .name("Monstera Deliciosa")
                .sku("PLANT-MONSTERA-01")
                .category(plantsCategory)
                .basePrice(new BigDecimal("899.00"))
                .build();

        Order order = Order.builder()
                .id(UUID.randomUUID())
                .orderNumber("FF-20261007-001")
                .user(user)
                .subtotal(new BigDecimal("899.00"))
                .discountAmount(BigDecimal.ZERO)
                .shippingAmount(BigDecimal.ZERO)
                .taxAmount(new BigDecimal("45.00"))
                .totalAmount(new BigDecimal("899.00"))
                .paymentMethod("Razorpay")
                .paymentStatus("COMPLETED")
                .orderStatus("Placed")
                .shippingAddressSnapshot("{\"name\":\"Srushti Kale\",\"phone\":\"9876543210\",\"address\":\"Baner Road, Flat 402\",\"city\":\"Pune\",\"state\":\"Maharashtra\",\"pincode\":\"411045\"}")
                .createdAt(Instant.now())
                .items(new ArrayList<>())
                .build();

        OrderItem item = OrderItem.builder()
                .id(UUID.randomUUID())
                .order(order)
                .product(plant)
                .productNameSnapshot("Monstera Deliciosa")
                .skuSnapshot("PLANT-MONSTERA-01")
                .categorySnapshot("plants")
                .quantity(1)
                .unitPrice(new BigDecimal("899.00"))
                .lineTotal(new BigDecimal("899.00"))
                .build();

        order.getItems().add(item);
        return order;
    }

    @Test
    @DisplayName("Configuration check correctly validates presence of credentials")
    void testIsConfigured() {
        assertTrue(shippingService.isConfigured());

        shippingService.setEmail("");
        assertFalse(shippingService.isConfigured());

        shippingService.setEmail(null);
        assertFalse(shippingService.isConfigured());
    }

    @Test
    @DisplayName("Payload mapping accurately maps Flora Fusion order to official Shiprocket Adhoc schema")
    void testMapOrderPayload() {
        Order order = createSampleOrder();
        ShiprocketOrderRequest req = shippingService.mapOrder(order);

        assertNotNull(req);
        assertEquals("FF-20261007-001", req.order_id());
        assertEquals("Srushti", req.billing_customer_name());
        assertEquals("Kale", req.billing_last_name());
        assertEquals("Baner Road, Flat 402", req.billing_address());
        assertEquals("Pune", req.billing_city());
        assertEquals("Maharashtra", req.billing_state());
        assertEquals("411045", req.billing_pincode());
        assertEquals("9876543210", req.billing_phone());
        assertEquals("srushti@florafusion.com", req.billing_email());
        assertEquals("Prepaid", req.payment_method());
        assertEquals(new BigDecimal("899.00"), req.sub_total());
        assertEquals(1, req.order_items().size());

        ShiprocketOrderItemRequest itemReq = req.order_items().get(0);
        assertEquals("Monstera Deliciosa", itemReq.name());
        assertEquals("PLANT-MONSTERA-01", itemReq.sku());
        assertEquals(1, itemReq.units());
        assertEquals(new BigDecimal("899.00"), itemReq.selling_price());

        // Nursery package dimensions and weights
        assertTrue(req.weight() > 0.5, "Plant weight should reflect live plant packaging");
        assertTrue(req.length() > 0 && req.breadth() > 0 && req.height() > 0);
    }

    @Test
    @DisplayName("Authentication token is retrieved and cached across multiple invocations")
    void testAuthTokenCaching() throws Exception {
        String authJson = "{\"token\":\"official_jwt_token_12345\",\"email\":\"api@florafusion.com\",\"id\":99}";
        when(mockAuthResponse.statusCode()).thenReturn(200);
        when(mockAuthResponse.body()).thenReturn(authJson);
        doReturn(mockAuthResponse).when(mockHttpClient).send(any(HttpRequest.class), any());

        String token1 = shippingService.getAuthToken();
        assertEquals("official_jwt_token_12345", token1);

        // Second call should return cached token without triggering extra HTTP call
        String token2 = shippingService.getAuthToken();
        assertEquals("official_jwt_token_12345", token2);

        verify(mockHttpClient, times(1)).send(any(HttpRequest.class), any());
    }

    @Test
    @DisplayName("Test Mode Safety: Creates official Shiprocket order draft but never triggers courier AWB or pickup")
    void testTestModeSafetyGuardsCourierAssignment() throws Exception {
        String authJson = "{\"token\":\"official_jwt_token_12345\",\"email\":\"api@florafusion.com\",\"id\":99}";
        String orderSuccessJson = "{\"order_id\":100200300,\"shipment_id\":400500600,\"status\":\"NEW\",\"status_code\":1}";

        when(mockAuthResponse.statusCode()).thenReturn(200);
        when(mockAuthResponse.body()).thenReturn(authJson);

        when(mockOrderResponse.statusCode()).thenReturn(200);
        when(mockOrderResponse.body()).thenReturn(orderSuccessJson);

        // Sequence: first call auth, second call create order
        doReturn(mockAuthResponse)
                .doReturn(mockOrderResponse)
                .when(mockHttpClient).send(any(HttpRequest.class), any());

        Order order = createSampleOrder();
        ShippingShipmentDto result = shippingService.pushOrderToShipping(order);

        assertNotNull(result);
        assertTrue(result.success());
        assertTrue(result.testMode(), "Result must explicitly reflect testMode=true");
        assertEquals("FF-20261007-001", result.floraOrderNumber());
        assertEquals(100200300L, result.shiprocketOrderId());
        assertEquals(400500600L, result.shiprocketShipmentId());
        assertNull(result.awbCode(), "In test mode, AWB code must be null to guarantee no courier assignment");
        assertNull(result.courierName(), "In test mode, Courier name must be null to guarantee no courier assignment");
        assertTrue(result.message().contains("Test Mode active"), "Message must explain that courier dispatch is safely guarded");

        // Exactly 2 calls made: 1 auth + 1 create order draft. Zero courier assignment calls.
        verify(mockHttpClient, times(2)).send(any(HttpRequest.class), any());
    }

    @Test
    @DisplayName("Unconfigured credentials safely returns error DTO without crashing")
    void testUnconfiguredSafety() {
        shippingService.setEmail("");
        shippingService.setPassword("");

        Order order = createSampleOrder();
        ShippingShipmentDto result = shippingService.pushOrderToShipping(order);

        assertNotNull(result);
        assertFalse(result.success());
        assertTrue(result.message().contains("not yet configured"));
        verifyNoInteractions(mockHttpClient);
    }
}
