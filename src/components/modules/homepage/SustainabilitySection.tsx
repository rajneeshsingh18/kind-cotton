"use client";

import { motion } from "framer-motion";
import { Leaf, Droplets, Recycle, Heart } from "lucide-react";

const pillars = [
  {
    icon: Leaf,
    title: "100% Organic Cotton",
    body: "Grown without synthetic pesticides, certified GOTS. Softer on skin, kinder to the soil.",
  },
  {
    icon: Droplets,
    title: "70% Less Water",
    body: "Our closed-loop dyeing process uses a fraction of conventional water — every drop saved matters.",
  },
  {
    icon: Recycle,
    title: "Zero-Waste Packaging",
    body: "All packaging is compostable or recycled. We've eliminated single-use plastics from our supply chain.",
  },
  {
    icon: Heart,
    title: "Fair Wages, Always",
    body: "Every maker is paid a living wage. We publish our supplier list because transparency isn't optional.",
  },
];

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.12 } },
};
const item = {
  hidden: { opacity: 0, y: 24 },
  show: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
      ease: [0.4, 0, 0.2, 1] as [number, number, number, number],
    },
  },
};

export default function SustainabilitySection() {
  return (
    <section className="my-16 py-14 px-6 sm:px-10 lg:px-14 bg-kc-surface-low rounded-2xl overflow-hidden relative">
      {/* Decorative background dot pattern */}
      <div
        className="absolute inset-0 opacity-[0.025] pointer-events-none"
        style={{
          backgroundImage:
            "radial-gradient(circle, var(--kc-primary) 1px, transparent 1px)",
          backgroundSize: "28px 28px",
        }}
      />

      {/* Header */}
      <div className="relative flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-12">
        <div>
          <p className="kc-eco-badge inline-block mb-3">Our Commitment</p>
          <h2 className="font-display text-3xl sm:text-4xl font-black text-kc-on-surface leading-tight">
            Kindness woven<br className="hidden sm:block" /> into every thread.
          </h2>
        </div>
        <p className="max-w-xs text-sm text-kc-on-surface-variant leading-relaxed md:text-right">
          Sustainability isn&apos;t a feature — it&apos;s the foundation everything else is built on.
        </p>
      </div>

      {/* Pillars grid */}
      <motion.div
        variants={container}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, amount: 0.2 }}
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5"
      >
        {pillars.map(({ icon: Icon, title, body }) => (
          <motion.div
            key={title}
            variants={item}
            className="bg-kc-surface-lowest rounded-2xl p-5 flex flex-col gap-4 kc-shadow group hover:shadow-[0_20px_56px_rgba(26,28,27,0.09)] transition-shadow duration-300"
          >
            <div className="w-10 h-10 rounded-xl flex items-center justify-center bg-kc-primary/10">
              <Icon className="w-5 h-5 text-kc-primary" />
            </div>
            <div>
              <h3 className="font-display text-sm font-bold text-kc-on-surface mb-1.5">
                {title}
              </h3>
              <p className="text-xs text-kc-on-surface-variant leading-relaxed">{body}</p>
            </div>
          </motion.div>
        ))}
      </motion.div>
    </section>
  );
}
