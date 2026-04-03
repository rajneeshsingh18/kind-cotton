"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Prisma } from "@prisma/client";
import { ShoppingBag, Check } from "lucide-react";

import { useQuickView } from "@/hooks/use-quick-view";
import { useCartStore } from "@/store/cart.store";
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

  if (!primaryVariant) return null;

  const tag = product.tag || (product.id.endsWith("1") ? "New Arrival" : null);

  const handleAddToCart = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    addToCart(
      {
        id: primaryVariant.id,
        title: product.name,
        price: primaryVariant.price,
        img: primaryVariant.images[0] || "/images/placeholder.jpg",
      },
      1
    );
    setIsAdded(true);
    setTimeout(() => setIsAdded(false), 2000);
  };

  return (
    <div className="group relative bg-kc-surface-lowest rounded-2xl overflow-hidden kc-shadow transition-shadow duration-300 hover:shadow-[0_20px_56px_rgba(26,28,27,0.10)]">
      {/* ── Image ──────────────────────────────────────────── */}
      <div className="relative aspect-[4/5] w-full overflow-hidden bg-kc-surface-low">
        <Link href={`/products/${product.id}`} className="block w-full h-full">
          <Image
            src={primaryVariant.images[0] || "/images/placeholder.jpg"}
            alt={product.name}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-104"
          />
        </Link>

        {/* Eco / tag badge */}
        {tag && (
          <div className="absolute top-3 left-3 kc-eco-badge">
            {tag}
          </div>
        )}

        {/* Hover overlay — "Quick View" with backdrop blur */}
        <div className="absolute inset-0 flex flex-col items-center justify-end pb-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <div className="absolute inset-0 bg-(--kc-on-surface)/10 backdrop-blur-[2px]" />
          <button
            onClick={() => openQuickView(product)}
            className="relative z-10 px-5 py-2 text-xs font-semibold tracking-wide text-white rounded-xl bg-(--kc-on-surface)/50 hover:bg-(--kc-on-surface)/70 transition-colors duration-200"
          >
            Quick View
          </button>
        </div>
      </div>

      {/* ── Details ────────────────────────────────────────── */}
      <div className="px-4 pt-3 pb-4">
        <h3 className="text-sm font-medium text-kc-on-surface leading-snug">
          <Link
            href={`/products/${product.id}`}
            className="hover:text-kc-primary transition-colors duration-200"
          >
            {product.name}
          </Link>
        </h3>

        <div className="mt-3 flex items-center justify-between gap-2">
          <p className="font-display text-base font-bold text-kc-on-surface">
            {formatPrice(primaryVariant.price)}
          </p>

          {/* Add to Cart — primary gradient, appears on hover */}
          <button
            onClick={handleAddToCart}
            disabled={isAdded}
            className={cn(
              "kc-btn-primary inline-flex items-center gap-1.5 px-3 py-2 text-xs font-semibold",
              "opacity-0 group-hover:opacity-100 translate-y-1 group-hover:translate-y-0",
              "transition-all duration-300",
              isAdded && "opacity-100 translate-y-0"
            )}
          >
            {isAdded ? (
              <>
                <Check className="w-3.5 h-3.5" />
                Added
              </>
            ) : (
              <>
                <ShoppingBag className="w-3.5 h-3.5" />
                Add
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
