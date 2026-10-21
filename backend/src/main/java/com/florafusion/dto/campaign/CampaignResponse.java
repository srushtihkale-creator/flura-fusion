package com.florafusion.dto.campaign;

import com.florafusion.entity.EmailCampaign;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.Instant;
import java.util.UUID;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CampaignResponse {

    private UUID id;
    private String title;
    private String subject;
    private String promotionalMessage;
    private String couponCode;
    private String couponTitle;
    private BigDecimal discountValue;
    private String discountType;
    private String targetCategory;
    private String targetProductIds;
    private String status;
    private Instant startDate;
    private Instant endDate;
    private int totalRecipients;
    private int sentCount;
    private int failedCount;
    private boolean testMode;
    private String testRecipient;
    private Instant approvedAt;
    private Instant sentAt;
    private Instant createdAt;
    private Instant updatedAt;

    public static CampaignResponse fromEntity(EmailCampaign entity) {
        if (entity == null) return null;

        String code = null;
        String couponTitle = null;
        BigDecimal discountVal = null;
        String discountType = null;

        if (entity.getCoupon() != null) {
            code = entity.getCoupon().getCode();
            couponTitle = entity.getCoupon().getTitle() != null ? entity.getCoupon().getTitle() : entity.getCoupon().getBannerText();
            discountVal = entity.getCoupon().getDiscountValue();
            discountType = entity.getCoupon().getDiscountType();
        }

        return CampaignResponse.builder()
                .id(entity.getId())
                .title(entity.getTitle())
                .subject(entity.getSubject())
                .promotionalMessage(entity.getPromotionalMessage())
                .couponCode(code)
                .couponTitle(couponTitle)
                .discountValue(discountVal)
                .discountType(discountType)
                .targetCategory(entity.getTargetCategory())
                .targetProductIds(entity.getTargetProductIds())
                .status(entity.getStatus())
                .startDate(entity.getStartDate())
                .endDate(entity.getEndDate())
                .totalRecipients(entity.getTotalRecipients())
                .sentCount(entity.getSentCount())
                .failedCount(entity.getFailedCount())
                .testMode(entity.isTestMode())
                .testRecipient(entity.getTestRecipient())
                .approvedAt(entity.getApprovedAt())
                .sentAt(entity.getSentAt())
                .createdAt(entity.getCreatedAt())
                .updatedAt(entity.getUpdatedAt())
                .build();
    }
}
