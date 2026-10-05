package com.florafusion.controller;

import com.florafusion.dto.catalog.ProductResponse;
import com.florafusion.security.UserPrincipal;
import com.florafusion.service.WishlistService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/v1/wishlist")
@RequiredArgsConstructor
@Tag(name = "Wishlist", description = "Customer Wishlist Persistence")
public class WishlistController {

    private final WishlistService wishlistService;

    @GetMapping
    @Operation(summary = "Get saved products in customer wishlist")
    public ResponseEntity<List<ProductResponse>> getWishlist(@AuthenticationPrincipal UserPrincipal principal) {
        return ResponseEntity.ok(wishlistService.getWishlist(principal.getId()));
    }

    @PostMapping("/toggle/{productId}")
    @Operation(summary = "Toggle product in customer wishlist (add or remove)")
    public ResponseEntity<Map<String, Object>> toggleWishlist(
            @AuthenticationPrincipal UserPrincipal principal,
            @PathVariable String productId
    ) {
        boolean inWishlist = wishlistService.toggleWishlist(principal.getId(), productId);
        return ResponseEntity.ok(Map.of(
            "productId", productId,
            "inWishlist", inWishlist
        ));
    }
}
