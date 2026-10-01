/* ==========================================================================
   FLORA FUSION — STORE & STATE MANAGEMENT
   Handles Cart, Wishlist, Orders, Coupons, and LocalStorage persistence
   ========================================================================== */

const FloraStore = {
  // --- Cart State ---
  cart: [],
  appliedCoupon: null,
  coupons: {
    'FLORA10': { code: 'FLORA10', discountPercent: 10, description: '10% Welcome Green Discount' },
    'NATURE20': { code: 'NATURE20', discountPercent: 20, minSubtotal: 1000, description: '20% off on orders above ₹1000' }
  },
  freeShippingThreshold: 799,

  // --- Wishlist State ---
  wishlist: [],

  // --- Orders State ---
  orders: [],

  // --- Initializer ---
  init() {
    try {
      const savedCart = localStorage.getItem('flora_cart');
      if (savedCart) this.cart = JSON.parse(savedCart);

      const savedWishlist = localStorage.getItem('flora_wishlist');
      if (savedWishlist) this.wishlist = JSON.parse(savedWishlist);

      const savedCoupon = localStorage.getItem('flora_coupon');
      if (savedCoupon && this.coupons[savedCoupon]) this.appliedCoupon = this.coupons[savedCoupon];

      const savedOrders = localStorage.getItem('flora_orders');
      if (savedOrders) this.orders = JSON.parse(savedOrders);
    } catch (e) {
      console.warn('LocalStorage error:', e);
    }

    this.dispatchCartUpdate();
    this.dispatchWishlistUpdate();
  },

  // --- Cart Operations ---
  addToCart(productId, quantity = 1, options = {}) {
    const product = getProductById(productId);
    if (!product) return false;

    const existingIndex = this.cart.findIndex(item => item.id === productId);
    if (existingIndex > -1) {
      this.cart[existingIndex].quantity += quantity;
    } else {
      this.cart.push({
        id: product.id,
        name: product.name,
        price: product.price,
        image: product.image,
        category: product.category,
        quantity: quantity,
        options: options
      });
    }

    this.saveCart();
    this.showToast(`Added ${product.name} to cart 🌿`, 'success');
    return true;
  },

  updateCartQuantity(productId, quantity) {
    const item = this.cart.find(item => item.id === productId);
    if (!item) return;

    if (quantity <= 0) {
      this.removeFromCart(productId);
    } else {
      item.quantity = quantity;
      this.saveCart();
    }
  },

  removeFromCart(productId) {
    const item = this.cart.find(i => i.id === productId);
    const itemName = item ? item.name : 'Item';
    this.cart = this.cart.filter(item => item.id !== productId);
    this.saveCart();
    this.showToast(`Removed ${itemName} from cart`, 'info');
  },

  clearCart() {
    this.cart = [];
    this.appliedCoupon = null;
    this.saveCart();
  },

  saveCart() {
    try {
      localStorage.setItem('flora_cart', JSON.stringify(this.cart));
      if (this.appliedCoupon) {
        localStorage.setItem('flora_coupon', this.appliedCoupon.code);
      } else {
        localStorage.removeItem('flora_coupon');
      }
    } catch (e) {}
    this.dispatchCartUpdate();
  },

  getCartCount() {
    return this.cart.reduce((total, item) => total + item.quantity, 0);
  },

  getCartSubtotal() {
    return this.cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  },

  getShippingCost() {
    const subtotal = this.getCartSubtotal();
    if (subtotal === 0) return 0;
    return subtotal >= this.freeShippingThreshold ? 0 : 79;
  },

  getDiscountAmount() {
    if (!this.appliedCoupon) return 0;
    const subtotal = this.getCartSubtotal();
    if (this.appliedCoupon.minSubtotal && subtotal < this.appliedCoupon.minSubtotal) {
      return 0;
    }
    return Math.round((subtotal * this.appliedCoupon.discountPercent) / 100);
  },

  getCartTotal() {
    const subtotal = this.getCartSubtotal();
    if (subtotal === 0) return 0;
    return subtotal + this.getShippingCost() - this.getDiscountAmount();
  },

  applyCoupon(code) {
    const upper = (code || '').trim().toUpperCase();
    if (!this.coupons[upper]) {
      this.showToast('Invalid coupon code. Try FLORA10 🍃', 'warning');
      return { success: false, message: 'Invalid coupon' };
    }

    const coupon = this.coupons[upper];
    const subtotal = this.getCartSubtotal();

    if (coupon.minSubtotal && subtotal < coupon.minSubtotal) {
      this.showToast(`Add items worth ₹${coupon.minSubtotal - subtotal} more to use ${upper}`, 'warning');
      return { success: false, message: `Minimum order ₹${coupon.minSubtotal}` };
    }

    this.appliedCoupon = coupon;
    this.saveCart();
    this.showToast(`Coupon ${upper} applied! Saved ${coupon.discountPercent}% 🎉`, 'success');
    return { success: true };
  },

  removeCoupon() {
    this.appliedCoupon = null;
    this.saveCart();
    this.showToast('Coupon removed', 'info');
  },

  // --- Wishlist Operations ---
  toggleWishlist(productId) {
    const product = getProductById(productId);
    if (!product) return false;

    const index = this.wishlist.indexOf(productId);
    if (index > -1) {
      this.wishlist.splice(index, 1);
      this.saveWishlist();
      this.showToast(`Removed ${product.name} from wishlist`, 'info');
      return false;
    } else {
      this.wishlist.push(productId);
      this.saveWishlist();
      this.showToast(`Saved ${product.name} to wishlist ❤️`, 'success');
      return true;
    }
  },

  isInWishlist(productId) {
    return this.wishlist.includes(productId);
  },

  saveWishlist() {
    try {
      localStorage.setItem('flora_wishlist', JSON.stringify(this.wishlist));
    } catch (e) {}
    this.dispatchWishlistUpdate();
  },

  getWishlistCount() {
    return this.wishlist.length;
  },

  // --- Order Creation & Tracking ---
  createOrder(shippingAddress, paymentMethod) {
    if (this.cart.length === 0) return null;

    const orderNumber = 'FF-' + Math.floor(100000 + Math.random() * 900000);
    const dateStr = new Date().toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });

    const newOrder = {
      orderId: orderNumber,
      date: dateStr,
      timestamp: Date.now(),
      items: [...this.cart],
      subtotal: this.getCartSubtotal(),
      shipping: this.getShippingCost(),
      discount: this.getDiscountAmount(),
      total: this.getCartTotal(),
      address: shippingAddress,
      paymentMethod: paymentMethod,
      status: 'Placed',
      estimatedDelivery: '3 to 5 business days',
      trackingSteps: [
        { label: 'Order Placed', time: 'Just now', completed: true },
        { label: 'Confirmed by Nursery', time: 'Expected in 2 hrs', completed: true },
        { label: 'Eco Packaging', time: 'Tomorrow morning', completed: false },
        { label: 'Shipped via Express Flora', time: 'In 24 hrs', completed: false },
        { label: 'Out for Delivery', time: 'In 3 days', completed: false },
        { label: 'Delivered', time: 'In 4 days', completed: false }
      ]
    };

    this.orders.unshift(newOrder);
    try {
      localStorage.setItem('flora_orders', JSON.stringify(this.orders));
      localStorage.setItem('flora_last_order', JSON.stringify(newOrder));
    } catch (e) {}

    this.clearCart();
    return newOrder;
  },

  getLastOrder() {
    try {
      const order = localStorage.getItem('flora_last_order');
      if (order) return JSON.parse(order);
    } catch (e) {}
    return this.orders[0] || null;
  },

  // --- Event Dispatches ---
  dispatchCartUpdate() {
    window.dispatchEvent(new CustomEvent('flora:cart-updated', {
      detail: {
        cart: this.cart,
        count: this.getCartCount(),
        subtotal: this.getCartSubtotal(),
        total: this.getCartTotal()
      }
    }));
  },

  dispatchWishlistUpdate() {
    window.dispatchEvent(new CustomEvent('flora:wishlist-updated', {
      detail: {
        wishlist: this.wishlist,
        count: this.getWishlistCount()
      }
    }));
  },

  // --- Toast System ---
  showToast(message, type = 'info') {
    let container = document.getElementById('flora-toast-container');
    if (!container) {
      container = document.createElement('div');
      container.id = 'flora-toast-container';
      container.className = 'flora-toast-container';
      document.body.appendChild(container);
    }

    const toast = document.createElement('div');
    toast.className = `flora-toast flora-toast-${type}`;
    toast.innerHTML = `
      <div class="toast-content">
        <span class="toast-icon">${type === 'success' ? '🌱' : (type === 'warning' ? '⚠️' : '🍃')}</span>
        <span class="toast-msg">${message}</span>
      </div>
    `;

    container.appendChild(toast);

    // Animate in
    requestAnimationFrame(() => {
      toast.classList.add('visible');
    });

    setTimeout(() => {
      toast.classList.remove('visible');
      setTimeout(() => toast.remove(), 400);
    }, 3200);
  }
};

// Auto initialize on script load
document.addEventListener('DOMContentLoaded', () => {
  FloraStore.init();
});
