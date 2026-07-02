"use client";

import { useState } from "react";
import SalesEmployeeNavbar from "./SalesEmployeeNavbar";
import SalesEmployeeTabs from "./SalesEmployeeTabs";
import SalesEmployeeStatsCards from "./SalesEmployeeStatsCards";
import SalesEmployeeMonthlyAccordion from "./SalesEmployeeMonthlyAccordion";
import {
  employeeInfo,
  tabs,
  employeeStats,
  monthlyData,
} from "./salesEmployeeData";

export default function SalesEmployeeDashboard() {
  const [activeTab, setActiveTab] = useState("Client Projects");

  return (
    <div className="flex min-h-screen w-full relative overflow-hidden">
      <div className="flex flex-col w-full min-h-screen z-10">
        <SalesEmployeeNavbar />

        <main className="flex-1 w-full max-w-7xl mx-auto p-4 sm:p-6 lg:p-8">
          <div className="px-6 py-8 space-y-8">
            {/* Header */}
            <div className="flex items-start justify-between gap-6">
              <div>
                <h1 className="text-3xl font-bold text-foreground">
                  Sales Employee Dashboard
                </h1>

                <p className="text-muted-foreground mt-2">
                  Monitor your leads, revenue, and personal sales performance.
                </p>
              </div>

              <button className="px-6 py-3 rounded-xl bg-primary text-primary-foreground font-semibold shadow-lg shadow-primary/20 hover:scale-105 transition">
                + New Lead
              </button>
            </div>

            {/* Employee Profile Card */}
            <div className="glass-card rounded-2xl p-5 border border-border">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-gradient-to-tr from-violet-600 via-indigo-600 to-purple-500 text-white flex items-center justify-center font-bold shadow-lg shadow-indigo-500/30">
                  {employeeInfo.initials}
                </div>

                <div>
                  <h2 className="font-bold text-foreground">
                    {employeeInfo.name}
                  </h2>

                  <p className="text-sm text-muted-foreground">
                    {employeeInfo.role} · {employeeInfo.id}
                  </p>
                </div>

                <div className="ml-auto px-4 py-2 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 text-sm font-semibold">
                  {employeeInfo.status} · {employeeInfo.month}
                </div>
              </div>
            </div>

            {/* Tabs */}
            <SalesEmployeeTabs
              tabs={tabs}
              activeTab={activeTab}
              setActiveTab={setActiveTab}
            />

            {/* KPI Cards */}
            <SalesEmployeeStatsCards stats={employeeStats[activeTab]} />

            {/* Month-wise Table */}
            <SalesEmployeeMonthlyAccordion
              activeTab={activeTab}
              data={monthlyData[activeTab]}
            />
          </div>
        </main>
      </div>
    </div>
  );
}