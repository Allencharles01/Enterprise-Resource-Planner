"use client";

import { motion } from "framer-motion";
import { ChevronRight } from "lucide-react";
import { inr } from "./digitalMarketingData";

const DESCRIPTIONS = {
  advertising: "Google, Meta, LinkedIn & Twitter ad performance.",
  creators: "One-time and partnership creator collaborations.",
  heavyads: "Billboards, sponsorships and offline campaigns.",
  documents: "Contracts, invoices and partnership agreements.",
};

export default function ModuleCard({ module, icon: Icon, onOpen }) {
  const glow = {
    blue: "glow-blue",
    purple: "glow-purple",
    orange: "glow-orange",
    cyan: "glow-cyan",
  }[module.glow];

  const color = {
    blue: "#6366f1",
    purple: "#a855f7",
    orange: "#fb923c",
    cyan: "#22d3ee",
  }[module.glow];

  const title = module.title
    .toLowerCase()
    .replace(/\b\w/g, (letter) => letter.toUpperCase())
    .replace("And", "&");

  const description = DESCRIPTIONS[module.id.toLowerCase()] || "Track campaign status and metrics.";

  return (
    <motion.article
      whileHover={{ scale: 1.02, y: -2 }}
      className={`module-card ${glow} flex flex-col justify-between p-5 sm:p-6 rounded-[16px] aspect-square transition-all duration-300`}
      style={{ "--module-color": color }}
    >
      <div>
        <div className="flex items-center justify-between mb-4">
          <span className="module-icon flex h-[52px] w-[52px] items-center justify-center rounded-[13px]">
            <Icon size={24} strokeWidth={2.4} />
          </span>
        </div>
        <h3 className="text-[18px] font-bold tracking-tight text-foreground">
          {title}
        </h3>
        <p className="mt-2 text-xs text-muted-foreground leading-relaxed">
          {description}
        </p>
      </div>

      <div className="mt-5 flex items-end justify-between">
        <div>
          <p className="text-[11px] font-medium uppercase tracking-wider text-muted-foreground">
            {module.metricLabel}
          </p>
          <p
            className="mt-1 text-[22px] font-extrabold tracking-tight"
            style={{ color }}
          >
            {module.metricText || inr(module.metricValue)}
          </p>
        </div>
        <button
          onClick={() => onOpen(module.id)}
          className="module-action flex h-10 w-24 items-center justify-center gap-2 rounded-[8px] border text-[13px] font-semibold transition cursor-pointer shadow-sm"
          type="button"
        >
          {module.button}
          <ChevronRight size={16} />
        </button>
      </div>
    </motion.article>
  );
}
