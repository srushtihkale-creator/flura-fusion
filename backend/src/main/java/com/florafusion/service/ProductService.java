package com.florafusion.service;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.florafusion.dto.catalog.Admin360ImagesUpdateRequest;
import com.florafusion.dto.catalog.AdminImagesUpdateRequest;
import com.florafusion.dto.catalog.AdminProductRequest;
import com.florafusion.dto.catalog.ProductResponse;
import com.florafusion.entity.Category;
import com.florafusion.entity.MediaType;
import com.florafusion.entity.Product;
import com.florafusion.entity.ProductImage;
import com.florafusion.exception.ResourceNotFoundException;
import com.florafusion.repository.CategoryRepository;
import com.florafusion.repository.ProductRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class ProductService {

    private final ProductRepository productRepository;
    private final CategoryRepository categoryRepository;
    private final ObjectMapper objectMapper = new ObjectMapper();

    // ==========================================
    // PUBLIC STOREFRONT APIs
    // ==========================================

    @Transactional(readOnly = true)
    public Page<ProductResponse> getProducts(String categorySlug, String sortKey, int page, int size) {
        Sort sort = resolveSort(sortKey);
        Pageable pageable = PageRequest.of(page, size, sort);

        Page<Product> productPage;
        if (categorySlug != null && !categorySlug.isBlank()) {
            productPage = productRepository.findByCategorySlugAndStatus(categorySlug.toLowerCase().trim(), "ACTIVE", pageable);
        } else {
            productPage = productRepository.findByStatus("ACTIVE", pageable);
        }

        return productPage.map(ProductResponse::fromEntity);
    }

    @Transactional(readOnly = true)
    public ProductResponse getProductBySlug(String slug) {
        Product product = productRepository.findBySlug(slug)
                .orElseThrow(() -> new ResourceNotFoundException("Product not found with slug: " + slug));
        return ProductResponse.fromEntity(product);
    }

    @Transactional(readOnly = true)
    public Page<ProductResponse> searchProducts(String query, int page, int size) {
        if (query == null || query.isBlank()) {
            return getProducts(null, "featured", page, size);
        }
        Pageable pageable = PageRequest.of(page, size, Sort.by(Sort.Direction.DESC, "rating"));
        return productRepository.searchProducts(query.trim(), pageable).map(ProductResponse::fromEntity);
    }

    @Transactional(readOnly = true)
    public List<ProductResponse> getRelatedProducts(String slug, int limit) {
        Product product = productRepository.findBySlug(slug)
                .orElseThrow(() -> new ResourceNotFoundException("Product not found with slug: " + slug));

        Pageable pageable = PageRequest.of(0, limit);
        return productRepository.findRelatedProducts(product.getCategory().getId(), product.getId(), pageable)
                .stream()
                .map(ProductResponse::fromEntity)
                .toList();
    }

    // ==========================================
    // ADMIN / CMS APIs (ROLE_ADMIN PROTECTED)
    // ==========================================

    @Transactional(readOnly = true)
    public Page<ProductResponse> getAdminProducts(
            String categorySlug,
            String status,
            String search,
            String sortKey,
            int page,
            int size
    ) {
        Sort sort = resolveAdminSort(sortKey);
        Pageable pageable = PageRequest.of(page, size, sort);

        String normalizedCategory = (categorySlug == null || categorySlug.isBlank() || "all".equalsIgnoreCase(categorySlug))
                ? null : categorySlug.toLowerCase().trim();
        String normalizedStatus = (status == null || status.isBlank() || "all".equalsIgnoreCase(status))
                ? null : status.toUpperCase().trim();
        String normalizedSearch = (search == null || search.isBlank())
                ? null : search.trim();

        return productRepository.findForAdmin(normalizedCategory, normalizedStatus, normalizedSearch, pageable)
                .map(ProductResponse::fromEntity);
    }

    @Transactional(readOnly = true)
    public ProductResponse getAdminProductById(UUID id) {
        Product product = productRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Product not found with ID: " + id));
        return ProductResponse.fromEntity(product);
    }

    @Transactional
    public ProductResponse adminCreateProduct(AdminProductRequest request) {
        // 1. Validate Category
        Category category = categoryRepository.findBySlug(request.categorySlug().toLowerCase().trim())
                .orElseThrow(() -> new ResourceNotFoundException("Category not found with slug: " + request.categorySlug()));

        // 2. Resolve and Validate Slug
        String slug = (request.slug() != null && !request.slug().isBlank())
                ? slugify(request.slug())
                : slugify(request.name());

        if (productRepository.existsBySlug(slug)) {
            throw new IllegalArgumentException("Product with slug '" + slug + "' already exists");
        }

        // 3. Validate SKU
        String sku = request.sku().trim().toUpperCase();
        if (productRepository.existsBySku(sku)) {
            throw new IllegalArgumentException("Product with SKU '" + sku + "' already exists");
        }

        // 4. Validate Prices
        BigDecimal basePrice = request.price();
        if (basePrice == null || basePrice.compareTo(BigDecimal.ZERO) < 0) {
            throw new IllegalArgumentException("Base price cannot be negative");
        }
        BigDecimal originalPrice = request.originalPrice() != null ? request.originalPrice() : basePrice;
        if (originalPrice.compareTo(basePrice) < 0) {
            throw new IllegalArgumentException("Original price (MRP) cannot be less than selling price");
        }

        // 5. Stock & Status
        int stockQuantity = request.stockQuantity() != null ? Math.max(0, request.stockQuantity()) : 0;
        boolean inStock = request.inStock() != null ? (request.inStock() && stockQuantity > 0) : (stockQuantity > 0);
        String status = (request.status() != null && !request.status().isBlank())
                ? request.status().toUpperCase().trim()
                : "ACTIVE";

        // 6. Serialize JSON metadata and care guide
        String metadataJson = "{}";
        String careGuideJson = "{}";
        try {
            if (request.metadata() != null) {
                metadataJson = objectMapper.writeValueAsString(request.metadata());
            }
            if (request.careGuide() != null) {
                careGuideJson = objectMapper.writeValueAsString(request.careGuide());
            }
        } catch (Exception e) {
            throw new IllegalArgumentException("Invalid JSON structure in metadata or careGuide", e);
        }

        // 7. Build Product Entity
        Product product = Product.builder()
                .category(category)
                .subCategory(request.subCategory() != null ? request.subCategory().trim().toLowerCase() : "")
                .name(request.name().trim())
                .slug(slug)
                .tagline(request.tagline() != null ? request.tagline().trim() : "")
                .description(request.description().trim())
                .sku(sku)
                .basePrice(basePrice)
                .originalPrice(originalPrice)
                .badge(request.badge() != null && !request.badge().isBlank() ? request.badge().trim() : null)
                .inStock(inStock)
                .stockQuantity(stockQuantity)
                .rating(new BigDecimal("5.0"))
                .reviewCount(0)
                .status(status)
                .metadata(metadataJson)
                .careGuide(careGuideJson)
                .images(new ArrayList<>())
                .build();

        // 8. Attach Images
        attachImagesToProduct(product, request.primaryImage(), request.images(), request.images360());

        Product saved = productRepository.save(product);
        return ProductResponse.fromEntity(saved);
    }

    @Transactional
    public ProductResponse adminUpdateProduct(UUID id, AdminProductRequest request) {
        Product product = productRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Product not found with ID: " + id));

        // 1. Validate Category
        Category category = categoryRepository.findBySlug(request.categorySlug().toLowerCase().trim())
                .orElseThrow(() -> new ResourceNotFoundException("Category not found with slug: " + request.categorySlug()));

        // 2. Validate Slug uniqueness
        String slug = (request.slug() != null && !request.slug().isBlank())
                ? slugify(request.slug())
                : slugify(request.name());

        if (productRepository.existsBySlugAndIdNot(slug, id)) {
            throw new IllegalArgumentException("Another product already exists with slug '" + slug + "'");
        }

        // 3. Validate SKU uniqueness
        String sku = request.sku().trim().toUpperCase();
        if (productRepository.existsBySkuAndIdNot(sku, id)) {
            throw new IllegalArgumentException("Another product already exists with SKU '" + sku + "'");
        }

        // 4. Validate Prices
        BigDecimal basePrice = request.price();
        if (basePrice == null || basePrice.compareTo(BigDecimal.ZERO) < 0) {
            throw new IllegalArgumentException("Base price cannot be negative");
        }
        BigDecimal originalPrice = request.originalPrice() != null ? request.originalPrice() : basePrice;
        if (originalPrice.compareTo(basePrice) < 0) {
            throw new IllegalArgumentException("Original price (MRP) cannot be less than selling price");
        }

        // 5. Stock & Status
        int stockQuantity = request.stockQuantity() != null ? Math.max(0, request.stockQuantity()) : product.getStockQuantity();
        boolean inStock = request.inStock() != null ? (request.inStock() && stockQuantity > 0) : (stockQuantity > 0);
        String status = (request.status() != null && !request.status().isBlank())
                ? request.status().toUpperCase().trim()
                : product.getStatus();

        // 6. Serialize JSON metadata and care guide
        try {
            if (request.metadata() != null) {
                product.setMetadata(objectMapper.writeValueAsString(request.metadata()));
            }
            if (request.careGuide() != null) {
                product.setCareGuide(objectMapper.writeValueAsString(request.careGuide()));
            }
        } catch (Exception e) {
            throw new IllegalArgumentException("Invalid JSON structure in metadata or careGuide", e);
        }

        // 7. Update Product Fields
        product.setCategory(category);
        product.setSubCategory(request.subCategory() != null ? request.subCategory().trim().toLowerCase() : product.getSubCategory());
        product.setName(request.name().trim());
        product.setSlug(slug);
        product.setTagline(request.tagline() != null ? request.tagline().trim() : product.getTagline());
        product.setDescription(request.description().trim());
        product.setSku(sku);
        product.setBasePrice(basePrice);
        product.setOriginalPrice(originalPrice);
        product.setBadge(request.badge() != null && !request.badge().isBlank() ? request.badge().trim() : null);
        product.setStockQuantity(stockQuantity);
        product.setInStock(inStock);
        product.setStatus(status);

        // 8. Update Images if provided
        if (request.primaryImage() != null || request.images() != null || request.images360() != null) {
            product.getImages().clear();
            attachImagesToProduct(product, request.primaryImage(), request.images(), request.images360());
        }

        Product saved = productRepository.save(product);
        return ProductResponse.fromEntity(saved);
    }

    @Transactional
    public ProductResponse adminArchiveProduct(UUID id) {
        Product product = productRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Product not found with ID: " + id));

        product.setStatus("ARCHIVED");
        product.setInStock(false);
        Product saved = productRepository.save(product);
        return ProductResponse.fromEntity(saved);
    }

    @Transactional
    public ProductResponse adminUpdateProductStatus(UUID id, String status) {
        Product product = productRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Product not found with ID: " + id));

        String normalized = status.toUpperCase().trim();
        product.setStatus(normalized);
        if ("INACTIVE".equals(normalized) || "ARCHIVED".equals(normalized)) {
            product.setInStock(false);
        } else if ("ACTIVE".equals(normalized)) {
            product.setInStock(product.getStockQuantity() > 0);
        }

        Product saved = productRepository.save(product);
        return ProductResponse.fromEntity(saved);
    }

    @Transactional
    public ProductResponse adminUpdateProductImages(UUID id, AdminImagesUpdateRequest request) {
        Product product = productRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Product not found with ID: " + id));

        // Preserve 360 angle images
        List<ProductImage> angleImages = new ArrayList<>(
                product.getImages().stream()
                        .filter(img -> img.getMediaType() == MediaType.ANGLE_360)
                        .toList()
        );

        product.getImages().clear();

        // Add primary image
        if (request.primaryImage() != null && !request.primaryImage().isBlank()) {
            product.getImages().add(ProductImage.builder()
                    .product(product)
                    .mediaUrl(request.primaryImage().trim())
                    .mediaType(MediaType.PRIMARY)
                    .sortOrder(0)
                    .altText(product.getName() + " primary image")
                    .build());
        }

        // Add gallery images
        if (request.galleryImages() != null) {
            int order = 1;
            for (String url : request.galleryImages()) {
                if (url != null && !url.isBlank()) {
                    product.getImages().add(ProductImage.builder()
                            .product(product)
                            .mediaUrl(url.trim())
                            .mediaType(MediaType.GALLERY)
                            .sortOrder(order++)
                            .altText(product.getName() + " gallery view " + order)
                            .build());
                }
            }
        }

        // Re-attach angle images
        product.getImages().addAll(angleImages);

        Product saved = productRepository.save(product);
        return ProductResponse.fromEntity(saved);
    }

    @Transactional
    public ProductResponse adminUpdateProduct360Images(UUID id, Admin360ImagesUpdateRequest request) {
        Product product = productRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Product not found with ID: " + id));

        // Remove old 360 images
        product.getImages().removeIf(img -> img.getMediaType() == MediaType.ANGLE_360);

        // Add new 360 frames
        if (request.images360() != null) {
            int frameIndex = 0;
            for (String url : request.images360()) {
                if (url != null && !url.isBlank()) {
                    product.getImages().add(ProductImage.builder()
                            .product(product)
                            .mediaUrl(url.trim())
                            .mediaType(MediaType.ANGLE_360)
                            .sortOrder(frameIndex++)
                            .altText(product.getName() + " 360 frame " + frameIndex)
                            .build());
                }
            }
        }

        Product saved = productRepository.save(product);
        return ProductResponse.fromEntity(saved);
    }

    // ==========================================
    // HELPERS
    // ==========================================

    private void attachImagesToProduct(Product product, String primaryImage, List<String> galleryImages, List<String> images360) {
        int order = 0;
        if (primaryImage != null && !primaryImage.isBlank()) {
            product.getImages().add(ProductImage.builder()
                    .product(product)
                    .mediaUrl(primaryImage.trim())
                    .mediaType(MediaType.PRIMARY)
                    .sortOrder(order++)
                    .altText(product.getName() + " primary image")
                    .build());
        }

        if (galleryImages != null) {
            for (String url : galleryImages) {
                if (url != null && !url.isBlank() && !url.trim().equals(primaryImage != null ? primaryImage.trim() : "")) {
                    product.getImages().add(ProductImage.builder()
                            .product(product)
                            .mediaUrl(url.trim())
                            .mediaType(MediaType.GALLERY)
                            .sortOrder(order++)
                            .altText(product.getName() + " gallery view " + order)
                            .build());
                }
            }
        }

        if (images360 != null) {
            int frameIdx = 0;
            for (String url : images360) {
                if (url != null && !url.isBlank()) {
                    product.getImages().add(ProductImage.builder()
                            .product(product)
                            .mediaUrl(url.trim())
                            .mediaType(MediaType.ANGLE_360)
                            .sortOrder(frameIdx++)
                            .altText(product.getName() + " 360 frame " + frameIdx)
                            .build());
                }
            }
        }
    }

    private String slugify(String input) {
        if (input == null) return "";
        return input.toLowerCase().trim()
                .replaceAll("[^a-z0-9\\s-]", "")
                .replaceAll("[\\s-]+", "-");
    }

    private Sort resolveSort(String sortKey) {
        if (sortKey == null) return Sort.by(Sort.Direction.DESC, "rating");
        return switch (sortKey.toLowerCase()) {
            case "price-low" -> Sort.by(Sort.Direction.ASC, "basePrice");
            case "price-high" -> Sort.by(Sort.Direction.DESC, "basePrice");
            case "rating" -> Sort.by(Sort.Direction.DESC, "rating");
            case "name" -> Sort.by(Sort.Direction.ASC, "name");
            default -> Sort.by(Sort.Direction.DESC, "createdAt");
        };
    }

    private Sort resolveAdminSort(String sortKey) {
        if (sortKey == null) return Sort.by(Sort.Direction.DESC, "createdAt");
        return switch (sortKey.toLowerCase()) {
            case "name-asc" -> Sort.by(Sort.Direction.ASC, "name");
            case "name-desc" -> Sort.by(Sort.Direction.DESC, "name");
            case "price-asc" -> Sort.by(Sort.Direction.ASC, "basePrice");
            case "price-desc" -> Sort.by(Sort.Direction.DESC, "basePrice");
            case "stock-asc" -> Sort.by(Sort.Direction.ASC, "stockQuantity");
            case "stock-desc" -> Sort.by(Sort.Direction.DESC, "stockQuantity");
            case "rating-desc" -> Sort.by(Sort.Direction.DESC, "rating");
            default -> Sort.by(Sort.Direction.DESC, "createdAt");
        };
    }
}
