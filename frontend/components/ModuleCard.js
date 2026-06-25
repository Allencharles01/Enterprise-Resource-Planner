"use client";

import { motion } from "framer-motion";
import { ChevronRight } from "lucide-react";
import { inr } from "@/lib/data";

export default function ModuleCard({ module, icon: Icon, onOpen }) {
  const glow = {
    blue: "glow-blue",
    purple: "glow-purple",
    orange: "glow-orange",
    cyan: "glow-cyan"
  }[module.glow];

  const color = {
    blue: "#6366f1",
    purple: "#a855f7",
    orange: "#fb923c",
    cyan: "#22d3ee"
  }[module.glow];

  const title = module.title
    .toLowerCase()
    .replace(/\b\w/g, (letter) => letter.toUpperCase())
    .replace("And", "&");

  return (
    <motion.article
      whileHover={{ scale: 1.006, y: -1 }}
      className={`module-card ${glow} grid min-h-[94px] grid-cols-[96px_1fr_230px_210px] items-center rounded-[13px] max-lg:grid-cols-1 max-lg:gap-4 max-lg:p-5`}
      style={{ "--module-color": color }}
    >
      <div className="theme-border flex h-full items-center justify-center border-r max-lg:border-r-0">
        <span className="module-icon flex h-[64px] w-[64px] items-center justify-center rounded-[13px]">
          <Icon size={29} strokeWidth={2.4} />
        </span>
      </div>
      <div className="min-w-0 px-4 max-lg:px-0">
        <h3 className="text-[20px] font-bold tracking-[-0.03em]">{title}</h3>
        <div className="mt-3 flex flex-wrap gap-x-7 gap-y-2">
          {module.labels.map((label) => (
            <span key={label} className="theme-text-soft flex items-center gap-2 text-[14px]">
              <span className="h-2 w-2 rounded-full" style={{ background: color, boxShadow: `0 0 12px ${color}` }} />
              {label}
            </span>
          ))}
        </div>
      </div>
      <div className="theme-border border-l px-7 max-lg:border-l-0 max-lg:px-0">
        <p className="theme-text-muted text-[13px] font-medium">
          {module.metricLabel}
        </p>
        <p className="mt-1 text-[21px] font-bold tracking-[-0.03em]" style={{ color }}>{module.metricText || inr(module.metricValue)}</p>
      </div>
      <div className="flex justify-end pr-8 max-lg:justify-start max-lg:pr-0">
        <button
          onClick={() => onOpen(module.id)}
          className="module-action flex h-11 min-w-[176px] items-center justify-center gap-4 rounded-[8px] border px-5 text-[14px] font-semibold transition"
          type="button"
        >
          {module.button}
          <ChevronRight size={19} />
        </button>
      </div>
    </motion.article>
  );
}
