// src/components/modules/homepage/HeroSection.tsx
"use client";
import React from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function HeroSection() {
  return (
    <section className="relative rounded-lg overflow-hidden mt-6">
      {/* Desktop: video background */}
      <video
        className="hidden md:block absolute inset-0 w-full h-full object-cover"
        src="/videos/hero-video.mp4"
        autoPlay muted loop playsInline
        poster="/images/hero-poster.jpg"
      />
      {/* Mobile: poster image */}
      <img
        src="/images/hero-poster.jpg"
        alt="KindCotton Collection"
        className="block md:hidden w-full h-64 object-cover"
      />

      {/* Overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/30 to-black/10 md:from-black/40 md:to-black/40" />

      <div className="relative z-10 flex items-center justify-center text-center py-20 md:py-28">
        <div className="max-w-3xl px-4">
          <h1 className=" text-amber-50 text-[clamp(1.75rem,4.5vw,3.5rem)] font-extrabold leading-tight">
            Eco-friendly fabrics. Everyday comfort.
          </h1>
          <p className="mt-4 text-lg text-slate-200/90 dark:text-slate-200/80">
            KindCotton — sustainable clothing crafted for living well. New collection out now.
          </p>
          <div className="mt-8 flex items-center justify-center gap-4">
            <Button asChild size="lg" className="rounded-full">
              <Link href="/products">Shop the collection</Link>
            </Button>
            <Button variant="outline" asChild className="rounded-full">
              <Link href="/about">Our story</Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
