"use client";

import { Activity } from "lucide-react";

export default function RecentActivity({ activities }) {
  return (
    <section className="glass rounded-[8px] p-5">
      <div className="flex items-center gap-2">
        <Activity size={19} />
        <h2 className="text-lg font-semibold">Recent Activity</h2>
      </div>
      <div className="mt-4 space-y-3">
        {activities.map((item) => (
          <article key={item._id} className="rounded-[8px] border p-3" style={{ borderColor: "var(--border)" }}>
            <p className="text-sm font-medium">{item.message}</p>
            <p className="mt-1 text-xs" style={{ color: "var(--muted-foreground)" }}>
              {new Date(item.timestamp).toLocaleString()} · {item.type}
            </p>
          </article>
        ))}
      </div>
    </section>
  );
}
