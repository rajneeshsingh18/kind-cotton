// src/components/modules/homepage/HeroSection.tsx
"use client";
import React from "react";
import Link from "next/link";
import Image from "next/image";

export default function HeroSection() {
  return (
    <section className="relative overflow-hidden mt-4 mx-4 sm:mx-6 lg:mx-8 rounded-2xl min-h-[520px] md:min-h-[600px] flex items-end">
      {/* Desktop: video background */}
      <video
        className="hidden md:block absolute inset-0 w-full h-full object-cover"
        src="/videos/hero-video.mp4"
        autoPlay
        muted
        loop
        playsInline
        poster="/images/hero-poster.jpg"
      />
      {/* Mobile: poster image */}
      <Image
        src="/images/hero-poster.jpg"
        alt="KindCotton Collection"
        fill
        className="block md:hidden object-cover"
        priority
      />

      {/* Layered gradient overlay — darker at bottom for text legibility */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />

      {/* ── Editorial text block ─────────────────────────────── */}
      <div className="relative z-10 w-full pb-12 md:pb-16 px-6 sm:px-10 lg:px-14">
        <div className="max-w-2xl">
          {/* Eyebrow label */}
          <p className="text-white/70 text-xs font-medium tracking-[0.18em] uppercase mb-5">
            New Collection — Spring 2025
          </p>

          {/* Display headline — Epilogue, dramatic scale */}
          <h1 className="font-display text-white font-black leading-[0.95] tracking-tight text-[clamp(2.4rem,6vw,4.5rem)]">
            Wear the<br />
            <span
              className="text-transparent bg-clip-text"
              style={{ backgroundImage: "linear-gradient(135deg, #a8c5a0 0%, #d4e8c8 100%)" }}
            >
              world gently.
            </span>
          </h1>

          {/* Body — Inter, offset right for editorial asymmetry */}
          <p className="mt-5 ml-0 md:ml-8 max-w-md text-white/80 text-sm sm:text-base leading-relaxed">
            Sustainable cotton crafted for how you actually live — thoughtfully made, endlessly wearable.
          </p>

          {/* CTAs */}
          <div className="mt-8 flex flex-wrap items-center gap-3">
            <Link
              href="/products"
              className="kc-btn-primary inline-flex items-center px-6 py-3 text-sm font-semibold"
            >
              Shop the collection
            </Link>
            <Link
              href="/about"
              className="inline-flex items-center px-6 py-3 text-sm font-medium text-white/90 rounded-2xl border border-white/30 hover:bg-white/10 transition-colors duration-200"
            >
              Our story
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
