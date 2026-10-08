package com.florafusion.service.shipping;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.florafusion.dto.shipping.*;
import com.florafusion.entity.Order;
import com.florafusion.entity.OrderItem;
import lombok.Setter;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.io.IOException;
import java.math.BigDecimal;
import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.time.Duration;
import java.time.Instant;
import java.time.ZoneId;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.List;

/**
 * Official Shiprocket Logistics Integration Service.
 * Communicates with the official Shiprocket REST API (https://apiv2.shiprocket.in).
 *
 * SAFETY GUARD:
 * When test-mode is true (SHIPROCKET_TEST_MODE=true), the service creates official ad-hoc
 * orders in Shiprocket but NEVER assigns couriers (assign/awb) or triggers real pickups,
 * ensuring zero unwanted charges and zero real courier dispatches during testing.
 */
@Slf4j
@Service
public class ShiprocketShippingService implements ShippingService {

    private static final DateTimeFormatter SHIPROCKET_DATE_FORMAT =
            DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm").withZone(ZoneId.of("Asia/Kolkata"));

    private final ObjectMapper objectMapper;

    @Setter
    private HttpClient httpClient;

    @Setter
    @Value("${application.shipping.shiprocket.base-url:https://apiv2.shiprocket.in}")
    private String baseUrl;

    @Setter
    @Value("${application.shipping.shiprocket.test-mode:true}")
    private boolean testMode;

    @Setter
    @Value("${application.shipping.shiprocket.email:}")
    private String email;

    @Setter
    @Value("${application.shipping.shiprocket.password:}")
    private String password;

    @Setter
    @Value("${application.shipping.shiprocket.pickup-location:Primary}")
    private String pickupLocation;

    // In-memory token cache (Shiprocket token is valid for 240 hours / 10 days)
    private String cachedToken = null;
    private Instant tokenExpiry = null;

    public ShiprocketShippingService(ObjectMapper objectMapper) {
        this.objectMapper = objectMapper;
        this.httpClient = HttpClient.newBuilder()
                .connectTimeout(Duration.ofSeconds(10))
                .build();
    }

    @Override
    public boolean isConfigured() {
        return email != null && !email.isBlank() && password != null && !password.isBlank();
    }

    @Override
    public boolean isTestMode() {
        return testMode;
    }

    @Override
    public String getProviderName() {
        return "shiprocket";
    }

    /**
     * Authenticates with official Shiprocket API (POST /v1/external/auth/login)
     * and caches the bearer token.
     */
    public synchronized String getAuthToken() throws IOException, InterruptedException {
        if (cachedToken != null && tokenExpiry != null && Instant.now().isBefore(tokenExpiry)) {
            return cachedToken;
        }

        if (!isConfigured()) {
            throw new IllegalStateException("Shiprocket credentials are not configured. Please set SHIPROCKET_EMAIL and SHIPROCKET_PASSWORD in backend environment variables.");
        }

        String loginUrl = baseUrl.replaceAll("/+$", "") + "/v1/external/auth/login";
        ShiprocketAuthRequest authRequest = new ShiprocketAuthRequest(email.trim(), password.trim());
        String requestJson = objectMapper.writeValueAsString(authRequest);

        HttpRequest httpRequest = HttpRequest.newBuilder()
                .uri(URI.create(loginUrl))
                .header("Content-Type", "application/json")
                .header("Accept", "application/json")
                .timeout(Duration.ofSeconds(15))
                .POST(HttpRequest.BodyPublishers.ofString(requestJson))
                .build();

        log.info("[ShiprocketShippingService] Authenticating with official Shiprocket API at: {}", loginUrl);
        HttpResponse<String> response = httpClient.send(httpRequest, HttpResponse.BodyHandlers.ofString());

        if (response.statusCode() >= 200 && response.statusCode() < 300) {
            ShiprocketAuthResponse authResponse = objectMapper.readValue(response.body(), ShiprocketAuthResponse.class);
            if (authResponse.token() != null && !authResponse.token().isBlank()) {
                this.cachedToken = authResponse.token();
                // Cache for 200 hours (within the 240-hour validity window)
                this.tokenExpiry = Instant.now().plus(Duration.ofHours(200));
                log.info("[ShiprocketShippingService] Successfully authenticated with Shiprocket for user: {}", authResponse.email());
                return this.cachedToken;
            }
        }

        log.error("[ShiprocketShippingService] Authentication failed (HTTP {}): {}", response.statusCode(), response.body());
        throw new IllegalStateException("Shiprocket authentication failed (HTTP " + response.statusCode() + "): " + response.body());
    }

    /**
     * Maps Flora Fusion Order to official Shiprocket Adhoc Order payload and sends it.
     */
    @Override
    public ShippingShipmentDto pushOrderToShipping(Order order) {
        if (order == null) {
            return ShippingShipmentDto.error("UNKNOWN", testMode, "Order entity cannot be null");
        }

        String orderNumber = order.getOrderNumber();

        if (!isConfigured()) {
            String msg = "Shiprocket is in " + (testMode ? "Test Mode" : "Production") + ", but API credentials (SHIPROCKET_EMAIL, SHIPROCKET_PASSWORD) are not yet configured in backend environment variables.";
            log.warn("[ShiprocketShippingService] Order {}: {}", orderNumber, msg);
            return ShippingShipmentDto.error(orderNumber, testMode, msg);
        }

        try {
            String token = getAuthToken();
            ShiprocketOrderRequest orderRequest = mapOrder(order);
            String payloadJson = objectMapper.writeValueAsString(orderRequest);

            String createOrderUrl = baseUrl.replaceAll("/+$", "") + "/v1/external/orders/create/adhoc";

            HttpRequest httpRequest = HttpRequest.newBuilder()
                    .uri(URI.create(createOrderUrl))
                    .header("Content-Type", "application/json")
                    .header("Accept", "application/json")
                    .header("Authorization", "Bearer " + token)
                    .timeout(Duration.ofSeconds(20))
                    .POST(HttpRequest.BodyPublishers.ofString(payloadJson))
                    .build();

            log.info("[ShiprocketShippingService] Pushing Order {} to Shiprocket adhoc endpoint (TestMode={})...", orderNumber, testMode);
            HttpResponse<String> response = httpClient.send(httpRequest, HttpResponse.BodyHandlers.ofString());

            if (response.statusCode() >= 200 && response.statusCode() < 300) {
                ShiprocketOrderResponse orderResponse = objectMapper.readValue(response.body(), ShiprocketOrderResponse.class);
                log.info("[ShiprocketShippingService] Order {} created in Shiprocket successfully. Shiprocket OrderId: {}, ShipmentId: {}, Status: {}",
                        orderNumber, orderResponse.order_id(), orderResponse.shipment_id(), orderResponse.status());

                if (testMode) {
                    // SAFETY GUARANTEE: In test mode, NEVER call courier assignment (assign/awb) or trigger live pickups.
                    log.info("[ShiprocketShippingService] TEST MODE ACTIVE: Live courier assignment and pickup dispatch safely guarded for Order {}", orderNumber);
                    return ShippingShipmentDto.testModeSuccess(
                            orderNumber,
                            orderResponse.order_id(),
                            orderResponse.shipment_id(),
                            orderResponse.status()
                    );
                } else {
                    return ShippingShipmentDto.liveSuccess(
                            orderNumber,
                            orderResponse.order_id(),
                            orderResponse.shipment_id(),
                            orderResponse.status(),
                            orderResponse.awb_code(),
                            orderResponse.courier_name()
                    );
                }
            } else {
                log.error("[ShiprocketShippingService] Failed to create order in Shiprocket (HTTP {}): {}", response.statusCode(), response.body());
                return ShippingShipmentDto.error(orderNumber, testMode, "Shiprocket API rejected order (HTTP " + response.statusCode() + "): " + response.body());
            }

        } catch (Exception e) {
            log.error("[ShiprocketShippingService] Exception while pushing order {} to Shiprocket: {}", orderNumber, e.getMessage(), e);
            return ShippingShipmentDto.error(orderNumber, testMode, e.getMessage());
        }
    }

    /**
     * Maps a Flora Fusion Order to the official Shiprocket Adhoc Order request payload.
     */
    public ShiprocketOrderRequest mapOrder(Order order) {
        String customerName = "Valued Customer";
        String customerPhone = "9999999999";
        String addressLine1 = "Address Not Provided";
        String addressLine2 = "";
        String city = "Pune";
        String state = "Maharashtra";
        String pincode = "411001";
        String country = "India";

        try {
            if (order.getShippingAddressSnapshot() != null && !order.getShippingAddressSnapshot().isBlank()) {
                JsonNode addr = objectMapper.readTree(order.getShippingAddressSnapshot());
                if (addr.has("name") && !addr.get("name").asText().isBlank()) customerName = addr.get("name").asText().trim();
                if (addr.has("phone") && !addr.get("phone").asText().isBlank()) customerPhone = addr.get("phone").asText().trim();
                if (addr.has("address") && !addr.get("address").asText().isBlank()) addressLine1 = addr.get("address").asText().trim();
                if (addr.has("city") && !addr.get("city").asText().isBlank()) city = addr.get("city").asText().trim();
                if (addr.has("state") && !addr.get("state").asText().isBlank()) state = addr.get("state").asText().trim();
                if (addr.has("pincode") && !addr.get("pincode").asText().isBlank()) pincode = addr.get("pincode").asText().trim();
            }
        } catch (Exception ignored) {
        }

        // Split customer name into first & last name
        String firstName = customerName;
        String lastName = "";
        int spaceIdx = customerName.lastIndexOf(' ');
        if (spaceIdx > 0) {
            firstName = customerName.substring(0, spaceIdx).trim();
            lastName = customerName.substring(spaceIdx + 1).trim();
        }

        String customerEmail = "customer@florafusion.com";
        if (order.getUser() != null && order.getUser().getEmail() != null && !order.getUser().getEmail().isBlank()) {
            customerEmail = order.getUser().getEmail().trim().toLowerCase();
        } else if (order.getGuestEmail() != null && !order.getGuestEmail().isBlank()) {
            customerEmail = order.getGuestEmail().trim().toLowerCase();
        }

        // Date formatting
        String orderDate = order.getCreatedAt() != null
                ? SHIPROCKET_DATE_FORMAT.format(order.getCreatedAt())
                : SHIPROCKET_DATE_FORMAT.format(Instant.now());

        // Payment method
        String paymentMethod = "COD".equalsIgnoreCase(order.getPaymentMethod()) ? "COD" : "Prepaid";

        // Map items
        List<ShiprocketOrderItemRequest> items = new ArrayList<>();
        double calculatedWeight = 0.0;
        int totalUnits = 0;

        if (order.getItems() != null && !order.getItems().isEmpty()) {
            for (OrderItem oi : order.getItems()) {
                String name = oi.getProductNameSnapshot() != null ? oi.getProductNameSnapshot() : "Botanical Item";
                String sku = oi.getSkuSnapshot() != null ? oi.getSkuSnapshot() : "SKU-" + oi.getId().toString().substring(0, 8);
                int units = Math.max(1, oi.getQuantity());
                totalUnits += units;

                BigDecimal unitPrice = oi.getUnitPrice() != null ? oi.getUnitPrice() : BigDecimal.ZERO;
                BigDecimal discount = oi.getDiscountAmount() != null ? oi.getDiscountAmount() : BigDecimal.ZERO;

                items.add(new ShiprocketOrderItemRequest(
                        name,
                        sku,
                        units,
                        unitPrice,
                        discount,
                        BigDecimal.ZERO,
                        "060290" // HSN code for live indoor plants and seeds
                ));

                // Volumetric weight preset based on category
                String cat = oi.getCategorySnapshot() != null ? oi.getCategorySnapshot().toLowerCase() : "";
                if (cat.contains("plant")) {
                    calculatedWeight += (1.2 * units);
                } else if (cat.contains("pot")) {
                    calculatedWeight += (1.5 * units);
                } else if (cat.contains("seed")) {
                    calculatedWeight += (0.15 * units);
                } else {
                    calculatedWeight += (1.0 * units);
                }
            }
        } else {
            items.add(new ShiprocketOrderItemRequest(
                    "Flora Fusion Botanical Order",
                    "FF-GENERIC",
                    1,
                    order.getTotalAmount() != null ? order.getTotalAmount() : BigDecimal.valueOf(499),
                    BigDecimal.ZERO,
                    BigDecimal.ZERO,
                    "060290"
            ));
            calculatedWeight = 1.0;
        }

        // Dimensions: standard sturdy nursery corrugated box preset
        double length = 20.0;
        double breadth = 20.0;
        double height = Math.min(60.0, 25.0 + (totalUnits * 5.0));
        double weight = Math.max(0.5, Math.round(calculatedWeight * 10.0) / 10.0);

        return new ShiprocketOrderRequest(
                order.getOrderNumber(),
                orderDate,
                pickupLocation != null && !pickupLocation.isBlank() ? pickupLocation : "Primary",
                "",
                "Fragile Live Plants & Ceramics - Flora Fusion Nursery",
                firstName,
                lastName,
                addressLine1,
                addressLine2,
                city,
                pincode,
                state,
                country,
                customerEmail,
                customerPhone,
                true,
                firstName,
                lastName,
                addressLine1,
                addressLine2,
                city,
                pincode,
                state,
                country,
                customerEmail,
                customerPhone,
                items,
                paymentMethod,
                order.getShippingAmount() != null ? order.getShippingAmount() : BigDecimal.ZERO,
                BigDecimal.ZERO,
                BigDecimal.ZERO,
                order.getDiscountAmount() != null ? order.getDiscountAmount() : BigDecimal.ZERO,
                order.getSubtotal() != null ? order.getSubtotal() : order.getTotalAmount(),
                length,
                breadth,
                height,
                weight
        );
    }
}
