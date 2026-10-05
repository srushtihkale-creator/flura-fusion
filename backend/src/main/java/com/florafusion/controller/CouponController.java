package com.florafusion.controller;

import com.florafusion.dto.coupon.CouponResponse;
import com.florafusion.service.CouponService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/coupons")
@RequiredArgsConstructor
@Tag(name = "Coupons & Offers", description = "Public Promotional Discounts and Active Nursery Coupons")
public class CouponController {

    private final CouponService couponService;

    @GetMapping
    @Operation(summary = "Get all active promotional coupons and discount offers")
    public ResponseEntity<List<CouponResponse>> getActiveCoupons() {
        return ResponseEntity.ok(couponService.getActiveCoupons());
    }

    @GetMapping("/active")
    @Operation(summary = "Get all active promotional coupons and discount offers")
    public ResponseEntity<List<CouponResponse>> getActiveCouponsAlias() {
        return ResponseEntity.ok(couponService.getActiveCoupons());
    }

    @GetMapping("/{code}")
    @Operation(summary = "Get details of an active coupon by code")
    public ResponseEntity<CouponResponse> getCouponByCode(@PathVariable String code) {
        return ResponseEntity.ok(couponService.getCouponByCode(code));
    }
}
