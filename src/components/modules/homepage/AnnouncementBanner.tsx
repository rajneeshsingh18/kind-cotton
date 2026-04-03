"use client";

import { useDispatch, useSelector } from "react-redux";
import { dismissBanner, selectBannerDismissed } from "@/store/ui.slice";
import type { RootState } from "@/store";
import { X, Leaf } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";

export function AnnouncementBanner() {
  const dispatch = useDispatch();
  const dismissed = useSelector((state: RootState) => selectBannerDismissed(state));

  return (
    <AnimatePresence>
      {!dismissed && (
        <motion.div
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: "auto", opacity: 1 }}
          exit={{ height: 0, opacity: 0 }}
          transition={{ duration: 0.28, ease: [0.4, 0, 0.2, 1] }}
          className="overflow-hidden"
        >
          <div
            className="flex items-center justify-center gap-2 px-4 py-2.5 text-xs font-medium text-kc-on-primary"
            style={{ background: "var(--kc-gradient-primary)" }}
          >
            <Leaf className="w-3.5 h-3.5 shrink-0 opacity-80" />
            <span>
              Free shipping on orders over{" "}
              <strong className="font-semibold">₹999</strong> — sustainably packaged, always.
            </span>
            <button
              onClick={() => dispatch(dismissBanner())}
              aria-label="Dismiss announcement"
              className="ml-3 p-0.5 rounded-md opacity-70 hover:opacity-100 transition-opacity duration-150"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
