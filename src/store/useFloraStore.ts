"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import { CartItem, Coupon, Order } from "@/types/cart";
import { Product } from "@/types/product";

export interface ToastMessage {
  id: string;
  message: string;
  type: "success" | "info" | "warning" | "error";
}

interface FloraState {
  // Cart
  cart: CartItem[];
  isCartOpen: boolean;
  coupon: Coupon | null;
  addToCart: (product: Product, quantity?: number, selectedOption?: string) => void;
  removeFromCart: (id: string) => void;
  updateQuantity: (id: string, delta: number) => void;
  clearCart: () => void;
  openCart: () => void;
  closeCart: () => void;
  applyCoupon: (code: string) => boolean;
  removeCoupon: () => void;
  
  // Math Getters
  getSubtotal: () => number;
  getShipping: () => number;
  getDiscount: () => number;
  getTotal: () => number;
  getCartCount: () => number;

  // Wishlist
  wishlist: string[]; // product IDs
  isWishlistOpen: boolean;
  toggleWishlist: (productId: string) => void;
  isInWishlist: (productId: string) => boolean;
  openWishlist: () => void;
  closeWishlist: () => void;

  // Flora AI Panel
  isAIOpen: boolean;
  openAI: () => void;
  openFloraAI: () => void;
  closeAI: () => void;

  // Search
  searchQuery: string;
  setSearchQuery: (query: string) => void;

  // Toasts
  toasts: ToastMessage[];
  addToast: (message: string, type?: "success" | "info" | "warning" | "error") => void;
  removeToast: (id: string) => void;

  // Orders
  orders: Order[];
  addOrder: (order: Order) => void;
}

export const useFloraStore = create<FloraState>()(
  persist(
    (set, get) => ({
      // Cart State
      cart: [],
      isCartOpen: false,
      coupon: null,

      addToCart: (product, quantity = 1, selectedOption) => {
        set((state) => {
          const existing = state.cart.find((item) => item.id === product.id);
          let newCart: CartItem[];
          if (existing) {
            newCart = state.cart.map((item) =>
              item.id === product.id ? { ...item, quantity: item.quantity + quantity } : item
            );
          } else {
            newCart = [
              ...state.cart,
              {
                id: product.id,
                slug: product.slug,
                name: product.name,
                price: product.price,
                originalPrice: product.originalPrice,
                image: product.image,
                category: product.category,
                quantity,
                selectedOption,
              },
            ];
          }
          return { cart: newCart, isCartOpen: true };
        });
        get().addToast(`Added ${product.name} to cart 🛒`, "success");
      },

      removeFromCart: (id) => {
        set((state) => ({
          cart: state.cart.filter((item) => item.id !== id),
        }));
      },

      updateQuantity: (id, delta) => {
        set((state) => ({
          cart: state.cart
            .map((item) => {
              if (item.id === id) {
                const newQty = item.quantity + delta;
                return newQty > 0 ? { ...item, quantity: newQty } : null;
              }
              return item;
            })
            .filter(Boolean) as CartItem[],
        }));
      },

      clearCart: () => set({ cart: [], coupon: null }),
      openCart: () => set({ isCartOpen: true }),
      closeCart: () => set({ isCartOpen: false }),

      applyCoupon: (code: string) => {
        const normalized = code.trim().toUpperCase();
        if (normalized === "FLORA10") {
          const coupon: Coupon = {
            code: "FLORA10",
            discountPercentage: 10,
            minOrderValue: 0,
            description: "10% off your entire order",
          };
          set({ coupon });
          get().addToast("Coupon FLORA10 applied! 10% discount 🌿", "success");
          return true;
        }
        if (normalized === "NATURE20") {
          if (get().getSubtotal() < 1000) {
            get().addToast("NATURE20 requires a minimum order of ₹1000", "warning");
            return false;
          }
          const coupon: Coupon = {
            code: "NATURE20",
            discountPercentage: 20,
            minOrderValue: 1000,
            description: "20% off on orders above ₹1000",
          };
          set({ coupon });
          get().addToast("Coupon NATURE20 applied! 20% discount 🎉", "success");
          return true;
        }
        get().addToast("Invalid coupon code. Try FLORA10", "error");
        return false;
      },

      removeCoupon: () => set({ coupon: null }),

      getSubtotal: () => {
        return get().cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
      },

      getShipping: () => {
        const subtotal = get().getSubtotal();
        if (subtotal === 0) return 0;
        return subtotal >= 799 ? 0 : 79;
      },

      getDiscount: () => {
        const coupon = get().coupon;
        if (!coupon) return 0;
        const subtotal = get().getSubtotal();
        return Math.round((subtotal * coupon.discountPercentage) / 100);
      },

      getTotal: () => {
        return Math.max(0, get().getSubtotal() + get().getShipping() - get().getDiscount());
      },

      getCartCount: () => {
        return get().cart.reduce((sum, item) => sum + item.quantity, 0);
      },

      // Wishlist State
      wishlist: [],
      isWishlistOpen: false,

      toggleWishlist: (productId) => {
        set((state) => {
          const exists = state.wishlist.includes(productId);
          const newWishlist = exists
            ? state.wishlist.filter((id) => id !== productId)
            : [...state.wishlist, productId];
          return { wishlist: newWishlist };
        });
        const isNowWished = get().wishlist.includes(productId);
        get().addToast(
          isNowWished ? "Saved to your green wishlist 💚" : "Removed from wishlist",
          isNowWished ? "success" : "info"
        );
      },

      isInWishlist: (productId) => {
        return get().wishlist.includes(productId);
      },

      openWishlist: () => set({ isWishlistOpen: true }),
      closeWishlist: () => set({ isWishlistOpen: false }),

      // Flora AI
      isAIOpen: false,
      openAI: () => set({ isAIOpen: true }),
      openFloraAI: () => set({ isAIOpen: true }),
      closeAI: () => set({ isAIOpen: false }),

      // Search
      searchQuery: "",
      setSearchQuery: (query) => set({ searchQuery: query }),

      // Toasts
      toasts: [],
      addToast: (message, type = "info") => {
        const id = Math.random().toString(36).substring(2, 9);
        set((state) => ({ toasts: [...state.toasts, { id, message, type }] }));
        setTimeout(() => {
          get().removeToast(id);
        }, 3500);
      },
      removeToast: (id) => {
        set((state) => ({ toasts: state.toasts.filter((t) => t.id !== id) }));
      },

      // Orders
      orders: [],
      addOrder: (order) => set((state) => ({ orders: [order, ...state.orders] })),
    }),
    {
      name: "flora-fusion-storage",
      partialize: (state) => ({
        cart: state.cart,
        coupon: state.coupon,
        wishlist: state.wishlist,
        orders: state.orders,
      }),
    }
  )
);
