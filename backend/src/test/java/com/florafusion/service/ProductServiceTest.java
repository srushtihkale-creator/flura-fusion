package com.florafusion.service;

import com.florafusion.dto.catalog.ProductResponse;
import com.florafusion.entity.Category;
import com.florafusion.entity.Product;
import com.florafusion.exception.ResourceNotFoundException;
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
import java.util.List;
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
}
