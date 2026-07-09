"use client";

import { motion } from "framer-motion";

const colorStyles = {
  rose: {
    card: "bg-gradient-to-br from-rose-500/25 via-rose-500/10 to-rose-600/5 border-rose-500/40 shadow-rose-500/20 hover:shadow-rose-500/40",
    icon: "bg-rose-500/20 text-rose-600 dark:text-rose-400",
  },
  purple: {
    card: "bg-gradient-to-br from-purple-500/25 via-purple-500/10 to-purple-600/5 border-purple-500/40 shadow-purple-500/20 hover:shadow-purple-500/40",
    icon: "bg-purple-500/20 text-purple-600 dark:text-purple-400",
  },
  red: {
    card: "bg-gradient-to-br from-red-500/25 via-red-500/10 to-red-600/5 border-red-500/40 shadow-red-500/20 hover:shadow-red-500/40",
    icon: "bg-red-500/20 text-red-600 dark:text-red-400",
  },

  cyan: {
    card: "bg-gradient-to-br from-cyan-500/25 via-cyan-500/10 to-cyan-600/5 border-cyan-500/40 shadow-cyan-500/20 hover:shadow-cyan-500/40",
    icon: "bg-cyan-500/20 text-cyan-600 dark:text-cyan-400",
  },
  blue: {
    card: "bg-gradient-to-br from-blue-500/25 via-blue-500/10 to-blue-600/5 border-blue-500/40 shadow-blue-500/20 hover:shadow-blue-500/40",
    icon: "bg-blue-500/20 text-blue-600 dark:text-blue-400",
  },
  indigo: {
    card: "bg-gradient-to-br from-indigo-500/25 via-indigo-500/10 to-indigo-600/5 border-indigo-500/40 shadow-indigo-500/20 hover:shadow-indigo-500/40",
    icon: "bg-indigo-500/20 text-indigo-600 dark:text-indigo-400",
  },

  amber: {
    card: "bg-gradient-to-br from-amber-500/25 via-amber-500/10 to-amber-600/5 border-amber-500/40 shadow-amber-500/20 hover:shadow-amber-500/40",
    icon: "bg-amber-500/20 text-amber-600 dark:text-amber-400",
  },
  orange: {
    card: "bg-gradient-to-br from-orange-500/25 via-orange-500/10 to-orange-600/5 border-orange-500/40 shadow-orange-500/20 hover:shadow-orange-500/40",
    icon: "bg-orange-500/20 text-orange-600 dark:text-orange-400",
  },
  emerald: {
    card: "bg-gradient-to-br from-emerald-500/25 via-emerald-500/10 to-emerald-600/5 border-emerald-500/40 shadow-emerald-500/20 hover:shadow-emerald-500/40",
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