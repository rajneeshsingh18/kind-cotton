"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Prisma } from "@prisma/client";
import { ShoppingBag, Star, Check, Eye } from "lucide-react"; // Import Eye icon

import { useQuickView } from "@/hooks/use-quick-view";
import { useCartStore } from "@/store/cart.store";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type ProductWithVariants = Prisma.ProductGetPayload<{
  include: { variants: true };
}>;

const formatPrice = (price: number) => {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
  }).format(price);
};

export function ProductCard({ product }: { product: ProductWithVariants }) {
  const addToCart = useCartStore((state) => state.addToCart);
  const openQuickView = useQuickView((state) => state.open);
  const [isAdded, setIsAdded] = useState(false);
  const primaryVariant = product.variants[0];

  if (!primaryVariant) {
    return null;
  }
  
  const tag = product.tag || (product.id.endsWith('1') ? 'New Arrival' : null);

  const handleAddToCart = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    const itemToAdd = {
      id: primaryVariant.id,
      title: product.name,
      price: primaryVariant.price,
      img: primaryVariant.images[0] || "/images/placeholder.jpg",
    };
    addToCart(itemToAdd, 1);

    setIsAdded(true);
    setTimeout(() => {
      setIsAdded(false);
    }, 2000);
  };

  return (
    <div className="group relative">
      <div className="bg-white rounded-2xl p-3 shadow-sm hover:shadow-lg transition-all duration-300 border border-transparent hover:border-slate-200">
        {/* Image Container - The hover target for the main CTA */}
        <div className="relative aspect-square w-full overflow-hidden rounded-lg bg-gray-100">
          <Link href={`/products/${product.id}`} className="block w-full h-full">
            <Image
              src={primaryVariant.images[0] || "/images/placeholder.jpg"}
              alt={product.name}
              fill
              className="object-cover transition-transform duration-300 group-hover:scale-105"
            />
          </Link>
          {tag && (
            <div className="absolute top-3 left-3 bg-white/90 text-slate-900 text-xs px-2 py-1 rounded-full font-semibold backdrop-blur-sm">
              {tag}
            </div>
          )}
          {/* ✅ MOVED "Add to Cart" here so it appears over the image on hover */}
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 w-[calc(100%-2rem)] z-10">
            <Button
              onClick={handleAddToCart}
              disabled={isAdded}
              className={cn(
                "w-full opacity-0 group-hover:opacity-100 transition-all duration-300",
                { "bg-emerald-500 hover:bg-emerald-600": isAdded }
              )}
            >
              {isAdded ? (
                <><Check className="w-4 h-4 mr-2" /> Added!</>
              ) : (
                <><ShoppingBag className="w-4 h-4 mr-2" /> Add to cart</>
              )}
            </Button>
          </div>
        </div>
        
        {/* Product Details */}
        <div className="mt-4">
          <h3 className="text-sm font-medium text-slate-800">
            <Link href={`/products/${product.id}`}>
              {product.name}
            </Link>
          </h3>
          <div className="mt-2 flex items-center justify-between">
            <p className="text-lg font-semibold text-slate-900">
              {formatPrice(primaryVariant.price)}
            </p>
            {/* ✅ MOVED "Quick view" here to be always visible */}
            <Button
              variant="ghost"
              className="h-8 w-26 rounded-10px"
              onClick={() => openQuickView(product)}
            >
              <Eye className="h-5 w-5 text-gray-500" />
              Quick View
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}