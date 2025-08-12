"use client";
import Link from "next/link";
import React, { useRef, useState, useEffect } from "react";
import { motion } from "framer-motion";
import Image from "next/image"; // ✅ ADD THIS LINE

const categories = [
  { name: "T-Shirts", href: "/products?category=t-shirts", img: "/images/cats/tshirt.webp" },
  { name: "Hoodies", href: "/products?category=hoodies", img: "/images/cats/hoodie.png" },
  { name: "Pants", href: "/products?category=pants", img: "/images/cats/pants.webp" },
  { name: "Sale", href: "/products?sale=true", img: "/images/cats/sale.webp" },
//   { name: "New In", href: "/products?sort=newest", img: "/images/cats/new.webp" },
];

export default function CategoryNav() {
  const carouselRef = useRef<HTMLDivElement>(null);
  const [dragConstraint, setDragConstraint] = useState(0);

  useEffect(() => {
    if (carouselRef.current) {
      const carouselWidth = carouselRef.current.scrollWidth;
      const viewportWidth = window.innerWidth;
      const newConstraint = carouselWidth - viewportWidth + 32;
      setDragConstraint(newConstraint > 0 ? -newConstraint : 0);
    }
  }, []);

  return (
    <section className="mt-10 mb-10">
      {/* Mobile carousel */}
      <div className="block sm:hidden overflow-x-hidden">
        <motion.div
          ref={carouselRef}
          className="flex gap-4 px-4"
          drag="x"
          dragConstraints={{ left: dragConstraint, right: 0 }}
          dragElastic={0.1}
        >
          {categories.map((c) => (
            <motion.div
              key={c.name}
              className="flex-shrink-0 w-36 h-44 rounded-lg overflow-hidden relative cursor-pointer"
              whileTap={{ scale: 0.95 }}
            >
              <Link href={c.href}>
                <Image
                  src={c.img}
                  alt={c.name}
                  width={144}
                  height={176}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-black/20" />
                <div className="absolute left-3 bottom-3 text-white font-semibold">
                  {c.name}
                </div>
              </Link>
            </motion.div>
          ))}
        </motion.div>
      </div>

      {/* Desktop grid */}
      <div className="hidden sm:grid sm:grid-cols-2 md:grid-cols-4 gap-6">
        {categories.map((c) => (
          <Link
            key={c.name}
            href={c.href}
            className="group relative w-full h-56 rounded-lg overflow-hidden"
          >
            <Image
              src={c.img}
              alt={c.name}
              fill
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            />
            <div className="absolute inset-0 bg-white/10 group-hover:bg-black/25 transition-colors" />
            <div className="absolute left-4 bottom-4 text-white font-semibold text-lg">
              {c.name}
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}