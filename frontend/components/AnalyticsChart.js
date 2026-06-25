"use client";

import { CartesianGrid, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { BarChart3, ChevronDown } from "lucide-react";
import { inr } from "@/lib/data";

export default function AnalyticsChart({ data, range }) {
  return (
    <section className="glass glow-blue rounded-[13px] p-6">
      <div className="flex items-center justify-between gap-3">
        <h2 className="flex items-center gap-3 text-[18px] font-bold tracking-[-0.03em]">
          <BarChart3 size={20} className="text-sky-400" /> Monthly Spend Analytics
        </h2>
        <button className="field flex h-9 items-center gap-3 rounded-[8px] px-4 text-[13px]" type="button">
          {range} <ChevronDown size={15} />
        </button>
      </div>
      <div className="mt-6 h-[330px]">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data} margin={{ left: 4, right: 12, top: 8, bottom: 4 }}>
            <CartesianGrid className="chart-grid" stroke="var(--chart-grid)" strokeDasharray="4 4" vertical={false} />
            <XAxis dataKey="month" stroke="var(--muted-foreground)" tickLine={false} axisLine={false} />
            <YAxis stroke="var(--muted-foreground)" tickLine={false} axisLine={false} tickFormatter={(value) => inr(value).replace(".00", "")} />
            <Tooltip contentStyle={{ background: "var(--muted)", border: "1px solid var(--border)", borderRadius: 14, color: "var(--foreground)" }} />
            <Line type="monotone" dataKey="profit" stroke="#3b82f6" strokeWidth={3} dot={{ r: 3, fill: "#f8fafc", strokeWidth: 2 }} activeDot={{ r: 6 }} />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </section>
  );
}
