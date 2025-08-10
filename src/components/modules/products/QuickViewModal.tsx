"use client";

import { useQuickView } from "@/hooks/use-quick-view";
import { ProductDetailsClient } from "@/app/(main)/products/[productId]/ProductDetailsClient";
import { AnimatePresence, motion } from "framer-motion";
import { X } from "lucide-react";

export function QuickViewModal() {
  const { isOpen, product, close } = useQuickView();

  // We are reusing the detailed client component we already built!
  // This is a great example of component reuse.
  if (!product) {
    return null;
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
          onClick={close} // Close modal when clicking the backdrop
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className="relative max-w-4xl w-full bg-white rounded-2xl shadow-xl overflow-hidden"
            onClick={(e) => e.stopPropagation()} // Prevent closing when clicking inside the modal
          >
            {/* We can simply reuse the component from our product detail page */}
            <ProductDetailsClient product={product} />
            
            <button
              onClick={close}
              className="absolute top-4 right-4 p-2 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors"
              aria-label="Close quick view"
            >
              <X className="w-5 h-5" />
            </button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}