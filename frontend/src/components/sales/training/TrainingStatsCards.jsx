"use client";

import { motion } from "framer-motion";
import { BookOpen, Users, TrendingUp } from "lucide-react";
import { trainingStats } from "./trainingData";

const iconMap = {
  book: BookOpen,
  users: Users,
  trend: TrendingUp,
};

const colorMap = {
  "Total Programs": "amber",
  "Total Enrolled": "blue",
  "Completion Rate": "purple",
};

export default function TrainingStatsCards() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {trainingStats.slice(1, 4).map((item) => {
        const Icon = iconMap[item.icon];
        const color = colorMap[item.title];

        return (
          <motion.div
            key={item.id}
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
                color === "amber"
                  ? "bg-gradient-to-br from-amber-500/20 to-amber-600/5 border-amber-500/30 shadow-amber-500/10"
                  : color === "blue"
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
                    color === "amber"
                      ? "bg-amber-500/20 text-amber-600 dark:text-amber-400"
                      : color === "blue"
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
              {item.subText}
            </p>
          </motion.div>
        );
      })}
    </div>
  );
}