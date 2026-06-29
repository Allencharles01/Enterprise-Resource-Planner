"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { DollarSign } from "lucide-react";
import { api } from "@/lib/api";

export default function TrainingRevenueCard() {
  const [revenueVal, setRevenueVal] = useState("₹ 0");
  const [subVal, setSubVal] = useState("0 Enrollments");

  useEffect(() => {
    api.get("/api/training/candidates").then((res) => {
      const list = res.data || [];
      const liveAdded = list.reduce((acc, c) => {
        const raw = String(c.cost || "0").replace(/\D/g, "");
        return acc + (raw ? parseInt(raw, 10) : 0);
      }, 0);
      setRevenueVal(`₹ ${liveAdded.toLocaleString("en-IN")}`);
      setSubVal(`${list.length} Enrolled Trainees`);
    }).catch(() => {});
  }, []);

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
          {revenueVal}
        </span>
      </div>

      <h3 className="text-lg font-semibold text-foreground">
        Revenue Through Training
      </h3>

      <p className="text-sm text-muted-foreground mt-1">
        <span className="font-semibold text-green-500">
          {subVal}
        </span>
      </p>
    </motion.div>
  );
}