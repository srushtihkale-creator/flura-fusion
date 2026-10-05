package com.florafusion.controller;

import com.florafusion.dto.catalog.*;
import com.florafusion.dto.coupon.AdminOfferRequest;
import com.florafusion.dto.coupon.CouponResponse;
import com.florafusion.dto.order.OrderResponse;
import com.florafusion.entity.Order;
import com.florafusion.entity.Product;
import com.florafusion.exception.ResourceNotFoundException;
import com.florafusion.repository.OrderRepository;
import com.florafusion.repository.ProductRepository;
import com.florafusion.repository.UserRepository;
import com.florafusion.service.CategoryService;
import com.florafusion.service.CouponService;
import com.florafusion.service.OrderService;
import com.florafusion.service.ProductService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

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
    private final ProductService productService;
    private final CategoryService categoryService;
    private final OrderRepository orderRepository;
    private final OrderService orderService;
    private final UserRepository userRepository;
    private final CouponService couponService;

    // ==========================================
    // DASHBOARD & ANALYTICS
    // ==========================================

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

    // ==========================================
    // PRODUCT CATALOG MANAGEMENT (CRUD)
    // ==========================================

    @GetMapping("/products")
    @Operation(summary = "Get paginated products for admin with category, status, and keyword search filters")
    public ResponseEntity<Page<ProductResponse>> getAdminProducts(
            @RequestParam(required = false) String category,
            @RequestParam(required = false) String status,
            @RequestParam(required = false) String search,
            @RequestParam(required = false, defaultValue = "createdAt") String sort,
            @RequestParam(required = false, defaultValue = "0") int page,
            @RequestParam(required = false, defaultValue = "50") int size
    ) {
        return ResponseEntity.ok(productService.getAdminProducts(category, status, search, sort, page, size));
    }

    @GetMapping("/products/{id}")
    @Operation(summary = "Get complete product details including gallery and 360 frames by ID for editing")
    public ResponseEntity<ProductResponse> getAdminProductById(@PathVariable UUID id) {
        return ResponseEntity.ok(productService.getAdminProductById(id));
    }

    @PostMapping("/products")
    @Operation(summary = "Create a new catalog product with images, JSONB metadata, and care guide")
    public ResponseEntity<ProductResponse> createProduct(@Valid @RequestBody AdminProductRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED).body(productService.adminCreateProduct(request));
    }

    @PutMapping("/products/{id}")
    @Operation(summary = "Update an existing catalog product's attributes, images, metadata, and care guide")
    public ResponseEntity<ProductResponse> updateProduct(
            @PathVariable UUID id,
            @Valid @RequestBody AdminProductRequest request
    ) {
        return ResponseEntity.ok(productService.adminUpdateProduct(id, request));
    }

    @DeleteMapping("/products/{id}")
    @Operation(summary = "Safely archive a product (sets status to ARCHIVED and inStock to false)")
    public ResponseEntity<Map<String, Object>> deleteProduct(@PathVariable UUID id) {
        ProductResponse archived = productService.adminArchiveProduct(id);
        return ResponseEntity.ok(Map.of(
                "message", "Product safely archived",
                "id", id.toString(),
                "status", archived.status()
        ));
    }

    @PatchMapping("/products/{id}/status")
    @Operation(summary = "Change product status (ACTIVE, INACTIVE, ARCHIVED)")
    public ResponseEntity<ProductResponse> updateProductStatus(
            @PathVariable UUID id,
            @RequestBody Map<String, String> body
    ) {
        String status = body.getOrDefault("status", "ACTIVE");
        return ResponseEntity.ok(productService.adminUpdateProductStatus(id, status));
    }

    @PutMapping("/products/{id}/stock")
    @Operation(summary = "Quick-update product inventory stock quantity")
    public ResponseEntity<ProductResponse> updateProductStock(
            @PathVariable UUID id,
            @RequestBody Map<String, Integer> body
    ) {
        Product product = productRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Product not found: " + id));

        Integer stockQuantity = body.get("stockQuantity");
        if (stockQuantity != null) {
            int qty = Math.max(0, stockQuantity);
            product.setStockQuantity(qty);
            product.setInStock(qty > 0 && "ACTIVE".equalsIgnoreCase(product.getStatus()));
            product = productRepository.save(product);
        }

        return ResponseEntity.ok(ProductResponse.fromEntity(product));
    }

    @PutMapping("/products/{id}/price")
    @Operation(summary = "Quick-update product base selling price and original MRP price")
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

    @PutMapping("/products/{id}/images")
    @Operation(summary = "Update product primary image and gallery photography list")
    public ResponseEntity<ProductResponse> updateProductImages(
            @PathVariable UUID id,
            @RequestBody AdminImagesUpdateRequest request
    ) {
        return ResponseEntity.ok(productService.adminUpdateProductImages(id, request));
    }

    @PutMapping("/products/{id}/360")
    @Operation(summary = "Update product sequential 360° turntable frames")
    public ResponseEntity<ProductResponse> updateProduct360Images(
            @PathVariable UUID id,
            @RequestBody Admin360ImagesUpdateRequest request
    ) {
        return ResponseEntity.ok(productService.adminUpdateProduct360Images(id, request));
    }

    // ==========================================
    // CATEGORY MANAGEMENT
    // ==========================================

    @GetMapping("/categories")
    @Operation(summary = "Get all categories (active & inactive) for administrative oversight")
    public ResponseEntity<List<CategoryResponse>> getAllCategories() {
        return ResponseEntity.ok(categoryService.getAllCategoriesForAdmin());
    }

    @PatchMapping("/categories/{id}/status")
    @Operation(summary = "Toggle active/inactive status of a category")
    public ResponseEntity<CategoryResponse> toggleCategoryStatus(
            @PathVariable UUID id,
            @RequestBody Map<String, Object> body
    ) {
        Object val = body.get("isActive");
        if (val == null) {
            val = body.get("active");
        }
        boolean active = val instanceof Boolean ? (Boolean) val : Boolean.parseBoolean(String.valueOf(val));
        return ResponseEntity.ok(categoryService.toggleCategoryStatus(id, active));
    }

    // ==========================================
    // ORDER FULFILLMENT MANAGEMENT
    // ==========================================

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
    @Operation(summary = "Update order delivery and shipping tracking status (triggers customer notification email)")
    public ResponseEntity<OrderResponse> updateOrderStatus(
            @PathVariable UUID id,
            @RequestBody Map<String, String> body
    ) {
        String newStatus = body.get("status");
        return ResponseEntity.ok(orderService.updateOrderStatus(id, newStatus));
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
