package com.florafusion.service;

import com.florafusion.dto.coupon.AdminOfferRequest;
import com.florafusion.dto.coupon.CouponResponse;
import com.florafusion.entity.Coupon;
import com.florafusion.exception.BadRequestException;
import com.florafusion.exception.ResourceNotFoundException;
import com.florafusion.repository.CouponRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.Instant;
import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class CouponService {

    private final CouponRepository couponRepository;

    @Transactional(readOnly = true)
    public List<CouponResponse> getActiveCoupons() {
        Instant now = Instant.now();
        return couponRepository.findAllByIsActiveTrueOrderByDisplayOrderAsc()
                .stream()
                .filter(c -> c.getEndDate() == null || c.getEndDate().isAfter(now))
                .filter(c -> c.getStartDate() == null || !c.getStartDate().isAfter(now))
                .filter(c -> c.getUsageLimit() == null || c.getTimesUsed() < c.getUsageLimit())
                .map(CouponResponse::fromEntity)
                .toList();
    }

    @Transactional(readOnly = true)
    public CouponResponse getCouponByCode(String code) {
        return couponRepository.findByCodeIgnoreCaseAndIsActiveTrue(code)
                .filter(c -> c.getEndDate() == null || c.getEndDate().isAfter(Instant.now()))
                .map(CouponResponse::fromEntity)
                .orElseThrow(() -> new ResourceNotFoundException("Active coupon not found: " + code));
    }

    // ==========================================
    // ADMIN / CMS MANAGEMENT APIS
    // ==========================================

    @Transactional(readOnly = true)
    public List<CouponResponse> getAllCouponsForAdmin() {
        return couponRepository.findAllByOrderByDisplayOrderAscCreatedAtDesc()
                .stream()
                .map(CouponResponse::fromEntity)
                .toList();
    }

    @Transactional
    public CouponResponse createOffer(AdminOfferRequest request) {
        String code = request.code().trim().toUpperCase();
        if (couponRepository.findByCodeIgnoreCase(code).isPresent()) {
            throw new BadRequestException("Coupon or offer code already exists: " + code);
        }

        Coupon coupon = Coupon.builder()
                .code(code)
                .title(request.title())
                .bannerText(request.bannerText())
                .discountType(request.discountType().trim().toUpperCase())
                .discountValue(request.discountValue() != null ? request.discountValue() : BigDecimal.ZERO)
                .minCartValue(request.minCartValue() != null ? request.minCartValue() : BigDecimal.ZERO)
                .maxDiscount(request.maxDiscount())
                .bundleQty(request.bundleQty())
                .bundlePrice(request.bundlePrice())
                .applicableCategory(request.applicableCategory() != null && !request.applicableCategory().isBlank()
                        ? request.applicableCategory().trim().toLowerCase() : "all")
                .applicableProductIds(request.applicableProductIds())
                .targetLink(request.targetLink() != null && !request.targetLink().isBlank()
                        ? request.targetLink().trim() : "/plants")
                .startDate(request.startDate() != null ? request.startDate() : Instant.now())
                .endDate(request.endDate())
                .usageLimit(request.usageLimit())
                .isActive(request.isActive() != null ? request.isActive() : true)
                .autoApply(request.autoApply() != null ? request.autoApply() : false)
                .displayOrder(request.displayOrder() != null ? request.displayOrder() : 0)
                .timesUsed(0)
                .build();

        coupon = couponRepository.save(coupon);
        return CouponResponse.fromEntity(coupon);
    }

    @Transactional
    public CouponResponse updateOffer(UUID id, AdminOfferRequest request) {
        Coupon coupon = couponRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Offer not found with ID: " + id));

        String code = request.code().trim().toUpperCase();
        couponRepository.findByCodeIgnoreCase(code).ifPresent(existing -> {
            if (!existing.getId().equals(id)) {
                throw new BadRequestException("Offer code already in use by another coupon: " + code);
            }
        });

        coupon.setCode(code);
        if (request.title() != null) coupon.setTitle(request.title());
        if (request.bannerText() != null) coupon.setBannerText(request.bannerText());
        if (request.discountType() != null) coupon.setDiscountType(request.discountType().trim().toUpperCase());
        if (request.discountValue() != null) coupon.setDiscountValue(request.discountValue());
        if (request.minCartValue() != null) coupon.setMinCartValue(request.minCartValue());
        coupon.setMaxDiscount(request.maxDiscount());
        coupon.setBundleQty(request.bundleQty());
        coupon.setBundlePrice(request.bundlePrice());
        if (request.applicableCategory() != null) coupon.setApplicableCategory(request.applicableCategory().trim().toLowerCase());
        coupon.setApplicableProductIds(request.applicableProductIds());
        if (request.targetLink() != null) coupon.setTargetLink(request.targetLink().trim());
        if (request.startDate() != null) coupon.setStartDate(request.startDate());
        coupon.setEndDate(request.endDate());
        coupon.setUsageLimit(request.usageLimit());
        if (request.isActive() != null) coupon.setActive(request.isActive());
        if (request.autoApply() != null) coupon.setAutoApply(request.autoApply());
        if (request.displayOrder() != null) coupon.setDisplayOrder(request.displayOrder());

        coupon = couponRepository.save(coupon);
        return CouponResponse.fromEntity(coupon);
    }

    @Transactional
    public CouponResponse toggleOfferStatus(UUID id, boolean isActive) {
        Coupon coupon = couponRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Offer not found with ID: " + id));
        coupon.setActive(isActive);
        coupon = couponRepository.save(coupon);
        return CouponResponse.fromEntity(coupon);
    }

    @Transactional
    public void deleteOffer(UUID id) {
        Coupon coupon = couponRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Offer not found with ID: " + id));
        couponRepository.delete(coupon);
    }
}
