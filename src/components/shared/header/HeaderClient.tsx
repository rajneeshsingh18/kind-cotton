"use client";

import Link from "next/link";
import React, { useState, useCallback } from "react";
import { Session } from "next-auth";
import { Heart, Search, Menu, X } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import { usePathname } from "next/navigation";
import FocusTrap from "focus-trap-react";

import { AuthButtons } from "@/components/modules/auth/AuthButtons";
import { CartIcon } from "./CartIcon";

const navLinks = [
  { name: "Home", href: "/" },
  { name: "Collections", href: "/products" },
  // Add more links here if needed
];

export function HeaderClient({ session }: { session: Session | null }) {
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const pathname = usePathname();

  const closeNav = useCallback(() => setMobileNavOpen(false), []);

  const isActive = (href: string) =>
    pathname === href
      ? "text-slate-900 font-semibold"
      : "text-slate-700 hover:text-slate-900 transition-colors";

  return (
    <>
      {/* Header */}
      <header className="sticky top-0 z-40 w-full bg-white/80 backdrop-blur-lg border-b border-gray-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Left Section */}
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

            {/* Center Section: Desktop Nav */}
            <nav className="hidden md:flex items-center gap-8">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`text-sm font-medium ${isActive(link.href)}`}
                >
                  {link.name}
                </Link>
              ))}
            </nav>

            {/* Right Section: Icons & Auth */}
            <div className="flex items-center gap-2 sm:gap-3">
              <button className="hidden sm:inline-flex p-2 rounded-full hover:bg-gray-100 transition">
                <Search className="w-5 h-5 text-slate-600" />
              </button>
              <button className="hidden sm:inline-flex p-2 rounded-full hover:bg-gray-100 transition">
                <Heart className="w-5 h-5 text-slate-600" />
              </button>

              <CartIcon />

              <div className="h-6 w-px bg-slate-200 hidden sm:block" />

              <AuthButtons session={session} />
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Navigation Drawer */}
      <AnimatePresence>
        {mobileNavOpen && (
          <>
            {/* Overlay */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/60 z-40"
              onClick={closeNav}
            />
            {/* Drawer */}
            <FocusTrap active={mobileNavOpen}>
              <motion.aside
                initial={{ x: "-100%" }}
                animate={{ x: 0 }}
                exit={{ x: "-100%" }}
                transition={{ type: "spring", stiffness: 300, damping: 30 }}
                className="fixed inset-y-0 left-0 z-50 w-72 bg-white border-r shadow-lg p-4 flex flex-col"
              >
                <div className="flex items-center justify-between mb-6">
                  <div className="font-bold text-xl">KindCotton</div>
                  <button
                    onClick={closeNav}
                    aria-label="Close menu"
                    className="p-2 rounded-md hover:bg-gray-100 transition"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
                {/* Links */}
                <nav className="flex flex-col gap-1 mb-4">
                  {navLinks.map((link) => (
                    <Link
                      key={link.href}
                      onClick={closeNav}
                      href={link.href}
                      className={`text-lg py-2 px-3 rounded hover:bg-gray-100 transition ${isActive(
                        link.href
                      )}`}
                    >
                      {link.name}
                    </Link>
                  ))}
                </nav>
                {/* Icons inside mobile drawer */}
                <div className="flex items-center gap-3 mt-auto pt-4 border-t border-gray-200">
                  <button className="p-2 rounded-full hover:bg-gray-100 transition">
                    <Search className="w-5 h-5 text-slate-600" />
                  </button>
                  <button className="p-2 rounded-full hover:bg-gray-100 transition">
                    <Heart className="w-5 h-5 text-slate-600" />
                  </button>
                  <CartIcon />
                </div>
              </motion.aside>
            </FocusTrap>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
