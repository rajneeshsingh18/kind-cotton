"use client";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";

export function DealsSection() {
  const [timeLeft, setTimeLeft] = useState(12 * 3600 + 58 * 60); // 12 hours, 58 mins

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prevTime) => (prevTime > 0 ? prevTime - 1 : 0));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const hours = Math.floor(timeLeft / 3600);
  const minutes = Math.floor((timeLeft % 3600) / 60);
  const seconds = timeLeft % 60;

  return (
    <section className="mb-12 bg-gray-100 p-8 rounded-lg flex flex-col md:flex-row items-center justify-between gap-6">
      <div>
        <h3 className="text-2xl font-bold">Limited-Time Deals</h3>
        <p className="text-gray-600">Don&apos;t miss out on these special prices.</p>
      </div>
      <div className="flex items-center gap-4">
        <div className="flex gap-2 text-center">
          <div className="bg-white p-3 rounded-md shadow-sm w-16">
            <div className="text-2xl font-bold">{String(hours).padStart(2, '0')}</div>
            <div className="text-xs text-gray-500">Hours</div>
          </div>
          <div className="bg-white p-3 rounded-md shadow-sm w-16">
            <div className="text-2xl font-bold">{String(minutes).padStart(2, '0')}</div>
            <div className="text-xs text-gray-500">Mins</div>
          </div>
          <div className="bg-white p-3 rounded-md shadow-sm w-16">
            <div className="text-2xl font-bold">{String(seconds).padStart(2, '0')}</div>
            <div className="text-xs text-gray-500">Secs</div>
          </div>
        </div>
      </div>
    </section>
  );
}