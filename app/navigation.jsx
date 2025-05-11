"use client";
import Link from "next/link";
import ThemeSwitcher from "./hooks/ThemeSwitcher";

export default function Navbar() {
  return (
    <nav className="flex justify-between items-center px-6 py-4 bg-background border-b border-foreground/30">
      <Link href="/">
        <h1 className="text-2xl text-primary font-bold">🍲 Taste Forge</h1>
      </Link>
      <ThemeSwitcher />
    </nav>
  );
}
