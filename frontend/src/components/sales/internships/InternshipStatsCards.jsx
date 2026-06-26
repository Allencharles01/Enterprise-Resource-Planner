"use client";

import { motion } from "framer-motion";

import {
  DollarSign,
  TrendingUp,
  Award,
} from "lucide-react";

import { internshipStats } from "./internshipData";

export default function InternshipStatsCards() {
  const iconMap = {
    emerald: DollarSign,
    blue: TrendingUp,
    purple: Award,
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
      {internshipStats.map((item) => {
        const Icon = iconMap[item.color];

        return (
          <motion.div
            key={item.title}
            whileHover={{
              scale: 1.02,
              y: -5,
            }}
            transition={{
              duration: 0.2,
            }}
            className={`
              glass-card
              rounded-2xl
              p-6
              border
              shadow-lg

              ${
                item.color === "emerald"
                  ? "bg-gradient-to-br from-emerald-500/20 to-emerald-600/5 border-emerald-500/30 shadow-emerald-500/10"
                  : item.color === "blue"
                  ? "bg-gradient-to-br from-blue-500/20 to-blue-600/5 border-blue-500/30 shadow-blue-500/10"
                  : "bg-gradient-to-br from-purple-500/20 to-purple-600/5 border-purple-500/30 shadow-purple-500/10"
              }
            `}
          >
            <div className="flex justify-between items-start mb-4">
  <div
    className={`
      p-3 rounded-xl

      ${
        item.color === "emerald"
          ? "bg-emerald-500/20 text-emerald-600 dark:text-emerald-400"
          : item.color === "blue"
          ? "bg-blue-500/20 text-blue-600 dark:text-blue-400"
          : "bg-purple-500/20 text-purple-600 dark:text-purple-400"
      }
    `}
  >
    <Icon size={24} />
  </div>

  <span className="text-3xl font-bold text-foreground">
    {item.value}
  </span>
</div>

            <h3 className="text-lg font-semibold text-foreground">
  {item.title}
</h3>

<p className="text-sm text-muted-foreground mt-1">
  {item.change && (
    <span className="font-semibold text-green-500">
      {item.change}
    </span>
  )}{" "}
  {item.subtitle}
</p>
          </motion.div>
        );
      })}
    </div>
  );
}