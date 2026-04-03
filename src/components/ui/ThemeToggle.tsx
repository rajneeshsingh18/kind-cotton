"use client";

import { useDispatch, useSelector } from "react-redux";
import { toggleTheme, selectTheme } from "@/store/theme.slice";
import type { RootState } from "@/store";
import { Moon, Sun } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export function ThemeToggle({ variant = "header" }: { variant?: "header" | "floating" }) {
  const dispatch = useDispatch();
  const theme = useSelector((state: RootState) => selectTheme(state));
  const isDark = theme === "dark";

  if (variant === "floating") {
    return (
      <motion.button
        onClick={() => dispatch(toggleTheme())}
        aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
        whileHover={{ scale: 1.08 }}
        whileTap={{ scale: 0.94 }}
        className="fixed bottom-6 right-6 z-50 w-12 h-12 rounded-2xl kc-shadow flex items-center justify-center transition-colors duration-300"
        style={{
          background: isDark
            ? "var(--kc-surface-container-high)"
            : "var(--kc-surface-container-lowest)",
        }}
      >
        <AnimatePresence mode="wait" initial={false}>
          {isDark ? (
            <motion.span
              key="sun"
              initial={{ opacity: 0, rotate: -60, scale: 0.7 }}
              animate={{ opacity: 1, rotate: 0, scale: 1 }}
              exit={{ opacity: 0, rotate: 60, scale: 0.7 }}
              transition={{ duration: 0.22 }}
            >
              <Sun className="w-5 h-5 text-amber-400" />
            </motion.span>
          ) : (
            <motion.span
              key="moon"
              initial={{ opacity: 0, rotate: 60, scale: 0.7 }}
              animate={{ opacity: 1, rotate: 0, scale: 1 }}
              exit={{ opacity: 0, rotate: -60, scale: 0.7 }}
              transition={{ duration: 0.22 }}
            >
              <Moon className="w-5 h-5 text-kc-primary" />
            </motion.span>
          )}
        </AnimatePresence>
      </motion.button>
    );
  }

  // header variant — compact pill
  return (
    <button
      onClick={() => dispatch(toggleTheme())}
      aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
      className="relative p-2 rounded-xl hover:bg-kc-surface-container transition-colors duration-200 overflow-hidden"
    >
      <AnimatePresence mode="wait" initial={false}>
        {isDark ? (
          <motion.span
            key="sun"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.18 }}
            className="block"
          >
            <Sun className="w-4 h-4 text-amber-400" />
          </motion.span>
        ) : (
          <motion.span
            key="moon"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.18 }}
            className="block"
          >
            <Moon className="w-4 h-4 text-kc-on-surface-variant" />
          </motion.span>
        )}
      </AnimatePresence>
    </button>
  );
}
