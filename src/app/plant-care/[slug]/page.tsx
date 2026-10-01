import React from "react";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { PlantCareService } from "@/services/plantCare.service";
import { PlantCareDetailView } from "@/components/plant-care/PlantCareDetailView";
import { PLANT_CARE_ARTICLES } from "@/data/plantCareArticles";

interface PageProps {
  params: {
    slug: string;
  };
}

export async function generateStaticParams() {
  return PLANT_CARE_ARTICLES.map((a) => ({
    slug: a.slug,
  }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const article = await PlantCareService.getBySlug(params.slug);

  if (!article) {
    return {
      title: "Article Not Found | Flora Fusion",
    };
  }

  return {
    title: `${article.title} | Flora Fusion Plant Care`,
    description: article.excerpt,
    openGraph: {
      title: article.title,
      description: article.excerpt,
      images: [article.image],
    },
  };
}

export default async function ArticlePage({ params }: PageProps) {
  const article = await PlantCareService.getBySlug(params.slug);

  if (!article) {
    notFound();
  }

  const allArticles = await PlantCareService.getAll();
  const relatedArticles = allArticles.filter((a) => a.id !== article.id).slice(0, 2);

  return <PlantCareDetailView article={article} relatedArticles={relatedArticles} />;
}
