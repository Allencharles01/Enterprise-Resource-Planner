"use client";

import { motion } from "framer-motion";
import { Award } from "lucide-react";
import { trainingStats } from "./trainingData";

export default function TrainingCertificationCard() {
  const certification = trainingStats[4];

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
        stat-card-violet
        rounded-2xl
        p-6
        border
        shadow-lg
        transition-all
        duration-300
      "
    >
      <div className="flex justify-between items-start mb-4">
        <div
          className="
            p-3 rounded-xl
            bg-violet-500/20
            text-violet-600
            dark:text-violet-400
          "
        >
          <Award size={24} />
        </div>

        <span className="text-3xl font-bold text-foreground">
          {certification.value}
        </span>
      </div>

      <h3 className="text-lg font-semibold text-foreground">
        {certification.title}
      </h3>

      <p className="text-sm text-muted-foreground mt-1">
        {certification.subText}
      </p>
    </motion.div>
  );
}