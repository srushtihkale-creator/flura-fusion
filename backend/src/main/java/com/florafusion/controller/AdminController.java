package com.florafusion.controller;

import com.florafusion.dto.catalog.ProductResponse;
import com.florafusion.dto.order.OrderResponse;
import com.florafusion.entity.Order;
import com.florafusion.entity.Product;
import com.florafusion.exception.ResourceNotFoundException;
import com.florafusion.repository.OrderRepository;
import com.florafusion.repository.ProductRepository;
import com.florafusion.repository.UserRepository;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import com.florafusion.dto.coupon.AdminOfferRequest;
import com.florafusion.dto.coupon.CouponResponse;
import com.florafusion.service.CouponService;
import jakarta.validation.Valid;
import java.math.BigDecimal;
import java.util.List;
import java.util.Map;
import java.util.UUID;

@RestController
@RequestMapping("/api/v1/admin")
@RequiredArgsConstructor
@PreAuthorize("hasRole('ADMIN')")
@SecurityRequirement(name = "bearerAuth")
@Tag(name = "Admin / CMS", description = "Protected Administrative Management APIs (Requires ROLE_ADMIN)")
public class AdminController {

    private final ProductRepository productRepository;
    private final OrderRepository orderRepository;
    private final UserRepository userRepository;
    private final CouponService couponService;

    @GetMapping("/dashboard/stats")
    @Operation(summary = "Get high-level business analytics and counters")
    public ResponseEntity<Map<String, Object>> getDashboardStats() {
        long totalProducts = productRepository.count();
        long totalOrders = orderRepository.count();
        long totalCustomers = userRepository.count();

        BigDecimal totalRevenue = orderRepository.findAll()
                .stream()
                .filter(o -> "COMPLETED".equalsIgnoreCase(o.getPaymentStatus()))
                .map(Order::getTotalAmount)
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        return ResponseEntity.ok(Map.of(
            "totalProducts", totalProducts,
            "totalOrders", totalOrders,
            "totalCustomers", totalCustomers,
            "totalRevenue", totalRevenue
        ));
    }

    @GetMapping("/orders")
    @Operation(summary = "Get all customer orders for fulfillment management")
    public ResponseEntity<Page<OrderResponse>> getAllOrders(
            @RequestParam(required = false, defaultValue = "0") int page,
            @RequestParam(required = false, defaultValue = "20") int size
    ) {
        return ResponseEntity.ok(orderRepository.findAllByOrderByCreatedAtDesc(PageRequest.of(page, size))
                .map(OrderResponse::fromEntity));
    }

    @PatchMapping("/orders/{id}/status")
    @Operation(summary = "Update order delivery and shipping tracking status")
    public ResponseEntity<OrderResponse> updateOrderStatus(
            @PathVariable UUID id,
            @RequestBody Map<String, String> body
    ) {
        Order order = orderRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Order not found: " + id));

        String newStatus = body.get("status");
        if (newStatus != null && !newStatus.isBlank()) {
            order.setOrderStatus(newStatus.trim());
            order = orderRepository.save(order);
        }

        return ResponseEntity.ok(OrderResponse.fromEntity(order));
    }

    @PutMapping("/products/{id}/stock")
    @Operation(summary = "Update product inventory stock quantity")
    public ResponseEntity<ProductResponse> updateProductStock(
            @PathVariable UUID id,
            @RequestBody Map<String, Integer> body
    ) {
        Product product = productRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Product not found: " + id));

        Integer stockQuantity = body.get("stockQuantity");
        if (stockQuantity != null) {
            product.setStockQuantity(Math.max(0, stockQuantity));
            product.setInStock(product.getStockQuantity() > 0);
            product = productRepository.save(product);
        }

        return ResponseEntity.ok(ProductResponse.fromEntity(product));
    }

    @PutMapping("/products/{id}/price")
    @Operation(summary = "Update product base and original price without frontend redeployment")
    public ResponseEntity<ProductResponse> updateProductPrice(
            @PathVariable UUID id,
            @RequestBody Map<String, BigDecimal> body
    ) {
        Product product = productRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Product not found: " + id));

        BigDecimal price = body.get("price");
        BigDecimal originalPrice = body.get("originalPrice");

        if (price != null && price.compareTo(BigDecimal.ZERO) >= 0) {
            product.setBasePrice(price);
        }
        if (originalPrice != null) {
            product.setOriginalPrice(originalPrice);
        }

        product = productRepository.save(product);
        return ResponseEntity.ok(ProductResponse.fromEntity(product));
    }

    // ==========================================
    // PROMOTIONAL OFFERS & MARQUEE MANAGEMENT
    // ==========================================

    @GetMapping("/offers")
    @Operation(summary = "Get all promotional offers and discount rules for administrative control")
    public ResponseEntity<List<CouponResponse>> getAllOffers() {
        return ResponseEntity.ok(couponService.getAllCouponsForAdmin());
    }

    @PostMapping("/offers")
    @Operation(summary = "Create a new promotional offer or marquee banner rule")
    public ResponseEntity<CouponResponse> createOffer(@Valid @RequestBody AdminOfferRequest request) {
        return ResponseEntity.ok(couponService.createOffer(request));
    }

    @PutMapping("/offers/{id}")
    @Operation(summary = "Update an existing promotional offer rule")
    public ResponseEntity<CouponResponse> updateOffer(
            @PathVariable UUID id,
            @Valid @RequestBody AdminOfferRequest request
    ) {
        return ResponseEntity.ok(couponService.updateOffer(id, request));
    }

    @PatchMapping("/offers/{id}/status")
    @Operation(summary = "Toggle active/inactive status of a promotional offer")
    public ResponseEntity<CouponResponse> toggleOfferStatus(
            @PathVariable UUID id,
            @RequestBody Map<String, Boolean> body
    ) {
        boolean active = body.getOrDefault("isActive", true);
        return ResponseEntity.ok(couponService.toggleOfferStatus(id, active));
    }

    @DeleteMapping("/offers/{id}")
    @Operation(summary = "Delete a promotional offer rule")
    public ResponseEntity<Map<String, String>> deleteOffer(@PathVariable UUID id) {
        couponService.deleteOffer(id);
        return ResponseEntity.ok(Map.of("message", "Offer deleted successfully", "id", id.toString()));
    }
}
