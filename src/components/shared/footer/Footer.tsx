import React from "react";
import { FaFacebookF, FaTwitter, FaInstagram } from "react-icons/fa";

export function Footer() {
  return (
    <footer className="border-t border-gray-200 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          {/* Logo */}
          <div className="text-lg font-semibold text-gray-800">
            KindCotton
          </div>

          {/* Navigation Links */}
          <div className="flex flex-wrap justify-center gap-6 text-sm text-gray-600">
            <a href="/" className="hover:text-gray-900">Home</a>
            <a href="/shop" className="hover:text-gray-900">Shop</a>
            <a href="/about" className="hover:text-gray-900">About Us</a>
            <a href="/contact" className="hover:text-gray-900">Contact</a>
            <a href="/faq" className="hover:text-gray-900">FAQ</a>
          </div>

          {/* Social Icons */}
          <div className="flex gap-4 text-gray-500">
            <a href="#" aria-label="Facebook" className="hover:text-blue-600">
              <FaFacebookF size={18} />
            </a>
            <a href="#" aria-label="Twitter" className="hover:text-sky-500">
              <FaTwitter size={18} />
            </a>
            <a href="#" aria-label="Instagram" className="hover:text-pink-500">
              <FaInstagram size={18} />
            </a>
          </div>
        </div>

        {/* Divider */}
        <div className="mt-8 border-t border-gray-100 pt-6">
          <p className="text-center text-xs text-gray-500">
            © {new Date().getFullYear()} KindCotton. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
