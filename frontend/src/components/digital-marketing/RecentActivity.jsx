"use client";

export default function RecentActivity({ activities }) {
  return (
    <aside className="glass rounded-[13px] p-6">
      <h2 className="text-[18px] font-bold text-foreground">Recent Activity</h2>
      <ul className="mt-4 space-y-3">
        {activities && activities.length ? (
          activities.map((a) => (
            <li key={a.id} className="flex items-center justify-between border-b border-border/40 pb-2.5 last:border-0">
              <div>
                <p className="text-[14px] font-medium text-foreground">{a.title}</p>
                <p className="text-[12px] text-muted-foreground">{a.time}</p>
              </div>
            </li>
          ))
        ) : (
          <p className="text-[13px] text-muted-foreground">No recent activity</p>
        )}
      </ul>
    </aside>
  );
}
