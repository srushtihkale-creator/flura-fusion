package com.florafusion.dto.catalog;

import java.util.List;

public record AdminImagesUpdateRequest(
    String primaryImage,
    List<String> galleryImages
) {}
