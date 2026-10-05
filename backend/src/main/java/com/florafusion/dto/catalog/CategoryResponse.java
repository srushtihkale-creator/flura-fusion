package com.florafusion.dto.catalog;

import com.florafusion.entity.Category;

import java.util.UUID;

public record CategoryResponse(
    UUID id,
    String name,
    String slug,
    String description,
    String imageUrl,
    int displayOrder,
    boolean isActive
) {
    public static CategoryResponse fromEntity(Category category) {
        return new CategoryResponse(
            category.getId(),
            category.getName(),
            category.getSlug(),
            category.getDescription(),
            category.getImageUrl(),
            category.getDisplayOrder(),
            category.isActive()
        );
    }
}
