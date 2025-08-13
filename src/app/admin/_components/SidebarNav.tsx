"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Package, ShoppingCart, Users } from "lucide-react";
import { cn } from "@/lib/utils";

const navLinks = [
  { href: "/admin/dashboard", label: "Dashboard", icon: Home },
  { href: "/admin/products", label: "Products", icon: Package },
  { href: "/admin/orders", label: "Orders", icon: ShoppingCart },
  { href: "/admin/customers", label: "Customers", icon: Users },
];

export function SidebarNav() {
  const pathname = usePathname();

  return (
    <>
      {/* Mobile Top Navigation */}
      <nav
        className={cn(
          "md:hidden fixed top-0 left-0 right-0 z-[9999] grid grid-cols-4 border-b border-white/20 backdrop-blur-lg",
          "bg-white/5 p-2"
        )}
      >
        {/* Animated slow gradient background */}
        <div className="absolute inset-0 -z-10 animate-slow-gradient bg-gradient-to-br from-purple-500 via-pink-500 to-orange-500 opacity-20" />

        {navLinks.map((link) => {
          const Icon = link.icon;
          const isActive = pathname.startsWith(link.href);
          return (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                "relative flex flex-col items-center gap-1 p-2 rounded-lg text-xs font-medium transition-all duration-300",
                isActive
                  ? "bg-gradient-to-r from-purple-300 via-pink-300 to-orange-300 text-white shadow-lg"
                  : "text-gray-800 hover:text-white"
              )}
            >
              <Icon className="h-5 w-5" />
              {link.label}
            </Link>
          );
        })}
      </nav>

      {/* Extra padding for mobile so content not hidden behind nav */}
      <div className="h-16 md:hidden" />

      {/* Desktop Sidebar */}
      <nav
        className={cn(
          "hidden md:flex md:flex-col gap-2 p-4 rounded-2xl shadow-xl border border-white/20 backdrop-blur-lg relative overflow-hidden",
          "bg-white/5"
        )}
      >
        {/* Animated slow gradient background */}
        <div className="absolute inset-0 -z-10 animate-slow-gradient bg-gradient-to-br from-purple-500 via-pink-500 to-orange-500 opacity-20" />

        {navLinks.map((link) => {
          const Icon = link.icon;
          const isActive = pathname.startsWith(link.href);
          return (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                "relative flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition-all duration-300",
                "hover:scale-[1.02] hover:shadow-md",
                isActive
                  ? "  bg-gradient-to-r from-purple-300 via-pink-300 to-orange-300 text-white shadow-lg"
                  : "text-gray-800 hover:text-white"
              )}
            >
              <Icon className="h-5 w-5" />
              <span>{link.label}</span>
            </Link>
          );
        })}
      </nav>

      {/* Styles */}
      <style jsx global>{`
        @keyframes gradientMove {
          0% {
            background-position: 0% 50%;
          }
          50% {
            background-position: 100% 50%;
          }
          100% {
            background-position: 0% 50%;
          }
        }
        .animate-slow-gradient {
          background-size: 200% 200%;
          animation: gradientMove 20s ease infinite;
        }
        @keyframes softPulse {
          0% {
            box-shadow: 0 0 0px rgba(255, 255, 255, 0.6);
          }
          50% {
            box-shadow: 0 0 20px rgba(255, 255, 255, 0.8);
          }
          100% {
            box-shadow: 0 0 0px rgba(255, 255, 255, 0.6);
          }
        }
        .active-glow {
          border-radius: 1rem;
          animation: softPulse 2s ease-in-out infinite;
        }
      `}</style>
    </>
  );
}
