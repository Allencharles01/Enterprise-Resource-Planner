"use client";

import InternshipStatsCards from "./InternshipStatsCards";
import InternshipTable from "./InternshipTable";

export default function InternshipDashboard() {
  return (
    <div className="space-y-8">
      <InternshipStatsCards />

      <InternshipTable />
    </div>
  );
}