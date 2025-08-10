// src/app/(main)/products/[productId]/page.tsx
import { notFound } from "next/navigation";
import db from "@/lib/db";
import { ProductDetailsClient } from "./ProductDetailsClient";

interface ProductDetailPageProps {
  params: {
    productId: string;
  };
}

export default async function ProductDetailPage({ params }: ProductDetailPageProps) {
  const product = await db.product.findUnique({
    where: {
      id: params.productId,
    },
    // Fetch all variants to allow user selection
    include: {
      variants: true,
    },
  });

  // If no product is found for the ID, show a 404 page
  if (!product) {
    notFound();
  }

  return <ProductDetailsClient product={product} />;
}