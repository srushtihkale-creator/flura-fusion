package com.florafusion.dto.cms;

import com.florafusion.entity.CmsBanner;

import java.util.UUID;

public record CmsBannerResponse(
    UUID id,
    String slotKey,
    String title,
    String subtitle,
    String eyebrow,
    String ctaText,
    String ctaLink,
    String imageUrl,
    int displayOrder
) {
    public static CmsBannerResponse fromEntity(CmsBanner banner) {
        return new CmsBannerResponse(
            banner.getId(),
            banner.getSlotKey(),
            banner.getTitle(),
            banner.getSubtitle(),
            banner.getEyebrow(),
            banner.getCtaText(),
            banner.getCtaLink(),
            banner.getImageUrl(),
            banner.getDisplayOrder()
        );
    }
}
