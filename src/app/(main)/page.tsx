// // src/app/(main)/page.tsx
// import db from "@/lib/db";
// import { AnimatedProductGrid } from "@/components/modules/products/AnimatedProductGrid";
// import { Button } from "@/components/ui/button";
// import Link from "next/link";

// export default async function HomePage() {
//   // Fetch a few products to feature on the homepage
//   const featuredProductsFromDb = await db.product.findMany({
//     take: 4, // Get the 4 most recent products
//     include: {
//       variants: {
//         orderBy: { price: 'asc' }
//       },
//     },
//     orderBy: {
//       createdAt: 'desc'
//     }
//   });

//   // Filter out any products that might not have variants
//   const featuredProducts = featuredProductsFromDb.filter(
//     (product) => product.variants.length > 0
//   );

//   return (
//     <div className="container mx-auto px-4 py-8">
//       {/* Hero Section */}
//       <section className="text-center py-16 bg-gray-50 rounded-lg mb-12">
//         <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-gray-900">
//           Effortless Style, Unmatched Comfort
//         </h1>
//         <p className="mt-4 max-w-2xl mx-auto text-lg text-gray-600">
//           Discover our new collection of premium cotton clothing, designed for your everyday life.
//         </p>
//         <div className="mt-8">
//           <Button asChild size="lg">
//             <Link href="/products">Shop All Products</Link>
//           </Button>
//         </div>
//       </section>

//       {/* Featured Products Section */}
//       <section>
//         <div className="mb-8 flex items-center justify-between">
//           <h2 className="text-2xl font-bold tracking-tight">Featured Products</h2>
//           <Button asChild variant="link">
//             <Link href="/products">View All →</Link>
//           </Button>
//         </div>
        
//         {featuredProducts.length > 0 ? (
//           // We reuse the animated grid we already built!
//           <AnimatedProductGrid products={featuredProducts} />
//         ) : (
//           <p>No featured products to display.</p>
//         )}
//       </section>
//     </div>
//   );
// }


export default function HomePage() {
  return (
    <div className="container mx-auto p-8">
      <h1 className="text-3xl font-bold">Homepage Build Test</h1>
      <p>
        If this page deploys successfully, the build issue is related to a component
        or data fetching on the original homepage.
      </p>
    </div>
  );
}