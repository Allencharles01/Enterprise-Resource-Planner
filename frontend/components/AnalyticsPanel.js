"use client";

import { Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { currency } from "@/lib/api";

export default function AnalyticsPanel({ data, range, ranges, onRangeChange }) {
  return (
    <section className="glass rounded-[8px] p-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-lg font-semibold">Monthly Spend Analytics</h2>
          <p className="text-sm" style={{ color: "var(--muted-foreground)" }}>
            Pulled from MongoDB campaign, creator, and heavy ad spend.
          </p>
        </div>
        <select className="field px-3 py-2 capitalize" value={range} onChange={(event) => onRangeChange(event.target.value)}>
          {ranges.map((item) => (
            <option key={item} value={item}>
              {item}
            </option>
          ))}
        </select>
      </div>
      <div className="mt-5 h-72">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data}>
            <XAxis dataKey="label" stroke="var(--muted-foreground)" />
            <YAxis stroke="var(--muted-foreground)" tickFormatter={(value) => currency(value).replace(".00", "")} />
            <Tooltip contentStyle={{ background: "var(--muted)", border: "1px solid var(--border)", borderRadius: 8 }} />
            <Line type="monotone" dataKey="spend" stroke="var(--primary)" strokeWidth={3} dot={false} />
            <Line type="monotone" dataKey="profit" stroke="var(--secondary)" strokeWidth={3} dot={false} />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </section>
  );
}
