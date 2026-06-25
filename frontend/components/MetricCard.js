"use client";

import { motion } from "framer-motion";
import { Area, AreaChart, Bar, BarChart, ResponsiveContainer, Tooltip } from "recharts";
import { currency } from "@/lib/api";

export default function MetricCard({ title, value, data, tone }) {
  const isPink = tone === "pink";
  const chartColor = isPink ? "var(--secondary)" : "var(--primary)";
  const glow = isPink ? "shadow-[0_0_36px_rgba(244,114,182,0.24)]" : "shadow-[0_0_36px_rgba(99,102,241,0.24)]";

  return (
    <motion.section
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      className={`glass ${glow} rounded-[8px] p-5 min-h-[230px] border`}
      style={{ borderColor: chartColor }}
    >
      <p className="text-sm" style={{ color: "var(--muted-foreground)" }}>
        {title}
      </p>
      <h2 className="mt-2 text-3xl font-semibold tracking-normal">{currency(value)}</h2>
      <div className="mt-5 h-28">
        <ResponsiveContainer width="100%" height="100%">
          {isPink ? (
            <BarChart data={data}>
              <Tooltip contentStyle={{ background: "var(--muted)", border: "1px solid var(--border)", borderRadius: 8 }} />
              <Bar dataKey="spend" fill={chartColor} radius={[8, 8, 0, 0]} />
            </BarChart>
          ) : (
            <AreaChart data={data}>
              <Tooltip contentStyle={{ background: "var(--muted)", border: "1px solid var(--border)", borderRadius: 8 }} />
              <Area type="monotone" dataKey="profit" stroke={chartColor} fill={chartColor} fillOpacity={0.22} strokeWidth={3} />
            </AreaChart>
          )}
        </ResponsiveContainer>
      </div>
    </motion.section>
  );
}
