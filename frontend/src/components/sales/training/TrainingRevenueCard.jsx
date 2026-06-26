"use client";

import { motion } from "framer-motion";
import { DollarSign } from "lucide-react";
import { trainingStats } from "./trainingData";

export default function TrainingRevenueCard() {
  const revenue = trainingStats[0];

  return (
    <motion.div
      whileHover={{
        scale: 1.02,
        y: -5,
      }}
      transition={{
        duration: 0.2,
      }}
      className="
        glass-card
        rounded-2xl
        p-6
        border
        shadow-lg
        bg-gradient-to-br
        from-emerald-500/20
        to-emerald-600/5
        border-emerald-500/30
        shadow-emerald-500/10
      "
    >
      <div className="flex justify-between items-start mb-4">
        <div
          className="
            p-3 rounded-xl
            bg-emerald-500/20
            text-emerald-600
            dark:text-emerald-400
          "
        >
          <DollarSign size={24} />
        </div>

        <span className="text-3xl font-bold text-foreground">
          {revenue.value}
        </span>
      </div>

      <h3 className="text-lg font-semibold text-foreground">
        {revenue.title}
      </h3>

      <p className="text-sm text-muted-foreground mt-1">
        <span className="font-semibold text-green-500">
          {revenue.subText}
        </span>
      </p>
    </motion.div>
  );
}