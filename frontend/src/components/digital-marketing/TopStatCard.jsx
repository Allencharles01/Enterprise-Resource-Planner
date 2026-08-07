"use client";

import { motion } from "framer-motion";
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  ResponsiveContainer,
} from "recharts";
import { ArrowDownRight, ArrowUpRight } from "lucide-react";
import { inr } from "./digitalMarketingData";

export default function TopStatCard({
  icon: Icon,
  title,
  amount,
  change,
  chartData,
  variant,
}) {
  const positive = change > 0;
  const color = variant === "pink" ? "#f472b6" : "#6366f1";
  const glow = variant === "pink" ? "glow-pink" : "glow-blue";

  return (
    <motion.section
      whileHover={{ scale: 1.008, y: -1 }}
      className={`glass ${glow} min-h-[144px] overflow-hidden rounded-[16px] p-5 sm:p-6 flex flex-col justify-center`}
    >
      <div className="grid h-full grid-cols-[1fr_260px] gap-4 max-md:grid-cols-1 items-center">
        <div className="flex min-w-0 items-center gap-4 sm:gap-5">
          <span
            className="flex h-[68px] w-[68px] sm:h-[72px] sm:w-[72px] shrink-0 items-center justify-center rounded-[13px]"
            style={{
              background: `linear-gradient(145deg, ${color}55, ${color}1f)`,
              color,
              boxShadow: `0 0 24px ${color}33, inset 0 0 20px rgba(255,255,255,0.08)`,
            }}
          >
            <Icon size={32} strokeWidth={2.4} />
          </span>
          <div className="min-w-0 flex-1">
            <p className="text-[13px] sm:text-[14px] font-semibold text-muted-foreground leading-snug">
              {title}
            </p>
            <h2 className="mt-1 text-[26px] sm:text-[28px] lg:text-[30px] font-bold leading-none tracking-[-0.03em] text-foreground">
              {inr(amount)}
            </h2>
            <p
              className="mt-1.5 flex flex-wrap items-center gap-1 text-[12px] sm:text-[13px] leading-tight"
              style={{ color: positive ? "#22c55e" : "#f87171" }}
            >
              <span className="flex items-center gap-0.5 font-semibold shrink-0">
                {positive ? (
                  <ArrowUpRight size={15} />
                ) : (
                  <ArrowDownRight size={15} />
                )}
                {Math.abs(change)}%
              </span>
              <span className="text-muted-foreground whitespace-nowrap">from last month</span>
            </p>
          </div>
        </div>
        <div className="h-[80px] sm:h-[88px] self-center max-md:hidden">
          <ResponsiveContainer width="100%" height="100%">
            {variant === "pink" ? (
              <BarChart data={chartData}>
                <Bar dataKey="spend" fill={color} radius={[3, 3, 0, 0]} />
              </BarChart>
            ) : (
              <AreaChart data={chartData}>
                <Area
                  type="monotone"
                  dataKey="profit"
                  stroke={color}
                  fill={color}
                  fillOpacity={0.2}
                  strokeWidth={3}
                />
              </AreaChart>
            )}
          </ResponsiveContainer>
        </div>
      </div>
    </motion.section>
  );
}
