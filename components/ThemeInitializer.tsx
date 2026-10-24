"use client";
import useThemeStore from "@/zustandStore/themeStore";
import { useEffect } from "react";

export default function ThemeInitializer() {
  const mode = useThemeStore((state) => state.mode);

  useEffect(() => {
    const root = window.document.documentElement;
    if (mode === "dark") {
      root.classList.add("dark");
    } else {
      root.classList.remove("dark");
    }
  }, [mode]);

  return null;
}
