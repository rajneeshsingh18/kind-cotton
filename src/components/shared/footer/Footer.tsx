import React from "react";
import Link from "next/link";
import { FaFacebookF, FaTwitter, FaInstagram } from "react-icons/fa";

export function Footer() {
  return (
    <footer className="bg-kc-surface-low mt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-8">
          {/* Brand */}
          <div>
            <div className="font-display text-lg font-bold text-kc-on-surface">
              KindCotton
            </div>
            <p className="mt-1 text-xs text-kc-on-surface-variant max-w-45 leading-relaxed">
              Sustainable clothing crafted for everyday living.
            </p>
          </div>

          {/* Navigation */}
          <nav className="flex flex-wrap gap-x-8 gap-y-2 text-sm text-kc-on-surface-variant">
            <Link href="/" className="hover:text-kc-on-surface transition-colors duration-200">Home</Link>
            <Link href="/products" className="hover:text-kc-on-surface transition-colors duration-200">Shop</Link>
            <Link href="/about" className="hover:text-kc-on-surface transition-colors duration-200">About Us</Link>
            <Link href="/contact" className="hover:text-kc-on-surface transition-colors duration-200">Contact</Link>
            <Link href="/faq" className="hover:text-kc-on-surface transition-colors duration-200">FAQ</Link>
          </nav>

          {/* Social icons */}
          <div className="flex gap-3">
            {[
              { Icon: FaFacebookF, href: "#", label: "Facebook" },
              { Icon: FaTwitter, href: "#", label: "Twitter" },
              { Icon: FaInstagram, href: "#", label: "Instagram" },
            ].map(({ Icon, href, label }) => (
              <Link
                key={label}
                href={href}
                aria-label={label}
                className="w-8 h-8 rounded-xl flex items-center justify-center bg-kc-surface-container text-kc-on-surface-variant hover:bg-kc-primary hover:text-kc-on-primary transition-all duration-200"
              >
                <Icon size={13} />
              </Link>
            ))}
          </div>
        </div>

        {/* Tonal divider — background shift, no border */}
        <div className="mt-10 pt-6" style={{ borderTop: "1px solid var(--kc-outline-variant)" }}>
          <p className="text-center text-xs text-kc-on-surface-variant">
            © {new Date().getFullYear()} KindCotton. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
