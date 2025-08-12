"use client";
import { Prisma } from '@prisma/client';
import { motion } from 'framer-motion';
import { ProductCard } from '../products/ProductCard';

type ProductWithVariants = Prisma.ProductGetPayload<{
  include: { variants: true };
}>;

interface ProductCarouselProps {
  title: string;
  products: ProductWithVariants[];
}

export function ProductCarousel({ title, products }: ProductCarouselProps) {
  return (
    <section className="mb-12">
      <h2 className="text-2xl font-bold tracking-tight mb-6">{title}</h2>
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6">
        {products.map((product, i) => (
          <motion.div
            key={product.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
          >
            <ProductCard product={product} />
          </motion.div>
        ))}
      </div>
    </section>
  );
}