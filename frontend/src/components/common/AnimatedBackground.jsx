"use client";

import { motion } from "framer-motion";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

export function AnimatedBackground() {
  const { resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  const isDark = resolvedTheme === "dark";

  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none -z-10 bg-background transition-colors duration-700">
      <motion.div
        animate={{
          scale: [1, 1.2, 1],
          opacity: isDark ? [0.1, 0.2, 0.1] : [0.1, 0.15, 0.1],
          x: [0, 50, 0],
          y: [0, 30, 0],
        }}
        transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
        className="absolute top-0 -left-1/4 w-[120vh] h-[120vh] rounded-full mix-blend-multiply dark:mix-blend-screen filter blur-[100px] bg-primary/30"
      />

      <motion.div
        animate={{
          scale: [1, 1.1, 1],
          opacity: isDark ? [0.1, 0.15, 0.1] : [0.05, 0.1, 0.05],
          x: [0, -30, 0],
          y: [0, -50, 0],
        }}
        transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
        className="absolute bottom-0 -right-1/4 w-[100vh] h-[100vh] rounded-full mix-blend-multiply dark:mix-blend-screen filter blur-[100px] bg-secondary/30"
      />

      <motion.div
        animate={{
          scale: [1, 1.3, 1],
          opacity: isDark ? [0.05, 0.1, 0.05] : [0.05, 0.08, 0.05],
          x: [0, 40, 0],
          y: [0, -40, 0],
        }}
        transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[80vh] h-[80vh] rounded-full mix-blend-multiply dark:mix-blend-screen filter blur-[100px] bg-accent/30"
      />
    </div>
  );
}
