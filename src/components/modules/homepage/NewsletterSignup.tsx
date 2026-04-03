"use client";
import React, { useState } from "react";

export default function NewsletterSignup() {
  const [email, setEmail] = useState("");
  const [done, setDone] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setDone(true);
  };

  return (
    <section className="my-16 relative overflow-hidden rounded-2xl px-8 sm:px-14 py-14 bg-kc-surface-container">
      {/* Subtle radial glow */}
      <div
        className="absolute -top-24 -right-24 w-72 h-72 rounded-full pointer-events-none"
        style={{
          background: "radial-gradient(circle, rgba(52,75,46,0.12) 0%, transparent 70%)",
        }}
      />

      <div className="relative max-w-xl">
        <p className="kc-eco-badge inline-block mb-4">Newsletter</p>
        <h3 className="font-display text-2xl sm:text-3xl font-black text-kc-on-surface leading-tight mb-2">
          10% off your<br />first order.
        </h3>
        <p className="text-sm text-kc-on-surface-variant mb-6">
          No spam — only sustainable finds, early access, and honest stories from our makers.
        </p>

        {done ? (
          <div className="inline-flex items-center gap-2 px-5 py-3 rounded-2xl bg-kc-primary/10 text-kc-primary text-sm font-semibold">
            You&apos;re in. Check your inbox for your discount.
          </div>
        ) : (
          <form
            onSubmit={handleSubmit}
            className="flex flex-col sm:flex-row gap-2 max-w-md"
          >
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="your@email.com"
              className="flex-1 rounded-2xl px-4 py-3 text-sm bg-kc-surface-lowest text-kc-on-surface placeholder:text-kc-on-surface-variant outline-none focus:ring-2 focus:ring-kc-primary/40 transition-shadow"
            />
            <button
              type="submit"
              className="kc-btn-primary px-5 py-3 text-sm font-semibold shrink-0"
            >
              Subscribe
            </button>
          </form>
        )}
      </div>
    </section>
  );
}
