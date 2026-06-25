"use client";

import { motion } from "framer-motion";

export default function ModuleButton({ icon: Icon, title, description, onClick }) {
  return (
    <motion.button
      whileHover={{ y: -4 }}
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
      className="glass rounded-[8px] p-5 text-left transition hover:border-[var(--primary)]"
      type="button"
    >
      <span className="inline-flex h-11 w-11 items-center justify-center rounded-[8px]" style={{ background: "var(--primary)", color: "var(--primary-foreground)" }}>
        <Icon size={21} />
      </span>
      <span className="mt-4 block text-base font-semibold">{title}</span>
      <span className="mt-1 block text-sm leading-6" style={{ color: "var(--muted-foreground)" }}>
        {description}
      </span>
    </motion.button>
  );
}
