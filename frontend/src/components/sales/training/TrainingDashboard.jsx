"use client";

import TrainingRevenueCard from "./TrainingRevenueCard";
import TrainingStatsCards from "./TrainingStatsCards";
import TrainingCertificationCard from "./TrainingCertificationCard";
import TrainingEnrollmentChart from "./TrainingEnrollmentChart";
import TrainingTable from "./TrainingTable";

export default function TrainingDashboard() {
  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-6">
        {/* LEFT SIDE */}
        <div className="xl:col-span-7 space-y-6">
          <TrainingRevenueCard />

          <TrainingStatsCards />

          <TrainingCertificationCard />
        </div>

        {/* RIGHT SIDE */}
        <div className="xl:col-span-5">
          <div className="h-full w-full">
            <TrainingEnrollmentChart />
          </div>
        </div>
      </div>

      <TrainingTable />
    </div>
  );
}