"use client";

import Link from "next/link";
import React, { useState, useEffect } from "react";
import { Session } from "next-auth";
import { ShoppingCart, Heart, Search, Menu, X } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";

import { useCartStore } from "@/store/cart.store";
import { AuthButtons } from "@/components/modules/auth/AuthButtons";

export function HeaderClient({ session }: { session: Session | null }) {
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const totalItems = useCartStore((state) => state.getTotalItems());

  const [hasMounted, setHasMounted] = useState(false);
  useEffect(() => {
    setHasMounted(true);
  }, []);

  return (
    <>
      <header className="sticky top-0 z-40 w-full bg-white/80 backdrop-blur-lg border-b border-gray-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Left Section: Mobile Menu & Brand */}
            <div className="flex items-center gap-3">
              <button
                className="md:hidden p-2 rounded-md hover:bg-gray-100 transition"
                onClick={() => setMobileNavOpen(true)}
                aria-label="Open menu"
              >
                <Menu className="w-6 h-6 text-slate-700" />
              </button>
              <Link
                href="/"
                className="text-2xl font-bold tracking-tight text-slate-900 hover:opacity-80 transition"
              >
                KindCotton
              </Link>
            </div>

            {/* Center Section: Desktop Navigation */}
            <nav className="hidden md:flex items-center gap-8">
              <Link
                href="/products"
                className="text-sm font-medium text-slate-700 hover:text-slate-900 transition-colors"
              >
                Collections
              </Link>
              <Link
                href="/about"
                className="text-sm font-medium text-slate-700 hover:text-slate-900 transition-colors"
              >
                About
              </Link>
              <Link
                href="/support"
                className="text-sm font-medium text-slate-700 hover:text-slate-900 transition-colors"
              >
                Support
              </Link>
            </nav>

            {/* Right Section: Icons & Auth */}
            <div className="flex items-center gap-2 sm:gap-4">
              {/* Search */}
              <button className="hidden sm:inline-flex p-2 rounded-full hover:bg-gray-100 transition">
                <Search className="w-5 h-5 text-slate-600" />
              </button>

              {/* Wishlist */}
              <button className="hidden sm:inline-flex p-2 rounded-full hover:bg-gray-100 transition">
                <Heart className="w-5 h-5 text-slate-600" />
              </button>

              {/* Cart */}
              <button
                className="p-2 rounded-full hover:bg-gray-100 transition relative"
                aria-label="Open cart"
              >
                <ShoppingCart className="w-6 h-6 text-slate-700" />
                {hasMounted && totalItems > 0 && (
                  <span className="absolute -top-1.5 -right-1.5 bg-rose-500 text-white rounded-full text-xs min-w-[20px] h-[20px] flex items-center justify-center px-[5px]">
                    {totalItems}
                  </span>
                )}
              </button>

              {/* Divider */}
              <div className="h-6 w-px bg-slate-200 hidden sm:block" />

              {/* Auth */}
              <AuthButtons session={session} />
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Navigation Drawer */}
      <AnimatePresence>
        {mobileNavOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/60 z-40"
              onClick={() => setMobileNavOpen(false)}
            />

            {/* Drawer */}
            <motion.aside
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
              className="fixed inset-y-0 left-0 z-50 w-72 bg-white border-r shadow-lg p-4 flex flex-col"
            >
              {/* Header */}
              <div className="flex items-center justify-between mb-6">
                <div className="font-bold text-xl">KindCotton</div>
                <button
                  onClick={() => setMobileNavOpen(false)}
                  aria-label="Close menu"
                  className="p-2 rounded-md hover:bg-gray-100 transition"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Navigation Links */}
              <nav className="flex flex-col gap-2">
                <Link
                  href="/"
                  className="text-lg py-2 px-3 rounded hover:bg-gray-100 transition"
                >
                  Home
                </Link>
                <Link
                  href="/products"
                  className="text-lg py-2 px-3 rounded hover:bg-gray-100 transition"
                >
                  Collections
                </Link>
                <Link
                  href="/about"
                  className="text-lg py-2 px-3 rounded hover:bg-gray-100 transition"
                >
                  About
                </Link>
                <Link
                  href="/support"
                  className="text-lg py-2 px-3 rounded hover:bg-gray-100 transition"
                >
                  Support
                </Link>
              </nav>

              {/* Optional Footer Links in Drawer */}
              <div className="mt-auto pt-4 border-t border-gray-200">
                <AuthButtons session={session} />
              </div>
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
