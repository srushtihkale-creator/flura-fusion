/* ==========================================================================
   FLORA FUSION — FLORA AI ENGINE
   Customer-facing botanical AI assistant with real catalog product recommendations
   ========================================================================== */

const FloraAI = {
  isOpen: false,
  messages: [],

  // Predefined Botanical Knowledge Base
  knowledgeBase: [
    {
      keywords: ["low light", "dark room", "bedroom", "office", "dim", "shade", "no window"],
      response: "For low-light spots like bedrooms and hallway corners, I highly recommend plants that naturally thrive under the forest canopy. They require minimal natural sunlight and purify the air while you sleep:",
      productSlugs: ["snake-plant", "zz-plant", "peace-lily"],
      why: "Tolerates low light, requires watering only every 2-3 weeks, and effectively cleanses indoor air."
    },
    {
      keywords: ["under 500", "cheap", "budget", "affordable", "under 400", "under 300", "500"],
      response: "We have wonderful, resilient green companions for under ₹500! Here are our most beloved budget-friendly plants:",
      productSlugs: ["money-plant", "aloe-vera", "jade-plant", "snake-plant"],
      why: "Exceptional value, easy to care for, and guaranteed healthy straight from our nurseries."
    },
    {
      keywords: ["beginner", "easy", "first plant", "starter", "novice", "hardy", "kill"],
      response: "Welcome to your plant journey! If you're just starting, you want resilient plants that thrive even if you occasionally forget to water them:",
      productSlugs: ["money-plant", "zz-plant", "snake-plant"],
      why: "Virtually indestructible, forgiving of irregular watering, and fast to reward you with new leaves."
    },
    {
      keywords: ["pot", "ceramic", "planter", "container", "which pot", "pots"],
      response: "Selecting the right pot gives your plants room to breathe and elevates your room aesthetics. Here are our top artisan choices:",
      productSlugs: ["ceramic-ripple-pot", "terracotta-pot", "minimal-white-pot", "self-watering-pot"],
      why: "Features proper root aeration, drainage holes with plugs, and premium textures."
    },
    {
      keywords: ["seed", "seeds", "grow", "vegetable", "herb", "kitchen"],
      response: "Growing plants from seed is deeply rewarding! For quick and joyful harvests on balconies and kitchen windows, try these:",
      productSlugs: ["basil-seeds", "mint-seeds", "tomato-seeds", "coriander-seeds"],
      why: "Non-GMO heirloom seeds with 85%+ germination rate in warm sunny spots."
    },
    {
      keywords: ["snake plant care", "water snake plant", "snake plant", "sansevieria"],
      response: "Snake Plants thrive on benevolent neglect! 🌿\n\n• **Watering:** Water only when the soil is 100% dry (every 2-3 weeks in summer, once a month in winter).\n• **Sunlight:** Adapts to dim corners or bright indirect light.\n• **Soil:** Gritty, well-draining cactus mix.\n• **NASA Certified:** Releases oxygen at night, perfect beside your bed.",
      productSlugs: ["snake-plant", "ceramic-ripple-pot"],
      why: "The #1 bedroom air purifier paired with our ripple ceramic pot."
    },
    {
      keywords: ["money plant care", "water money plant", "pothos"],
      response: "Money Plants bring vibrant cascading green energy into your space! 🍃\n\n• **Watering:** Water once a week when the top inch of soil feels dry.\n• **Light:** Bright, indirect light keeps the variegation vibrant.\n• **Vastu/Feng Shui:** Place in the southeast corner of your living room for positive energy.",
      productSlugs: ["money-plant", "hanging-planter"],
      why: "A classic green companion that looks stunning hanging or on a shelf."
    },
    {
      keywords: ["peace lily care", "peace lily", "droop"],
      response: "Peace Lilies communicate their thirst clearly! If leaves start to droop slightly, it simply needs a thorough drink. Keep in soft indirect light to enjoy its serene white blossoms.",
      productSlugs: ["peace-lily"],
      why: "Spectacular white blooms and NASA-rated formaldehyde air filtration."
    },
    {
      keywords: ["monstera", "swiss cheese"],
      response: "Monstera Deliciosa is our iconic tropical statement! Provide bright indirect light, wipe the wide perforated leaves monthly, and allow the top 2 inches of soil to dry between waterings.",
      productSlugs: ["monstera-deliciosa", "marble-pot"],
      why: "Magnificent split leaves that turn any living room into an oasis."
    },
    {
      keywords: ["air purifier", "purify", "toxin", "clean air", "breathe"],
      response: "Plants are nature's own bio-filters. These species actively remove airborne toxins like benzene, xylene, and formaldehyde:",
      productSlugs: ["snake-plant", "peace-lily", "areca-palm"],
      why: "Proven air purifying qualities with zero electrical consumption."
    },
    {
      keywords: ["pet", "cat", "dog", "toxic", "safe"],
      response: "For curious cats and playful dogs, pet safety is paramount! Areca Palm and Lavender are non-toxic green choices that you can safely keep around furry companions.",
      productSlugs: ["areca-palm", "lavender"],
      why: "100% pet-friendly botanical beauty."
    }
  ],

  init() {
    this.bindEvents();
    // Default welcome message
    if (this.messages.length === 0) {
      this.messages.push({
        sender: 'flora',
        text: "Hi! I'm Flora 🌿 What are you looking for today? Whether you need a plant for your bedroom, an artisan pot, or seed advice, I'm here to guide you.",
        products: []
      });
    }
  },

  bindEvents() {
    const launcher = document.getElementById('flora-ai-launcher');
    const closeBtn = document.getElementById('flora-ai-close');
    const backdrop = document.getElementById('flora-ai-backdrop');
    const form = document.getElementById('flora-ai-form');
    const input = document.getElementById('flora-ai-input');

    if (launcher) launcher.addEventListener('click', () => this.toggle());
    if (closeBtn) closeBtn.addEventListener('click', () => this.close());
    if (backdrop) backdrop.addEventListener('click', () => this.close());

    if (form) {
      form.addEventListener('submit', (e) => {
        e.preventDefault();
        const query = (input.value || '').trim();
        if (!query) return;
        input.value = '';
        this.handleUserQuery(query);
      });
    }

    // Quick prompt chips
    document.querySelectorAll('.flora-ai-chip').forEach(chip => {
      chip.addEventListener('click', () => {
        const query = chip.getAttribute('data-query');
        if (query) {
          if (!this.isOpen) this.open();
          this.handleUserQuery(query);
        }
      });
    });
  },

  toggle() {
    if (this.isOpen) this.close();
    else this.open();
  },

  open() {
    this.isOpen = true;
    const panel = document.getElementById('flora-ai-panel');
    const backdrop = document.getElementById('flora-ai-backdrop');
    if (panel) panel.classList.add('open');
    if (backdrop) backdrop.classList.add('visible');
    this.renderMessages();
    setTimeout(() => {
      const input = document.getElementById('flora-ai-input');
      if (input) input.focus();
    }, 200);
  },

  close() {
    this.isOpen = false;
    const panel = document.getElementById('flora-ai-panel');
    const backdrop = document.getElementById('flora-ai-backdrop');
    if (panel) panel.classList.remove('open');
    if (backdrop) backdrop.classList.remove('visible');
  },

  handleUserQuery(query) {
    // 1. Add user message
    this.messages.push({
      sender: 'user',
      text: query
    });
    this.renderMessages();

    // 2. Show thinking indicator
    this.showTypingIndicator();

    // 3. Process natural language query against catalog & knowledge base
    setTimeout(() => {
      this.hideTypingIndicator();
      const answer = this.generateResponse(query);
      this.messages.push({
        sender: 'flora',
        text: answer.text,
        products: answer.products,
        why: answer.why
      });
      this.renderMessages();
    }, 600);
  },

  generateResponse(query) {
    const q = query.toLowerCase();

    // 1. Match from predefined knowledge base
    for (const item of this.knowledgeBase) {
      for (const kw of item.keywords) {
        if (q.includes(kw)) {
          const matchedProducts = item.productSlugs
            .map(slug => getProductBySlug(slug))
            .filter(Boolean);

          return {
            text: item.response,
            products: matchedProducts,
            why: item.why
          };
        }
      }
    }

    // 2. Dynamic catalog keyword search
    const matches = ALL_PRODUCTS.filter(p => {
      return p.name.toLowerCase().includes(q) ||
             p.category.toLowerCase().includes(q) ||
             (p.metadata && Object.values(p.metadata).some(v => String(v).toLowerCase().includes(q)));
    }).slice(0, 3);

    if (matches.length > 0) {
      return {
        text: `I found ${matches.length} wonderful items in our nursery catalog matching "${query}":`,
        products: matches,
        why: "Direct match from our curated collection."
      };
    }

    // 3. Friendly fallback
    return {
      text: `I'd love to help you find the perfect green companion for "${query}"! You can ask me things like:\n\n• "Which plants are good for low light?"\n• "Show me plants under ₹500"\n• "How do I water a Snake Plant?"\n• "Suggest easy seeds for beginners"\n• "Which pot fits a Money Plant?"`,
      products: [getProductBySlug('money-plant'), getProductBySlug('ceramic-ripple-pot')].filter(Boolean),
      why: "Our all-time nursery favorites."
    };
  },

  showTypingIndicator() {
    const container = document.getElementById('flora-ai-messages');
    if (!container) return;

    let indicator = document.getElementById('flora-ai-typing');
    if (!indicator) {
      indicator = document.createElement('div');
      indicator.id = 'flora-ai-typing';
      indicator.className = 'flora-ai-message flora-ai-bot typing-indicator';
      indicator.innerHTML = `
        <div class="bot-avatar">🌿</div>
        <div class="typing-dots">
          <span></span><span></span><span></span>
          <span style="font-size:0.75rem; color:var(--color-text-secondary); margin-left:6px; font-weight:500;">Flora AI is thinking...</span>
        </div>
      `;
      container.appendChild(indicator);
      container.scrollTop = container.scrollHeight;
    }
  },

  hideTypingIndicator() {
    const indicator = document.getElementById('flora-ai-typing');
    if (indicator) indicator.remove();
  },

  renderMessages() {
    const container = document.getElementById('flora-ai-messages');
    if (!container) return;

    container.innerHTML = this.messages.map((m, idx) => {
      if (m.sender === 'user') {
        return `
          <div class="flora-ai-message flora-ai-user">
            <div class="message-bubble user-bubble">${this.escapeHTML(m.text)}</div>
          </div>
        `;
      } else {
        let productsHTML = '';
        if (m.products && m.products.length > 0) {
          productsHTML = `
            <div class="flora-ai-recommendations">
              ${m.products.map(prod => `
                <div class="ai-product-card" data-id="${prod.id}">
                  <img src="${prod.image}" alt="${prod.name}" onerror="this.src='${prod.refImage}'" class="ai-prod-img" />
                  <div class="ai-prod-info">
                    <span class="ai-prod-category">${prod.category.toUpperCase()}</span>
                    <h5 class="ai-prod-name">${prod.name}</h5>
                    <div class="ai-prod-meta">
                      <span class="ai-prod-price">₹${prod.price}</span>
                      <span class="ai-prod-rating">★ ${prod.rating}</span>
                    </div>
                    <div class="ai-prod-actions">
                      <button class="ai-btn-view" onclick="FloraApp.openProductModal('${prod.slug}')">View</button>
                      <button class="ai-btn-add" onclick="FloraStore.addToCart('${prod.id}', 1)">Add to Cart</button>
                    </div>
                  </div>
                </div>
              `).join('')}
            </div>
          `;
        }

        return `
          <div class="flora-ai-message flora-ai-bot">
            <div class="bot-avatar">🌿</div>
            <div class="bot-content">
              <div class="message-bubble bot-bubble">
                ${m.text.replace(/\n/g, '<br/>')}
              </div>
              ${productsHTML}
            </div>
          </div>
        `;
      }
    }).join('');

    container.scrollTop = container.scrollHeight;
  },

  escapeHTML(str) {
    const p = document.createElement('p');
    p.textContent = str;
    return p.innerHTML;
  }
};
