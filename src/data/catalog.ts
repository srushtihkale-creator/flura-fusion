import { Product } from '@/types/product';

export /* ==========================================================================
   FLORA FUSION â€” PRODUCT CATALOG DATA
   All 11 Plants, 10 Pots, and 10 Seeds exactly matching the reference images
   ========================================================================== */

const FLORA_CATALOG: { plants: Product[]; pots: Product[]; seeds: Product[] } = {
  plants: [
    {
      id: "plant-1",
      category: "plants",
      subCategory: "indoor",
      name: "Money Plant",
      slug: "money-plant",
      tagline: "Brings good luck & positivity",
      description: "An enduring indoor favorite celebrated for its lush heart-shaped foliage. Believed to attract wealth, positive energy, and prosperity into the home. Thrives in moderate indirect light with very low maintenance.",
      price: 399,
      originalPrice: 499,
      rating: 4.8,
      reviewCount: 124,
      image: "/assets/products/plants/money-plant.jpg",
      refImage: "/assets/products/plants/money-plant-ref.png",
      badge: "Bestseller",
      inStock: true,
      metadata: {
        placement: "Indoor",
        water: "Low Water (once a week)",
        light: "Indirect Sun / Medium",
        difficulty: "Easy for Beginners",
        airPurifying: true,
        petFriendly: false,
        size: "Medium (8-12 inches)"
      },
      careGuide: {
        watering: "Water thoroughly only when the top 2 inches of soil feel dry to the touch.",
        sunlight: "Prefers bright, indirect light; tolerates moderate fluorescent room light.",
        repotting: "Repot once every 18-24 months into a slightly larger ceramic or terracotta pot.",
        proTip: "Wipe leaves gently with a damp cotton cloth once a month to maximize photosynthesis."
      }
    },
    {
      id: "plant-2",
      category: "plants",
      subCategory: "air-purifying",
      name: "Snake Plant",
      slug: "snake-plant",
      tagline: "Purifies air & filters toxins",
      description: "A champion air purifier recommended by NASA clean air studies. Features sculptural, sword-like leaves with architectural golden borders. Releases oxygen even at night, making it ideal for bedrooms.",
      price: 499,
      originalPrice: 599,
      rating: 4.9,
      reviewCount: 210,
      image: "/assets/products/plants/snake-plant.jpg",
      refImage: "/assets/products/plants/snake-plant-ref.png",
      badge: "Popular",
      inStock: true,
      metadata: {
        placement: "Indoor",
        water: "Low Water (every 2-3 weeks)",
        light: "Low to Bright Indirect",
        difficulty: "Indestructible",
        airPurifying: true,
        petFriendly: false,
        size: "Medium-Tall (12-16 inches)"
      },
      careGuide: {
        watering: "Allow soil to completely dry out between waterings. Less is always more.",
        sunlight: "Adapts to dim corners or sunny window sills effortlessly.",
        repotting: "Rarely needs repotting; happy even when slightly root-bound.",
        proTip: "Keep away from cold drafty air conditioners in summer."
      }
    },
    {
      id: "plant-3",
      category: "plants",
      subCategory: "flowering",
      name: "Peace Lily",
      slug: "peace-lily",
      tagline: "Natural air purifier with pure blooms",
      description: "Graceful glossy leaves complemented by serene white spathes. Known for purifying airborne benzene and formaldehyde while gracefully telling you when it needs water by slightly drooping.",
      price: 749,
      originalPrice: 899,
      rating: 4.7,
      reviewCount: 98,
      image: "/assets/products/plants/peace-lily.jpg",
      refImage: "/assets/products/plants/peace-lily-ref.png",
      badge: "Clean Air",
      inStock: true,
      metadata: {
        placement: "Indoor",
        water: "Medium Water (2 times/week)",
        light: "Low to Medium Indirect",
        difficulty: "Easy",
        airPurifying: true,
        petFriendly: false,
        size: "Medium (10-14 inches)"
      },
      careGuide: {
        watering: "Keep soil consistently moist, but never soggy. Drops signal thirst.",
        sunlight: "Thrives in soft, dappled shade; harsh direct sun will scorch white blooms.",
        repotting: "Divide and repot every 2 years in spring.",
        proTip: "Mist foliage once or twice a week to maintain tropical humidity."
      }
    },
    {
      id: "plant-4",
      category: "plants",
      subCategory: "indoor",
      name: "Areca Palm",
      slug: "areca-palm",
      tagline: "Adds freshness & humidity",
      description: "Feathery, arching fronds bring a tranquil resort vibe to any living room. A natural air humidifier that filters airborne toxins and fills large empty corners with lush tropical greenery.",
      price: 699,
      originalPrice: 849,
      rating: 4.6,
      reviewCount: 76,
      image: "/assets/products/plants/areca-palm.jpg",
      refImage: "/assets/products/plants/areca-palm-ref.png",
      badge: null,
      inStock: true,
      metadata: {
        placement: "Indoor",
        water: "Medium Water",
        light: "Bright Indirect Light",
        difficulty: "Moderate",
        airPurifying: true,
        petFriendly: true,
        size: "Large (18-24 inches)"
      },
      careGuide: {
        watering: "Water when the top 1 inch of soil is dry. Use filtered water if possible.",
        sunlight: "Abundant bright indirect light near an east or west-facing window.",
        repotting: "Repot every 2-3 years without disturbing root ball.",
        proTip: "Trim yellowing outer fronds at the base to stimulate fresh new growth."
      }
    },
    {
      id: "plant-5",
      category: "plants",
      subCategory: "indoor",
      name: "ZZ Plant",
      slug: "zz-plant",
      tagline: "Low maintenance & ultra hardy",
      description: "Glossy, emerald-green leaves that look practically polished. Capable of thriving in dark hallways, windowless offices, and forgotten corners thanks to its moisture-storing rhizomes.",
      price: 599,
      originalPrice: 699,
      rating: 4.5,
      reviewCount: 65,
      image: "/assets/products/plants/zz-plant.jpg",
      refImage: "/assets/products/plants/zz-plant-ref.png",
      badge: "Hardy",
      inStock: true,
      metadata: {
        placement: "Indoor",
        water: "Low Water (every 2-3 weeks)",
        light: "Low Light to Shade",
        difficulty: "Super Easy",
        airPurifying: true,
        petFriendly: false,
        size: "Medium (12-16 inches)"
      },
      careGuide: {
        watering: "Extremely drought-tolerant. Only water when pot is feather-light.",
        sunlight: "Tolerates fluorescent lights and darkest rooms without fading.",
        repotting: "Repot only when rhizomes physically push against the pot edges.",
        proTip: "Avoid over-watering at all costs â€” this plant thrives on neglect."
      }
    },
    {
      id: "plant-6",
      category: "plants",
      subCategory: "succulents",
      name: "Jade Plant",
      slug: "jade-plant",
      tagline: "Brings prosperity & good fortune",
      description: "A beloved succulent with thick, jade-green gem-like leaves and sturdy tree-like stems. In Vastu and Feng Shui, it symbolizes wealth and good energy when placed near entrances.",
      price: 499,
      originalPrice: 599,
      rating: 4.6,
      reviewCount: 87,
      image: "/assets/products/plants/jade-plant.jpg",
      refImage: "/assets/products/plants/jade-plant-ref.png",
      badge: "Lucky",
      inStock: true,
      metadata: {
        placement: "Indoor / Sunny Sill",
        water: "Low Water (drought tolerant)",
        light: "Bright Direct to Indirect Sun",
        difficulty: "Easy",
        airPurifying: false,
        petFriendly: false,
        size: "Compact (6-10 inches)"
      },
      careGuide: {
        watering: "Water sparingly. Allow soil to dry out completely between sessions.",
        sunlight: "Needs at least 4-5 hours of sunshine or bright light daily.",
        repotting: "Best planted in heavy terracotta pots with excellent drainage holes.",
        proTip: "Pinch young branch tips to encourage bushy, bonsai-style growth."
      }
    },
    {
      id: "plant-7",
      category: "plants",
      subCategory: "outdoor",
      name: "Lavender",
      slug: "lavender",
      tagline: "Calms mind & reduces stress",
      description: "Fragrant purple blossoms with therapeutic essential oils known to ease anxiety and promote restful sleep. Perfect for sunny balconies, window sills, and patio planters.",
      price: 399,
      originalPrice: 499,
      rating: 4.6,
      reviewCount: 72,
      image: "/assets/products/plants/lavender.jpg",
      refImage: "/assets/products/plants/lavender-ref.png",
      badge: "Aromatic",
      inStock: true,
      metadata: {
        placement: "Outdoor / Balcony",
        water: "Low to Moderate Water",
        light: "Full Sun (6+ hrs)",
        difficulty: "Moderate",
        airPurifying: false,
        petFriendly: true,
        size: "Medium (10-14 inches)"
      },
      careGuide: {
        watering: "Water deeply at root level once a week. Avoid splashing petals.",
        sunlight: "Demands direct sunlight to produce vibrant purple flowers.",
        repotting: "Requires gritty, well-draining soil with perlite or gravel.",
        proTip: "Harvest dried flower stems to make natural herbal drawer sachets."
      }
    },
    {
      id: "plant-8",
      category: "plants",
      subCategory: "indoor",
      name: "Ficus Elastica",
      slug: "ficus-elastica",
      tagline: "Elegant & hardy botanical statement",
      description: "Dramatic burgundy and deep olive rubber plant foliage with a high-shine finish. Creates an immediate architectural focal point in modern minimalist living rooms.",
      price: 799,
      originalPrice: 949,
      rating: 4.5,
      reviewCount: 61,
      image: "/assets/products/plants/ficus-elastica.jpg",
      refImage: "/assets/products/plants/ficus-elastica-ref.png",
      badge: null,
      inStock: true,
      metadata: {
        placement: "Indoor",
        water: "Medium Water (weekly)",
        light: "Bright Indirect Light",
        difficulty: "Easy",
        airPurifying: true,
        petFriendly: false,
        size: "Tall (14-20 inches)"
      },
      careGuide: {
        watering: "Keep soil slightly moist during growth months; reduce in winter.",
        sunlight: "Bright indirect light keeps the burgundy leaf pigmentation rich.",
        repotting: "Repot every 2 years into a stable ceramic pot.",
        proTip: "Rotate pot 90 degrees weekly to encourage balanced straight growth."
      }
    },
    {
      id: "plant-9",
      category: "plants",
      subCategory: "indoor",
      name: "Monstera Deliciosa",
      slug: "monstera-deliciosa",
      tagline: "Trendy & tropical statement plant",
      description: "The Swiss Cheese plant with iconic natural perforations (fenestrations). A world-famous design icon that injects wild tropical character and vibrant energy into any room.",
      price: 999,
      originalPrice: 1199,
      rating: 4.7,
      reviewCount: 103,
      image: "/assets/products/plants/monstera-deliciosa.jpg",
      refImage: "/assets/products/plants/monstera-deliciosa-ref.png",
      badge: "Trending",
      inStock: true,
      metadata: {
        placement: "Indoor",
        water: "Medium Water (every 7-10 days)",
        light: "Bright Indirect Light",
        difficulty: "Easy to Moderate",
        airPurifying: true,
        petFriendly: false,
        size: "Large (18-26 inches)"
      },
      careGuide: {
        watering: "Water thoroughly when top 2 inches dry out; allow pot to drain.",
        sunlight: "Thrives in dappled morning sun or bright filtered living room light.",
        repotting: "Provide a moss stick or trellis for aerial roots as it climbs.",
        proTip: "Gently mist aerial roots to encourage bigger leaf fenestrations."
      }
    },
    {
      id: "plant-10",
      category: "plants",
      subCategory: "succulents",
      name: "Aloe Vera",
      slug: "aloe-vera",
      tagline: "Heals & soothes naturally",
      description: "Prized medicinal succulent packed with soothing bioactive gel for skin, burns, and hair care. Requires negligible attention and happily thrives on sunny kitchen sills.",
      price: 299,
      originalPrice: 399,
      rating: 4.6,
      reviewCount: 92,
      image: "/assets/products/plants/aloe-vera.jpg",
      refImage: "/assets/products/plants/aloe-vera-ref.png",
      badge: "Medicinal",
      inStock: true,
      metadata: {
        placement: "Indoor / Balcony",
        water: "Low Water (every 3 weeks)",
        light: "Bright Indirect to Direct Sun",
        difficulty: "Beginner Friendly",
        airPurifying: true,
        petFriendly: false,
        size: "Compact (8-10 inches)"
      },
      careGuide: {
        watering: "Soak and dry method; let the soil dry out bone-dry before watering.",
        sunlight: "6 hours of bright light keeps the plump spears upright and healthy.",
        repotting: "Use porous cactus-succulent mix in a breathable terracotta container.",
        proTip: "Harvest mature outer leaves from the base without damaging the stem."
      }
    },
    {
      id: "plant-11",
      category: "plants",
      subCategory: "indoor",
      name: "Rubber Plant",
      slug: "rubber-plant",
      tagline: "Stylish & durable classic",
      description: "Thick, leathery forest-green leaves with a sculptural presence. Excellent at capturing indoor dust and converting indoor carbon dioxide into crisp oxygen.",
      price: 699,
      originalPrice: 799,
      rating: 4.5,
      reviewCount: 67,
      image: "/assets/products/plants/rubber-plant.jpg",
      refImage: "/assets/products/plants/rubber-plant-ref.png",
      badge: null,
      inStock: true,
      metadata: {
        placement: "Indoor",
        water: "Medium Water (weekly)",
        light: "Bright Filtered Light",
        difficulty: "Easy",
        airPurifying: true,
        petFriendly: false,
        size: "Medium-Tall (14-18 inches)"
      },
      careGuide: {
        watering: "Water once the surface soil is dry. Avoid standing in water saucers.",
        sunlight: "Enjoys warm filtered sunlight near patio doors or wide windows.",
        repotting: "Spring repotting every 2 years keeps foliage vibrant.",
        proTip: "Dust leaves regularly to keep the surface shiny and breathable."
      }
    }
  ],

  pots: [
    {
      id: "pot-1",
      category: "pots",
      subCategory: "ceramic",
      name: "Ceramic Ripple Pot",
      slug: "ceramic-ripple-pot",
      tagline: "Elegant & modern tactile texture",
      description: "Handcrafted artisan ceramic with a hypnotic ripple wave contour. Glazed in soothing botanical sage and warm cream to seamlessly complement indoor foliage.",
      price: 499,
      originalPrice: 599,
      rating: 4.7,
      reviewCount: 82,
      image: "/assets/products/pots/ceramic-ripple-pot.jpg",
      refImage: "/assets/products/pots/ceramic-ripple-pot-ref.png",
      badge: "Artisan",
      inStock: true,
      metadata: {
        material: "High-fired Ceramic",
        size: "8 inch diameter (Height: 7.5 inch)",
        drainage: "Includes drainage hole + silicone plug",
        style: "Modern Ripple",
        colors: ["#A9BDA3", "#F7F4EC"]
      }
    },
    {
      id: "pot-2",
      category: "pots",
      subCategory: "terracotta",
      name: "Terracotta Pot",
      slug: "terracotta-pot",
      tagline: "Classic & breathable natural clay",
      description: "Authentic kiln-fired Indian terracotta clay. The porous walls permit natural root aeration and evaporate excess moisture, preventing root rot naturally.",
      price: 299,
      originalPrice: 349,
      rating: 4.6,
      reviewCount: 67,
      image: "/assets/products/pots/terracotta-pot.jpg",
      refImage: "/assets/products/pots/terracotta-pot-ref.png",
      badge: "Classic",
      inStock: true,
      metadata: {
        material: "Natural Terracotta Clay",
        size: "8 inch diameter (Height: 7 inch)",
        drainage: "Large center drainage hole",
        style: "Timeless Traditional",
        colors: ["#B9825B"]
      }
    },
    {
      id: "pot-3",
      category: "pots",
      subCategory: "self-watering",
      name: "Self-Watering Pot",
      slug: "self-watering-pot",
      tagline: "Hassle-free care with sub-irrigation",
      description: "Engineered sub-irrigation reservoir with capillary cotton wicking. Keeps your plants consistently hydrated for up to 14 days when traveling or busy.",
      price: 699,
      originalPrice: 799,
      rating: 4.5,
      reviewCount: 54,
      image: "/assets/products/pots/self-watering-pot.jpg",
      refImage: "/assets/products/pots/self-watering-pot-ref.png",
      badge: "Smart Care",
      inStock: true,
      metadata: {
        material: "Durable BPA-free Matte Polymer",
        size: "8 inch diameter",
        drainage: "Dual-basin self-wicking system",
        style: "Minimalist Two-Tone",
        colors: ["#53635A", "#FBF9F4"]
      }
    },
    {
      id: "pot-4",
      category: "pots",
      subCategory: "hanging",
      name: "Hanging Planter",
      slug: "hanging-planter",
      tagline: "Perfect for balconies & vertical spaces",
      description: "Glazed stoneware bowl supported by durable hand-knotted natural jute cord. Ideal for trailing pothos, english ivy, and string of pearls.",
      price: 399,
      originalPrice: 499,
      rating: 4.6,
      reviewCount: 49,
      image: "/assets/products/pots/hanging-planter.jpg",
      refImage: "/assets/products/pots/hanging-planter-ref.png",
      badge: null,
      inStock: true,
      metadata: {
        material: "Glazed Ceramic with Jute Hanger",
        size: "8 inch diameter (Rope drop: 28 inch)",
        drainage: "Built-in saucer with drainage",
        style: "Boho Chic",
        colors: ["#EAE8DF", "#A9BDA3"]
      }
    },
    {
      id: "pot-5",
      category: "pots",
      subCategory: "ceramic",
      name: "Marble Pot",
      slug: "marble-pot",
      tagline: "Premium luxury stone finish",
      description: "Heavyweight ceramic planter with hand-swirled grey and gold Carrara marble veining. A show-stopping centerpiece for executive desks and coffee tables.",
      price: 799,
      originalPrice: 999,
      rating: 4.8,
      reviewCount: 73,
      image: "/assets/products/pots/marble-pot.jpg",
      refImage: "/assets/products/pots/marble-pot-ref.png",
      badge: "Luxury",
      inStock: true,
      metadata: {
        material: "Cast Stone Ceramic",
        size: "8 inch diameter (Height: 8 inch)",
        drainage: "Pre-drilled with stopper",
        style: "Polished Marble",
        colors: ["#FFFFFF", "#DCC8A8"]
      }
    },
    {
      id: "pot-6",
      category: "pots",
      subCategory: "decorative",
      name: "Metal Pot",
      slug: "metal-pot",
      tagline: "Modern & chic spun brass finish",
      description: "Precision-spun brass planter with a warm brushed metallic glow. Includes a waterproof internal liner to protect metal from direct soil moisture.",
      price: 749,
      originalPrice: 899,
      rating: 4.4,
      reviewCount: 38,
      image: "/assets/products/pots/metal-pot.jpg",
      refImage: "/assets/products/pots/metal-pot-ref.png",
      badge: null,
      inStock: true,
      metadata: {
        material: "Brushed Brass Alloy",
        size: "8 inch diameter",
        drainage: "Includes removable inner pot with drainage",
        style: "Mid-Century Glam",
        colors: ["#D4AF37", "#173F2B"]
      }
    },
    {
      id: "pot-7",
      category: "pots",
      subCategory: "ceramic",
      name: "Ribbed Ceramic Pot",
      slug: "ribbed-ceramic-pot",
      tagline: "Trendy & stylish vertical fluting",
      description: "Architectural vertical ribs in a gentle blush terracotta glaze. Brings rhythm, visual interest, and soft warmth to any room's decor.",
      price: 549,
      originalPrice: 649,
      rating: 4.6,
      reviewCount: 60,
      image: "/assets/products/pots/ribbed-ceramic-pot.jpg",
      refImage: "/assets/products/pots/ribbed-ceramic-pot-ref.png",
      badge: "Trending",
      inStock: true,
      metadata: {
        material: "Fine Porcelain Ceramic",
        size: "7 inch diameter (Height: 7 inch)",
        drainage: "Drainage hole with matching saucer",
        style: "Fluted Column",
        colors: ["#F1E1D4", "#DDE7D8"]
      }
    },
    {
      id: "pot-8",
      category: "pots",
      subCategory: "decorative",
      name: "Bamboo Pot",
      slug: "bamboo-pot",
      tagline: "Eco-friendly sustainable natural grain",
      description: "Constructed from rapidly renewable compressed bamboo and organic plant resin. Biodegradable, lightweight, and warmly organic.",
      price: 449,
      originalPrice: 529,
      rating: 4.5,
      reviewCount: 42,
      image: "/assets/products/pots/bamboo-pot.jpg",
      refImage: "/assets/products/pots/bamboo-pot-ref.png",
      badge: "Eco Choice",
      inStock: true,
      metadata: {
        material: "Natural Bamboo Fiber",
        size: "7 inch diameter",
        drainage: "Drainage base with catch tray",
        style: "Warm Earthy Minimal",
        colors: ["#DCC8A8"]
      }
    },
    {
      id: "pot-9",
      category: "pots",
      subCategory: "decorative",
      name: "Decorative Pot",
      slug: "decorative-pot",
      tagline: "Adds character with artisan pattern",
      description: "Stunning monochrome geometric tribal motifs silk-printed onto matte ceramic. Accentuates green foliage with dramatic contrast.",
      price: 599,
      originalPrice: 699,
      rating: 4.7,
      reviewCount: 56,
      image: "/assets/products/pots/decorative-pot.jpg",
      refImage: "/assets/products/pots/decorative-pot-ref.png",
      badge: null,
      inStock: true,
      metadata: {
        material: "Glazed Stoneware Ceramic",
        size: "8 inch diameter",
        drainage: "Drainage hole included",
        style: "Boho Patterned",
        colors: ["#123222", "#FBF9F4"]
      }
    },
    {
      id: "pot-10",
      category: "pots",
      subCategory: "ceramic",
      name: "Minimal White Pot",
      slug: "minimal-white-pot",
      tagline: "Simple & versatile matte porcelain",
      description: "The quintessential pure white cylinder planter with a silky smooth satin glaze. Allows the natural color and architecture of your plant to take center stage.",
      price: 399,
      originalPrice: 479,
      rating: 4.5,
      reviewCount: 47,
      image: "/assets/products/pots/minimal-white-pot.jpg",
      refImage: "/assets/products/pots/minimal-white-pot-ref.png",
      badge: "Versatile",
      inStock: true,
      metadata: {
        material: "Matte Porcelain",
        size: "8 inch diameter",
        drainage: "Base drainage hole with plug",
        style: "Scandinavian Minimal",
        colors: ["#FFFFFF"]
      }
    }
  ],

  seeds: [
    {
      id: "seed-1",
      category: "seeds",
      subCategory: "herb",
      name: "Basil Seeds",
      slug: "basil-seeds",
      tagline: "Fresh aromatic Italian herbs at home",
      description: "Heirloom Sweet Genovese Basil seeds. Yields tender, deeply aromatic leaves packed with essential culinary oils for fresh pestos, pastas, and salads.",
      price: 99,
      originalPrice: 129,
      rating: 4.7,
      reviewCount: 89,
      image: "/assets/products/seeds/basil-seeds.jpg",
      refImage: "/assets/products/seeds/basil-seeds-ref.png",
      badge: "Heirloom",
      inStock: true,
      metadata: {
        type: "Herb Seeds",
        difficulty: "Easy for Beginners",
        season: "All Year Round / Spring",
        germination: "5-8 Days",
        harvestTime: "4-5 Weeks",
        seedCount: "150+ Seeds"
      }
    },
    {
      id: "seed-2",
      category: "seeds",
      subCategory: "vegetable",
      name: "Tomato Seeds",
      slug: "tomato-seeds",
      tagline: "Juicy & homegrown sweet cherry tomatoes",
      description: "High-yield non-GMO Cherry Tomato seeds selected for warm sunny balconies. Yields clusters of bite-sized, exceptionally sweet ruby-red fruits.",
      price: 79,
      originalPrice: 99,
      rating: 4.6,
      reviewCount: 76,
      image: "/assets/products/seeds/tomato-seeds.jpg",
      refImage: "/assets/products/seeds/tomato-seeds-ref.png",
      badge: "High Yield",
      inStock: true,
      metadata: {
        type: "Vegetable Seeds",
        difficulty: "Easy",
        season: "Summer & Autumn",
        germination: "6-10 Days",
        harvestTime: "60-75 Days",
        seedCount: "50+ Seeds"
      }
    },
    {
      id: "seed-3",
      category: "seeds",
      subCategory: "flower",
      name: "Sunflower Seeds",
      slug: "sunflower-seeds",
      tagline: "Brighten your space with radiant blooms",
      description: "Dwarf Sunspot sunflower variety tailored for terrace planters and patio containers. Radiates cheerful golden-yellow petals that follow the morning sun.",
      price: 89,
      originalPrice: 119,
      rating: 4.5,
      reviewCount: 68,
      image: "/assets/products/seeds/sunflower-seeds.jpg",
      refImage: "/assets/products/seeds/sunflower-seeds-ref.png",
      badge: "Pollinator",
      inStock: true,
      metadata: {
        type: "Flower Seeds",
        difficulty: "Super Easy",
        season: "Spring to Summer",
        germination: "7-10 Days",
        harvestTime: "55-65 Days",
        seedCount: "35+ Seeds"
      }
    },
    {
      id: "seed-4",
      category: "seeds",
      subCategory: "flower",
      name: "Marigold Seeds",
      slug: "marigold-seeds",
      tagline: "Natural organic garden pest control",
      description: "Vibrant orange and saffron African Marigolds. Besides their festive beauty, their aromatic roots naturally deter soil nematodes and garden pests.",
      price: 69,
      originalPrice: 89,
      rating: 4.6,
      reviewCount: 54,
      image: "/assets/products/seeds/marigold-seeds.jpg",
      refImage: "/assets/products/seeds/marigold-seeds-ref.png",
      badge: "Pest Shield",
      inStock: true,
      metadata: {
        type: "Flower Seeds",
        difficulty: "Easy",
        season: "All Year",
        germination: "4-6 Days",
        harvestTime: "45-50 Days",
        seedCount: "100+ Seeds"
      }
    },
    {
      id: "seed-5",
      category: "seeds",
      subCategory: "herb",
      name: "Mint Seeds",
      slug: "mint-seeds",
      tagline: "Fresh, cooling & fast growing",
      description: "Spearmint seeds that sprout vigorous, refreshing green sprigs. Essential for homemade lemonades, refreshing chutneys, and soothing herbal teas.",
      price: 79,
      originalPrice: 99,
      rating: 4.5,
      reviewCount: 47,
      image: "/assets/products/seeds/mint-seeds.jpg",
      refImage: "/assets/products/seeds/mint-seeds-ref.png",
      badge: "Fast Grow",
      inStock: true,
      metadata: {
        type: "Herb Seeds",
        difficulty: "Very Easy",
        season: "Spring / Summer",
        germination: "7-12 Days",
        harvestTime: "30-40 Days",
        seedCount: "200+ Seeds"
      }
    },
    {
      id: "seed-6",
      category: "seeds",
      subCategory: "vegetable",
      name: "Lettuce Seeds",
      slug: "lettuce-seeds",
      tagline: "Healthy, crisp & organic salad greens",
      description: "Butterhead loose-leaf lettuce seeds. Harvest fresh, tender, pesticide-free salad leaves right outside your kitchen window whenever you make lunch.",
      price: 69,
      originalPrice: 89,
      rating: 4.4,
      reviewCount: 38,
      image: "/assets/products/seeds/lettuce-seeds.jpg",
      refImage: "/assets/products/seeds/lettuce-seeds-ref.png",
      badge: null,
      inStock: true,
      metadata: {
        type: "Vegetable Seeds",
        difficulty: "Easy",
        season: "Winter & Cool Spring",
        germination: "4-7 Days",
        harvestTime: "30-45 Days",
        seedCount: "150+ Seeds"
      }
    },
    {
      id: "seed-7",
      category: "seeds",
      subCategory: "vegetable",
      name: "Chilli Seeds",
      slug: "chilli-seeds",
      tagline: "Spicy & rewarding fiery garden harvest",
      description: "Indian Guntur Green Chilli seeds. Compact bushy plants produce heavy flushes of fiery peppers throughout summer with proper sunlight.",
      price: 79,
      originalPrice: 99,
      rating: 4.3,
      reviewCount: 32,
      image: "/assets/products/seeds/chilli-seeds.jpg",
      refImage: "/assets/products/seeds/chilli-seeds-ref.png",
      badge: "Spicy",
      inStock: true,
      metadata: {
        type: "Vegetable Seeds",
        difficulty: "Moderate",
        season: "Warm Weather / Summer",
        germination: "8-14 Days",
        harvestTime: "70-80 Days",
        seedCount: "40+ Seeds"
      }
    },
    {
      id: "seed-8",
      category: "seeds",
      subCategory: "herb",
      name: "Coriander Seeds",
      slug: "coriander-seeds",
      tagline: "Fresh kitchen greens for everyday cooking",
      description: "High-germination split coriander seeds. In just 3 weeks, enjoy a thick carpet of zesty fresh cilantro for garnishing daily curries and dal.",
      price: 59,
      originalPrice: 79,
      rating: 4.4,
      reviewCount: 41,
      image: "/assets/products/seeds/coriander-seeds.jpg",
      refImage: "/assets/products/seeds/coriander-seeds-ref.png",
      badge: "Kitchen Must",
      inStock: true,
      metadata: {
        type: "Herb Seeds",
        difficulty: "Easy",
        season: "All Year",
        germination: "7-10 Days",
        harvestTime: "25-35 Days",
        seedCount: "100+ Seeds"
      }
    },
    {
      id: "seed-9",
      category: "seeds",
      subCategory: "vegetable",
      name: "Carrot Seeds",
      slug: "carrot-seeds",
      tagline: "Nutritious, crunchy & sweet roots",
      description: "Nantes sweet carrot seeds ideal for deep planter boxes and raised terrace beds. Crisp, coreless roots loaded with vitamin A and natural sweetness.",
      price: 69,
      originalPrice: 89,
      rating: 4.2,
      reviewCount: 28,
      image: "/assets/products/seeds/carrot-seeds.jpg",
      refImage: "/assets/products/seeds/carrot-seeds-ref.png",
      badge: null,
      inStock: true,
      metadata: {
        type: "Vegetable Seeds",
        difficulty: "Easy",
        season: "Autumn to Winter",
        germination: "10-14 Days",
        harvestTime: "65-75 Days",
        seedCount: "200+ Seeds"
      }
    },
    {
      id: "seed-10",
      category: "seeds",
      subCategory: "flower",
      name: "Wildflower Seeds",
      slug: "wildflower-seeds",
      tagline: "Attracts beneficial pollinators & bees",
      description: "A biodiverse seed blend of cosmos, poppies, cornflowers, and sweet alyssum. Creates a dreamy, colorful meadow buzzing with cheerful honeybees and butterflies.",
      price: 99,
      originalPrice: 129,
      rating: 4.6,
      reviewCount: 52,
      image: "/assets/products/seeds/wildflower-seeds.jpg",
      refImage: "/assets/products/seeds/wildflower-seeds-ref.png",
      badge: "Eco Mix",
      inStock: true,
      metadata: {
        type: "Flower Seeds",
        difficulty: "Super Easy",
        season: "Spring to Early Winter",
        germination: "5-10 Days",
        harvestTime: "40-60 Days",
        seedCount: "300+ Seeds"
      }
    }
  ]
};

// Helper: Flatten all products into a single array
const ALL_PRODUCTS = [
  ...FLORA_CATALOG.plants,
  ...FLORA_CATALOG.pots,
  ...FLORA_CATALOG.seeds
];

// Helper: Find product by slug or id
export function getProductById(id: string): Product | undefined {
  return ALL_PRODUCTS.find(p => p.id === id);
}

export function getProductBySlug(slug: string): Product | undefined {
  return ALL_PRODUCTS.find(p => p.slug === slug);
}

export function getAllProducts(): Product[] {
  return ALL_PRODUCTS;
}

