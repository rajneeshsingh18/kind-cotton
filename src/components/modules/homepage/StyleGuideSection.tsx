// src/components/modules/homepage/StyleGuideSection.tsx
import React from "react";
export default function StyleGuideSection() {
  return (
    <section className="mb-12">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white dark:bg-slate-800 p-6 rounded-lg shadow-sm">
          <h4 className="font-semibold mb-2">Why KindCotton</h4>
          <p className="text-sm text-slate-500 dark:text-slate-300/70">Sustainably sourced, soft on skin, and built to last.</p>
        </div>
        <div className="bg-white dark:bg-slate-800 p-6 rounded-lg shadow-sm">
          <h4 className="font-semibold mb-2">Sizing Guide</h4>
          <p className="text-sm text-slate-500 dark:text-slate-300/70">Fits true to size. See full guide for details.</p>
        </div>
        <div className="bg-white dark:bg-slate-800 p-6 rounded-lg shadow-sm">
          <h4 className="font-semibold mb-2">Sustainability</h4>
          <p className="text-sm text-slate-500 dark:text-slate-300/70">We plant trees, reduce waste, and offset carbon.</p>
        </div>
      </div>
    </section>
  );
}
