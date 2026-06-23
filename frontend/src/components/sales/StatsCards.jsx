"use client";

import { motion } from "framer-motion";
import { statsData } from "./salesData";

export default function StatsCards() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
      {statsData.map((item) => (
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
              item.color === "amber"
                ? "bg-gradient-to-br from-amber-500/20 to-amber-600/5 border-amber-500/30 shadow-amber-500/10"
                : item.color === "emerald"
                ? "bg-gradient-to-br from-emerald-500/20 to-emerald-600/5 border-emerald-500/30 shadow-emerald-500/10"
                : "bg-gradient-to-br from-rose-500/20 to-rose-600/5 border-rose-500/30 shadow-rose-500/10"
            }
          `}
        >
          <div className="flex justify-between items-start mb-4">
            <div
              className={`
                p-3 rounded-xl
                ${
                  item.color === "amber"
                    ? "bg-amber-500/20 text-amber-600 dark:text-amber-400"
                    : item.color === "emerald"
                    ? "bg-emerald-500/20 text-emerald-600 dark:text-emerald-400"
                    : "bg-rose-500/20 text-rose-600 dark:text-rose-400"
                }
              `}
            >
              <item.icon size={24} />
            </div>

            <span className="text-3xl font-bold text-foreground">
              {item.value}
            </span>
          </div>

          <h3 className="text-lg font-semibold text-foreground">
            {item.title}
          </h3>

          <p className="text-sm text-muted-foreground mt-1">
            <span className="font-semibold text-green-600 dark:text-green-400">
              {item.change}
            </span>{" "}
            {item.subtitle}
          </p>
        </motion.div>
      ))}
    </div>
  );
}