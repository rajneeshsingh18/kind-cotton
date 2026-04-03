"use client";
import Link from "next/link";
import React, { useRef, useState, useEffect } from "react";
import { motion } from "framer-motion";
import Image from "next/image";

const categories = [
  { name: "T-Shirts", href: "/products?category=t-shirts", img: "/images/cats/tshirt.webp" },
  { name: "Hoodies",  href: "/products?category=hoodies",  img: "/images/cats/hoodie.png"  },
  { name: "Pants",    href: "/products?category=pants",    img: "/images/cats/pants.webp"  },
  { name: "Sale",     href: "/products?sale=true",         img: "/images/cats/sale.webp"   },
];

export default function CategoryNav() {
  const carouselRef = useRef<HTMLDivElement>(null);
  const [dragConstraint, setDragConstraint] = useState(0);

  useEffect(() => {
    if (carouselRef.current) {
      const overflow = carouselRef.current.scrollWidth - window.innerWidth + 32;
      setDragConstraint(overflow > 0 ? -overflow : 0);
    }
  }, []);

  return (
    <section className="mt-10 mb-10">
      {/* Mobile carousel */}
      <div className="block sm:hidden overflow-x-hidden">
        <motion.div
          ref={carouselRef}
          className="flex gap-3 px-4"
          drag="x"
          dragConstraints={{ left: dragConstraint, right: 0 }}
          dragElastic={0.08}
        >
          {categories.map((c) => (
            <motion.div
              key={c.name}
              className="shrink-0 w-36 h-44 rounded-2xl overflow-hidden relative cursor-pointer kc-shadow"
              whileTap={{ scale: 0.97 }}
            >
              <Link href={c.href} className="block w-full h-full">
                <Image
                  src={c.img}
                  alt={c.name}
                  width={144}
                  height={176}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-linear-to-t from-black/50 to-transparent" />
                <div className="absolute left-3 bottom-3 text-white text-sm font-semibold font-display">
                  {c.name}
                </div>
              </Link>
            </motion.div>
          ))}
        </motion.div>
      </div>

      {/* Desktop grid */}
      <div className="hidden sm:grid sm:grid-cols-2 md:grid-cols-4 gap-4">
        {categories.map((c) => (
          <Link
            key={c.name}
            href={c.href}
            className="group relative w-full h-60 rounded-2xl overflow-hidden kc-shadow"
          >
            <Image
              src={c.img}
              alt={c.name}
              fill
              className="object-cover transition-transform duration-500 group-hover:scale-105"
            />
            {/* Tonal gradient overlay */}
            <div className="absolute inset-0 bg-linear-to-t from-black/45 via-black/5 to-transparent group-hover:from-black/55 transition-all duration-300" />
            {/* Category label */}
            <div className="absolute left-4 bottom-4 text-white font-display font-semibold text-base">
              {c.name}
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
