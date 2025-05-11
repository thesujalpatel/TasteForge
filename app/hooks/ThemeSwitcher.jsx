"use client";

import { useEffect, useState } from "react";

export default function ThemeSwitcher() {
  const [theme, setTheme] = useState("system");

  useEffect(() => {
    const savedTheme = localStorage.getItem("theme") || "system";
    setTheme(savedTheme);
    applyTheme(savedTheme);

    if (savedTheme === "system") {
      const media = window.matchMedia("(prefers-color-scheme: dark)");
      const handler = () => applyTheme("system");
      media.addEventListener("change", handler);
      return () => media.removeEventListener("change", handler);
    }
  }, []);

  const applyTheme = (value) => {
    let themeToApply = value;

    if (value === "system") {
      const prefersDark = window.matchMedia(
        "(prefers-color-scheme: dark)"
      ).matches;
      themeToApply = prefersDark ? "dark" : "light";
    }

    document.documentElement.setAttribute("data-theme", themeToApply);
  };

  const handleChange = (value) => {
    setTheme(value);
    localStorage.setItem("theme", value);
    applyTheme(value);
  };

  return (
    <select
      value={theme}
      onChange={(e) => handleChange(e.target.value)}
      className="bg-background text-foreground
        border border-foreground/30 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition duration-200 ease-in-out
      "
    >
      <option value="light">🌞 Light</option>
      <option value="dark">🌚 Dark</option>
      <option value="system">🖥️ System</option>
    </select>
  );
}
