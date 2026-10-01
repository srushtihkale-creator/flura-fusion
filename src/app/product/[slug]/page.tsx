import React from "react";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ProductService } from "@/services/product.service";
import { ProductDetailView } from "@/components/product/ProductDetailView";
import { getAllProducts } from "@/data/catalog";

interface PageProps {
  params: {
    slug: string;
  };
}

export async function generateStaticParams() {
  const allProducts = getAllProducts();
  return allProducts.map((p) => ({
    slug: p.slug,
  }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const product = await ProductService.getBySlug(params.slug);

  if (!product) {
    return {
      title: "Product Not Found | Flora Fusion",
    };
  }

  return {
    title: `${product.name} — ₹${product.price} | Flora Fusion`,
    description: `${product.tagline}. ${product.description.slice(0, 150)}...`,
    openGraph: {
      title: `${product.name} | Flora Fusion`,
      description: product.tagline,
      images: [product.image],
    },
  };
}

export default async function ProductPage({ params }: PageProps) {
  const product = await ProductService.getBySlug(params.slug);

  if (!product) {
    notFound();
  }

  const relatedProducts = await ProductService.getRelated(product, 4);

  return <ProductDetailView product={product} relatedProducts={relatedProducts} />;
}
