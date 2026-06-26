"use client";

import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from "recharts";
import { motion } from "framer-motion";
import { enrollmentData } from "./trainingData";

export default function TrainingEnrollmentChart() {
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
        h-full
        bg-gradient-to-br
        from-purple-500/20
        to-purple-600/5
        border-purple-500/30
        shadow-purple-500/10
      "
    >
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-xl font-bold text-foreground">
            Monthly Enrollments
          </h2>

          <p className="text-sm text-muted-foreground mt-1">
            Training participation overview
          </p>
        </div>
      </div>

      <div className="h-[400px] mt-6">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={enrollmentData}
            margin={{
              top: 5,
              right: 0,
              left: -25,
              bottom: 0,
            }}
          >
            <CartesianGrid
              strokeDasharray="3 3"
              strokeOpacity={0.1}
            />

            <XAxis
              dataKey="month"
              tickLine={false}
              axisLine={false}
              className="text-xs"
            />

            <YAxis
              tickLine={false}
              axisLine={false}
              className="text-xs"
            />

            <Tooltip
              contentStyle={{
                background: "#1e293b",
                border: "none",
                borderRadius: "12px",
              }}
            />

            <Bar
              dataKey="enrollments"
              radius={[10, 10, 0, 0]}
              fill="#a855f7"
              barSize={36}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </motion.div>
  );
}