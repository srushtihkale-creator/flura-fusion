package com.florafusion.controller;

import com.florafusion.dto.order.CreateOrderRequest;
import com.florafusion.dto.order.OrderResponse;
import com.florafusion.dto.order.OrderValidationResponse;
import com.florafusion.dto.order.ValidateOrderRequest;
import com.florafusion.entity.Order;
import com.florafusion.security.UserPrincipal;
import com.florafusion.service.InvoiceService;
import com.florafusion.service.OrderService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.UUID;

@RestController
@RequestMapping("/api/v1/orders")
@RequiredArgsConstructor
@Tag(name = "Orders & Checkout", description = "Authoritative Checkout, Validation, Orders & PDF Invoices")
public class OrderController {

    private final OrderService orderService;
    private final InvoiceService invoiceService;

    @PostMapping("/validate")
    @Operation(summary = "Validate checkout cart, stock, and calculate authoritative price breakdown")
    public ResponseEntity<OrderValidationResponse> validateOrder(@Valid @RequestBody ValidateOrderRequest request) {
        return ResponseEntity.ok(orderService.validateOrder(request));
    }

    @PostMapping
    @Operation(summary = "Place customer or guest order with stock deduction and mock payment")
    public ResponseEntity<OrderResponse> createOrder(
            @AuthenticationPrincipal UserPrincipal principal,
            @Valid @RequestBody CreateOrderRequest request
    ) {
        UUID userId = principal != null ? principal.getId() : null;
        OrderResponse response = orderService.createOrder(request, userId);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @GetMapping("/track/{orderNumber}")
    @Operation(summary = "Get live order tracking milestones and order summary")
    public ResponseEntity<OrderResponse> trackOrder(@PathVariable String orderNumber) {
        return ResponseEntity.ok(orderService.getOrderByNumber(orderNumber));
    }

    @GetMapping("/{identifier}")
    @Operation(summary = "Get order details by order number or ID (Privacy Protected)")
    public ResponseEntity<OrderResponse> getOrder(
            @AuthenticationPrincipal UserPrincipal principal,
            @PathVariable String identifier
    ) {
        UUID userId = principal != null ? principal.getId() : null;
        boolean isAdmin = principal != null && principal.getAuthorities().stream()
                .anyMatch(a -> a.getAuthority().equals("ROLE_ADMIN"));
        return ResponseEntity.ok(orderService.getOrderByIdentifier(identifier, userId, isAdmin));
    }

    @GetMapping("/my-orders")
    @Operation(summary = "Get authenticated customer order history")
    public ResponseEntity<Page<OrderResponse>> getMyOrders(
            @AuthenticationPrincipal UserPrincipal principal,
            @RequestParam(required = false, defaultValue = "0") int page,
            @RequestParam(required = false, defaultValue = "10") int size
    ) {
        return ResponseEntity.ok(orderService.getMyOrders(principal.getId(), PageRequest.of(page, size)));
    }

    @GetMapping("/{orderNumber}/invoice")
    @Operation(summary = "Download official Flora Fusion PDF tax invoice (Privacy Protected)")
    public ResponseEntity<byte[]> downloadInvoice(
            @AuthenticationPrincipal UserPrincipal principal,
            @PathVariable String orderNumber
    ) {
        Order order = orderService.getOrderEntity(orderNumber);

        // RBAC / Privacy check
        if (order.getUser() != null) {
            boolean isAdmin = principal != null && principal.getAuthorities().stream()
                    .anyMatch(a -> a.getAuthority().equals("ROLE_ADMIN"));
            if (!isAdmin && (principal == null || !principal.getId().equals(order.getUser().getId()))) {
                throw new org.springframework.security.access.AccessDeniedException("Access denied: You are not authorized to download another customer's invoice.");
            }
        }

        byte[] pdfBytes = invoiceService.generateInvoicePdf(order);

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_PDF);
        headers.setContentDispositionFormData("attachment", "invoice-" + order.getOrderNumber() + ".pdf");
        headers.setContentLength(pdfBytes.length);

        return new ResponseEntity<>(pdfBytes, headers, HttpStatus.OK);
    }
}
