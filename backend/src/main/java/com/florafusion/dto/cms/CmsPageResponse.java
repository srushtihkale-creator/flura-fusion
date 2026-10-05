package com.florafusion.dto.cms;

import com.florafusion.entity.CmsPage;

import java.util.UUID;

public record CmsPageResponse(
    UUID id,
    String slug,
    String title,
    String category,
    String author,
    String readingTime,
    String coverImage,
    String excerpt,
    String contentMarkdown
) {
    public static CmsPageResponse fromEntity(CmsPage page) {
        return new CmsPageResponse(
            page.getId(),
            page.getSlug(),
            page.getTitle(),
            page.getCategory(),
            page.getAuthor(),
            page.getReadingTime(),
            page.getCoverImage(),
            page.getExcerpt(),
            page.getContentMarkdown()
        );
    }
}
