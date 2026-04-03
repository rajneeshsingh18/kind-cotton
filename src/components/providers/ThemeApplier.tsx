"use client";

import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setTheme, selectTheme } from "@/store/theme.slice";
import type { RootState } from "@/store";

export function ThemeApplier() {
  const dispatch = useDispatch();
  const theme = useSelector((state: RootState) => selectTheme(state));

  // Hydrate from localStorage on first mount
  useEffect(() => {
    const stored = localStorage.getItem("kc-theme") as "light" | "dark" | null;
    if (stored === "light" || stored === "dark") {
      dispatch(setTheme(stored));
    } else if (window.matchMedia("(prefers-color-scheme: dark)").matches) {
      dispatch(setTheme("dark"));
    }
  }, [dispatch]);

  // Apply class to <html> and persist
  useEffect(() => {
    const root = document.documentElement;
    if (theme === "dark") {
      root.classList.add("dark");
    } else {
      root.classList.remove("dark");
    }
    localStorage.setItem("kc-theme", theme);
  }, [theme]);

  return null;
}
