"use client";

import { useEffect, useState } from "react";
import { PiSun, PiMoon, PiDevices } from "react-icons/pi";

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
    <div className="flex items-center gap-2">
      <PiSun
        className={`text-2xl cursor-pointer ${
          theme === "light" ? "text-primary" : "text-foreground/50"
        }`}
        onClick={() => handleChange("light")}
      />
      <PiDevices
        className={`text-2xl cursor-pointer ${
          theme === "system" ? "text-primary" : "text-foreground/50"
        }`}
        onClick={() => handleChange("system")}
      />
      <PiMoon
        className={`text-2xl cursor-pointer ${
          theme === "dark" ? "text-primary" : "text-foreground/50"
        }`}
        onClick={() => handleChange("dark")}
      />
    </div>
  );
}
