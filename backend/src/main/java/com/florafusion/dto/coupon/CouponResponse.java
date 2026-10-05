package com.florafusion.dto.coupon;

import com.florafusion.entity.Coupon;

import java.math.BigDecimal;
import java.time.Instant;
import java.util.UUID;

public record CouponResponse(
    UUID id,
    String code,
    String discountType,
    BigDecimal discountValue,
    BigDecimal minCartValue,
    BigDecimal maxDiscount,
    String title,
    String description,
    String terms,
    String bannerText,
    boolean autoApply,
    String applicableCategory,
    String applicableProductIds,
    String targetLink,
    Integer bundleQty,
    BigDecimal bundlePrice,
    int displayOrder,
    Instant startDate,
    Instant endDate,
    boolean isActive
) {
    public static CouponResponse fromEntity(Coupon c) {
        String title = c.getTitle();
        String desc = null;
        String terms = null;
        String banner = c.getBannerText();

        if (title == null || title.isBlank()) {
            if ("BUNDLE".equalsIgnoreCase(c.getDiscountType())) {
                title = "Buy Any " + (c.getBundleQty() != null ? c.getBundleQty() : 4) + " Plants @ ₹" + (c.getBundlePrice() != null ? c.getBundlePrice().intValue() : 1199);
            } else if ("FREE_SHIPPING".equalsIgnoreCase(c.getDiscountType())) {
                title = "Free Shipping";
            } else if ("PERCENTAGE".equalsIgnoreCase(c.getDiscountType())) {
                int pct = c.getDiscountValue().intValue();
                title = pct + "% OFF";
            } else {
                int amt = c.getDiscountValue().intValue();
                title = "FLAT ₹" + amt + " OFF";
            }
        }

        if (banner == null || banner.isBlank()) {
            if ("BUNDLE".equalsIgnoreCase(c.getDiscountType())) {
                banner = "🌿 BUY ANY " + (c.getBundleQty() != null ? c.getBundleQty() : 4) + " PLANTS @ ₹" + (c.getBundlePrice() != null ? c.getBundlePrice().intValue() : 1199);
            } else if ("FREE_SHIPPING".equalsIgnoreCase(c.getDiscountType())) {
                banner = "🚚 FREE SHIPPING ABOVE ₹" + (c.getMinCartValue() != null ? c.getMinCartValue().intValue() : 499);
            } else if ("PERCENTAGE".equalsIgnoreCase(c.getDiscountType())) {
                banner = "🎉 GET " + c.getDiscountValue().intValue() + "% OFF ON ORDERS ABOVE ₹" + (c.getMinCartValue() != null ? c.getMinCartValue().intValue() : 0);
            } else {
                banner = "✨ FLAT ₹" + c.getDiscountValue().intValue() + " OFF ON ORDERS ABOVE ₹" + (c.getMinCartValue() != null ? c.getMinCartValue().intValue() : 0);
            }
        }

        if ("BUNDLE".equalsIgnoreCase(c.getDiscountType())) {
            desc = "Special Botanical Bundle: Any " + (c.getBundleQty() != null ? c.getBundleQty() : 4) + " plants at ₹" + (c.getBundlePrice() != null ? c.getBundlePrice().intValue() : 1199);
            terms = "Applicable on all live nursery plants";
        } else if ("FREE_SHIPPING".equalsIgnoreCase(c.getDiscountType())) {
            desc = "Free doorstep delivery across India on orders above ₹" + (c.getMinCartValue() != null ? c.getMinCartValue().intValue() : 499);
            terms = "Min. cart value ₹" + (c.getMinCartValue() != null ? c.getMinCartValue().intValue() : 499);
        } else if ("PERCENTAGE".equalsIgnoreCase(c.getDiscountType())) {
            int pct = c.getDiscountValue().intValue();
            if (c.getMinCartValue() != null && c.getMinCartValue().compareTo(BigDecimal.ZERO) > 0) {
                desc = pct + "% off on orders above ₹" + c.getMinCartValue().intValue();
                terms = "Min. cart value ₹" + c.getMinCartValue().intValue() + 
                    (c.getMaxDiscount() != null ? " • Max discount ₹" + c.getMaxDiscount().intValue() : "");
            } else {
                desc = pct + "% off on all plants, pots & seeds";
                terms = "No minimum order" + 
                    (c.getMaxDiscount() != null ? " • Max discount ₹" + c.getMaxDiscount().intValue() : "");
            }
        } else {
            int amt = c.getDiscountValue().intValue();
            desc = "Flat ₹" + amt + " discount on your order";
            terms = (c.getMinCartValue() != null && c.getMinCartValue().compareTo(BigDecimal.ZERO) > 0 
                ? "Min. cart value ₹" + c.getMinCartValue().intValue() : "No minimum order");
        }

        return new CouponResponse(
            c.getId(),
            c.getCode(),
            c.getDiscountType(),
            c.getDiscountValue(),
            c.getMinCartValue(),
            c.getMaxDiscount(),
            title,
            desc,
            terms,
            banner,
            c.isAutoApply(),
            c.getApplicableCategory() != null ? c.getApplicableCategory() : "all",
            c.getApplicableProductIds(),
            c.getTargetLink() != null ? c.getTargetLink() : "/plants",
            c.getBundleQty(),
            c.getBundlePrice(),
            c.getDisplayOrder(),
            c.getStartDate(),
            c.getEndDate(),
            c.isActive()
        );
    }
}
