// src/components/sales/StatsCards.jsx

"use client";

import { statsData } from "./salesData";

export default function StatsCards() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {statsData.map((item) => (
        <div
          key={item.title}
          className="glass-card rounded-2xl p-6 border border-border"
        >
          <p className="text-sm text-muted-foreground mb-2">
            {item.title}
          </p>

          <div className="flex items-end justify-between">
            <h3 className="text-3xl font-bold text-foreground">
              {item.value}
            </h3>

            <span className="text-sm font-medium text-green-500">
              {item.change}
            </span>
          </div>
        </div>
      ))}
    </div>
  );
}