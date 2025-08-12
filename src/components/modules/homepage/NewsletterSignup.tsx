// src/components/modules/homepage/NewsletterSignup.tsx
"use client";
import React, { useState } from "react";
import { Button } from "@/components/ui/button";

export default function NewsletterSignup() {
  const [email, setEmail] = useState("");
  const [done, setDone] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: send to API
    setDone(true);
  };

  return (
    <section className="my-12 bg-gradient-to-r from-emerald-50 to-emerald-100 dark:from-emerald-900 dark:to-emerald-800 p-6 rounded-lg text-center">
      <h3 className="text-xl font-semibold">Join our newsletter</h3>
      <p className="text-sm text-slate-600 dark:text-slate-300/80">Get 10% off your first order.</p>
      <form onSubmit={handleSubmit} className="mt-4 flex flex-col sm:flex-row items-center justify-center gap-3 max-w-xl mx-auto">
        <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)}
          className="w-full sm:flex-1 rounded-md border px-3 py-2 text-slate-900 dark:text-slate-100" placeholder="Email address" />
        <Button type="submit"  className="rounded-full">{done ? "Subscribed" : "Subscribe"}</Button>
      </form>
    </section>
  );
}
