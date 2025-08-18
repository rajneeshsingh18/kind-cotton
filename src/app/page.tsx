// src/app/(main)/page.tsx
import db from "@/lib/db";
import { AnimatedProductGrid } from "@/components/modules/products/AnimatedProductGrid";
import { Button } from "@/components/ui/button";
import HeroSection from "@/components/modules/homepage/HeroSection";
import CategoryNav from "@/components/modules/homepage/CategoryNav";
import NewsletterSignup from "@/components/modules/homepage/NewsletterSignup";
import StyleGuideSection from "@/components/modules/homepage/StyleGuideSection";
import { AnimatedTestimonials } from "@/components/ui/animated-testimonials"; // Added import


import { DealsSection } from "@/components/modules/homepage/DealsSection";


import Link from "next/link";

export default async function HomePage() {
  // Fetch a few products to feature on the homepage
  const featuredProductsFromDb = await db.product.findMany({
    take: 4, // Get the 4 most recent products
    include: {
      variants: {
        orderBy: { price: 'asc' }
      },
    },
    orderBy: {
      createdAt: 'desc'
    }
  });

  // Filter out any products that might not have variants
  const featuredProducts = featuredProductsFromDb.filter(
    (product) => product.variants.length > 0
  );


  // Data for the new testimonials section
  const testimonials = [
    {
      description: "KindCotton has completely transformed my wardrobe. The quality is amazing, and the clothes are so comfortable and stylish.",
      image: "https://images.unsplash.com/photo-1611558709798-e009c8fd7706?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3",
      name: "Isabelle Carlos",
      handle: "@isabellecarlos",
    },

    {
      description: "KindCotton has completely transformed my wardrobe. The quality is amazing, and the clothes are so comfortable and stylish.",
      image: "https://images.unsplash.com/photo-1611558709798-e009c8fd7706?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3",
      name: "Rohan",
      handle: "@isabellecarlos",
    }
    // ... (other testimonial objects) ...
  ];
  

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Hero Section */}

      <HeroSection />

      <CategoryNav />


       <DealsSection />

            {/* Featured Products Section */}
      <section>
        <div className="mb-8 flex items-center justify-between">
          <h2 className="text-2xl font-bold tracking-tight">Featured Products</h2>
          <Button asChild variant="link">
            <Link href="/products">View All →</Link>
          </Button>
        </div>
        
        {featuredProducts.length > 0 ? (
          // We reuse the animated grid we already built!
          <AnimatedProductGrid products={featuredProducts} />
        ) : (
          <p>No featured products to display.</p>
        )}
      </section>


      <NewsletterSignup/>

      <StyleGuideSection/>

      {/* Animated Testimonials Section */}
      <section className="py-12">
        <h2 className="text-center text-2xl font-bold tracking-tight mb-8">What Our Customers Are Saying</h2>
        <AnimatedTestimonials data={testimonials} />
      </section>

        {/* Deals (client) */}
       
      <section className="text-center py-16 bg-gray-50 rounded-lg mb-12">
        <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-gray-900">
          Effortless Style, Unmatched Comfort
        </h1>
        <p className="mt-4 max-w-2xl mx-auto text-lg text-gray-600">
          Discover our new collection of premium cotton clothing, designed for your everyday life.
        </p>
        <div className="mt-8">
          <Button asChild size="lg">
            <Link href="/products">Shop All Products</Link>
          </Button>
        </div>
      </section>


    </div>
  );
}