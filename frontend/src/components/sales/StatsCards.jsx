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
            transition-all
            duration-300
            ${
              item.color === "amber"
                ? "stat-card-amber"
                : item.color === "emerald"
                ? "stat-card-emerald"
                : "stat-card-rose"
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