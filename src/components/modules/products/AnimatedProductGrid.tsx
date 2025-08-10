"use client";

import { motion } from "framer-motion";
import { ProductCard } from "./ProductCard";
import { Prisma } from "@prisma/client";

// Define the full product type, including variants
type ProductWithVariants = Prisma.ProductGetPayload<{
  include: { variants: true };
}>;

// Animation variants for the container to orchestrate the stagger effect
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.05, // Each card will appear 0.05s after the previous one
    },
  },
};

// Animation variants for each individual product card
const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: {
      duration: 0.5,
    },
  },
};

export function AnimatedProductGrid({ products }: { products: ProductWithVariants[] }) {
  return (
    <motion.div
      className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {products.map((product) => (
        <motion.div key={product.id} variants={itemVariants}>
          <ProductCard product={product} />
        </motion.div>
      ))}
    </motion.div>
  );
}