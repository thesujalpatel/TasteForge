"use client";
import Link from "next/link";
import ThemeSwitcher from "./hooks/ThemeSwitcher";

export default function Navbar() {
  return (
    <nav className="flex justify-between items-center p-3 fixed top-5 w-[80vw] z-10 left-1/2 -translate-x-1/2 backdrop-blur-md bg-background/30 border border-foreground/30 rounded-xl">
      <Link href="/">
        <h1 className="text-2xl text-primary font-bold">🍲 Taste Forge</h1>
      </Link>
      <ThemeSwitcher />
    </nav>
  );
}
