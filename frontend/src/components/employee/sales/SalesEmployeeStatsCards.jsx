"use client";

import { motion } from "framer-motion";

const colorStyles = {
  rose: {
    card: "stat-card-rose",
    icon: "bg-rose-500/20 text-rose-600 dark:text-rose-400",
  },
  purple: {
    card: "stat-card-purple",
    icon: "bg-purple-500/20 text-purple-600 dark:text-purple-400",
  },
  red: {
    card: "stat-card-red",
    icon: "bg-red-500/20 text-red-600 dark:text-red-400",
  },

  cyan: {
    card: "stat-card-cyan",
    icon: "bg-cyan-500/20 text-cyan-600 dark:text-cyan-400",
  },
  blue: {
    card: "stat-card-blue",
    icon: "bg-blue-500/20 text-blue-600 dark:text-blue-400",
  },
  indigo: {
    card: "stat-card-indigo",
    icon: "bg-indigo-500/20 text-indigo-600 dark:text-indigo-400",
  },

  amber: {
    card: "stat-card-amber",
    icon: "bg-amber-500/20 text-amber-600 dark:text-amber-400",
  },
  orange: {
    card: "stat-card-orange",
    icon: "bg-orange-500/20 text-orange-600 dark:text-orange-400",
  },
  emerald: {
    card: "stat-card-emerald",
    icon: "bg-emerald-500/20 text-emerald-600 dark:text-emerald-400",
  },
};

export default function SalesEmployeeStatsCards({ stats }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
      {stats.map((item) => {
        const style = colorStyles[item.color] || colorStyles.indigo;

        return (
          <motion.div
            key={item.title}
            whileHover={{
              scale: 1.03,
              y: -6,
            }}
            transition={{
              duration: 0.2,
            }}
            className={`
              glass-card
              rounded-2xl
              p-6
              border
              shadow-xl
              transition-all
              duration-300
              ${style.card}
            `}
          >
            <div className="flex justify-between items-start mb-4">
              <div className={`p-3 rounded-xl ${style.icon}`}>
                <item.icon size={24} />
              </div>

              <span className="px-3 py-1 rounded-full text-xs font-bold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
                {item.change}
              </span>
            </div>

            <span className="block text-3xl font-bold text-foreground">
              {item.value}
            </span>

            <h3 className="text-lg font-semibold text-foreground mt-3">
              {item.title}
            </h3>

            <p className="text-sm text-muted-foreground mt-1">
              <span className="font-semibold text-green-600 dark:text-green-400">
                {item.change}
              </span>{" "}
              {item.subtitle}
            </p>
          </motion.div>
        );
      })}
    </div>
  );
}