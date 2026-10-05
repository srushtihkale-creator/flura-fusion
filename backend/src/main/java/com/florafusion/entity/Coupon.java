package com.florafusion.entity;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.math.BigDecimal;
import java.time.Instant;
import java.util.UUID;

@Entity
@Table(name = "coupons")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Coupon {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @Column(nullable = false, unique = true, length = 40)
    private String code;

    @Column(name = "discount_type", nullable = false, length = 20)
    private String discountType; // "PERCENTAGE" or "FIXED_AMOUNT"

    @Column(name = "discount_value", nullable = false, precision = 10, scale = 2)
    private BigDecimal discountValue;

    @Column(name = "min_cart_value", nullable = false, precision = 10, scale = 2)
    @Builder.Default
    private BigDecimal minCartValue = BigDecimal.ZERO;

    @Column(name = "max_discount", precision = 10, scale = 2)
    private BigDecimal maxDiscount;

    @Column(name = "usage_limit")
    private Integer usageLimit;

    @Column(name = "times_used", nullable = false)
    @Builder.Default
    private int timesUsed = 0;

    @Column(name = "start_date", nullable = false)
    @Builder.Default
    private Instant startDate = Instant.now();

    @Column(name = "end_date")
    private Instant endDate;

    @Column(name = "is_active", nullable = false)
    @Builder.Default
    private boolean isActive = true;

    @Column(name = "title", length = 150)
    private String title;

    @Column(name = "banner_text")
    private String bannerText;

    @Column(name = "auto_apply", nullable = false)
    @Builder.Default
    private boolean autoApply = false;

    @Column(name = "applicable_category", nullable = false, length = 50)
    @Builder.Default
    private String applicableCategory = "all";

    @Column(name = "applicable_product_ids", columnDefinition = "TEXT")
    private String applicableProductIds;

    @Column(name = "target_link")
    @Builder.Default
    private String targetLink = "/plants";

    @Column(name = "bundle_qty")
    private Integer bundleQty;

    @Column(name = "bundle_price", precision = 10, scale = 2)
    private BigDecimal bundlePrice;

    @Column(name = "display_order", nullable = false)
    @Builder.Default
    private int displayOrder = 0;

    @CreationTimestamp
    @Column(name = "created_at", nullable = false, updatable = false)
    private Instant createdAt;

    @UpdateTimestamp
    @Column(name = "updated_at", nullable = false)
    private Instant updatedAt;
}
