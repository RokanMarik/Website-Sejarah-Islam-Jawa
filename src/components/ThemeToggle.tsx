"use client";

import { useState, useEffect } from "react";

type Theme = "dark" | "light" | "sepia";

const themes: Theme[] = ["dark", "light", "sepia"];

const themeIcons: Record<Theme, string> = {
  dark: "🌙",
  light: "☀️",
  sepia: "📜",
};

const themeLabels: Record<Theme, string> = {
  dark: "Mode Gelap",
  light: "Mode Terang",
  sepia: "Naskah Kuno",
};

export default function ThemeToggle() {
  const [theme, setTheme] = useState<Theme>("dark");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const saved = localStorage.getItem("theme") as Theme | null;
    const initial = saved || "dark";
    applyTheme(initial);
    setTheme(initial);
  }, []);

  const applyTheme = (t: Theme) => {
    document.body.classList.remove("theme-sepia", "theme-light");
    if (t === "sepia") {
      document.body.classList.add("theme-sepia");
    } else if (t === "light") {
      document.body.classList.add("theme-light");
    }
  };

  const toggleTheme = () => {
    const idx = themes.indexOf(theme);
    const next = themes[(idx + 1) % themes.length];
    setTheme(next);
    localStorage.setItem("theme", next);
    applyTheme(next);
  };

  if (!mounted) return null;

  return (
    <button
      onClick={toggleTheme}
      className="flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-gray-700 hover:border-yellow-400 transition-colors text-sm"
      title={themeLabels[theme]}
      aria-label={`Ganti tema: ${themeLabels[theme]}`}
    >
      <span className="text-base">{themeIcons[theme]}</span>
    </button>
  );
}
