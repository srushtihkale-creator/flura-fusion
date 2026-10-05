package com.florafusion.dto.catalog;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.florafusion.entity.MediaType;
import com.florafusion.entity.Product;
import com.florafusion.entity.ProductImage;

import java.math.BigDecimal;
import java.util.*;

public record ProductResponse(
    String id,
    String category,
    String subCategory,
    String name,
    String slug,
    String tagline,
    String description,
    String sku,
    BigDecimal price,
    BigDecimal originalPrice,
    BigDecimal rating,
    int reviewCount,
    String image,
    List<String> images,
    List<String> images360,
    String badge,
    boolean inStock,
    int stockQuantity,
    Map<String, Object> metadata,
    Map<String, Object> careGuide
) {
    private static final ObjectMapper objectMapper = new ObjectMapper();

    public static ProductResponse fromEntity(Product product) {
        String primaryImage = null;
        List<String> galleryImages = new ArrayList<>();
        List<String> angleImages = new ArrayList<>();

        if (product.getImages() != null) {
            for (ProductImage img : product.getImages()) {
                if (img.getMediaType() == MediaType.PRIMARY && primaryImage == null) {
                    primaryImage = img.getMediaUrl();
                } else if (img.getMediaType() == MediaType.ANGLE_360) {
                    angleImages.add(img.getMediaUrl());
                } else {
                    galleryImages.add(img.getMediaUrl());
                }
            }
        }

        if (primaryImage == null && !galleryImages.isEmpty()) {
            primaryImage = galleryImages.get(0);
        } else if (primaryImage == null && !angleImages.isEmpty()) {
            primaryImage = angleImages.get(0);
        }

        // If angle images exist and gallery is empty, set gallery to angle images
        if (galleryImages.isEmpty() && !angleImages.isEmpty()) {
            galleryImages = new ArrayList<>(angleImages);
        }

        Map<String, Object> metadataMap = Collections.emptyMap();
        Map<String, Object> careGuideMap = Collections.emptyMap();

        try {
            if (product.getMetadata() != null && !product.getMetadata().isBlank()) {
                metadataMap = objectMapper.readValue(product.getMetadata(), new TypeReference<>() {});
            }
            if (product.getCareGuide() != null && !product.getCareGuide().isBlank()) {
                careGuideMap = objectMapper.readValue(product.getCareGuide(), new TypeReference<>() {});
            }
        } catch (Exception ignored) {
        }

        return new ProductResponse(
            product.getId().toString(),
            product.getCategory() != null ? product.getCategory().getSlug() : null,
            product.getSubCategory(),
            product.getName(),
            product.getSlug(),
            product.getTagline(),
            product.getDescription(),
            product.getSku(),
            product.getBasePrice(),
            product.getOriginalPrice(),
            product.getRating(),
            product.getReviewCount(),
            primaryImage,
            galleryImages,
            angleImages,
            product.getBadge(),
            product.isInStock() && product.getStockQuantity() > 0,
            product.getStockQuantity(),
            metadataMap,
            careGuideMap
        );
    }
}
