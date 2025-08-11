"use client";

import { useState } from "react"; // 1. Import useState
import Image from "next/image";
import Link from "next/link";
import { Prisma } from "@prisma/client";
import { ShoppingBag, Star, Check } from "lucide-react"; // 2. Import the Check icon


import { useQuickView } from "@/hooks/use-quick-view"; // 1. Import the hook


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
  // 3. Add state to track the "added" status
  const [isAdded, setIsAdded] = useState(false);
  const primaryVariant = product.variants[0];

  const openQuickView = useQuickView((state) => state.open); // 2. Get the open action

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

    // Set the state to true and reset after 2 seconds
    setIsAdded(true);
    setTimeout(() => {
      setIsAdded(false);
    }, 2000);
  };

  return (
    <div className="group relative">
      <div className="bg-white rounded-2xl p-3 shadow-sm hover:shadow-lg transition-all duration-300 border border-transparent hover:border-slate-200">
        {/* Card content (Image, Details, etc.) remains the same */}
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
        </div>
        <div className="mt-4">
          <h3 className="text-sm font-medium text-slate-800">
            <Link href={`/products/${product.id}`}>
              <span aria-hidden="true" className="absolute inset-0 z-0" />
              {product.name}
            </Link>
          </h3>
          <div className="mt-1 flex items-center justify-between">
            <p className="text-lg font-semibold text-slate-900">
              {formatPrice(primaryVariant.price)}
            </p>
            {product.rating && (
              <div className="flex items-center gap-1 text-sm text-slate-500">
                <span>{product.rating.toFixed(1)}</span>
                <Star className="w-4 h-4 text-amber-400 fill-amber-400" />
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Add to Cart Button - Now with feedback */}
      <div className="absolute bottom-24 left-1/2 -translate-x-1/2 w-[calc(100%-2rem)] z-10">
        {/* 3. Wire up the onClick event */}
          <button 
            onClick={() => openQuickView(product)} 
            className=" bg-amber-50 text-xs flex-center r px-3 py-1 border rounded-full hover:bg-gray-50"
          >
            Quick view
          </button>

        <Button
          onClick={handleAddToCart}
          disabled={isAdded} // 4. Disable button when item is added
          className={cn(
            "bg-amber-100 text-grey-100 w-full opacity-0 group-hover:opacity-100 transition-all duration-200",
            // 5. Conditionally change the background color
            {
              "bg-emerald-500 hover:bg-amber-100": isAdded,
            }
          )}
        >
          {isAdded ? (
            // 6. Show "Added!" text and checkmark icon
            <>
              <Check className="w-4 h-4 mr-2" />
              Added!
            </>
          ) : (
            // Or show the default text and icon
            <>
              <ShoppingBag className="w-4 h-4 mr-2" />
              Add to cart
            </>
          )}
        </Button>
      </div>
    </div>
  );
}