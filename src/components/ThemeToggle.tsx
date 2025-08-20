"use client";

import { useEffect, useState } from "react";
import { Sun, Moon } from "lucide-react";

type Mode = "light" | "dark";

export default function ThemeToggle() {
  const [mode, setMode] = useState<Mode>("dark");

  // Initialize from localStorage or system preference
  useEffect(() => {
    const stored = (localStorage.getItem("theme") as Mode | null);
    const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    const initial: Mode = stored ?? (prefersDark ? "dark" : "light");
    setMode(initial);
    document.documentElement.setAttribute("data-theme", initial);
  }, []);

  function toggle() {
    const next: Mode = mode === "dark" ? "light" : "dark";
    setMode(next);
    document.documentElement.setAttribute("data-theme", next);
    localStorage.setItem("theme", next);
  }

  return (
    <button
      onClick={toggle}
      aria-label="Toggle theme"
      className="ml-3 inline-flex items-center gap-2 rounded-xl border px-3 py-2 text-sm hover:opacity-90"
      style={{
        borderColor: "color-mix(in oklab, var(--brand-600) 55%, transparent)",
        color: "var(--text)",
        background: "color-mix(in oklab, var(--brand-600) 6%, transparent)",
      }}
    >
      {mode === "dark" ? <Sun size={16} /> : <Moon size={16} />}
      <span className="hidden sm:inline">{mode === "dark" ? "Light" : "Dark"}</span>
    </button>
  );
}
