/* ==========================================================================
   FLORA FUSION — MAIN APPLICATION CONTROLLER
   Router, UI Renderers, Event Handlers, Modals & Cart Drawer
   ========================================================================== */

const FloraApp = {
  activeCategory: 'all',
  activeFilter: 'all',
  currentProduct: null,
  checkoutStep: 1,

  init() {
    this.bindEvents();
    this.initRouter();
    this.renderCatalogGrids();
    this.updateBadges();

    // Listen to store events
    window.addEventListener('flora:cart-updated', (e) => {
      this.updateBadges();
      this.renderCartDrawer();
    });

    window.addEventListener('flora:wishlist-updated', (e) => {
      this.updateBadges();
      this.updateWishlistIcons();
      this.renderWishlistModal();
    });
  },

  // --- Router & Hash Navigation ---
  initRouter() {
    const handleRoute = () => {
      const hash = window.location.hash || '#/';
      const [route, param] = hash.replace('#/', '').split('/');

      // Update nav link active state
      document.querySelectorAll('.nav-link, .mobile-nav-btn').forEach(el => {
        const target = el.getAttribute('data-route');
        if (target === (route || 'home')) {
          el.classList.add('active');
        } else {
          el.classList.remove('active');
        }
      });

      // View switching
      if (!route || route === 'home') {
        this.showView('home-view');
        window.scrollTo({ top: 0, behavior: 'smooth' });
      } else if (['plants', 'pots', 'seeds'].includes(route)) {
        this.showView('catalog-view');
        this.switchCatalogCategory(route);
      } else if (route === 'product' && param) {
        this.openProductModal(param);
      } else if (route === 'about') {
        this.showView('about-view');
        window.scrollTo({ top: 0, behavior: 'smooth' });
      } else if (route === 'plant-care') {
        this.showView('care-view');
        window.scrollTo({ top: 0, behavior: 'smooth' });
      } else if (route === 'checkout') {
        this.openCheckoutModal();
      } else if (route === 'tracking') {
        this.openTrackingModal();
      }
    };

    window.addEventListener('hashchange', handleRoute);
    handleRoute();
  },

  showView(viewId) {
    document.querySelectorAll('.app-view').forEach(v => v.style.display = 'none');
    const target = document.getElementById(viewId);
    if (target) {
      target.style.display = 'block';
      if (typeof FloraAnimations !== 'undefined') {
        FloraAnimations.animateCardsEntrance(`#${viewId} .product-card`);
      }
    }
  },

  switchCatalogCategory(category) {
    this.activeCategory = category;
    this.activeFilter = 'all';

    // Update section titles & subtitles per references
    const titleEl = document.getElementById('catalog-page-title');
    const descEl = document.getElementById('catalog-page-desc');
    const chipsContainer = document.getElementById('catalog-filter-chips');

    const meta = {
      plants: {
        title: "Plants",
        desc: "Green companions for a healthier, happier you.",
        filters: ["All", "Indoor", "Outdoor", "Flowering", "Air Purifying", "Succulents"]
      },
      pots: {
        title: "Pots",
        desc: "The perfect home for your plants.",
        filters: ["All", "Ceramic", "Terracotta", "Hanging", "Decorative", "Self-Watering"]
      },
      seeds: {
        title: "Seeds",
        desc: "Grow your own green dreams.",
        filters: ["All", "Flower", "Vegetable", "Herb", "Fruit"]
      }
    }[category] || meta.plants;

    if (titleEl) titleEl.textContent = meta.title;
    if (descEl) descEl.textContent = meta.desc;

    if (chipsContainer) {
      chipsContainer.innerHTML = meta.filters.map((f, i) => `
        <button class="filter-chip ${i === 0 ? 'active' : ''}" data-filter="${f.toLowerCase().replace(/\s+/g, '-')}">
          ${f}
        </button>
      `).join('');

      chipsContainer.querySelectorAll('.filter-chip').forEach(btn => {
        btn.addEventListener('click', () => {
          chipsContainer.querySelectorAll('.filter-chip').forEach(b => b.classList.remove('active'));
          btn.classList.add('active');
          this.activeFilter = btn.getAttribute('data-filter');
          this.renderDedicatedCatalog();
        });
      });
    }

    this.renderDedicatedCatalog();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  },

  renderDedicatedCatalog() {
    const grid = document.getElementById('dedicated-catalog-grid');
    if (!grid) return;

    let items = FLORA_CATALOG[this.activeCategory] || [];
    if (this.activeFilter !== 'all') {
      items = items.filter(item => {
        const sub = (item.subCategory || '').toLowerCase();
        const f = this.activeFilter.toLowerCase();
        if (sub.includes(f)) return true;
        if (item.metadata && Object.values(item.metadata).some(val => String(val).toLowerCase().includes(f))) return true;
        return false;
      });
    }

    if (items.length === 0) {
      grid.innerHTML = `
        <div style="grid-column: 1 / -1; text-align: center; padding: 48px; background: #fff; border-radius: 12px;">
          <h3>No plants found in this filter 🍃</h3>
          <p>Try selecting "All" or asking Flora AI for custom recommendations.</p>
        </div>
      `;
      return;
    }

    grid.innerHTML = items.map(prod => this.createProductCardHTML(prod)).join('');
    this.attachCardEventListeners(grid);
  },

  // --- Render Homepage Catalog Grids with Section Filters ---
  homeFilters: {
    plants: 'all',
    pots: 'all',
    seeds: 'all'
  },

  renderCatalogGrids() {
    this.filterHomeCategory('plants', 'all');
    this.filterHomeCategory('pots', 'all');
    this.filterHomeCategory('seeds', 'all');
  },

  filterHomeCategory(category, filterValue, buttonEl) {
    const f = (filterValue || 'all').toLowerCase().trim();
    this.homeFilters[category] = f;

    // Update active button state in this section's chips
    if (buttonEl && buttonEl.parentElement) {
      buttonEl.parentElement.querySelectorAll('.home-filter-chip').forEach(b => b.classList.remove('active'));
      buttonEl.classList.add('active');
    }

    const grid = document.getElementById(`home-${category}-grid`);
    if (!grid) return;

    let items = FLORA_CATALOG[category] || [];
    if (f !== 'all') {
      items = items.filter(item => {
        const sub = (item.subCategory || '').toLowerCase();
        if (sub.includes(f)) return true;
        if (item.metadata && Object.values(item.metadata).some(val => String(val).toLowerCase().includes(f))) return true;
        return false;
      });
    }

    grid.innerHTML = items.map(p => this.createProductCardHTML(p)).join('');
    this.attachCardEventListeners(grid);
  },

  createProductCardHTML(prod) {
    const isWished = FloraStore.isInWishlist(prod.id);
    let tagString = '';

    if (prod.category === 'plants') {
      tagString = `<span>☀️ ${prod.metadata.placement}</span> • <span>💧 ${prod.metadata.water.split(' ')[0]} Water</span>`;
    } else if (prod.category === 'pots') {
      tagString = `<span>📏 ${prod.metadata.size.split(' ')[0]}</span> • <span>🏺 ${prod.metadata.material.split(' ')[0]}</span>`;
    } else {
      tagString = `<span>🌿 ${prod.metadata.type.split(' ')[0]}</span> • <span>⚡ ${prod.metadata.difficulty.split(' ')[0]}</span>`;
    }

    return `
      <div class="product-card" data-slug="${prod.slug}" data-id="${prod.id}">
        <div class="product-img-wrapper">
          ${prod.badge ? `<span class="card-badge">${prod.badge}</span>` : ''}
          <button class="card-wishlist-btn ${isWished ? 'active' : ''}" data-id="${prod.id}" title="Save to wishlist" onclick="event.stopPropagation(); FloraApp.toggleWishlist('${prod.id}', this)">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="${isWished ? 'currentColor' : 'none'}" stroke="currentColor" stroke-width="2">
              <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
            </svg>
          </button>
          <img src="${prod.image}" alt="${prod.name}" onerror="this.src='${prod.refImage}'" class="product-card-img" loading="lazy" />
        </div>
        <h4 class="product-name" title="${prod.name}">${prod.name}</h4>
        <p class="product-short-desc">${prod.tagline}</p>
        <div class="product-meta-row">
          <div class="product-rating">
            <span class="star">★</span> ${prod.rating} <span style="color:var(--color-text-muted)">(${prod.reviewCount})</span>
          </div>
          <div class="product-price">
            ₹${prod.price}
            ${prod.originalPrice ? `<span class="product-price-original">₹${prod.originalPrice}</span>` : ''}
          </div>
        </div>
        <div class="product-card-tags">
          ${tagString}
        </div>
        <button class="card-quick-add" onclick="event.stopPropagation(); FloraStore.addToCart('${prod.id}', 1)">
          Add to Cart +
        </button>
      </div>
    `;
  },

  attachCardEventListeners(container) {
    container.querySelectorAll('.product-card').forEach(card => {
      card.addEventListener('click', () => {
        const slug = card.getAttribute('data-slug');
        if (slug) this.openProductModal(slug);
      });
    });
  },

  // --- Product Detail Modal ---
  openProductModal(slug) {
    const prod = getProductBySlug(slug);
    if (!prod) return;
    this.currentProduct = prod;

    const modal = document.getElementById('product-detail-modal');
    if (!modal) return;

    // Populate data
    document.getElementById('modal-prod-img').src = prod.image;
    document.getElementById('modal-prod-img').onerror = () => {
      document.getElementById('modal-prod-img').src = prod.refImage;
    };
    document.getElementById('modal-prod-name').textContent = prod.name;
    document.getElementById('modal-prod-tagline').textContent = prod.tagline;
    document.getElementById('modal-prod-price').textContent = `₹${prod.price}`;
    document.getElementById('modal-prod-original-price').textContent = prod.originalPrice ? `₹${prod.originalPrice}` : '';
    document.getElementById('modal-prod-rating').textContent = `★ ${prod.rating} (${prod.reviewCount} customer reviews)`;
    document.getElementById('modal-prod-desc').textContent = prod.description;

    // Populate Specs
    const specsContainer = document.getElementById('modal-prod-specs');
    if (specsContainer && prod.metadata) {
      specsContainer.innerHTML = Object.entries(prod.metadata).map(([key, val]) => `
        <div class="modal-spec-row">
          <span class="modal-spec-label">${this.capitalizeFirst(key)}</span>
          <span class="modal-spec-val">${Array.isArray(val) ? val.join(', ') : val}</span>
        </div>
      `).join('');
    }

    // Populate Care Guide if plant
    const careBox = document.getElementById('modal-care-guide-box');
    if (careBox) {
      if (prod.careGuide) {
        careBox.style.display = 'block';
        careBox.innerHTML = `
          <h5 style="margin-bottom:8px; color:var(--color-brand-forest);">🌿 Plant Care Guide</h5>
          <p style="font-size:0.8125rem; margin-bottom:4px;"><strong>Watering:</strong> ${prod.careGuide.watering}</p>
          <p style="font-size:0.8125rem; margin-bottom:4px;"><strong>Light:</strong> ${prod.careGuide.sunlight}</p>
          <p style="font-size:0.8125rem; margin-bottom:0;"><strong>Pro Tip:</strong> ${prod.careGuide.proTip}</p>
        `;
      } else {
        careBox.style.display = 'none';
      }
    }

    // Populate Cross-Selling (Prompt 2 Final Sections 26 & 27)
    const crossSellBox = document.getElementById('modal-prod-cross-sell');
    if (crossSellBox) {
      let recs = [];
      if (prod.category === 'plants') {
        recs = [getProductBySlug('ceramic-ripple-pot'), getProductBySlug('terracotta-pot')].filter(Boolean);
      } else if (prod.category === 'pots') {
        recs = [getProductBySlug('money-plant'), getProductBySlug('snake-plant')].filter(Boolean);
      } else {
        recs = [getProductBySlug('self-watering-pot'), getProductBySlug('bamboo-pot')].filter(Boolean);
      }

      if (recs.length > 0) {
        crossSellBox.style.display = 'block';
        crossSellBox.innerHTML = `
          <div class="cross-sell-header">
            <span>🌿</span> Frequently Bought Together
          </div>
          <div class="cross-sell-grid">
            ${recs.map(r => `
              <div class="cross-sell-card">
                <img src="${r.image}" alt="${r.name}" onerror="this.src='${r.refImage}'" class="cross-sell-img" />
                <div class="cross-sell-info">
                  <div class="cross-sell-name">${r.name}</div>
                  <div class="cross-sell-price">₹${r.price}</div>
                </div>
                <button class="cross-sell-add-btn" onclick="event.stopPropagation(); FloraStore.addToCart('${r.id}', 1);">+ Add</button>
              </div>
            `).join('')}
          </div>
        `;
      } else {
        crossSellBox.style.display = 'none';
      }
    }

    // Reset Quantity
    document.getElementById('modal-qty-val').textContent = '1';

    modal.classList.add('open');
  },

  closeProductModal() {
    const modal = document.getElementById('product-detail-modal');
    if (modal) modal.classList.remove('open');
  },

  // --- Cart Drawer Operations ---
  openCartDrawer() {
    const drawer = document.getElementById('cart-drawer');
    const backdrop = document.getElementById('cart-drawer-backdrop');
    if (drawer) drawer.classList.add('open');
    if (backdrop) backdrop.classList.add('open');
    this.renderCartDrawer();
  },

  closeCartDrawer() {
    const drawer = document.getElementById('cart-drawer');
    const backdrop = document.getElementById('cart-drawer-backdrop');
    if (drawer) drawer.classList.remove('open');
    if (backdrop) backdrop.classList.remove('open');
  },

  renderCartDrawer() {
    const itemsContainer = document.getElementById('cart-items-container');
    const subtotalEl = document.getElementById('cart-subtotal');
    const shippingEl = document.getElementById('cart-shipping');
    const discountRow = document.getElementById('cart-discount-row');
    const discountEl = document.getElementById('cart-discount');
    const totalEl = document.getElementById('cart-total');
    const progressBar = document.getElementById('cart-progress-fill');
    const progressText = document.getElementById('cart-progress-text');

    if (!itemsContainer) return;

    if (FloraStore.cart.length === 0) {
      itemsContainer.innerHTML = `
        <div style="text-align:center; padding: 48px 16px;">
          <div style="font-size: 2.8rem; margin-bottom: 12px;">🪴</div>
          <h4 style="margin-bottom: 8px; color:var(--color-brand-forest);">Your garden basket is empty.</h4>
          <p style="font-size:0.875rem; color:var(--color-text-secondary); margin-bottom:16px;">Discover healthy nursery plants, artisan pots, and organic seeds.</p>
          <button class="btn-primary" style="padding: 10px 22px;" onclick="FloraApp.closeCartDrawer(); window.location.hash='#/plants';">
            Explore Plants →
          </button>
        </div>
      `;
      if (subtotalEl) subtotalEl.textContent = '₹0';
      if (shippingEl) shippingEl.textContent = '₹0';
      if (discountRow) discountRow.style.display = 'none';
      if (totalEl) totalEl.textContent = '₹0';
      if (progressBar) progressBar.style.width = '0%';
      if (progressText) progressText.textContent = `Add items worth ₹${FloraStore.freeShippingThreshold} for Free Delivery!`;
      return;
    }

    // Render cart item rows
    itemsContainer.innerHTML = FloraStore.cart.map(item => `
      <div class="cart-item-row" data-id="${item.id}">
        <img src="${item.image}" alt="${item.name}" class="cart-item-img" />
        <div class="cart-item-info">
          <h5 class="cart-item-name">${item.name}</h5>
          <div class="cart-item-price">₹${item.price} each</div>
          <div class="cart-item-actions">
            <div class="qty-counter" style="height: 32px;">
              <button class="qty-btn" onclick="FloraStore.updateCartQuantity('${item.id}', ${item.quantity - 1})">−</button>
              <span class="qty-val" style="width: 32px; font-size: 0.8125rem;">${item.quantity}</span>
              <button class="qty-btn" onclick="FloraStore.updateCartQuantity('${item.id}', ${item.quantity + 1})">+</button>
            </div>
            <button class="cart-item-remove" onclick="FloraStore.removeFromCart('${item.id}')">Remove</button>
          </div>
        </div>
      </div>
    `).join('');

    const subtotal = FloraStore.getCartSubtotal();
    const shipping = FloraStore.getShippingCost();
    const discount = FloraStore.getDiscountAmount();
    const total = FloraStore.getCartTotal();

    if (subtotalEl) subtotalEl.textContent = `₹${subtotal}`;
    if (shippingEl) shippingEl.textContent = shipping === 0 ? 'FREE' : `₹${shipping}`;

    if (discountRow && discountEl) {
      if (discount > 0) {
        discountRow.style.display = 'flex';
        discountEl.textContent = `-₹${discount}`;
      } else {
        discountRow.style.display = 'none';
      }
    }

    if (totalEl) totalEl.textContent = `₹${total}`;

    // Free shipping progress calculation
    if (progressBar && progressText) {
      if (subtotal >= FloraStore.freeShippingThreshold) {
        progressBar.style.width = '100%';
        progressText.innerHTML = '🎉 <strong>Free Delivery unlocked!</strong>';
      } else {
        const remaining = FloraStore.freeShippingThreshold - subtotal;
        const percent = Math.min(100, Math.round((subtotal / FloraStore.freeShippingThreshold) * 100));
        progressBar.style.width = `${percent}%`;
        progressText.textContent = `Add ₹${remaining} more to qualify for Free Delivery 🚚`;
      }
    }
  },

  // --- Wishlist Modal Operations ---
  toggleWishlist(productId, btnEl) {
    const isWished = FloraStore.toggleWishlist(productId);
    if (btnEl) {
      btnEl.classList.toggle('active', isWished);
      btnEl.querySelector('svg').setAttribute('fill', isWished ? 'currentColor' : 'none');
    }
  },

  updateWishlistIcons() {
    document.querySelectorAll('.card-wishlist-btn').forEach(btn => {
      const id = btn.getAttribute('data-id');
      const active = FloraStore.isInWishlist(id);
      btn.classList.toggle('active', active);
      const svg = btn.querySelector('svg');
      if (svg) svg.setAttribute('fill', active ? 'currentColor' : 'none');
    });
  },

  openWishlistModal() {
    const modal = document.getElementById('wishlist-modal');
    if (modal) {
      modal.classList.add('open');
      this.renderWishlistModal();
    }
  },

  closeWishlistModal() {
    const modal = document.getElementById('wishlist-modal');
    if (modal) modal.classList.remove('open');
  },

  renderWishlistModal() {
    const container = document.getElementById('wishlist-items-grid');
    if (!container) return;

    if (FloraStore.wishlist.length === 0) {
      container.innerHTML = `
        <div style="grid-column: 1 / -1; text-align: center; padding: 48px 20px;">
          <div style="font-size: 2.5rem; margin-bottom: 12px;">🌿</div>
          <h3 style="color:var(--color-brand-forest); font-family:var(--font-heading); font-size:1.8rem; margin-bottom:6px;">Your little garden is waiting.</h3>
          <p style="color:var(--color-text-secondary); font-size:0.9375rem; margin-bottom:20px;">Save plants, pots and seeds you love.</p>
          <button class="btn-primary" style="padding: 10px 24px;" onclick="FloraApp.closeWishlistModal(); window.location.hash='#/plants';">
            Explore Plants
          </button>
        </div>
      `;
      return;
    }

    const items = FloraStore.wishlist.map(id => getProductById(id)).filter(Boolean);
    container.innerHTML = items.map(p => this.createProductCardHTML(p)).join('');
    this.attachCardEventListeners(container);
  },

  // --- Checkout Stepper Modal ---
  openCheckoutModal() {
    if (FloraStore.cart.length === 0) {
      FloraStore.showToast('Your cart is empty! Add plants before checkout 🌱', 'warning');
      return;
    }
    this.closeCartDrawer();
    this.checkoutStep = 1;
    this.updateCheckoutStepperUI();
    const modal = document.getElementById('checkout-modal');
    if (modal) modal.classList.add('open');
  },

  closeCheckoutModal() {
    const modal = document.getElementById('checkout-modal');
    if (modal) modal.classList.remove('open');
  },

  updateCheckoutStepperUI() {
    // Hide all step sections
    document.querySelectorAll('.checkout-step-content').forEach(el => el.style.display = 'none');
    const currentSection = document.getElementById(`checkout-step-${this.checkoutStep}`);
    if (currentSection) currentSection.style.display = 'block';

    // Update stepper circles
    document.querySelectorAll('.stepper-step').forEach((el, idx) => {
      if (idx + 1 === this.checkoutStep) el.classList.add('active');
      else el.classList.remove('active');
    });

    // Update summary in step 3
    const checkoutTotal = document.getElementById('checkout-modal-total');
    if (checkoutTotal) checkoutTotal.textContent = `₹${FloraStore.getCartTotal()}`;
  },

  nextCheckoutStep() {
    if (this.checkoutStep === 1) {
      // Validate form
      const name = document.getElementById('checkout-name').value.trim();
      const phone = document.getElementById('checkout-phone').value.trim();
      const address = document.getElementById('checkout-address').value.trim();
      if (!name || !phone || !address) {
        FloraStore.showToast('Please fill in your shipping details', 'warning');
        return;
      }
      this.checkoutStep = 2;
      this.updateCheckoutStepperUI();
    } else if (this.checkoutStep === 2) {
      this.checkoutStep = 3;
      this.updateCheckoutStepperUI();
    } else if (this.checkoutStep === 3) {
      // Place Order
      this.completeOrder();
    }
  },

  prevCheckoutStep() {
    if (this.checkoutStep > 1) {
      this.checkoutStep--;
      this.updateCheckoutStepperUI();
    }
  },

  completeOrder() {
    const address = {
      name: document.getElementById('checkout-name').value,
      phone: document.getElementById('checkout-phone').value,
      address: document.getElementById('checkout-address').value,
      city: document.getElementById('checkout-city').value || 'Mumbai',
      pincode: document.getElementById('checkout-pincode').value || '400001'
    };

    const paymentMethod = document.querySelector('input[name="payment-method"]:checked')?.value || 'UPI';

    const order = FloraStore.createOrder(address, paymentMethod);
    this.closeCheckoutModal();
    this.openConfirmationModal(order);
  },

  // --- Confirmation & Tracking Modals ---
  openConfirmationModal(order) {
    if (!order) return;
    const modal = document.getElementById('confirmation-modal');
    if (!modal) return;

    document.getElementById('conf-order-id').textContent = order.orderId;
    document.getElementById('conf-order-total').textContent = `₹${order.total}`;
    document.getElementById('conf-delivery-estimate').textContent = order.estimatedDelivery;

    modal.classList.add('open');
  },

  closeConfirmationModal() {
    const modal = document.getElementById('confirmation-modal');
    if (modal) modal.classList.remove('open');
  },

  openTrackingModal() {
    const order = FloraStore.getLastOrder();
    const modal = document.getElementById('tracking-modal');
    if (!modal) return;

    if (!order) {
      FloraStore.showToast('No active orders found to track.', 'info');
      return;
    }

    document.getElementById('tracking-order-num').textContent = order.orderId;
    document.getElementById('tracking-order-date').textContent = order.date;
    document.getElementById('tracking-order-address').textContent = `${order.address.name}, ${order.address.address}, ${order.address.city} - ${order.address.pincode}`;

    modal.classList.add('open');
  },

  closeTrackingModal() {
    const modal = document.getElementById('tracking-modal');
    if (modal) modal.classList.remove('open');
  },

  // --- Policy & Legal Modals (Prompt 2 Final Sections 42 & 43) ---
  openPolicyModal(type) {
    const modal = document.getElementById('policy-modal');
    const titleEl = document.getElementById('policy-modal-title');
    const bodyEl = document.getElementById('policy-modal-body');
    if (!modal || !titleEl || !bodyEl) return;

    const policies = {
      terms: {
        title: "Terms & Conditions",
        content: `
          <h4>1. Nursery Fresh Guarantee</h4>
          <p>Every living plant from Flora Fusion is grown and inspected in verified Indian nurseries. We certify that all plants are acclimatized for apartment lighting and pest-free at transit dispatch.</p>
          <h4>2. Simulated E-Commerce Operations</h4>
          <p>Flora Fusion is a high-fidelity prototype simulating real-time e-commerce orders, promotional coupons (e.g. FLORA10), and order state tracking.</p>
          <h4>3. Transit Replacement Guarantee</h4>
          <p>If your botanical shipment experiences transit distress or pot breakage, contact our support team or Flora AI within 48 hours for a prompt replacement.</p>
        `
      },
      shipping: {
        title: "Shipping & Delivery Policy",
        content: `
          <h4>1. Free Express Shipping</h4>
          <p>Orders totaling ₹799 or more automatically qualify for 100% Free Express Delivery. Orders under ₹799 incur a flat fee of ₹79.</p>
          <h4>2. Bio-Packaging Standards</h4>
          <p>All plants travel in engineered biodegradable breathable pods that secure the potting medium and maintain root humidity throughout the journey.</p>
          <h4>3. Dispatch & Live Tracking</h4>
          <p>Orders are dispatched within 24–48 hours from regional nurseries and arrive in 3–5 business days with visual status tracking.</p>
        `
      },
      privacy: {
        title: "Privacy Policy",
        content: `
          <h4>1. Privacy First & Local Persistence</h4>
          <p>Flora Fusion does not sell or distribute personal data. Your active cart, wishlist, and mock order records are retained safely in your browser's localStorage.</p>
          <h4>2. Flora AI Customer Assistance</h4>
          <p>Queries to Flora AI are executed on the customer's side to provide botanical care advice and accurate catalog matching without intrusive profiling.</p>
        `
      }
    };

    const p = policies[type] || policies.terms;
    titleEl.textContent = p.title;
    bodyEl.innerHTML = p.content;
    modal.classList.add('open');
  },

  closePolicyModal() {
    const modal = document.getElementById('policy-modal');
    if (modal) modal.classList.remove('open');
  },

  // --- Refined Search Panel (Prompt 2 Final Sections 21 & 37) ---
  handleSearchInput(query) {
    const dropdown = document.getElementById('search-dropdown');
    if (!dropdown) return;

    const q = (query || '').trim().toLowerCase();

    // Before typing / Popular searches state
    if (q.length === 0) {
      dropdown.innerHTML = `
        <div class="search-panel-heading">Popular Searches</div>
        <div class="search-chips-row">
          <button class="search-tag-chip" onclick="FloraApp.applySearchQuery('Low Light')">🌿 Low Light Plants</button>
          <button class="search-tag-chip" onclick="FloraApp.applySearchQuery('Indoor')">🪴 Indoor Plants</button>
          <button class="search-tag-chip" onclick="FloraApp.applySearchQuery('Ceramic')">🏺 Ceramic Pots</button>
          <button class="search-tag-chip" onclick="FloraApp.applySearchQuery('Easy')">🌱 Easy Seeds</button>
        </div>
        <div class="search-panel-heading">Categories</div>
        <div class="search-chips-row">
          <button class="search-tag-chip" onclick="window.location.hash='#/plants'; FloraApp.closeSearchDropdown();">Plants (11)</button>
          <button class="search-tag-chip" onclick="window.location.hash='#/pots'; FloraApp.closeSearchDropdown();">Pots (10)</button>
          <button class="search-tag-chip" onclick="window.location.hash='#/seeds'; FloraApp.closeSearchDropdown();">Seeds (10)</button>
        </div>
      `;
      dropdown.classList.add('active');
      return;
    }

    // While typing: products, categories, suggestions
    const matches = ALL_PRODUCTS.filter(p => {
      return p.name.toLowerCase().includes(q) ||
             p.category.toLowerCase().includes(q) ||
             (p.metadata && Object.values(p.metadata).some(v => String(v).toLowerCase().includes(q)));
    }).slice(0, 6);

    if (matches.length === 0) {
      dropdown.innerHTML = `
        <div style="padding: 24px 16px; text-align: center;">
          <div style="font-size: 1.8rem; margin-bottom: 8px;">🍃</div>
          <h4 style="color:var(--color-brand-forest); margin-bottom:4px; font-size:0.9375rem;">No plants found for that search.</h4>
          <p style="font-size:0.8125rem; color:var(--color-text-secondary); margin-bottom:14px;">Try exploring our core nursery collections:</p>
          <div class="search-chips-row" style="justify-content:center;">
            <button class="search-tag-chip" onclick="window.location.hash='#/plants'; FloraApp.closeSearchDropdown();">Explore Plants</button>
            <button class="search-tag-chip" onclick="window.location.hash='#/pots'; FloraApp.closeSearchDropdown();">Explore Pots</button>
            <button class="search-tag-chip" onclick="window.location.hash='#/seeds'; FloraApp.closeSearchDropdown();">Explore Seeds</button>
          </div>
        </div>
      `;
    } else {
      dropdown.innerHTML = `
        <div class="search-panel-heading">Matching Products</div>
        ${matches.map(prod => `
          <div class="search-result-item" onclick="FloraApp.openProductModal('${prod.slug}'); FloraApp.closeSearchDropdown();">
            <img src="${prod.image}" alt="${prod.name}" class="search-result-img" onerror="this.src='${prod.refImage}'" />
            <div style="flex:1; min-width:0;">
              <div style="font-weight: 600; font-size: 0.875rem; color:var(--color-brand-forest); white-space:nowrap; overflow:hidden; text-overflow:ellipsis;">${prod.name}</div>
              <div style="font-size: 0.75rem; color: var(--color-text-muted);">${prod.category.toUpperCase()} • ₹${prod.price}</div>
            </div>
            <span style="font-size:0.75rem; color:var(--color-brand-green); font-weight:600;">View →</span>
          </div>
        `).join('')}
      `;
    }

    dropdown.classList.add('active');
  },

  applySearchQuery(term) {
    const input = document.getElementById('header-search-input');
    if (input) input.value = term;
    this.handleSearchInput(term);
  },

  closeSearchDropdown() {
    document.getElementById('search-dropdown')?.classList.remove('active');
  },

  updateBadges() {
    const cartCount = FloraStore.getCartCount();
    const wishCount = FloraStore.getWishlistCount();

    document.querySelectorAll('.cart-badge').forEach(b => {
      b.textContent = cartCount;
      b.style.display = cartCount > 0 ? 'flex' : 'none';
    });

    document.querySelectorAll('.wishlist-badge').forEach(b => {
      b.textContent = wishCount;
      b.style.display = wishCount > 0 ? 'flex' : 'none';
    });
  },

  bindEvents() {
    // Header cart & wishlist buttons
    document.querySelectorAll('.open-cart-btn').forEach(btn => {
      btn.addEventListener('click', () => this.openCartDrawer());
    });

    document.querySelectorAll('.open-wishlist-btn').forEach(btn => {
      btn.addEventListener('click', () => this.openWishlistModal());
    });

    document.getElementById('cart-drawer-close')?.addEventListener('click', () => this.closeCartDrawer());
    document.getElementById('cart-drawer-backdrop')?.addEventListener('click', () => this.closeCartDrawer());

    // Product modal close
    document.getElementById('product-modal-close')?.addEventListener('click', () => this.closeProductModal());
    document.getElementById('product-detail-modal')?.addEventListener('click', (e) => {
      if (e.target.id === 'product-detail-modal') this.closeProductModal();
    });

    // Product modal quantity
    document.getElementById('modal-qty-minus')?.addEventListener('click', () => {
      const valEl = document.getElementById('modal-qty-val');
      let val = parseInt(valEl.textContent) || 1;
      if (val > 1) valEl.textContent = val - 1;
    });

    document.getElementById('modal-qty-plus')?.addEventListener('click', () => {
      const valEl = document.getElementById('modal-qty-val');
      let val = parseInt(valEl.textContent) || 1;
      valEl.textContent = val + 1;
    });

    // Modal Add to Cart & Buy Now
    document.getElementById('modal-add-cart-btn')?.addEventListener('click', () => {
      if (this.currentProduct) {
        const qty = parseInt(document.getElementById('modal-qty-val').textContent) || 1;
        FloraStore.addToCart(this.currentProduct.id, qty);
        this.closeProductModal();
        this.openCartDrawer();
      }
    });

    document.getElementById('modal-buy-now-btn')?.addEventListener('click', () => {
      if (this.currentProduct) {
        const qty = parseInt(document.getElementById('modal-qty-val').textContent) || 1;
        FloraStore.addToCart(this.currentProduct.id, qty);
        this.closeProductModal();
        this.openCheckoutModal();
      }
    });

    // Search bar input & focus
    const searchInput = document.getElementById('header-search-input');
    if (searchInput) {
      searchInput.addEventListener('focus', () => this.handleSearchInput(searchInput.value));
      searchInput.addEventListener('input', (e) => this.handleSearchInput(e.target.value));
      document.addEventListener('click', (e) => {
        if (!e.target.closest('.header-search')) {
          this.closeSearchDropdown();
        }
      });
    }

    // Coupon code form in cart drawer
    document.getElementById('cart-coupon-form')?.addEventListener('submit', (e) => {
      e.preventDefault();
      const code = document.getElementById('cart-coupon-input').value;
      FloraStore.applyCoupon(code);
    });

    // Checkout Stepper Navigation
    document.getElementById('checkout-next-btn')?.addEventListener('click', () => this.nextCheckoutStep());
    document.getElementById('checkout-prev-btn')?.addEventListener('click', () => this.prevCheckoutStep());
    document.getElementById('checkout-modal-close')?.addEventListener('click', () => this.closeCheckoutModal());
    document.getElementById('confirmation-modal-close')?.addEventListener('click', () => this.closeConfirmationModal());
    document.getElementById('tracking-modal-close')?.addEventListener('click', () => this.closeTrackingModal());

    // Policy modal close handlers
    document.getElementById('policy-modal-close')?.addEventListener('click', () => this.closePolicyModal());
    document.getElementById('policy-modal')?.addEventListener('click', (e) => {
      if (e.target.id === 'policy-modal') this.closePolicyModal();
    });

    // Global Escape Key Listener (Prompt 2 Final Section 38 Accessibility)
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        this.closeProductModal();
        this.closeCartDrawer();
        this.closeWishlistModal();
        this.closeCheckoutModal();
        this.closeConfirmationModal();
        this.closeTrackingModal();
        this.closePolicyModal();
        this.closeSearchDropdown();
        if (typeof FloraAI !== 'undefined') FloraAI.close();
      }
    });

    // Dynamic Current Year (Prompt 2 Final Section 42)
    const currentYear = new Date().getFullYear();
    document.querySelectorAll('.current-year').forEach(el => el.textContent = currentYear);
  },

  capitalizeFirst(str) {
    return str.charAt(0).toUpperCase() + str.slice(1);
  }
};

// Global entry point
document.addEventListener('DOMContentLoaded', () => {
  FloraApp.init();
  FloraAI.init();
  FloraAnimations.init();
});
