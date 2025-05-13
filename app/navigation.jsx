"use client";
import Link from "next/link";
import ThemeSwitcher from "./hooks/ThemeSwitcher";

export default function Navbar() {
  return (
    <nav className="p-2 sm:p-3 top-2 sm:top-5 sm:w-[80vw] w-[97vw] flex justify-between items-center fixed  z-10 left-1/2 -translate-x-1/2 backdrop-blur-md bg-background/30 border border-foreground/30 rounded-xl font-[family-name:var(--font-courgette)]">
      <Link href="/">
        <h1 className="text-2xl text-primary font-bold">🍲 Taste Forge</h1>
      </Link>
      <ThemeSwitcher />
    </nav>
  );
}
