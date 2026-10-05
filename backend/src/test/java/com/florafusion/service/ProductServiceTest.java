package com.florafusion.service;

import com.florafusion.dto.catalog.Admin360ImagesUpdateRequest;
import com.florafusion.dto.catalog.AdminImagesUpdateRequest;
import com.florafusion.dto.catalog.AdminProductRequest;
import com.florafusion.dto.catalog.ProductResponse;
import com.florafusion.entity.Category;
import com.florafusion.entity.Product;
import com.florafusion.exception.ResourceNotFoundException;
import com.florafusion.repository.CategoryRepository;
import com.florafusion.repository.ProductRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.UUID;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class ProductServiceTest {

    @Mock
    private ProductRepository productRepository;

    @Mock
    private CategoryRepository categoryRepository;

    @InjectMocks
    private ProductService productService;

    private Category category;
    private Product product;

    @BeforeEach
    void setUp() {
        category = Category.builder()
                .id(UUID.randomUUID())
                .name("Plants")
                .slug("plants")
                .build();

        product = Product.builder()
                .id(UUID.randomUUID())
                .name("Money Plant")
                .slug("money-plant")
                .sku("FF-PLN-001")
                .basePrice(new BigDecimal("399.00"))
                .originalPrice(new BigDecimal("499.00"))
                .rating(new BigDecimal("4.8"))
                .reviewCount(124)
                .badge("Bestseller")
                .inStock(true)
                .stockQuantity(85)
                .category(category)
                .status("ACTIVE")
                .images(new ArrayList<>())
                .build();
    }

    @Test
    @DisplayName("getProducts by category slug returns mapped page")
    void testGetProducts_ByCategory() {
        Page<Product> page = new PageImpl<>(List.of(product));
        when(productRepository.findByCategorySlugAndStatus(eq("plants"), eq("ACTIVE"), any(Pageable.class)))
                .thenReturn(page);

        Page<ProductResponse> result = productService.getProducts("plants", "rating", 0, 10);

        assertNotNull(result);
        assertEquals(1, result.getTotalElements());
        assertEquals("Money Plant", result.getContent().get(0).name());
        assertEquals("plants", result.getContent().get(0).category());
    }

    @Test
    @DisplayName("getProductBySlug returns product when exists")
    void testGetProductBySlug_Success() {
        when(productRepository.findBySlug("money-plant")).thenReturn(Optional.of(product));

        ProductResponse response = productService.getProductBySlug("money-plant");

        assertNotNull(response);
        assertEquals("Money Plant", response.name());
        assertEquals("FF-PLN-001", response.sku());
    }

    @Test
    @DisplayName("getProductBySlug throws ResourceNotFoundException when slug does not exist")
    void testGetProductBySlug_NotFound() {
        when(productRepository.findBySlug("unknown-plant")).thenReturn(Optional.empty());

        assertThrows(ResourceNotFoundException.class, () -> productService.getProductBySlug("unknown-plant"));
    }

    @Test
    @DisplayName("searchProducts delegates to repository query")
    void testSearchProducts() {
        Page<Product> page = new PageImpl<>(List.of(product));
        when(productRepository.searchProducts(eq("money"), any(Pageable.class))).thenReturn(page);

        Page<ProductResponse> result = productService.searchProducts("money", 0, 10);

        assertNotNull(result);
        assertEquals(1, result.getTotalElements());
        assertEquals("Money Plant", result.getContent().get(0).name());
    }

    @Test
    @DisplayName("adminCreateProduct creates new product with valid data")
    void testAdminCreateProduct_Success() {
        AdminProductRequest request = new AdminProductRequest(
                "Snake Plant",
                "snake-plant",
                "plants",
                "air-purifying",
                "Purifies air & filters toxins",
                "High quality air purifying plant",
                "FF-PLN-002",
                new BigDecimal("499.00"),
                new BigDecimal("599.00"),
                "Popular",
                50,
                true,
                "ACTIVE",
                "/assets/products/plants/snake-plant-1.jpg",
                List.of("/assets/products/plants/snake-plant-2.jpg"),
                List.of("/assets/products/plants/snake-plant-1.jpg", "/assets/products/plants/snake-plant-2.jpg"),
                Map.of("placement", "Indoor"),
                Map.of("watering", "Low Water")
        );

        when(categoryRepository.findBySlug("plants")).thenReturn(Optional.of(category));
        when(productRepository.existsBySlug("snake-plant")).thenReturn(false);
        when(productRepository.existsBySku("FF-PLN-002")).thenReturn(false);
        when(productRepository.save(any(Product.class))).thenAnswer(invocation -> {
            Product p = invocation.getArgument(0);
            p.setId(UUID.randomUUID());
            return p;
        });

        ProductResponse response = productService.adminCreateProduct(request);

        assertNotNull(response);
        assertEquals("Snake Plant", response.name());
        assertEquals("FF-PLN-002", response.sku());
        assertEquals("ACTIVE", response.status());
    }

    @Test
    @DisplayName("adminArchiveProduct sets product status to ARCHIVED")
    void testAdminArchiveProduct() {
        UUID id = product.getId();
        when(productRepository.findById(id)).thenReturn(Optional.of(product));
        when(productRepository.save(any(Product.class))).thenAnswer(invocation -> invocation.getArgument(0));

        ProductResponse response = productService.adminArchiveProduct(id);

        assertNotNull(response);
        assertEquals("ARCHIVED", response.status());
        assertFalse(response.inStock());
    }

    @Test
    @DisplayName("adminUpdateProduct updates product fields")
    void testAdminUpdateProduct() {
        UUID id = product.getId();
        AdminProductRequest updateReq = new AdminProductRequest(
                "Money Plant Golden",
                "money-plant-golden",
                "plants",
                "indoor",
                "Golden prosperity plant",
                "Updated description",
                "FF-PLN-001",
                new BigDecimal("449.00"),
                new BigDecimal("549.00"),
                "Bestseller",
                120,
                true,
                "ACTIVE",
                "/img/primary.jpg",
                List.of("/img/gallery1.jpg"),
                null,
                Map.of("placement", "Indoor"),
                Map.of("watering", "Weekly")
        );

        when(productRepository.findById(id)).thenReturn(Optional.of(product));
        when(categoryRepository.findBySlug("plants")).thenReturn(Optional.of(category));
        when(productRepository.existsBySlugAndIdNot("money-plant-golden", id)).thenReturn(false);
        when(productRepository.existsBySkuAndIdNot("FF-PLN-001", id)).thenReturn(false);
        when(productRepository.save(any(Product.class))).thenAnswer(invocation -> invocation.getArgument(0));

        ProductResponse response = productService.adminUpdateProduct(id, updateReq);

        assertNotNull(response);
        assertEquals("Money Plant Golden", response.name());
        assertEquals(new BigDecimal("449.00"), response.price());
        assertEquals(120, response.stockQuantity());
    }

    @Test
    @DisplayName("adminUpdateProduct360Images updates 360 frames")
    void testAdminUpdate360Images() {
        UUID id = product.getId();
        Admin360ImagesUpdateRequest req = new Admin360ImagesUpdateRequest(List.of("f1.jpg", "f2.jpg", "f3.jpg", "f4.jpg"));

        when(productRepository.findById(id)).thenReturn(Optional.of(product));
        when(productRepository.save(any(Product.class))).thenAnswer(invocation -> invocation.getArgument(0));

        ProductResponse response = productService.adminUpdateProduct360Images(id, req);

        assertNotNull(response);
        assertEquals(4, response.images360().size());
    }
}
