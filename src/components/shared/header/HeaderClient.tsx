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
import { ThemeToggle } from "@/components/ui/ThemeToggle";

const navLinks = [
  { name: "Home", href: "/" },
  { name: "Collections", href: "/products" },
];

export function HeaderClient({ session }: { session: Session | null }) {
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const pathname = usePathname();

  const closeNav = useCallback(() => setMobileNavOpen(false), []);

  const isActive = (href: string) =>
    pathname === href
      ? "text-kc-primary font-semibold"
      : "text-kc-on-surface-variant hover:text-kc-on-surface transition-colors duration-200";

  return (
    <>
      {/* ── Header ─────────────────────────────────────────────── */}
      <header className="sticky top-0 z-40 w-full kc-glass">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">

            {/* Left — mobile trigger + brand */}
            <div className="flex items-center gap-3">
              <button
                className="md:hidden p-2 rounded-xl hover:bg-kc-surface-container transition-colors duration-200"
                onClick={() => setMobileNavOpen(true)}
                aria-label="Open menu"
              >
                <Menu className="w-5 h-5 text-kc-on-surface-variant" />
              </button>
              <Link
                href="/"
                className="font-display text-xl font-bold tracking-tight text-kc-on-surface hover:text-kc-primary transition-colors duration-200"
              >
                KindCotton
              </Link>
            </div>

            {/* Center — desktop nav */}
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

            {/* Right — icons + auth */}
            <div className="flex items-center gap-1 sm:gap-2">
              <button
                className="hidden sm:inline-flex p-2 rounded-xl hover:bg-kc-surface-container transition-colors duration-200"
                aria-label="Search"
              >
                <Search className="w-4 h-4 text-kc-on-surface-variant" />
              </button>
              <button
                className="hidden sm:inline-flex p-2 rounded-xl hover:bg-kc-surface-container transition-colors duration-200"
                aria-label="Wishlist"
              >
                <Heart className="w-4 h-4 text-kc-on-surface-variant" />
              </button>

              <CartIcon />

              <ThemeToggle variant="header" />

              <div
                className="h-5 w-px mx-1 hidden sm:block"
                style={{ backgroundColor: "var(--kc-outline-variant)" }}
              />

              <AuthButtons session={session} />
            </div>
          </div>
        </div>
      </header>

      {/* ── Mobile Navigation Drawer ───────────────────────────── */}
      <AnimatePresence>
        {mobileNavOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="fixed inset-0 bg-(--kc-on-surface)/40 backdrop-blur-sm z-40"
              onClick={closeNav}
            />
            <FocusTrap active={mobileNavOpen}>
              <motion.aside
                initial={{ x: "-100%" }}
                animate={{ x: 0 }}
                exit={{ x: "-100%" }}
                transition={{ type: "spring", stiffness: 320, damping: 32 }}
                className="fixed inset-y-0 left-0 z-50 w-72 bg-kc-surface-lowest p-6 flex flex-col kc-shadow"
              >
                {/* Drawer header */}
                <div className="flex items-center justify-between mb-8">
                  <span className="font-display text-lg font-bold text-kc-on-surface">
                    KindCotton
                  </span>
                  <button
                    onClick={closeNav}
                    aria-label="Close menu"
                    className="p-2 rounded-xl hover:bg-kc-surface-container transition-colors duration-200"
                  >
                    <X className="w-4 h-4 text-kc-on-surface-variant" />
                  </button>
                </div>

                {/* Nav links */}
                <nav className="flex flex-col gap-1">
                  {navLinks.map((link) => (
                    <Link
                      key={link.href}
                      onClick={closeNav}
                      href={link.href}
                      className={`text-base py-3 px-4 rounded-xl transition-colors duration-200 hover:bg-kc-surface-container ${isActive(link.href)}`}
                    >
                      {link.name}
                    </Link>
                  ))}
                </nav>

                {/* Bottom icons */}
                <div
                  className="flex items-center gap-2 mt-auto pt-6"
                  style={{ borderTop: "1px solid var(--kc-outline-variant)" }}
                >
                  <button className="p-2 rounded-xl hover:bg-kc-surface-container transition-colors duration-200">
                    <Search className="w-4 h-4 text-kc-on-surface-variant" />
                  </button>
                  <button className="p-2 rounded-xl hover:bg-kc-surface-container transition-colors duration-200">
                    <Heart className="w-4 h-4 text-kc-on-surface-variant" />
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
