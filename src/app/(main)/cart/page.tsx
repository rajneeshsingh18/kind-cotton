"use client";

import Image from "next/image";
import Link from "next/link";
import { useCartStore } from "@/store/cart.store";
import { Button } from "@/components/ui/button";
import { Minus, Plus, Trash2, ShoppingBag, Loader2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";

// Utility to format currency
const formatPrice = (price: number) =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
  }).format(price);

export default function CartPage() {
  const { items, removeFromCart, updateQuantity } = useCartStore();
  const [isLoading, setIsLoading] = useState(false);

  const subtotal = items.reduce((acc, item) => acc + item.price * item.quantity, 0);
  const shippingCost = subtotal > 500 ? 0 : 50;
  const total = subtotal + shippingCost;

  // ✅ This is the updated checkout logic for Lemon Squeezy
  const handleCheckout = async () => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ items }),
      });

      const { checkoutUrl } = await response.json();
      if (!checkoutUrl) {
        throw new Error("Could not create checkout session.");
      }

      // Redirect directly to the Lemon Squeezy checkout page
      window.location.href = checkoutUrl;

    } catch (error) {
      console.error("Checkout Error:", error);
      alert("An error occurred. Please try again.");
      setIsLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      {items.length === 0 ? (
        // Empty cart view
        <div className="text-center py-20">
          <ShoppingBag className="mx-auto mb-6 h-16 w-16 text-gray-400" />
          <h1 className="text-3xl font-bold mb-2">Your Cart is Empty</h1>
          <p className="text-gray-500 mb-8">Looks like you haven&apos;t added anything yet.</p>
          <Button asChild size="lg" className="rounded-full">
            <Link href="/products">🛒 Start Shopping</Link>
          </Button>
        </div>
      ) : (
        // Cart view with items
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
          <div className="lg:col-span-2 space-y-4">
            <AnimatePresence>
              {items.map((item) => (
                <motion.div
                  key={item.id}
                  layout
                  drag="x"
                  dragConstraints={{ left: 0, right: 0 }}
                  onDragEnd={(e, { offset }) => {
                    if (offset.x < -100) removeFromCart(item.id);
                  }}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, x: -200 }}
                  className="flex flex-col sm:flex-row items-center gap-4 bg-white p-4 rounded-lg shadow-sm border"
                >
                  <div className="relative h-24 w-24 rounded-md overflow-hidden flex-shrink-0">
                    <Image src={item.img} alt={item.title} fill className="object-cover" />
                  </div>
                  <div className="flex flex-1 flex-col justify-between w-full">
                    <h2 className="font-semibold text-lg">{item.title}</h2>
                    <p className="text-sm text-gray-500">{formatPrice(item.price)}</p>
                    <div className="mt-2 flex items-center justify-between gap-6">
                      <div className="flex items-center gap-2">
                        <Button variant="outline" size="icon" onClick={() => updateQuantity(item.id, "decrease")}>
                          <Minus className="h-4 w-4" />
                        </Button>
                        <span className="w-10 text-center font-semibold text-lg">{item.quantity}</span>
                        <Button variant="outline" size="icon" onClick={() => updateQuantity(item.id, "increase")}>
                          <Plus className="h-4 w-4" />
                        </Button>
                      </div>
                      <div className="text-lg font-semibold">{formatPrice(item.price * item.quantity)}</div>
                    </div>
                  </div>
                   <div className="self-start sm:self-center">
                    <Button variant="ghost" size="icon" onClick={() => removeFromCart(item.id)} className="hover:bg-red-50">
                      <Trash2 className="h-5 w-5 text-red-500" />
                    </Button>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1 bg-white p-6 rounded-lg shadow-sm border space-y-4 sticky top-24">
            <h2 className="text-xl font-semibold">Order Summary</h2>
            <div className="flex justify-between"><span>Subtotal</span><span>{formatPrice(subtotal)}</span></div>
            <div className="flex justify-between"><span>Shipping</span><span>{shippingCost === 0 ? "Free" : formatPrice(shippingCost)}</span></div>
            <hr />
            <div className="flex justify-between font-bold text-lg"><span>Total</span><span>{formatPrice(total)}</span></div>
            <Button
              size="lg"
              className="w-full mt-4 rounded-full"
              onClick={handleCheckout}
              disabled={isLoading}
            >
              {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Proceed to Checkout
            </Button>
            <p className="text-xs text-gray-500 text-center">
              Secure checkout — All transactions are encrypted
            </p>
          </div>
        </div>
      )}
    </div>
  );
}