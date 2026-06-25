"use client";

import { motion } from "framer-motion";
import { Area, AreaChart, Bar, BarChart, ResponsiveContainer } from "recharts";
import { ArrowDownRight, ArrowUpRight } from "lucide-react";
import { inr } from "@/lib/data";

export default function TopStatCard({ icon: Icon, title, amount, change, chartData, variant }) {
  const positive = change > 0;
  const color = variant === "pink" ? "#f472b6" : "#6366f1";
  const glow = variant === "pink" ? "glow-pink" : "glow-blue";

  return (
    <motion.section whileHover={{ scale: 1.008, y: -1 }} className={`glass ${glow} h-[136px] overflow-hidden rounded-[13px] p-6`}>
      <div className="grid h-full grid-cols-[1fr_280px] gap-5 max-md:grid-cols-1">
        <div className="flex min-w-0 items-center gap-6">
          <span className="flex h-[74px] w-[74px] shrink-0 items-center justify-center rounded-[13px]" style={{ background: `linear-gradient(145deg, ${color}55, ${color}1f)`, color, boxShadow: `0 0 24px ${color}33, inset 0 0 20px rgba(255,255,255,0.08)` }}>
            <Icon size={32} strokeWidth={2.4} />
          </span>
          <div>
            <p className="theme-text-soft text-[14px] font-semibold">
              {title}
            </p>
            <h2 className="mt-2 text-[30px] font-bold leading-none tracking-[-0.03em]">{inr(amount)}</h2>
            <p className="mt-3 flex items-center gap-1 text-[13px]" style={{ color: positive ? "#22c55e" : "#f87171" }}>
              {positive ? <ArrowUpRight size={15} /> : <ArrowDownRight size={15} />}
              <span className="font-semibold">{Math.abs(change)}%</span>
              <span className="theme-text-muted">from last month</span>
            </p>
          </div>
        </div>
        <div className="h-[92px] self-center max-md:hidden">
          <ResponsiveContainer width="100%" height="100%">
            {variant === "pink" ? (
              <BarChart data={chartData}>
                <Bar dataKey="spend" fill={color} radius={[3, 3, 0, 0]} />
              </BarChart>
            ) : (
              <AreaChart data={chartData}>
                <Area type="monotone" dataKey="profit" stroke={color} fill={color} fillOpacity={0.2} strokeWidth={3} />
              </AreaChart>
            )}
          </ResponsiveContainer>
        </div>
      </div>
    </motion.section>
  );
}
