"use client";
import { useState, useEffect } from "react";
import Link from "next/link";

export function DealsSection() {
  const [timeLeft, setTimeLeft] = useState(12 * 3600 + 58 * 60);

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const hours   = Math.floor(timeLeft / 3600);
  const minutes = Math.floor((timeLeft % 3600) / 60);
  const seconds = timeLeft % 60;

  const pad = (n: number) => String(n).padStart(2, "0");

  return (
    <section className="mb-12 bg-kc-surface-low rounded-2xl px-8 py-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-8">
      {/* Left — copy */}
      <div>
        <p className="kc-eco-badge inline-block mb-3">Limited Time</p>
        <h3 className="font-display text-2xl font-bold text-kc-on-surface leading-tight">
          Deals that don&apos;t last.
        </h3>
        <p className="mt-1 text-sm text-kc-on-surface-variant">
          Prices drop at midnight — shop before the timer hits zero.
        </p>
        <Link
          href="/products"
          className="kc-btn-primary inline-flex items-center px-5 py-2.5 text-sm font-semibold mt-5"
        >
          Shop deals
        </Link>
      </div>

      {/* Right — countdown */}
      <div className="flex items-center gap-3">
        {[
          { value: pad(hours),   label: "Hours" },
          { value: pad(minutes), label: "Mins"  },
          { value: pad(seconds), label: "Secs"  },
        ].map(({ value, label }, i) => (
          <div key={label} className="flex items-center gap-3">
            <div className="bg-kc-surface-lowest rounded-2xl kc-shadow px-4 py-3 min-w-16 text-center">
              <div className="font-display text-2xl font-bold text-kc-on-surface tabular-nums">
                {value}
              </div>
              <div className="text-[10px] font-medium tracking-wide text-kc-on-surface-variant uppercase mt-0.5">
                {label}
              </div>
            </div>
            {i < 2 && (
              <span className="font-display text-xl font-bold text-kc-on-surface-variant select-none">
                :
              </span>
            )}
          </div>
        ))}
      </div>
    </section>
  );
}
