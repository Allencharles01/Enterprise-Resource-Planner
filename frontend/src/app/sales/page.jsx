"use client";

import { useState } from "react";
import { DashboardLayout } from "@/components/DashboardLayout";
import SalesTabs from "@/components/sales/SalesTabs";
import StatsCards from "@/components/sales/StatsCards";
import ProjectsTable from "@/components/sales/ProjectsTable";

export default function SalesPage() {
  const [activeTab, setActiveTab] = useState("Client Projects");

  return (
    <DashboardLayout>
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-bold text-foreground">
            Sales Dashboard
          </h1>

          <p className="text-muted-foreground mt-2">
            Monitor projects, revenue, and sales performance.
          </p>
        </div>

        <SalesTabs
          activeTab={activeTab}
          setActiveTab={setActiveTab}
        />

        <StatsCards />

        <ProjectsTable />
      </div>
    </DashboardLayout>
  );
}