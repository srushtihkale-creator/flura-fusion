/* ==========================================================================
   FLORA FUSION — ANIMATION & LENIS ENGINE
   GSAP Timelines, ScrollTrigger Reveals, and Lenis Smooth Inertia Scrolling
   ========================================================================== */

const FloraAnimations = {
  lenis: null,
  prefersReducedMotion: false,

  init() {
    this.prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    // 1. Initialize Lenis Smooth Scrolling if not reduced motion
    if (!this.prefersReducedMotion && typeof Lenis !== 'undefined') {
      try {
        this.lenis = new Lenis({
          duration: 1.1,
          easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
          smoothWheel: true,
          smoothTouch: false
        });

        // Sync with GSAP ScrollTrigger if available
        if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') {
          gsap.registerPlugin(ScrollTrigger);

          this.lenis.on('scroll', ScrollTrigger.update);

          gsap.ticker.add((time) => {
            this.lenis.raf(time * 1000);
          });

          gsap.ticker.lagSmoothing(0);
        } else {
          const raf = (time) => {
            this.lenis.raf(time);
            requestAnimationFrame(raf);
          };
          requestAnimationFrame(raf);
        }
      } catch (e) {
        console.warn('Lenis init error:', e);
      }
    }

    // 2. Run entrance animations
    this.initHeroEntrance();
    this.initZeroGravityMotion();
    this.initHero3DParallax();
    this.initScrollReveals();
    this.initIndividualBadgeRotations();
  },

  /* Individual rotation and click interaction for footer circular badges */
  initIndividualBadgeRotations() {
    const badgeItems = document.querySelectorAll('.overlapping-badge-item');
    if (!badgeItems || badgeItems.length === 0) return;

    // Organic timing variations (22s to 38s) for a natural, living botanical field effect
    const durations = [28, 34, 24, 38, 30, 26, 36, 32, 22];

    badgeItems.forEach((item, index) => {
      const svg = item.querySelector('.overlapping-badge-svg');
      if (!svg) return;

      // Ensure transform origin is precisely centered
      gsap.set(svg, { transformOrigin: '50% 50%' });

      // Alternating rotation directions: even indices clockwise (+1), odd indices counter-clockwise (-1)
      const direction = (index % 2 === 0) ? 1 : -1;
      const duration = durations[index % durations.length];
      const deltaAngle = direction * 360;

      let loopTween = null;
      let isSpinningOnClick = false;

      // Helper to start or resume smooth continuous ambient rotation
      const startContinuousRotation = () => {
        if (this.prefersReducedMotion || typeof gsap === 'undefined') return;

        if (loopTween) loopTween.kill();

        loopTween = gsap.to(svg, {
          rotation: `+=${deltaAngle}`,
          duration: duration,
          ease: 'none',
          repeat: -1,
          transformOrigin: '50% 50%'
        });
      };

      // Start the individual continuous slow rotation
      startContinuousRotation();

      // Click / tap interaction: spin specific circle 360° smoothly, then resume slow rotation
      const handleBadgeClick = () => {
        if (isSpinningOnClick || typeof gsap === 'undefined') return;
        isSpinningOnClick = true;

        // 1. Pause/kill ambient continuous rotation
        if (loopTween) {
          loopTween.kill();
          loopTween = null;
        }

        // 2. Tactile subtle bounce on the container
        gsap.to(item, {
          scale: 1.12,
          duration: 0.18,
          yoyo: true,
          repeat: 1,
          ease: 'power1.out'
        });

        // 3. Smooth, energetic 360° rotation in that circle's natural direction
        const spinDelta = direction * 360;
        gsap.to(svg, {
          rotation: `+=${spinDelta}`,
          duration: 0.85,
          ease: 'power2.out',
          transformOrigin: '50% 50%',
          onComplete: () => {
            isSpinningOnClick = false;
            // 4. Continue slow automatic rotation seamlessly from new angle
            startContinuousRotation();
          }
        });
      };

      item.addEventListener('click', handleBadgeClick);

      // Accessibility: keyboard Enter / Space triggers same smooth 360° spin
      item.setAttribute('tabindex', '0');
      item.setAttribute('role', 'button');
      item.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          handleBadgeClick();
        }
      });
    });
  },

  /* Restrained Hero 3D Depth on mouse movement (Prompt 2 Final Section 15) */
  initHero3DParallax() {
    if (this.prefersReducedMotion || typeof gsap === 'undefined') return;

    const heroSection = document.querySelector('.hero-section');
    const heroCard = document.querySelector('.hero-main-card');
    if (!heroSection || !heroCard) return;

    heroSection.addEventListener('mousemove', (e) => {
      const rect = heroSection.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width - 0.5;
      const y = (e.clientY - rect.top) / rect.height - 0.5;

      // Strictly restrained to max +-3 degrees
      const rotateY = x * 6;
      const rotateX = -y * 6;

      gsap.to(heroCard, {
        rotateX: rotateX,
        rotateY: rotateY,
        transformPerspective: 1000,
        ease: 'power2.out',
        duration: 0.6
      });
    });

    heroSection.addEventListener('mouseleave', () => {
      gsap.to(heroCard, {
        rotateX: 0,
        rotateY: 0,
        ease: 'power2.out',
        duration: 0.8
      });
    });
  },

  initHeroEntrance() {
    if (this.prefersReducedMotion || typeof gsap === 'undefined') return;

    const tl = gsap.timeline({ defaults: { ease: 'power3.out', duration: 0.9 } });

    tl.from('.site-header', { y: -20, opacity: 0, duration: 0.8 })
      .from('.hero-main-card', { scale: 0.96, opacity: 0, duration: 1 }, '-=0.5')
      .from('.hero-eyebrow', { y: 15, opacity: 0, duration: 0.6 }, '-=0.7')
      .from('.hero-title', { y: 20, opacity: 0, duration: 0.8 }, '-=0.5')
      .from('.hero-description', { y: 15, opacity: 0, duration: 0.7 }, '-=0.6')
      .from('.hero-cta-group', { y: 15, opacity: 0, duration: 0.6 }, '-=0.5')
      .from('.hero-floating-badge', { y: 20, opacity: 0, duration: 0.7, ease: 'back.out(1.5)' }, '-=0.4');
  },

  initZeroGravityMotion() {
    if (this.prefersReducedMotion || typeof gsap === 'undefined') return;

    // Hero leaf 1 drift
    const leaf1 = document.querySelector('.leaf-1');
    if (leaf1) {
      gsap.to(leaf1, {
        y: -12,
        x: 6,
        rotation: 4,
        duration: 3.6,
        ease: 'sine.inOut',
        repeat: -1,
        yoyo: true
      });
    }

    // Hero leaf 2 drift (asynchronous delay and direction)
    const leaf2 = document.querySelector('.leaf-2');
    if (leaf2) {
      gsap.to(leaf2, {
        y: 10,
        x: -5,
        rotation: -5,
        duration: 4.2,
        delay: 0.8,
        ease: 'sine.inOut',
        repeat: -1,
        yoyo: true
      });
    }

    // Hero badge subtle floating
    const badge = document.querySelector('.hero-floating-badge');
    if (badge) {
      gsap.to(badge, {
        y: -6,
        rotation: 0.5,
        duration: 3.2,
        ease: 'sine.inOut',
        repeat: -1,
        yoyo: true
      });
    }

    // AI launcher subtle leaf wobble
    const aiIcon = document.querySelector('.ai-leaf-icon');
    if (aiIcon) {
      gsap.to(aiIcon, {
        rotation: 12,
        duration: 2.4,
        ease: 'sine.inOut',
        repeat: -1,
        yoyo: true
      });
    }
  },

  initScrollReveals() {
    if (this.prefersReducedMotion || typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') return;

    // Reveal promo banner cards
    gsap.utils.toArray('.promo-card').forEach((card, i) => {
      gsap.from(card, {
        scrollTrigger: {
          trigger: card,
          start: 'top 88%'
        },
        y: 28,
        opacity: 0,
        duration: 0.8,
        delay: i * 0.12,
        ease: 'power2.out'
      });
    });

    // Reveal trust strip items
    gsap.utils.toArray('.trust-item').forEach((item, i) => {
      gsap.from(item, {
        scrollTrigger: {
          trigger: item,
          start: 'top 92%'
        },
        y: 20,
        opacity: 0,
        duration: 0.6,
        delay: i * 0.08,
        ease: 'power2.out'
      });
    });
  },

  animateCardsEntrance(selector) {
    if (this.prefersReducedMotion || typeof gsap === 'undefined') return;
    gsap.from(selector, {
      y: 20,
      opacity: 0,
      duration: 0.5,
      stagger: 0.05,
      ease: 'power2.out'
    });
  }
};
