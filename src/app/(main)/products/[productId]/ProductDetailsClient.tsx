"use client";

import { useState, useMemo, useEffect } from "react";
import Image from "next/image";
import { Prisma, Size } from "@prisma/client";
import { Button } from "@/components/ui/button";
import { useCartStore } from "@/store/cart.store";
import { Minus, Plus, Check } from "lucide-react";

type ProductWithVariants = Prisma.ProductGetPayload<{
  include: { variants: true };
}>;

export function ProductDetailsClient({ product }: { product: ProductWithVariants }) {
  const addToCart = useCartStore((state) => state.addToCart);

  // State for selections
  const [selectedColor, setSelectedColor] = useState<string>(product.variants[0].color);
  const [selectedSize, setSelectedSize] = useState<Size>(product.variants[0].size);
  const [quantity, setQuantity] = useState(1);
  const [addedToCart, setAddedToCart] = useState(false);

  // Memoize derived values to optimize performance
  const uniqueColors = useMemo(() => {
    return [...new Set(product.variants.map(v => v.color))];
  }, [product.variants]);

  const availableSizesForSelectedColor = useMemo(() => {
    return product.variants
      .filter(v => v.color === selectedColor)
      .map(v => v.size);
  }, [selectedColor, product.variants]);
  
  // Find the currently selected variant based on color and size
  const selectedVariant = useMemo(() => {
    return product.variants.find(
      v => v.color === selectedColor && v.size === selectedSize
    );
  }, [selectedColor, selectedSize, product.variants]);
  
  // Effect to reset size selection if it's not available for a new color
  useEffect(() => {
    if (!availableSizesForSelectedColor.includes(selectedSize)) {
      setSelectedSize(availableSizesForSelectedColor[0]);
    }
  }, [selectedColor, selectedSize, availableSizesForSelectedColor]);

  const handleAddToCart = () => {
    if (!selectedVariant) return;

    const itemToAdd = {
      id: selectedVariant.id,
      title: product.name,
      price: selectedVariant.price,
      img: selectedVariant.images[0] || "/images/placeholder.jpg",
    };
    addToCart(itemToAdd, quantity);

    // Provide user feedback
    setAddedToCart(true);
    setTimeout(() => setAddedToCart(false), 2000); // Reset after 2 seconds
  };
  
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid gap-8 md:grid-cols-2 lg:gap-16">
        {/* Image */}
        <div className="relative aspect-square overflow-hidden rounded-lg border">
          <Image
            src={selectedVariant?.images[0] || "/images/placeholder.jpg"}
            alt={`${product.name} - ${selectedVariant?.color}`}
            fill
            className="object-cover transition-opacity duration-300"
          />
        </div>

        {/* Product Info & Actions */}
        <div className="flex flex-col">
          <h1 className="text-3xl font-bold tracking-tight lg:text-4xl">{product.name}</h1>
          <p className="mt-4 text-3xl font-semibold">
            ${selectedVariant?.price.toFixed(2)}
          </p>
          <p className="mt-6 text-gray-600 leading-relaxed">{product.description}</p>
          
          <div className="mt-8 space-y-6">
            {/* Color Selector */}
            <div>
              <h3 className="text-sm font-medium text-gray-900">Color</h3>
              <div className="mt-2 flex flex-wrap gap-3">
                {uniqueColors.map((color) => (
                  <button
                    key={color}
                    type="button"
                    onClick={() => setSelectedColor(color)}
                    className={`h-8 w-8 rounded-full border border-gray-300 transition-transform hover:scale-110 ${selectedColor === color ? 'ring-2 ring-offset-2 ring-blue-500' : ''}`}
                    style={{ backgroundColor: color }}
                    title={color}
                  />
                ))}
              </div>
            </div>

            {/* Size Selector */}
            <div>
              <h3 className="text-sm font-medium text-gray-900">Size</h3>
              <div className="mt-2 flex flex-wrap gap-2">
                {Object.values(Size).map((size) => (
                  <Button
                    key={size}
                    variant={selectedSize === size ? "default" : "outline"}
                    onClick={() => setSelectedSize(size)}
                    disabled={!availableSizesForSelectedColor.includes(size)}
                    className="disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {size}
                  </Button>
                ))}
              </div>
            </div>

            {/* Quantity Selector */}
            <div>
                <h3 className="text-sm font-medium text-gray-900">Quantity</h3>
                <div className="mt-2 flex items-center">
                    <Button variant="outline" size="icon" onClick={() => setQuantity(q => Math.max(1, q - 1))}>
                        <Minus className="h-4 w-4"/>
                    </Button>
                    <span className="w-16 text-center text-lg font-semibold">{quantity}</span>
                    <Button variant="outline" size="icon" onClick={() => setQuantity(q => q + 1)}>
                        <Plus className="h-4 w-4"/>
                    </Button>
                </div>
            </div>
          </div>

          <div className="mt-auto pt-8">
            <Button
              size="lg"
              className="w-full transition-colors"
              onClick={handleAddToCart}
              disabled={!selectedVariant || addedToCart}
            >
              {addedToCart ? (
                <>
                  <Check className="h-5 w-5 mr-2" /> Added!
                </>
              ) : (
                "Add to Cart"
              )}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}