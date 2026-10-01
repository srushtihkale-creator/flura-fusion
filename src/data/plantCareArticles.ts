import { PlantCareArticle } from "@/types/cms";

export const PLANT_CARE_ARTICLES: PlantCareArticle[] = [
  {
    id: "care-1",
    slug: "golden-rule-of-watering",
    title: "The Golden Rule of Watering Indoor Plants",
    category: "watering",
    excerpt:
      "More indoor plants perish from over-watering than under-watering. Master the 2-inch soil test and seasonal drainage cycles.",
    readTime: "4 min read",
    author: "Botanical Team",
    date: "Sep 2026",
    image: "/assets/products/plants/money-plant.jpg",
    contentMarkdown: `
### Why Over-Watering Harms Roots
Root rot occurs when water fills all microscopic air pockets in the potting mix, suffocating roots and inviting fungal pathogens. Most tropical plants prefer their potting soil to breathe between hydration cycles.

### The Finger & Skewer Test
1. Insert your index finger or a dry wooden skewer 2 inches into the soil.
2. If it emerges with cool, dark soil clinging to it, wait 2 to 3 days.
3. If it comes out dry and clean, water deeply until moisture freely escapes from the bottom drainage hole.

### Seasonality & Weather
During Indian monsoons and winters, ambient humidity slows evaporation. Cut watering frequency by almost half compared to peak summer months.
    `.trim(),
  },
  {
    id: "care-2",
    slug: "deciphering-natural-light",
    title: "Deciphering Natural Light in Your Apartment",
    category: "light",
    excerpt:
      "Understand the difference between bright indirect light, direct sun, and low-light tolerance for thriving foliage.",
    readTime: "5 min read",
    author: "Flora Specialist",
    date: "Sep 2026",
    image: "/assets/products/plants/monstera-deliciosa.jpg",
    contentMarkdown: `
### What is "Bright Indirect Light"?
Bright indirect light means the plant can "see" the open sky without harsh sunbeams directly striking the leaves, which causes bleached scorch spots. Placing plants within 3 to 5 feet of an east-facing window or behind sheer curtains is ideal.

### Low Light Champions
Rooms with north-facing windows or recessed corners receive low light. Choose resilient species like the Snake Plant (*Sansevieria*) and ZZ Plant (*Zamioculcas zamiifolia*), which metabolize slowly and tolerate low luminescence without etiolation.

### Direct Sunlight
Flowering plants like Lavender and outdoor edible herbs require at least 4 to 6 hours of unfiltered direct sun to produce essential oils and blossoms.
    `.trim(),
  },
  {
    id: "care-3",
    slug: "potting-and-drainage-secrets",
    title: "Potting, Soil Drainage & Cachepot Techniques",
    category: "repotting",
    excerpt:
      "Never trap stagnant water in pots without drainage. Learn when and how to repot into breathable terracotta or glazed ceramic.",
    readTime: "4 min read",
    author: "Nursery Master",
    date: "Aug 2026",
    image: "/assets/products/pots/terracotta-pot.jpg",
    contentMarkdown: `
### The Crucial Drainage Hole
Pots must have drainage holes to allow excess salts and stagnant water to flush out. If you fall in love with a decorative cachepot without holes, keep the plant in its nursery plastic container and slide it inside the decorative pot.

### The Ideal Soil Composition
For indoor foliage:
- 40% Premium garden soil
- 30% Coco peat (for light aeration and moisture retention)
- 20% Perlite or coarse pumice
- 10% Well-rotted vermicompost

### When to Repot
Roots peeking through bottom drainage holes or water draining straight through within 2 seconds are clear signs your plant is root-bound. Choose a new pot that is only 1 to 2 inches larger in diameter.
    `.trim(),
  },
  {
    id: "care-4",
    slug: "common-leaf-symptoms-guide",
    title: "Plant Doctor: Diagnosing Yellow Leaves & Brown Tips",
    category: "troubleshooting",
    excerpt:
      "Learn what your leaves are telling you: crispy brown tips, yellowing lower leaves, curling foliage, and pests.",
    readTime: "6 min read",
    author: "Plant Health Desk",
    date: "Aug 2026",
    image: "/assets/products/plants/peace-lily.jpg",
    contentMarkdown: `
### Yellowing Lower Leaves
Occasional shedding of oldest lower leaves is natural. However, sudden widespread yellowing accompanied by soft stems signals over-watering. Check the roots immediately and let the soil dry out.

### Crispy Brown Leaf Tips
Usually caused by low indoor humidity (especially from air conditioners) or mineral buildup from hard tap water. Mist the foliage in the morning or group plants together to create a humid microclimate.

### Drooping Stems
Peace Lilies and Fittonia are dramatic communicators. When thirsty, they droop dramatically within hours, but perk right back up within 30 minutes of a thorough watering.
    `.trim(),
  },
  {
    id: "care-5",
    slug: "growing-balcony-herbs-from-seeds",
    title: "Growing A Thriving Balcony Herb Garden From Seeds",
    category: "repotting",
    excerpt:
      "Step-by-step instructions for germinating Basil, Mint, and Coriander seeds into lush, kitchen-ready fresh herbs.",
    readTime: "5 min read",
    author: "Garden Botanist",
    date: "Jul 2026",
    image: "/assets/products/seeds/basil-seeds.jpg",
    contentMarkdown: `
### Sowing Depth
A universal rule for seeds: sow them at a depth roughly double their size. Tiny seeds like Basil only need a light 2mm dusting of vermicompost over them.

### Germination Moisture
Never pour water from a heavy watering can over freshly sown seeds, as it will wash them away. Use a fine mist spray bottle twice daily to keep the top layer moist until sprouts emerge in 5 to 8 days.

### Pruning for Bushy Growth
Once your herb plant develops three sets of true leaves, pinch off the top growing tip. This encourages branching, resulting in twice as many fragrant leaves for your kitchen dishes!
    `.trim(),
  },
];
