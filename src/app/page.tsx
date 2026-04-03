// src/app/page.tsx
import db from "@/lib/db";
import Link from "next/link";

import { AnimatedProductGrid } from "@/components/modules/products/AnimatedProductGrid";
import HeroSection from "@/components/modules/homepage/HeroSection";
import CategoryNav from "@/components/modules/homepage/CategoryNav";
import NewsletterSignup from "@/components/modules/homepage/NewsletterSignup";
import SustainabilitySection from "@/components/modules/homepage/SustainabilitySection";
import { DealsSection } from "@/components/modules/homepage/DealsSection";
import { AnimatedTestimonials } from "@/components/ui/animated-testimonials";
import { ThemeToggle } from "@/components/ui/ThemeToggle";

export default async function HomePage() {
  const featuredProductsFromDb = await db.product.findMany({
    take: 4,
    include: { variants: { orderBy: { price: "asc" } } },
    orderBy: { createdAt: "desc" },
  });

  const featuredProducts = featuredProductsFromDb.filter(
    (p) => p.variants.length > 0
  );

  const testimonials = [
    {
      description:
        "I've tried a dozen sustainable brands. KindCotton is the first one where the quality actually matches the mission. Wearing it feels like a decision I'm proud of.",
      image:
        "https://images.unsplash.com/photo-1611558709798-e009c8fd7706?q=80&w=400&auto=format&fit=crop",
      name: "Priya Menon",
      handle: "@priyamenon",
    },
    {
      description:
        "The fabric is incredible — soft, durable, and doesn't lose shape after washing. And knowing the supply chain is transparent makes it even better.",
      image:
        "https://images.unsplash.com/photo-1607746882042-944635dfe10e?q=80&w=400&auto=format&fit=crop",
      name: "Rohan Sharma",
      handle: "@rohansharma",
    },
  ];

  return (
    <div className="container mx-auto px-4 py-6">
      {/* ── Hero ──────────────────────────────────────────────── */}
      <HeroSection />

      {/* ── Category Nav ─────────────────────────────────────── */}
      <CategoryNav />

      {/* ── Deals ────────────────────────────────────────────── */}
      <DealsSection />

      {/* ── Featured Products ────────────────────────────────── */}
      <section className="mb-14">
        <div className="mb-8 flex items-end justify-between">
          <div>
            <p className="kc-eco-badge inline-block mb-3">Handpicked</p>
            <h2 className="font-display text-2xl font-black text-kc-on-surface leading-tight">
              Featured Products
            </h2>
          </div>
          <Link
            href="/products"
            className="text-sm font-medium text-kc-primary hover:underline underline-offset-4 transition-all"
          >
            View all →
          </Link>
        </div>

        {featuredProducts.length > 0 ? (
          <AnimatedProductGrid products={featuredProducts} />
        ) : (
          <p className="text-sm text-kc-on-surface-variant">No featured products to display.</p>
        )}
      </section>

      {/* ── Sustainability ───────────────────────────────────── */}
      <SustainabilitySection />

      {/* ── Newsletter ───────────────────────────────────────── */}
      <NewsletterSignup />

      {/* ── Testimonials ─────────────────────────────────────── */}
      <section className="my-16">
        <div className="text-center mb-10">
          <p className="kc-eco-badge inline-block mb-3">Reviews</p>
          <h2 className="font-display text-2xl font-black text-kc-on-surface">
            Worn and loved.
          </h2>
        </div>
        <AnimatedTestimonials data={testimonials} />
      </section>

      {/* ── Final CTA ────────────────────────────────────────── */}
      <section className="relative overflow-hidden text-center py-16 px-6 bg-kc-surface-low rounded-2xl mb-12">
        {/* Decorative circles */}
        <div
          className="absolute -bottom-20 -left-20 w-64 h-64 rounded-full pointer-events-none"
          style={{
            background: "radial-gradient(circle, rgba(52,75,46,0.10) 0%, transparent 70%)",
          }}
        />
        <div
          className="absolute -top-16 -right-16 w-56 h-56 rounded-full pointer-events-none"
          style={{
            background: "radial-gradient(circle, rgba(52,75,46,0.08) 0%, transparent 70%)",
          }}
        />

        <div className="relative">
          <p className="kc-eco-badge inline-block mb-4">New Collection</p>
          <h2 className="font-display text-3xl sm:text-5xl font-black text-kc-on-surface leading-tight mb-4">
            Effortless style.<br className="hidden sm:block" /> Unmatched comfort.
          </h2>
          <p className="max-w-lg mx-auto text-sm text-kc-on-surface-variant leading-relaxed mb-8">
            Premium cotton clothing designed for your everyday life — sustainably made, endlessly wearable.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-3">
            <Link
              href="/products"
              className="kc-btn-primary inline-flex items-center px-7 py-3.5 text-sm font-semibold"
            >
              Shop All Products
            </Link>
            {/* Dark-mode toggle as a hero action for visibility */}
            <div className="inline-flex items-center gap-2 px-4 py-3.5 rounded-2xl bg-kc-surface-lowest text-xs font-medium text-kc-on-surface-variant kc-shadow">
              <ThemeToggle variant="header" />
              <span>Toggle theme</span>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
