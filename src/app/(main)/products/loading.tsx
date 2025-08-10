// src/app/(main)/products/loading.tsx

// A simple skeleton component for a single product card
const SkeletonCard = () => (
  <div className="bg-white rounded-2xl p-3 shadow-sm">
    <div className="relative aspect-square w-full overflow-hidden rounded-lg bg-gray-200"></div>
    <div className="mt-4 h-4 w-3/4 rounded bg-gray-200"></div>
    <div className="mt-2 h-6 w-1/2 rounded bg-gray-200"></div>
  </div>
);

export default function ProductsLoading() {
  return (
    <div className="container mx-auto px-4 py-8">
      {/* Skeleton for the header */}
      <div className="mb-8 h-9 w-1/3 rounded bg-gray-200"></div>

      {/* Skeleton for the product grid */}
      <div className="grid animate-pulse grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        <SkeletonCard />
        <SkeletonCard />
        <SkeletonCard />
        <SkeletonCard />
        <SkeletonCard />
        <SkeletonCard />
        <SkeletonCard />
        <SkeletonCard />
      </div>
    </div>
  );
}