package com.florafusion.dto.order;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.florafusion.entity.Order;
import com.florafusion.entity.OrderItem;

import java.math.BigDecimal;
import java.time.ZoneId;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.Collections;
import java.util.List;

public record OrderResponse(
    String orderId,
    String orderNumber,
    String date,
    BigDecimal subtotal,
    BigDecimal discount,
    BigDecimal shipping,
    BigDecimal total,
    String paymentMethod,
    String paymentStatus,
    String orderStatus,
    String estimatedDelivery,
    ShippingAddressDto address,
    List<OrderItemDto> items,
    List<TrackingStepDto> trackingSteps
) {
    private static final ObjectMapper objectMapper = new ObjectMapper();
    private static final DateTimeFormatter formatter = DateTimeFormatter.ofPattern("MMM dd, yyyy");

    public record OrderItemDto(
        String id,
        String name,
        String sku,
        String image,
        String category,
        int quantity,
        BigDecimal price,
        BigDecimal discount,
        BigDecimal lineTotal
    ) {}

    public record TrackingStepDto(
        String label,
        String time,
        boolean completed
    ) {}

    public static OrderResponse fromEntity(Order order) {
        String formattedDate = order.getCreatedAt() != null
            ? formatter.format(order.getCreatedAt().atZone(ZoneId.systemDefault()))
            : "Today";

        ShippingAddressDto addressDto = null;
        try {
            if (order.getShippingAddressSnapshot() != null) {
                addressDto = objectMapper.readValue(order.getShippingAddressSnapshot(), ShippingAddressDto.class);
            }
        } catch (Exception ignored) {
        }

        List<TrackingStepDto> trackingSteps = new ArrayList<>();
        try {
            if (order.getTrackingMilestones() != null) {
                trackingSteps = objectMapper.readValue(order.getTrackingMilestones(), new TypeReference<>() {});
            }
        } catch (Exception ignored) {
        }

        if (trackingSteps.isEmpty()) {
            trackingSteps = generateDefaultTrackingSteps(order.getOrderStatus(), formattedDate);
        }

        List<OrderItemDto> itemDtos = new ArrayList<>();
        if (order.getItems() != null) {
            for (OrderItem item : order.getItems()) {
                itemDtos.add(new OrderItemDto(
                    item.getProduct() != null ? item.getProduct().getId().toString() : item.getId().toString(),
                    item.getProductNameSnapshot(),
                    item.getSkuSnapshot(),
                    item.getProductImageSnapshot(),
                    item.getCategorySnapshot(),
                    item.getQuantity(),
                    item.getUnitPrice(),
                    item.getDiscountAmount(),
                    item.getLineTotal()
                ));
            }
        }

        return new OrderResponse(
            order.getId().toString(),
            order.getOrderNumber(),
            formattedDate,
            order.getSubtotal(),
            order.getDiscountAmount(),
            order.getShippingAmount(),
            order.getTotalAmount(),
            order.getPaymentMethod(),
            order.getPaymentStatus(),
            order.getOrderStatus(),
            "Within 3-5 Business Days",
            addressDto,
            itemDtos,
            trackingSteps
        );
    }

    private static List<TrackingStepDto> generateDefaultTrackingSteps(String currentStatus, String dateStr) {
        List<String> stages = List.of("Placed", "Confirmed", "Packed", "Dispatched", "Out for Delivery", "Delivered");
        int currentIndex = stages.indexOf(currentStatus);
        if (currentIndex < 0) currentIndex = 0;

        List<TrackingStepDto> steps = new ArrayList<>();
        for (int i = 0; i < stages.size(); i++) {
            boolean completed = i <= currentIndex;
            String time = completed ? dateStr : "Pending";
            steps.add(new TrackingStepDto(stages.get(i), time, completed));
        }
        return steps;
    }
}
