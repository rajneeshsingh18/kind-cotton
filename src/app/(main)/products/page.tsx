// src/app/(main)/products/page.tsx
import db from "@/lib/db";
import { AnimatedProductGrid } from "@/components/modules/products/AnimatedProductGrid";

export default async function ProductsPage() {
  const productsFromDb = await db.product.findMany({
    include: {
      variants: {
        orderBy: { price: 'asc' }
      },
    },
    orderBy: {
      createdAt: 'desc'
    }
  });

  // Filter out products that have no variants
  const productsWithVariants = productsFromDb.filter(
    (product) => product.variants.length > 0
  );

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Improved Page Header */}
      <div className="mb-8 flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">All Products</h1>
        {/* Placeholder for future Sort/Filter buttons */}
        <div className="flex items-center gap-4">
          {/* Example: <SortDropdown /> */}
        </div>
      </div>
      
      {productsWithVariants.length === 0 ? (
        <p>No products found.</p>
      ) : (
        // Delegate rendering to the new animated client component
        <AnimatedProductGrid products={productsWithVariants} />
      )}
    </div>
  );
}