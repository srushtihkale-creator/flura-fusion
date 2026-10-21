"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import { CartItem, Coupon, Order } from "@/types/cart";
import { Product } from "@/types/product";
import { AuthUser, AuthService } from "@/services/auth.service";
import { WishlistService } from "@/services/wishlist.service";
import { OrderService } from "@/services/order.service";
import { CartService } from "@/services/cart.service";

export interface ToastMessage {
  id: string;
  message: string;
  type: "success" | "info" | "warning" | "error";
}

interface FloraState {
  // Authentication
  user: AuthUser | null;
  token: string | null;
  isAuthenticated: boolean;
  isAuthModalOpen: boolean;
  authMode: "signin" | "signup" | "verify" | "forgot" | "reset";
  setAuthMode: (mode: "signin" | "signup" | "verify" | "forgot" | "reset") => void;
  openAuthModal: (mode?: "signin" | "signup" | "verify" | "forgot" | "reset") => void;
  closeAuthModal: () => void;
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  loginWithGoogle: (idToken: string) => Promise<{ success: boolean; error?: string }>;
  register: (name: string, email: string, password: string, phone?: string, marketingConsent?: boolean) => Promise<{ success: boolean; error?: string; requiresVerification?: boolean; email?: string }>;
  verifyEmail: (email: string, code: string) => Promise<{ success: boolean; error?: string }>;
  resendVerification: (email: string) => Promise<{ success: boolean; error?: string; message?: string }>;
  forgotPassword: (email: string) => Promise<{ success: boolean; error?: string; message?: string }>;
  resetPassword: (email: string, code: string, newPassword: string) => Promise<{ success: boolean; error?: string; message?: string }>;
  logout: () => void;
  initAuth: () => void;
  loadUserData: () => Promise<void>;
  loadOrders: () => Promise<void>;
  loadWishlist: () => Promise<void>;

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
  applyCoupon: (code: string, couponData?: Partial<Coupon>) => boolean;
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
      // Authentication State
      user: null,
      token: null,
      isAuthenticated: false,
      isAuthModalOpen: false,
      authMode: "signin",

      setAuthMode: (mode) => set({ authMode: mode }),
      openAuthModal: (mode = "signin") => set({ isAuthModalOpen: true, authMode: mode }),
      closeAuthModal: () => set({ isAuthModalOpen: false }),

      login: async (email: string, password: string) => {
        try {
          const res = await AuthService.login(email, password);
          const user: AuthUser = {
            id: res.id,
            email: res.email,
            name: res.name,
            role: res.role,
          };
          set({
            user,
            token: res.token,
            isAuthenticated: true,
            isAuthModalOpen: false,
            // Clear any previous user's cached cart, wishlist, orders before loading fresh user data
            cart: [],
            wishlist: [],
            orders: [],
          });
          get().addToast(`Welcome back, ${res.name}! 🌿`, "success");
          await get().loadUserData();
          return { success: true };
        } catch (err: any) {
          const msg = err?.message || "Invalid credentials. Please try again.";
          return { success: false, error: msg };
        }
      },

      loginWithGoogle: async (idToken: string) => {
        try {
          const res = await AuthService.loginWithGoogle(idToken);
          const user: AuthUser = {
            id: res.id,
            email: res.email,
            name: res.name,
            role: res.role,
            emailVerified: res.emailVerified ?? true,
          };
          set({
            user,
            token: res.token,
            isAuthenticated: true,
            isAuthModalOpen: false,
            // Clear any previous user's cached cart, wishlist, orders before loading fresh user data
            cart: [],
            wishlist: [],
            orders: [],
          });
          get().addToast(`Welcome to Flora Fusion, ${res.name}! 🌿`, "success");
          await get().loadUserData();
          return { success: true };
        } catch (err: any) {
          const msg = err?.message || "Google authentication failed. Please try again.";
          return { success: false, error: msg };
        }
      },

      register: async (name: string, email: string, password: string, phone?: string, marketingConsent = false) => {
        try {
          const res = await AuthService.register(name, email, password, phone, marketingConsent);
          if (res.token) {
            const user: AuthUser = {
              id: res.id,
              email: res.email,
              name: res.name,
              role: res.role,
              phone: phone?.trim(),
              emailVerified: true,
            };
            set({
              user,
              token: res.token,
              isAuthenticated: true,
              isAuthModalOpen: false,
              cart: [],
              wishlist: [],
              orders: [],
              coupon: null,
            });
            get().addToast(`Welcome to Flora Fusion, ${res.name}! 🌱`, "success");
            await get().loadUserData();
            return { success: true };
          } else {
            get().addToast(`Verification code sent to ${res.email}! 🌿`, "info");
            return { success: true, requiresVerification: true, email: res.email };
          }
        } catch (err: any) {
          const msg = err?.message || "Registration failed. Please try again.";
          return { success: false, error: msg };
        }
      },

      verifyEmail: async (email: string, code: string) => {
        try {
          const res = await AuthService.verifyEmail(email, code);
          if (res && res.token) {
            const user: AuthUser = {
              id: res.id,
              email: res.email,
              name: res.name,
              role: res.role,
              emailVerified: true,
            };
            set({
              user,
              token: res.token,
              isAuthenticated: true,
              isAuthModalOpen: false,
              cart: [],
              wishlist: [],
              orders: [],
              coupon: null,
            });
            get().addToast(`Account verified! Welcome to Flora Fusion, ${res.name}! 🌱`, "success");
            await get().loadUserData();
            return { success: true };
          }
          return { success: false, error: "Verification succeeded, but no session token received." };
        } catch (err: any) {
          const msg = err?.message || "Verification failed. Please check the code.";
          return { success: false, error: msg };
        }
      },

      resendVerification: async (email: string) => {
        try {
          const res = await AuthService.resendVerification(email);
          get().addToast("A new verification code has been sent to your email 🌿", "info");
          return { success: true, message: res.message };
        } catch (err: any) {
          const msg = err?.message || "Failed to resend code. Please try again later.";
          return { success: false, error: msg };
        }
      },

      forgotPassword: async (email: string) => {
        try {
          const res = await AuthService.forgotPassword(email);
          get().addToast("If an account exists, a reset code has been sent 📩", "info");
          return { success: true, message: res.message };
        } catch (err: any) {
          const msg = err?.message || "Failed to send reset code. Please try again.";
          return { success: false, error: msg };
        }
      },

      resetPassword: async (email: string, code: string, newPassword: string) => {
        try {
          const res = await AuthService.resetPassword(email, code, newPassword);
          get().addToast("Password reset successful! Please sign in with your new password 🔐", "success");
          return { success: true, message: res.message };
        } catch (err: any) {
          const msg = err?.message || "Password reset failed. Please check the code and try again.";
          return { success: false, error: msg };
        }
      },

      logout: () => {
        AuthService.clearSession();
        set({
          user: null,
          token: null,
          isAuthenticated: false,
          cart: [],
          wishlist: [],
          orders: [],
          coupon: null,
        });
        get().addToast("Signed out successfully. See you soon! 🍃", "info");
      },

      initAuth: () => {
        const token = AuthService.getToken();
        const user = AuthService.getUser();
        if (token && user) {
          set({
            token,
            user,
            isAuthenticated: true,
          });
          get().loadUserData();
        } else {
          AuthService.clearSession();
          set({
            token: null,
            user: null,
            isAuthenticated: false,
            cart: [],
            wishlist: [],
            orders: [],
            coupon: null,
          });
        }
      },

      loadUserData: async () => {
        const { isAuthenticated, token } = get();
        if (!isAuthenticated || !token) return;
        try {
          const [userOrders, userWishlist, userCart] = await Promise.all([
            OrderService.getMyOrders(),
            WishlistService.fetchUserWishlist(),
            CartService.fetchUserCart(),
          ]);
          set({
            orders: userOrders,
            wishlist: userWishlist,
            cart: userCart,
          });
        } catch (err) {
          console.error("Failed to load user-specific data:", err);
        }
      },

      loadOrders: async () => {
        const { isAuthenticated, token } = get();
        if (!isAuthenticated || !token) return;
        try {
          const userOrders = await OrderService.getMyOrders();
          set({ orders: userOrders });
        } catch (err) {
          console.error("Failed to load customer orders:", err);
        }
      },

      loadWishlist: async () => {
        const { isAuthenticated, token } = get();
        if (!isAuthenticated || !token) return;
        try {
          const userWishlist = await WishlistService.fetchUserWishlist();
          set({ wishlist: userWishlist });
        } catch (err) {
          console.error("Failed to load customer wishlist:", err);
        }
      },

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
        if (get().isAuthenticated) {
          CartService.syncAddToCart(product.id, quantity);
        }
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

      clearCart: () => {
        set({ cart: [], coupon: null });
        if (get().isAuthenticated) {
          CartService.syncClearCart();
        }
      },
      openCart: () => set({ isCartOpen: true }),
      closeCart: () => set({ isCartOpen: false }),

      applyCoupon: (code: string, couponData?: Partial<Coupon>) => {
        const normalized = code.trim().toUpperCase();
        if (normalized === "FLORA10") {
          const coupon: Coupon = {
            code: "FLORA10",
            discountPercentage: 10,
            minOrderValue: 0,
            maxDiscount: 500,
            description: "10% off your entire order",
            terms: "No minimum order • Max discount ₹500",
            title: "10% OFF",
          };
          set({ coupon });
          get().addToast("Coupon FLORA10 applied! 10% discount 🌿", "success");
          return true;
        }
        if (normalized === "NATURE20") {
          if (get().getSubtotal() > 0 && get().getSubtotal() < 1000) {
            get().addToast("NATURE20 requires a minimum order of ₹1000", "warning");
            return false;
          }
          const coupon: Coupon = {
            code: "NATURE20",
            discountPercentage: 20,
            minOrderValue: 1000,
            maxDiscount: 1000,
            description: "20% off on orders above ₹1000",
            terms: "Min. cart value ₹1,000 • Max discount ₹1,000",
            title: "20% OFF",
          };
          set({ coupon });
          get().addToast("Coupon NATURE20 applied! 20% discount 🎉", "success");
          return true;
        }
        if (normalized === "WELCOME50") {
          if (get().getSubtotal() > 0 && get().getSubtotal() < 499) {
            get().addToast("WELCOME50 requires a minimum order of ₹499", "warning");
            return false;
          }
          const coupon: Coupon = {
            code: "WELCOME50",
            discountPercentage: 0,
            discountAmount: 50,
            discountType: "FIXED_AMOUNT",
            minOrderValue: 499,
            maxDiscount: 50,
            description: "Flat ₹50 off on orders above ₹499",
            terms: "Min. cart value ₹499 • Welcome offer",
            title: "FLAT ₹50 OFF",
          };
          set({ coupon });
          get().addToast("Coupon WELCOME50 applied! Flat ₹50 discount 🎉", "success");
          return true;
        }
        if (normalized === "PLANTBUNDLE4") {
          const coupon: Coupon = {
            code: "PLANTBUNDLE4",
            discountPercentage: 0,
            discountType: "BUNDLE",
            bundleQty: 4,
            bundlePrice: 1199,
            minOrderValue: 0,
            description: "Buy Any 4 Plants @ ₹1,199 bundle offer",
            terms: "Applicable on live nursery plants",
            title: "Buy Any 4 Plants @ ₹1,199",
            bannerText: "🌿 BUY ANY 4 PLANTS @ ₹1,199",
            autoApply: true,
          };
          set({ coupon });
          get().addToast("Offer applied: Buy Any 4 Plants @ ₹1,199 🌿", "success");
          return true;
        }
        if (normalized === "FREESHIP499") {
          const coupon: Coupon = {
            code: "FREESHIP499",
            discountPercentage: 0,
            discountAmount: 79,
            discountType: "FREE_SHIPPING",
            minOrderValue: 499,
            description: "Free shipping on orders above ₹499",
            terms: "Min. cart value ₹499",
            title: "Free Shipping",
            bannerText: "🚚 FREE SHIPPING ABOVE ₹499",
            autoApply: true,
          };
          set({ coupon });
          get().addToast("Offer applied: Free Shipping Above ₹499 🚚", "success");
          return true;
        }
        if (couponData && couponData.code) {
          if (couponData.minOrderValue && get().getSubtotal() > 0 && get().getSubtotal() < couponData.minOrderValue) {
            get().addToast(`${couponData.code} requires a minimum order of ₹${couponData.minOrderValue}`, "warning");
            return false;
          }
          const coupon: Coupon = {
            code: couponData.code.toUpperCase(),
            discountPercentage: couponData.discountPercentage ?? 0,
            discountAmount: couponData.discountAmount,
            discountType: couponData.discountType ?? "PERCENTAGE",
            minOrderValue: couponData.minOrderValue ?? 0,
            maxDiscount: couponData.maxDiscount,
            description: couponData.description || `Special discount coupon ${couponData.code}`,
            terms: couponData.terms,
            title: couponData.title,
            bannerText: couponData.bannerText,
            autoApply: couponData.autoApply,
            bundleQty: couponData.bundleQty,
            bundlePrice: couponData.bundlePrice,
          };
          set({ coupon });
          get().addToast(`Offer ${coupon.code} applied! 🌿`, "success");
          return true;
        }
        get().addToast("Invalid coupon code. Try FLORA10 or PLANTBUNDLE4", "error");
        return false;
      },

      removeCoupon: () => set({ coupon: null }),

      getSubtotal: () => {
        return get().cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
      },

      getShipping: () => {
        const subtotal = get().getSubtotal();
        if (subtotal === 0) return 0;
        const coupon = get().coupon;
        if (coupon && coupon.discountType === "FREE_SHIPPING" && subtotal >= (coupon.minOrderValue || 0)) {
          return 0;
        }
        return subtotal >= 799 ? 0 : 79;
      },

      getDiscount: () => {
        const coupon = get().coupon;
        if (!coupon) return 0;
        const subtotal = get().getSubtotal();
        if (coupon.discountType === "FREE_SHIPPING") {
          return 0;
        }
        if (coupon.discountType === "BUNDLE") {
          const reqQty = coupon.bundleQty || 4;
          const bundlePrice = coupon.bundlePrice || 1199;
          const plantItems = get().cart.filter((item) => item.category === "plants");
          const totalPlantQty = plantItems.reduce((sum, item) => sum + item.quantity, 0);
          if (totalPlantQty >= reqQty) {
            const unitPrices: number[] = [];
            plantItems.forEach((it) => {
              for (let q = 0; q < it.quantity; q++) {
                unitPrices.push(it.price);
              }
            });
            unitPrices.sort((a, b) => b - a);
            const bundleSum = unitPrices.slice(0, reqQty).reduce((a, b) => a + b, 0);
            if (bundleSum > bundlePrice) {
              return bundleSum - bundlePrice;
            }
          }
          return 0;
        }
        if (coupon.discountType === "FIXED_AMOUNT" || (coupon.discountAmount && coupon.discountPercentage === 0)) {
          return Math.min(coupon.discountAmount ?? 50, subtotal);
        }
        let discount = Math.round((subtotal * coupon.discountPercentage) / 100);
        if (coupon.maxDiscount && discount > coupon.maxDiscount) {
          discount = coupon.maxDiscount;
        }
        return discount;
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
        if (get().isAuthenticated) {
          WishlistService.toggleWishlistBackend(productId).catch(() => {});
        }
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
      addOrder: (order) =>
        set((state) => ({
          orders: [order, ...state.orders.filter((o) => o.orderId !== order.orderId)],
        })),
    }),
    {
      name: "flora-fusion-storage",
      partialize: (state) => ({
        cart: state.cart,
        coupon: state.coupon,
        wishlist: state.wishlist,
        orders: state.orders,
        user: state.user,
        token: state.token,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
);
