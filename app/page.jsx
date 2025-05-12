"use client";
import { motion } from "framer-motion";
import Link from "next/link";

export default function Home() {
  const fadeIn = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: 20 },
    transition: {
      type: "spring",
      stiffness: 300,
      damping: 20,
    },
  };
  return (
    <div className="max-w-5xl w-full absolute top-1/2 left-1/2 -translate-1/2 mx-auto px-4 py-8">
      <motion.h1
        {...fadeIn}
        className="text-4xl font-bold text-center text-primary"
      >
        🍛 Taste Forge
      </motion.h1>
      <motion.p
        {...fadeIn}
        className="text-lg mb-6 text-center text-foreground/50"
      >
        Flavor. Invented. Instantly.
      </motion.p>
      <motion.p {...fadeIn} className="text-xl mb-4 text-center">
        <span className="text-primary">
          Transform your kitchen into a flavor laboratory
        </span>{" "}
        where inspiration meets innovation! Taste Forge fuses{" "}
        <span className="text-primary">AI-powered creativity</span> with your
        pantry staples, conjuring{" "}
        <span className="text-primary">bold, unexpected recipes</span>. Say
        goodbye to routine meals embrace{" "}
        <span className="text-primary">culinary surprises</span> and{" "}
        <span className="text-primary">taste adventures</span> every time you
        cook.
      </motion.p>
      <div className="w-fit mx-auto">
        <Link href="/recipe">
          <motion.div
            {...fadeIn}
            whileHover={{
              scale: 1.02,
            }}
            whileTap={{ scale: 0.98 }}
            transition={{
              type: "spring",
              stiffness: 300,
              damping: 15,
            }}
            className={`px-3 py-2 bg-primary text-background font-semibold rounded-md mt-4 w-fit min-w-50 text-center mx-auto`}
          >
            Lets Get Started
          </motion.div>
        </Link>
      </div>
    </div>
  );
}
