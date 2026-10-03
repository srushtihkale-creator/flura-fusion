import React from "react";
import Link from "next/link";

interface PlantType {
  title: string;
  subtitle: string;
  image: string;
  href: string;
}

const PLANT_TYPES: PlantType[] = [
  {
    title: "Indoor Plants",
    subtitle: "Lush home foliage",
    image: "/assets/products/plants/monstera-deliciosa.jpg",
    href: "/plants?filter=indoor",
  },
  {
    title: "Low Light Plants",
    subtitle: "Thrives in dim spaces",
    image: "/assets/products/plants/zz-plant-1.jpg",
    href: "/plants?filter=low-light",
  },
  {
    title: "Flowering Plants",
    subtitle: "Calming floral blooms",
    image: "/assets/products/plants/peace-lily-1.jpg",
    href: "/plants?filter=flowering",
  },
  {
    title: "Air Purifying Plants",
    subtitle: "Detoxifies room air",
    image: "/assets/products/plants/snake-plant-1.jpg",
    href: "/plants?filter=air-purifying",
  },
  {
    title: "Easy Care Plants",
    subtitle: "Low maintenance",
    image: "/assets/products/plants/jade-plant-1.jpg",
    href: "/plants?filter=easy-care",
  },
  {
    title: "Large Plants",
    subtitle: "Floor statement greens",
    image: "/assets/products/plants/areca-palm-1.jpg",
    href: "/plants?filter=large",
  },
];

export function ExploreByPlantType() {
  return (
    <section className="explore-plant-types-section container">
      <div className="explore-types-header">
        <div className="explore-types-title-wrap">
          <span className="explore-types-eyebrow">Botanical Spaces</span>
          <h2 className="explore-types-title">Explore by Plant Type</h2>
          <p className="explore-types-subtitle">Find a plant that fits your space.</p>
        </div>
        <Link href="/plants" className="explore-types-view-all">
          <span>View all plants</span>
          <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
            <path d="M4 10h12M11 5l5 5-5 5" />
          </svg>
        </Link>
      </div>

      <div className="explore-types-grid">
        {PLANT_TYPES.map((plantType) => (
          <Link
            key={plantType.title}
            href={plantType.href}
            className="plant-type-card"
          >
            <div className="plant-type-img-box">
              <img
                src={plantType.image}
                alt={plantType.title}
                className="plant-type-img"
                loading="lazy"
              />
            </div>
            <div className="plant-type-meta">
              <h3 className="plant-type-name">{plantType.title}</h3>
              <p className="plant-type-desc">{plantType.subtitle}</p>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
