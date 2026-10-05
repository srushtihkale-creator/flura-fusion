package com.florafusion.service;

import com.florafusion.dto.cart.AddToCartRequest;
import com.florafusion.dto.cart.CartResponse;
import com.florafusion.entity.Cart;
import com.florafusion.entity.CartItem;
import com.florafusion.entity.Product;
import com.florafusion.entity.User;
import com.florafusion.exception.OutOfStockException;
import com.florafusion.repository.CartItemRepository;
import com.florafusion.repository.CartRepository;
import com.florafusion.repository.ProductRepository;
import com.florafusion.repository.UserRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.test.util.ReflectionTestUtils;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.Optional;
import java.util.UUID;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class CartServiceTest {

    @Mock
    private CartRepository cartRepository;

    @Mock
    private CartItemRepository cartItemRepository;

    @Mock
    private ProductRepository productRepository;

    @Mock
    private UserRepository userRepository;

    @InjectMocks
    private CartService cartService;

    private UUID userId;
    private UUID cartId;
    private UUID productId;
    private User user;
    private Cart cart;
    private Product product;

    @BeforeEach
    void setUp() {
        ReflectionTestUtils.setField(cartService, "freeShippingThreshold", new BigDecimal("799.00"));
        ReflectionTestUtils.setField(cartService, "standardShippingFee", new BigDecimal("79.00"));

        userId = UUID.randomUUID();
        cartId = UUID.randomUUID();
        productId = UUID.randomUUID();

        user = User.builder().id(userId).email("customer@florafusion.com").build();
        cart = Cart.builder().id(cartId).user(user).items(new ArrayList<>()).build();

        product = Product.builder()
                .id(productId)
                .name("Snake Plant")
                .slug("snake-plant")
                .sku("FF-PLN-002")
                .basePrice(new BigDecimal("499.00"))
                .inStock(true)
                .stockQuantity(10)
                .build();
    }

    @Test
    @DisplayName("getCart returns empty cart summary when user has no items")
    void testGetCart_Empty() {
        when(cartRepository.findByUserId(userId)).thenReturn(Optional.of(cart));

        CartResponse response = cartService.getCart(userId);

        assertNotNull(response);
        assertEquals(0, response.items().size());
        assertEquals(BigDecimal.ZERO, response.subtotal());
        assertFalse(response.isFreeShipping());
    }

    @Test
    @DisplayName("addToCart throws OutOfStockException when quantity exceeds stock")
    void testAddToCart_OutOfStock() {
        when(cartRepository.findByUserId(userId)).thenReturn(Optional.of(cart));
        when(productRepository.findById(productId)).thenReturn(Optional.of(product));

        AddToCartRequest request = new AddToCartRequest(productId.toString(), 15);

        assertThrows(OutOfStockException.class, () -> cartService.addToCart(userId, request));
    }

    @Test
    @DisplayName("addToCart successfully adds in-stock item")
    void testAddToCart_Success() {
        when(cartRepository.findByUserId(userId)).thenReturn(Optional.of(cart));
        when(productRepository.findById(productId)).thenReturn(Optional.of(product));
        when(cartItemRepository.findByCartIdAndProductId(cartId, productId)).thenReturn(Optional.empty());

        CartItem savedItem = CartItem.builder()
                .id(UUID.randomUUID())
                .cart(cart)
                .product(product)
                .quantity(1)
                .build();
        when(cartItemRepository.save(any(CartItem.class))).thenReturn(savedItem);

        Cart cartWithItem = Cart.builder()
                .id(cartId)
                .user(user)
                .items(new ArrayList<>(java.util.List.of(savedItem)))
                .build();
        when(cartRepository.findById(cartId)).thenReturn(Optional.of(cartWithItem));

        AddToCartRequest request = new AddToCartRequest(productId.toString(), 1);
        CartResponse response = cartService.addToCart(userId, request);

        assertNotNull(response);
        assertEquals(1, response.items().size());
        assertEquals(new BigDecimal("499.00"), response.subtotal());
        assertEquals(new BigDecimal("79.00"), response.shipping()); // below 799
    }
}
